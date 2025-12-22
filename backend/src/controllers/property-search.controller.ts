import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { ElasticsearchService } from '../services/elasticsearch.service';
import { RedisService } from '../services/redis.service';
import { PropertyService } from '../services/property.service';
import { OptionalAuthGuard } from '../guards/optional-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

interface SearchQuery {
    location: {
        type: 'city' | 'coordinates' | 'drawn_boundary' | 'address';
        value: any;
        radius_miles?: number;
    };
    filters?: {
        price?: { min?: number; max?: number };
        bedrooms?: { min?: number; exact?: number };
        bathrooms?: { min?: number };
        square_feet?: { min?: number; max?: number };
        property_type?: string[];
        vastu_min_score?: number;
        climate_risk_max?: number;
        smart_home_min_score?: number;
        [key: string]: any;
    };
    sort?: {
        field: string;
        direction: 'asc' | 'desc';
    };
    pagination?: {
        page: number;
        limit: number;
    };
}

@Controller('api/v1/properties')
export class PropertySearchController {
    constructor(
        private elasticsearchService: ElasticsearchService,
        private redisService: RedisService,
        private propertyService: PropertyService
    ) { }

    @Post('search')
    @UseGuards(OptionalAuthGuard)
    async searchProperties(
        @Body() query: SearchQuery,
        @CurrentUser() user?: any
    ) {
        const startTime = Date.now();

        // Generate cache key
        const cacheKey = this.generateCacheKey(query);

        // Check cache (2-minute TTL for public searches)
        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            return {
                ...JSON.parse(cached),
                cached: true,
                query_time_ms: Date.now() - startTime
            };
        }

        // Execute search
        const results = await this.elasticsearchService.search(query);

        // Enrich results with real-time data
        const enriched = await this.enrichSearchResults(results.hits, user);

        // Calculate relevance scores if user authenticated
        const scored = user
            ? await this.calculatePersonalizedScores(enriched, user)
            : enriched;

        // Format response
        const response = {
            total_results: results.total.value,
            page: query.pagination?.page || 1,
            total_pages: Math.ceil(results.total.value / (query.pagination?.limit || 24)),
            query_time_ms: Date.now() - startTime,
            properties: scored,
            facets: this.formatFacets(results.aggregations),
            saved_search: user ? {
                can_save: true,
                similar_saved_searches: await this.findSimilarSavedSearches(user.user_id, query)
            } : null,
            map_data: {
                bounds: this.calculateMapBounds(scored),
                cluster_url: `/api/v1/properties/map-clusters?${new URLSearchParams({ query: JSON.stringify(query) })}`
            }
        };

        // Cache results
        await this.redisService.setex(cacheKey, 120, JSON.stringify(response));

        // Log search for analytics
        if (user) {
            await this.logSearch(user.user_id, query, results.total.value);
        }

