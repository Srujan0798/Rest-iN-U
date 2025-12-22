import request from 'supertest';
import { app } from '../../server';
import { TestHelpers } from '../setup';

describe('Puranic Land Analysis Integration Tests', () => {
    let testUser: any;
    let testProperty: any;
    let authToken: string;

    beforeAll(async () => {
        // Create test user and property
        testUser = await TestHelpers.createTestUser({
            email: 'puranic-test@example.com'
        });
        authToken = 'mock-token';

        testProperty = await TestHelpers.createTestProperty(testUser.user_id, {
            city: 'Varanasi',
            state: 'UP',
            price: 6000000
        });
    });

    afterAll(async () => {
        await TestHelpers.cleanupDatabase();
    });

    describe('POST /api/v1/properties/:id/puranic/analyze', () => {
        it('should analyze land successfully', async () => {
            const response = await request(app)
                .post(`/api/v1/properties/${testProperty.property_id}/puranic/analyze`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    latitude: 25.3176,
                    longitude: 82.9739,
                    elevation: 80,
                    soil_data: {
                        color: 'reddish',
                        fertility: 0.8
                    }
                })
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.analysis_id).toBeDefined();
            expect(response.body.classification).toBeDefined();
        }, 60000);

        it('should require authentication', async () => {
            await request(app)
                .post(`/api/v1/properties/${testProperty.property_id}/puranic/analyze`)
                .send({
                    latitude: 25.3176,
                    longitude: 82.9739,
                    elevation: 80
                })
                .expect(401);
        });
    });

    describe('GET /api/v1/properties/:id/puranic', () => {
        let analysisId: string;

        beforeAll(async () => {
            // Create analysis
            const response = await request(app)
                .post(`/api/v1/properties/${testProperty.property_id}/puranic/analyze`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    latitude: 25.3176,
                    longitude: 82.9739,
                    elevation: 80
                });

            analysisId = response.body.analysis_id;
        }, 60000);

        it('should retrieve all property analyses', async () => {
            const response = await request(app)
                .get(`/api/v1/properties/${testProperty.property_id}/puranic`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.property_id).toBe(testProperty.property_id);
            expect(response.body.total_analyses).toBeGreaterThan(0);
            expect(response.body.analyses).toBeInstanceOf(Array);
            expect(response.body.analyses[0]).toHaveProperty('analysis_id');
            expect(response.body.analyses[0]).toHaveProperty('classification');
        });
    });

    describe('GET /api/v1/properties/:id/puranic/:analysisId', () => {
        let analysisId: string;

        beforeAll(async () => {
            const response = await request(app)
                .post(`/api/v1/properties/${testProperty.property_id}/puranic/analyze`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    latitude: 25.3176,
                    longitude: 82.9739,
                    elevation: 80
                });

            analysisId = response.body.analysis_id;
        }, 60000);

        it('should retrieve detailed analysis', async () => {
            const response = await request(app)
                .get(`/api/v1/properties/${testProperty.property_id}/puranic/${analysisId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.analysis_id).toBe(analysisId);
            expect(response.body.bhumi_tattva).toBeDefined();
            expect(response.body.elemental_balance).toBeDefined();
            expect(response.body.sacred_geography).toBeDefined();
        });
    });
});
