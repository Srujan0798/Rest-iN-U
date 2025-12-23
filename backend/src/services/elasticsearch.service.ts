import { Client } from '@elastic/elasticsearch';

// Elasticsearch Service for Advanced Property Search
class ElasticsearchService {
    private client: Client;
    private indexName = 'properties';

    constructor() {
        this.client = new Client({
            node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
            auth: process.env.ES_USERNAME ? {
                username: process.env.ES_USERNAME,
                password: process.env.ES_PASSWORD || ''
            } : undefined
        });
    }

    // Initialize properties index with mapping
    async createPropertyIndex(): Promise<void> {
        const indexExists = await this.client.indices.exists({ index: this.indexName });

        if (indexExists) {
            console.log('Properties index already exists');
            return;
        }

        await this.client.indices.create({
            index: this.indexName,
            body: {
                settings: {
                    number_of_shards: 3,
                    number_of_replicas: 1,
                    analysis: {
                        analyzer: {
                            property_analyzer: {
                                type: 'custom',
                                tokenizer: 'standard',
                                filter: ['lowercase', 'asciifolding', 'stop', 'snowball']
                            }
                        }
                    }
                },
                mappings: {
                    properties: {
                        property_id: { type: 'keyword' },
                        mls_id: { type: 'keyword' },
                        address: {
                            properties: {
                                street: { type: 'text', analyzer: 'property_analyzer' },
                                city: { type: 'keyword' },
                                state: { type: 'keyword' },
                                zip: { type: 'keyword' },
                                location: { type: 'geo_point' }
                            }
                        },
                        basic_info: {
                            properties: {
                                price: { type: 'integer' },
                                bedrooms: { type: 'integer' },
                                bathrooms: { type: 'float' },
                                square_feet: { type: 'integer' },
                                lot_size: { type: 'integer' },
                                year_built: { type: 'integer' },
                                property_type: { type: 'keyword' },
                                listing_type: { type: 'keyword' },
                                status: { type: 'keyword' }
                            }
                        },
                        description: { type: 'text', analyzer: 'property_analyzer' },
                        features: { type: 'keyword' },
                        scores: {
                            properties: {
                                vastu: { type: 'integer' },
                                feng_shui: { type: 'integer' },
                                land_energy: { type: 'integer' },
                                climate_risk: { type: 'integer' },
                                smart_home: { type: 'integer' }
                            }
                        },
                        climate_risk: {
                            properties: {
                                overall_score: { type: 'integer' },
                                flood_risk: { type: 'integer' },
                                wildfire_risk: { type: 'integer' },
                                hurricane_risk: { type: 'integer' }
                            }
                        },
                        neighborhood: {
                            properties: {
                                name: { type: 'keyword' },
                                walkability_score: { type: 'integer' },
                                transit_score: { type: 'integer' },
                                crime_index: { type: 'integer' },
                                school_rating_avg: { type: 'float' }
                            }
                        },
                        financial: {
                            properties: {
                                price_per_sqft: { type: 'integer' },
                                estimated_monthly_payment: { type: 'integer' },
                                rental_yield_percent: { type: 'float' }
                            }
                        },
                        listing_agent_id: { type: 'keyword' },
                        owner_id: { type: 'keyword' },
                        days_on_market: { type: 'integer' },
                        listed_date: { type: 'date' },
                        view_count: { type: 'integer' },
                        favorite_count: { type: 'integer' },
                        blockchain_verified: { type: 'boolean' },
                        created_at: { type: 'date' },
                        updated_at: { type: 'date' }
                    }
                }
            }
        });

        console.log('Properties index created successfully');
    }

    // Index a single property
    async indexProperty(property: any): Promise<void> {
        const document = this.transformPropertyForIndex(property);

        await this.client.index({
            index: this.indexName,
            id: property.id || property.property_id,
            document,
            refresh: true
        });

        console.log(`Indexed property: ${property.id || property.property_id}`);
    }

    // Bulk index multiple properties
    async bulkIndexProperties(properties: any[]): Promise<any> {
        const operations = properties.flatMap(property => [
            { index: { _index: this.indexName, _id: property.id || property.property_id } },
            this.transformPropertyForIndex(property)
        ]);

        const response = await this.client.bulk({ operations, refresh: true });

        if (response.errors) {
            console.error('Bulk indexing errors found');
        }

        console.log(`Bulk indexed ${properties.length} properties`);
        return response;
    }

    // Delete property from index
    async deleteProperty(propertyId: string): Promise<void> {
        await this.client.delete({
            index: this.indexName,
            id: propertyId,
            refresh: true
        });

        console.log(`Deleted property from index: ${propertyId}`);
    }

    // Advanced search with filters
    async search(query: SearchQuery): Promise<SearchResult> {
        const esQuery = this.buildSearchQuery(query);

        const result = await this.client.search({
            index: this.indexName,
            body: esQuery
        });

        return {
            total: (result.hits.total as any).value || 0,
            hits: result.hits.hits.map((hit: any) => ({
                ...hit._source,
                _score: hit._score
            })),
            aggregations: result.aggregations
        };
    }

