import request from 'supertest';
import { app } from '../../server';
import { TestHelpers } from '../setup';
import { ElasticsearchService } from '../../services/elasticsearch.service';

describe('Property Search Integration Tests', () => {
    let testUser: any;
    let testProperties: any[] = [];
    let authToken: string;
    let esService: ElasticsearchService;

    beforeAll(async () => {
        esService = new ElasticsearchService();

        // Recreate test index
        await esService.client.indices.delete({ index: 'properties', ignore_unavailable: true });
        await esService.createPropertyIndex();

        // Create test user
        testUser = await TestHelpers.createTestUser({
            email: 'search-test@example.com',
            preferences: {
                vastu_importance: 8,
                climate_concern: 9,
                max_budget: 1500000
            }
        });
        // authToken = generateTestToken(testUser.user_id); // Mock token generation
        authToken = 'mock-token';

        // Create diverse test properties
        const propertyData = [
            {
                city: 'Boulder', state: 'CO', price: 500000, bedrooms: 3, bathrooms: 2,
                property_type: 'house', vastu_score: 85, climate_risk: 25, lat: 40.0150, lng: -105.2705
            },
            {
                city: 'Boulder', state: 'CO', price: 750000, bedrooms: 4, bathrooms: 3,
                property_type: 'house', vastu_score: 72, climate_risk: 30, lat: 40.0180, lng: -105.2650
            },
            {
                city: 'Boulder', state: 'CO', price: 1200000, bedrooms: 5, bathrooms: 4,
                property_type: 'house', vastu_score: 90, climate_risk: 20, lat: 40.0200, lng: -105.2600
            },
            {
                city: 'Denver', state: 'CO', price: 600000, bedrooms: 3, bathrooms: 2,
                property_type: 'condo', vastu_score: 65, climate_risk: 35, lat: 39.7392, lng: -104.9903
            },
            {
                city: 'Boulder', state: 'CO', price: 450000, bedrooms: 2, bathrooms: 2,
                property_type: 'condo', vastu_score: 78, climate_risk: 28, lat: 40.0165, lng: -105.2720
            }
        ];

        for (const data of propertyData) {
            const property = await TestHelpers.createTestProperty(testUser.user_id, {
                ...data,
                street: `${Math.floor(Math.random() * 999)} Test St`,
                zip: '80302',
                square_feet: 2000,
                year_built: 2020
            });
            testProperties.push(property);

            // Index in Elasticsearch
            await esService.indexProperty(property);
        }

        // Wait for indexing
        await new Promise(resolve => setTimeout(resolve, 2000));
    });

    afterAll(async () => {
        await TestHelpers.cleanupDatabase();
        await esService.client.indices.delete({ index: 'properties' });
    });

    describe('Basic Search', () => {
        it('should search by city', async () => {
            const response = await request(app)
                .post('/api/v1/properties/search')
                .send({
                    location: { type: 'city', value: 'Boulder, CO' }
                })
                .expect(200);

            expect(response.body.total_results).toBe(4); // 4 Boulder properties
            expect(response.body.properties).toHaveLength(4);
            response.body.properties.forEach((prop: any) => {
                expect(prop.address.city).toBe('Boulder');
            });
        });

        it('should filter by price range', async () => {
            const response = await request(app)
                .post('/api/v1/properties/search')
                .send({
                    location: { type: 'city', value: 'Boulder, CO' },
                    filters: {
                        price: { min: 500000, max: 800000 }
                    }
                })
                .expect(200);

            expect(response.body.total_results).toBe(2); // 500k and 750k properties
            response.body.properties.forEach((prop: any) => {
                expect(prop.basic_info.price).toBeGreaterThanOrEqual(500000);
                expect(prop.basic_info.price).toBeLessThanOrEqual(800000);
            });
        });

        it('should filter by bedrooms', async () => {
            const response = await request(app)
                .post('/api/v1/properties/search')
                .send({
                    location: { type: 'city', value: 'Boulder, CO' },
                    filters: {
                        bedrooms: { min: 4 }
                    }
                })
                .expect(200);

            response.body.properties.forEach((prop: any) => {
                expect(prop.basic_info.bedrooms).toBeGreaterThanOrEqual(4);
            });
        });

        it('should filter by property type', async () => {
            const response = await request(app)
                .post('/api/v1/properties/search')
                .send({
                    location: { type: 'city', value: 'Boulder, CO' },
                    filters: {
                        property_type: ['house']
                    }
                })
                .expect(200);

            expect(response.body.total_results).toBe(3); // 3 houses in Boulder
            response.body.properties.forEach((prop: any) => {
                expect(prop.basic_info.property_type).toBe('house');
            });
        });
    });

    describe('Spiritual Filters', () => {
        it('should filter by Vastu score', async () => {
            const response = await request(app)
                .post('/api/v1/properties/search')
                .send({
                    location: { type: 'city', value: 'Boulder, CO' },
                    filters: {
                        vastu_min_score: 80
                    }
                })
                .expect(200);

            expect(response.body.total_results).toBe(2); // 85 and 90 score properties
            response.body.properties.forEach((prop: any) => {
                expect(prop.scores.vastu).toBeGreaterThanOrEqual(80);
            });
        });

        it('should filter by climate risk', async () => {
            const response = await request(app)
                .post('/api/v1/properties/search')
                .send({
                    location: { type: 'city', value: 'Boulder, CO' },
                    filters: {
                        climate_risk_max: 25
                    }
                })
                .expect(200);

            expect(response.body.total_results).toBe(2); // 20 and 25 risk properties
            response.body.properties.forEach((prop: any) => {
                expect(prop.climate_risk.overall_score).toBeLessThanOrEqual(25);
            });
        });

        it('should combine spiritual and standard filters', async () => {
            const response = await request(app)
                .post('/api/v1/properties/search')
                .send({
                    location: { type: 'city', value: 'Boulder, CO' },
                    filters: {
                        price: { max: 800000 },
                        vastu_min_score: 75,
                        climate_risk_max: 30
                    }
                })
                .expect(200);

            response.body.properties.forEach((prop: any) => {
                expect(prop.basic_info.price).toBeLessThanOrEqual(800000);
                expect(prop.scores.vastu).toBeGreaterThanOrEqual(75);
                expect(prop.climate_risk.overall_score).toBeLessThanOrEqual(30);
            });
        });
    });

    describe('Geo Search', () => {
        it('should search by coordinates with radius', async () => {
            const response = await request(app)
                .post('/api/v1/properties/search')
                .send({
                    location: {
                        type: 'coordinates',
                        value: { lat: 40.0150, lng: -105.2705 },
                        radius_miles: 5
                    }
                })
                .expect(200);

            expect(response.body.total_results).toBeGreaterThan(0);
            expect(response.body.properties[0]).toHaveProperty('address');
        });

        it('should return properties sorted by distance', async () => {
            const centerLat = 40.0150;
            const centerLng = -105.2705;

            const response = await request(app)
                .post('/api/v1/properties/search')
                .send({
                    location: {
                        type: 'coordinates',
                        value: { lat: centerLat, lng: centerLng },
                        radius_miles: 10
                    },
                    sort: {
                        field: '_geo_distance',
                        direction: 'asc'
                    }
                })
                .expect(200);

            // Verify results are sorted by distance (closest first)
            let lastDistance = 0;
            response.body.properties.forEach((prop: any) => {
                const distance = calculateDistance(
                    centerLat, centerLng,
                    prop.address.location.lat, prop.address.location.lon
                );
                expect(distance).toBeGreaterThanOrEqual(lastDistance);
                lastDistance = distance;
            });
        });
    });

    describe('Faceted Search', () => {
        it('should return facets with counts', async () => {
            const response = await request(app)
                .post('/api/v1/properties/search')
                .send({
                    location: { type: 'city', value: 'Boulder, CO' }
                })
                .expect(200);

            expect(response.body.facets).toBeDefined();
            expect(response.body.facets.price_ranges).toBeDefined();
            expect(response.body.facets.property_types).toBeDefined();
            expect(response.body.facets.vastu_score_ranges).toBeDefined();

            // Verify counts
            const propertyTypes = response.body.facets.property_types;
            expect(propertyTypes.house).toBe(3);
            expect(propertyTypes.condo).toBe(1);
        });
    });

    describe('Pagination', () => {
        it('should paginate results', async () => {
            const page1 = await request(app)
                .post('/api/v1/properties/search')
                .send({
                    location: { type: 'city', value: 'Boulder, CO' },
                    pagination: { page: 1, limit: 2 }
                })
                .expect(200);

            expect(page1.body.page).toBe(1);
            expect(page1.body.properties).toHaveLength(2);
            expect(page1.body.total_pages).toBe(2); // 4 properties / 2 per page

            const page2 = await request(app)
                .post('/api/v1/properties/search')
                .send({
                    location: { type: 'city', value: 'Boulder, CO' },
                    pagination: { page: 2, limit: 2 }
                })
                .expect(200);

            expect(page2.body.page).toBe(2);
            expect(page2.body.properties).toHaveLength(2);

            // Ensure different results
            const page1Ids = page1.body.properties.map((p: any) => p.property_id);
            const page2Ids = page2.body.properties.map((p: any) => p.property_id);
            expect(page1Ids).not.toEqual(page2Ids);
        });
    });

    describe('Sorting', () => {
        it('should sort by price ascending', async () => {
            const response = await request(app)
                .post('/api/v1/properties/search')
                .send({
                    location: { type: 'city', value: 'Boulder, CO' },
                    sort: { field: 'price', direction: 'asc' }
                })
                .expect(200);

            const prices = response.body.properties.map((p: any) => p.basic_info.price);
            const sortedPrices = [...prices].sort((a, b) => a - b);
            expect(prices).toEqual(sortedPrices);
        });

        it('should sort by price descending', async () => {
            const response = await request(app)
                .post('/api/v1/properties/search')
                .send({
                    location: { type: 'city', value: 'Boulder, CO' },
                    sort: { field: 'price', direction: 'desc' }
                })
                .expect(200);

            const prices = response.body.properties.map((p: any) => p.basic_info.price);
            const sortedPrices = [...prices].sort((a, b) => b - a);
            expect(prices).toEqual(sortedPrices);
        });

        it('should sort by Vastu score', async () => {
            const response = await request(app)
                .post('/api/v1/properties/search')
                .send({
                    location: { type: 'city', value: 'Boulder, CO' },
                    sort: { field: 'vastu_score', direction: 'desc' }
                })
                .expect(200);

            const scores = response.body.properties.map((p: any) => p.scores.vastu);
            const sortedScores = [...scores].sort((a, b) => b - a);
            expect(scores).toEqual(sortedScores);
        });
    });

    describe('Personalized Scoring', () => {
        it('should apply personalized scores for authenticated users', async () => {
            const response = await request(app)
                .post('/api/v1/properties/search')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    location: { type: 'city', value: 'Boulder, CO' }
                })
                .expect(200);

            // Verify all properties have overall_match score
            response.body.properties.forEach((prop: any) => {
                expect(prop.scores.overall_match).toBeDefined();
                expect(prop.scores.overall_match).toBeGreaterThan(0);
                expect(prop.scores.overall_match).toBeLessThanOrEqual(100);
            });

            // Properties with high Vastu and low climate risk should score higher
            // (user has vastu_importance: 8, climate_concern: 9)
            const highVastuLowRisk = response.body.properties.find(
                (p: any) => p.scores.vastu >= 85 && p.climate_risk.overall_score <= 25
            );
            const lowVastuHighRisk = response.body.properties.find(
                (p: any) => p.scores.vastu < 70 && p.climate_risk.overall_score >= 35
            );

            if (highVastuLowRisk && lowVastuHighRisk) {
                expect(highVastuLowRisk.scores.overall_match).toBeGreaterThan(
                    lowVastuHighRisk.scores.overall_match
                );
            }
        });
    });

    describe('Similar Properties', () => {
        it('should find similar properties', async () => {
            const referenceProperty = testProperties[0];

            const response = await request(app)
                .post('/api/v1/properties/similar')
                .send({
                    property_id: referenceProperty.property_id,
                    count: 3
                })
                .expect(200);

            expect(response.body.reference_property).toBe(referenceProperty.property_id);
            expect(response.body.similar_properties).toHaveLength(3);

            // Verify similarity reasons provided
            response.body.similar_properties.forEach((prop: any) => {
                expect(prop.similarity_score).toBeDefined();
                expect(prop.reasons).toBeInstanceOf(Array);
                expect(prop.reasons.length).toBeGreaterThan(0);
            });
        });
    });

    describe('Map Clustering', () => {
        it('should return clustered results for map view', async () => {
            const query = {
                location: { type: 'city', value: 'Boulder, CO' }
            };

            const response = await request(app)
                .get('/api/v1/properties/map-clusters')
                .query({ query: JSON.stringify(query) })
                .expect(200);

            expect(response.body.clusters).toBeDefined();
            expect(response.body.clusters).toBeInstanceOf(Array);

            // Verify cluster structure
            response.body.clusters.forEach((cluster: any) => {
                expect(cluster.location).toBeDefined();
                expect(cluster.location.lat).toBeDefined();
                expect(cluster.location.lon).toBeDefined();
                expect(cluster.count).toBeGreaterThan(0);
                expect(cluster.avg_price).toBeDefined();
                expect(cluster.price_range).toBeDefined();
            });
        });
    });

    describe('Caching', () => {
        it('should cache search results', async () => {
            const query = {
                location: { type: 'city', value: 'Boulder, CO' },
                filters: { price: { max: 1000000 } }
            };

            // First request
            const response1 = await request(app)
                .post('/api/v1/properties/search')
                .send(query)
                .expect(200);

            expect(response1.body.cached).toBeUndefined(); // First request not cached

            // Second identical request
            const response2 = await request(app)
                .post('/api/v1/properties/search')
                .send(query)
                .expect(200);

            expect(response2.body.cached).toBe(true); // Second request from cache
            expect(response2.body.properties).toEqual(response1.body.properties);
        });
    });

    describe('Performance', () => {
        it('should return results in under 500ms', async () => {
            const startTime = Date.now();

            await request(app)
                .post('/api/v1/properties/search')
                .send({
                    location: { type: 'city', value: 'Boulder, CO' },
                    filters: {
                        price: { min: 400000, max: 800000 },
                        vastu_min_score: 70
                    }
                })
                .expect(200);

            const duration = Date.now() - startTime;
            expect(duration).toBeLessThan(500);
        });
    });
});

// Helper function
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
