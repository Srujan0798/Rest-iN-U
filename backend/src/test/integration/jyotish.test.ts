import request from 'supertest';
import { app } from '../../server';
import { TestHelpers } from '../setup';

describe('Jyotish Analysis Integration Tests', () => {
    let testUser: any;
    let testProperty: any;
    let authToken: string;

    beforeAll(async () => {
        // Create test user and property
        testUser = await TestHelpers.createTestUser({
            email: 'jyotish-test@example.com'
        });
        authToken = 'mock-token';

        testProperty = await TestHelpers.createTestProperty(testUser.user_id, {
            city: 'Varanasi',
            state: 'UP',
            price: 5000000
        });
    });

    afterAll(async () => {
        await TestHelpers.cleanupDatabase();
    });

    describe('POST /api/v1/properties/:id/jyotish/muhurat', () => {
        it('should analyze muhurat successfully', async () => {
            const response = await request(app)
                .post(`/api/v1/properties/${testProperty.property_id}/jyotish/muhurat`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    latitude: 25.3176,
                    longitude: 82.9739,
                    analysis_type: 'purchase',
                    buyer_birth_data: {
                        datetime: '1990-01-01T12:00:00',
                        lat: 25.3176,
                        lng: 82.9739
                    }
                })
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.analysis_id).toBeDefined();
            expect(response.body.analysis_type).toBe('purchase');
        }, 60000);

        it('should require authentication', async () => {
            await request(app)
                .post(`/api/v1/properties/${testProperty.property_id}/jyotish/muhurat`)
                .send({
                    latitude: 25.3176,
                    longitude: 82.9739
                })
                .expect(401);
        });
    });

    describe('GET /api/v1/properties/:id/jyotish', () => {
        let analysisId: string;

        beforeAll(async () => {
            // Create analysis
            const response = await request(app)
                .post(`/api/v1/properties/${testProperty.property_id}/jyotish/muhurat`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    latitude: 25.3176,
                    longitude: 82.9739,
                    analysis_type: 'griha_pravesh'
                });

            analysisId = response.body.analysis_id;
        }, 60000);

        it('should retrieve all property analyses', async () => {
            const response = await request(app)
                .get(`/api/v1/properties/${testProperty.property_id}/jyotish`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.property_id).toBe(testProperty.property_id);
            expect(response.body.total_analyses).toBeGreaterThan(0);
            expect(response.body.analyses).toBeInstanceOf(Array);
            expect(response.body.analyses[0]).toHaveProperty('analysis_id');
            expect(response.body.analyses[0]).toHaveProperty('analysis_type');
        });
    });

    describe('GET /api/v1/properties/:id/jyotish/:analysisId', () => {
        let analysisId: string;

        beforeAll(async () => {
            const response = await request(app)
                .post(`/api/v1/properties/${testProperty.property_id}/jyotish/muhurat`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    latitude: 25.3176,
                    longitude: 82.9739,
                    analysis_type: 'registration'
                });

            analysisId = response.body.analysis_id;
        }, 60000);

        it('should retrieve detailed analysis', async () => {
            const response = await request(app)
                .get(`/api/v1/properties/${testProperty.property_id}/jyotish/${analysisId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.analysis_id).toBe(analysisId);
            expect(response.body.best_muhurats).toBeInstanceOf(Array);
            expect(response.body.avoid_dates).toBeInstanceOf(Array);
            expect(response.body.general_guidance).toBeInstanceOf(Array);
        });
    });
});