    // Geo-distance search
    async searchByLocation(lat: number, lng: number, radiusMiles: number, filters?: any): Promise<any> {
        const result = await this.client.search({
            index: this.indexName,
            body: {
                query: {
                    bool: {
                        filter: [
                            {
                                geo_distance: {
                                    distance: `${radiusMiles}mi`,
                                    'address.location': { lat, lon: lng }
                                }
                            },
                            ...(filters ? this.buildFilters(filters) : [])
                        ]
                    }
                },
                sort: [
                    {
                        _geo_distance: {
                            'address.location': { lat, lon: lng },
                            order: 'asc',
                            unit: 'mi'
                        }
                    }
                ]
            }
        });

        return result.hits.hits.map((hit: any) => ({
            ...hit._source,
            distance_miles: hit.sort?.[0]
        }));
    }

    // Map clustering for visualization
    async getMapClusters(bounds: MapBounds, precision: number = 5): Promise<any[]> {
        const result = await this.client.search({
            index: this.indexName,
            body: {
                query: {
                    geo_bounding_box: {
                        'address.location': {
                            top_left: { lat: bounds.north, lon: bounds.west },
                            bottom_right: { lat: bounds.south, lon: bounds.east }
                        }
                    }
                },
                aggs: {
                    grid: {
                        geohash_grid: {
                            field: 'address.location',
                            precision
                        },
                        aggs: {
                            centroid: { geo_centroid: { field: 'address.location' } },
                            avg_price: { avg: { field: 'basic_info.price' } },
                            min_price: { min: { field: 'basic_info.price' } },
                            max_price: { max: { field: 'basic_info.price' } }
                        }
                    }
                },
                size: 0
            }
        });

        return (result.aggregations as any).grid.buckets.map((bucket: any) => ({
            location: bucket.centroid.location,
            count: bucket.doc_count,
            avg_price: Math.round(bucket.avg_price.value),
            price_range: {
                min: bucket.min_price.value,
                max: bucket.max_price.value
            }
        }));
    }

    // Similar properties using More Like This
    async findSimilar(propertyId: string, count: number = 5): Promise<any[]> {
        const result = await this.client.search({
            index: this.indexName,
            body: {
                query: {
                    bool: {
                        must: [
                            {
                                more_like_this: {
                                    fields: ['description', 'features', 'address.city'],
                                    like: [{ _index: this.indexName, _id: propertyId }],
                                    min_term_freq: 1,
                                    max_query_terms: 12
                                }
                            }
                        ],
                        must_not: [{ term: { property_id: propertyId } }]
                    }
                },
                size: count
            }
        });

        return result.hits.hits.map((hit: any) => ({
            ...hit._source,
            similarity_score: hit._score
        }));
    }

    // Private helpers
    private transformPropertyForIndex(property: any): any {
        return {
            property_id: property.id || property.property_id,
            mls_id: property.mlsId,
            address: {
                street: property.street,
                city: property.city,
                state: property.state,
                zip: property.zipCode,
                location: property.latitude && property.longitude ? {
                    lat: property.latitude,
                    lon: property.longitude
                } : null
            },
            basic_info: {
                price: property.price,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                square_feet: property.squareFeet,
                lot_size: property.lotSize,
                year_built: property.yearBuilt,
                property_type: property.propertyType,
                listing_type: property.listingType,
                status: property.status
            },
            description: property.description,
            features: property.features || [],
            scores: {
                vastu: property.vastuScore || 0,
                feng_shui: property.fengShuiScore || 0,
                land_energy: property.landEnergyScore || 0,
                climate_risk: property.climateRiskScore || 0,
                smart_home: property.smartHomeScore || 0
            },
            climate_risk: property.climateRisk ? {
                overall_score: property.climateRisk.overallScore,
                flood_risk: property.climateRisk.floodRisk,
                wildfire_risk: property.climateRisk.wildfireRisk,
                hurricane_risk: property.climateRisk.hurricaneRisk
            } : null,
            neighborhood: property.neighborhood ? {
                name: property.neighborhood.name,
                walkability_score: property.neighborhood.walkabilityScore,
                transit_score: property.neighborhood.transitScore,
                crime_index: property.neighborhood.crimeIndex,
                school_rating_avg: property.neighborhood.schoolRatingAvg
            } : null,
            financial: {
                price_per_sqft: property.squareFeet ? Math.round(property.price / property.squareFeet) : null,
                estimated_monthly_payment: property.estimatedMonthlyPayment,
                rental_yield_percent: property.rentalYieldPercent
            },
            listing_agent_id: property.listingAgentId,
            owner_id: property.ownerId,
            days_on_market: property.daysOnMarket,
            listed_date: property.listedDate,
            view_count: property.viewCount || 0,
            favorite_count: property.favoriteCount || 0,
            blockchain_verified: !!property.blockchainTokenId,
            created_at: property.createdAt,
            updated_at: property.updatedAt
        };
    }