        return response;
    }

    @Get('map-clusters')
    async getMapClusters(@Query('query') queryStr: string) {
        const query = JSON.parse(queryStr);

        // Use Elasticsearch geo-grid aggregation for clustering
        const clusterQuery = {
            ...query,
            aggs: {
                grid: {
                    geohash_grid: {
                        field: 'address.location',
                        precision: 5 // Adjust based on zoom level
                    },
                    aggs: {
                        centroid: {
                            geo_centroid: {
                                field: 'address.location'
                            }
                        },
                        avg_price: {
                            avg: { field: 'basic_info.price' }
                        },
                        min_price: {
                            min: { field: 'basic_info.price' }
                        },
                        max_price: {
                            max: { field: 'basic_info.price' }
                        }
                    }
                }
            },
            size: 0 // Don't return individual documents
        };

        const results = await this.elasticsearchService.search(clusterQuery);

        // Format clusters
        const clusters = results.aggregations.grid.buckets.map((bucket: any) => ({
            location: bucket.centroid.location,
            count: bucket.doc_count,
            avg_price: Math.round(bucket.avg_price.value),
            price_range: {
                min: bucket.min_price.value,
                max: bucket.max_price.value
            }
        }));

        return { clusters };
    }

    @Post('similar')
    @UseGuards(OptionalAuthGuard)
    async findSimilarProperties(
        @Body('property_id') propertyId: string,
        @Body('count') count: number = 5
    ) {
        // Get reference property
        const property = await this.propertyService.findOne(propertyId);

        if (!property) {
            throw new Error('Property not found');
        }

        // More-like-this query
        const similar = await this.elasticsearchService.client.search({
            index: 'properties',
            body: {
                query: {
                    bool: {
                        must: [
                            {
                                more_like_this: {

                                    fields: ['description', 'features', 'address.city'],
                                    like: [
                                        {
                                            _index: 'properties',
                                            _id: propertyId
                                        }
                                    ],
                                    min_term_freq: 1,
                                    max_query_terms: 12
                                }
                            }
                        ],
                        filter: [
                            {
                                range: {
                                    'basic_info.price': {
                                        gte: property.price * 0.8,
                                        lte: property.price * 1.2
                                    }
                                }
                            },
                            {
                                term: { 'basic_info.property_type': property.property_type }
                            }
                        ],
                        must_not: [
                            { term: { property_id: propertyId } }
                        ]
                    }
                },
                size: count
            }
        });

        return {
            reference_property: propertyId,
            similar_properties: similar.hits.hits.map((hit: any) => ({
                ...hit._source,
                similarity_score: hit._score,
                reasons: this.explainSimilarity(property, hit._source)
            }))
        };
    }

    private generateCacheKey(query: SearchQuery): string {
        // Create deterministic hash of query
        const queryStr = JSON.stringify(query);
        const crypto = require('crypto');
        return `search:${crypto.createHash('md5').update(queryStr).digest('hex')}`;
    }

    private async enrichSearchResults(properties: any[], user?: any) {
        // Fetch real-time data in parallel
        const propertyIds = properties.map(p => p.property_id);

        const [viewCounts, favoriteCounts, userFavorites] = await Promise.all([
            this.propertyService.getViewCounts(propertyIds),
            this.propertyService.getFavoriteCounts(propertyIds),
            user ? this.propertyService.getUserFavorites(user.user_id, propertyIds) : {}
        ]);

        return properties.map(property => ({
            ...property,
            view_count: viewCounts[property.property_id] || 0,
            favorite_count: favoriteCounts[property.property_id] || 0,
            is_favorited: user ? !!userFavorites[property.property_id] : false
        }));
    }

    private async calculatePersonalizedScores(properties: any[], user: any) {
        // Get user preferences and history
        const userProfile = await this.propertyService.getUserProfile(user.user_id);
        const browsingHistory = await this.propertyService.getBrowsingHistory(user.user_id);

        return properties.map(property => {
            let relevanceScore = 70; // Base score

            // Boost for Vastu match
            if (userProfile.preferences?.vastu_importance >= 7) {
                const vastuBoost = (property.scores?.vastu || 0) / 100 * 15;
                relevanceScore += vastuBoost;
            }

            // Boost for climate safety
            if (userProfile.preferences?.climate_concern >= 7) {
                const climateBoost = (100 - (property.climate_risk?.overall_score || 50)) / 100 * 15;
                relevanceScore += climateBoost;
            }

            // Boost for smart home if tech-savvy
            if (userProfile.preferences?.tech_enthusiast) {
                const smartHomeBoost = (property.scores?.smart_home || 0) / 100 * 10;
                relevanceScore += smartHomeBoost;
            }

            // Boost for browsing history match
            const historyMatch = this.calculateHistoryMatch(property, browsingHistory);
            relevanceScore += historyMatch * 10;

            // Price match
            const priceMatch = this.calculatePriceMatch(
                property.basic_info.price,
                userProfile.typical_budget
            );
            relevanceScore += priceMatch * 5;

            return {
                ...property,
                scores: {
                    ...property.scores,
                    overall_match: Math.min(100, Math.round(relevanceScore))
                }
            };
        });
    }

    private calculateHistoryMatch(property: any, history: any[]): number {
        if (!history || history.length === 0) return 0;

        let matchScore = 0;

        // Check if similar price range viewed before
        const avgViewedPrice = history.reduce((sum, h) => sum + h.price, 0) / history.length;
        const priceDiff = Math.abs(property.basic_info.price - avgViewedPrice) / avgViewedPrice;
        if (priceDiff < 0.2) matchScore += 3;

        // Check if same city
        const viewedCities = history.map(h => h.city);
        if (viewedCities.includes(property.address.city)) matchScore += 2;

        // Check if same property type
        const viewedTypes = history.map(h => h.property_type);
        if (viewedTypes.includes(property.basic_info.property_type)) matchScore += 2;

        // Check if similar features
        const viewedFeatures = history.flatMap(h => h.features || []);
        const commonFeatures = (property.features || []).filter((f: string) =>
            viewedFeatures.includes(f)
        );
        matchScore += Math.min(3, commonFeatures.length);

        return matchScore;
    }

    private calculatePriceMatch(price: number, typicalBudget?: { min: number; max: number }): number {
        if (!typicalBudget) return 0;

        if (price >= typicalBudget.min && price <= typicalBudget.max) {
            return 10; // Perfect match
        }

        // Calculate how far outside range
        if (price < typicalBudget.min) {
            const underBudget = (typicalBudget.min - price) / typicalBudget.min;
            return Math.max(0, 10 - underBudget * 20);
        } else {
            const overBudget = (price - typicalBudget.max) / typicalBudget.max;
            return Math.max(0, 10 - overBudget * 30);
        }
    }

    private formatFacets(aggregations: any) {
        return {
            price_ranges: this.formatBuckets(aggregations.price_ranges),
            property_types: this.formatBuckets(aggregations.property_types),
            neighborhoods: this.formatBuckets(aggregations.neighborhoods),
            bedrooms: this.formatBuckets(aggregations.bedrooms),
            vastu_score_ranges: this.formatBuckets(aggregations.vastu_score_ranges),
            climate_risk_ranges: this.formatBuckets(aggregations.climate_risk_ranges)
        };
    }

    private formatBuckets(buckets: any) {
        if (!buckets) return {};

        const result: Record<string, number> = {};
        buckets.buckets.forEach((bucket: any) => {
            result[bucket.key] = bucket.doc_count;
        });
        return result;
    }

    private calculateMapBounds(properties: any[]) {
        if (properties.length === 0) return null;

        const lats = properties.map(p => p.address.location.lat);
        const lngs = properties.map(p => p.address.location.lon);

        return {
            north: Math.max(...lats),
            south: Math.min(...lats),
            east: Math.max(...lngs),
            west: Math.min(...lngs)
        };
    }

    private explainSimilarity(ref: any, similar: any): string[] {
        const reasons: string[] = [];

        if (ref.city === similar.address.city) {
            reasons.push(`Same neighborhood: ${ref.city}`);
        }

        const priceDiff = Math.abs(ref.price - similar.basic_info.price) / ref.price;
        if (priceDiff < 0.1) {
            reasons.push('Similar price range');
        }

        if (ref.bedrooms === similar.basic_info.bedrooms) {
            reasons.push(`Same number of bedrooms: ${ref.bedrooms}`);
        }

        const commonFeatures = ref.features.filter((f: string) =>
            similar.features?.includes(f)
        );
        if (commonFeatures.length > 0) {
            reasons.push(`Shared features: ${commonFeatures.slice(0, 2).join(', ')}`);
        }

        return reasons;
    }

    private async findSimilarSavedSearches(userId: string, query: SearchQuery): Promise<number> {
        // Query database for similar saved searches
        // This is a simplified version
        return 0;
    }

    private async logSearch(userId: string, query: SearchQuery, resultCount: number) {
        // Log to analytics system
        // Note: this.analytics is not defined in the snippet, assuming it's injected or handled elsewhere
        // For now, commenting out to avoid error
        /*
        await this.analytics.track('property_search', {
          user_id: userId,
          filters_used: Object.keys(query.filters || {}).length,
          result_count: resultCount,
          has_spiritual_filters: !!(query.filters?.vastu_min_score || query.filters?.feng_shui_required),
          has_climate_filters: !!query.filters?.climate_risk_max,
          location_type: query.location.type,
          timestamp: new Date()
        });
        */
    }
}