    private buildSearchQuery(query: SearchQuery): any {
        const must: any[] = [];
        const filter: any[] = [];

        // Location filter
        if (query.location) {
            if (query.location.type === 'city') {
                filter.push({ term: { 'address.city': query.location.value } });
            } else if (query.location.type === 'coordinates') {
                filter.push({
                    geo_distance: {
                        distance: `${query.location.radiusMiles || 10}mi`,
                        'address.location': {
                            lat: query.location.lat,
                            lon: query.location.lng
                        }
                    }
                });
            }
        }

        // Price filter
        if (query.filters?.price) {
            filter.push({
                range: {
                    'basic_info.price': {
                        ...(query.filters.price.min && { gte: query.filters.price.min }),
                        ...(query.filters.price.max && { lte: query.filters.price.max })
                    }
                }
            });
        }

        // Bedrooms filter
        if (query.filters?.bedrooms) {
            filter.push({
                range: { 'basic_info.bedrooms': { gte: query.filters.bedrooms.min } }
            });
        }

        // Property type filter
        if (query.filters?.propertyType?.length) {
            filter.push({ terms: { 'basic_info.property_type': query.filters.propertyType } });
        }

        // Vastu score filter
        if (query.filters?.vastuMinScore) {
            filter.push({ range: { 'scores.vastu': { gte: query.filters.vastuMinScore } } });
        }

        // Climate risk filter
        if (query.filters?.climateRiskMax) {
            filter.push({ range: { 'climate_risk.overall_score': { lte: query.filters.climateRiskMax } } });
        }

        // Status filter (default to active)
        filter.push({ term: { 'basic_info.status': query.filters?.status || 'active' } });

        // Keyword search
        if (query.filters?.keywords) {
            must.push({
                multi_match: {
                    query: query.filters.keywords,
                    fields: ['description^2', 'address.street', 'features'],
                    type: 'best_fields'
                }
            });
        }

        const esQuery: any = {
            query: { bool: { must, filter } },
            from: ((query.pagination?.page || 1) - 1) * (query.pagination?.limit || 24),
            size: Math.min(query.pagination?.limit || 24, 100),
            aggs: {
                price_ranges: {
                    range: {
                        field: 'basic_info.price',
                        ranges: [
                            { key: '0-300k', to: 300000 },
                            { key: '300k-500k', from: 300000, to: 500000 },
                            { key: '500k-750k', from: 500000, to: 750000 },
                            { key: '750k-1M', from: 750000, to: 1000000 },
                            { key: '1M+', from: 1000000 }
                        ]
                    }
                },
                property_types: { terms: { field: 'basic_info.property_type', size: 10 } },
                bedrooms: { terms: { field: 'basic_info.bedrooms', size: 10 } },
                vastu_ranges: {
                    range: {
                        field: 'scores.vastu',
                        ranges: [
                            { key: 'Excellent (80+)', from: 80 },
                            { key: 'Good (60-79)', from: 60, to: 80 },
                            { key: 'Fair (<60)', to: 60 }
                        ]
                    }
                }
            }
        };

        // Sorting
        if (query.sort) {
            const sortMap: Record<string, string> = {
                price: 'basic_info.price',
                vastu_score: 'scores.vastu',
                date: 'listed_date'
            };
            esQuery.sort = [{ [sortMap[query.sort.field] || query.sort.field]: query.sort.direction }];
        } else {
            esQuery.sort = ['_score', { listed_date: 'desc' }];
        }

        return esQuery;
    }

    private buildFilters(filters: any): any[] {
        const result: any[] = [];
        if (filters.price?.min) result.push({ range: { 'basic_info.price': { gte: filters.price.min } } });
        if (filters.price?.max) result.push({ range: { 'basic_info.price': { lte: filters.price.max } } });
        if (filters.propertyType) result.push({ terms: { 'basic_info.property_type': filters.propertyType } });
        return result;
    }

    // Health check
    async healthCheck(): Promise<boolean> {
        try {
            await this.client.ping();
            return true;
        } catch {
            return false;
        }
    }
}

// Types
interface SearchQuery {
    location?: {
        type: 'city' | 'coordinates';
        value?: string;
        lat?: number;
        lng?: number;
        radiusMiles?: number;
    };
    filters?: {
        price?: { min?: number; max?: number };
        bedrooms?: { min?: number };
        propertyType?: string[];
        vastuMinScore?: number;
        climateRiskMax?: number;
        status?: string;
        keywords?: string;
    };
    sort?: { field: string; direction: 'asc' | 'desc' };
    pagination?: { page: number; limit: number };
}

interface SearchResult {
    total: number;
    hits: any[];
    aggregations: any;
}

interface MapBounds {
    north: number;
    south: number;
    east: number;
    west: number;
}

// Export singleton instance
export const elasticsearchService = new ElasticsearchService();
export default ElasticsearchService;

