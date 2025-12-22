import request from 'supertest';
import { app } from '../../server';
import { TestHelpers } from '../setup';

describe('Ayurvedic Property Analysis Integration Tests', () => {
    let testUser: any;
    let testProperty: any;
    let authToken: string;

    beforeAll(async () => {
        // Create test user and property
        testUser = await TestHelpers.createTestUser({
            email: 'ayurveda-test@example.com'
        });
        authToken = 'mock-token';

        testProperty = await TestHelpers.createTestProperty(testUser.user_id, {
            city: 'Kerala',
            state: 'KL',
            price: 8000000
        });
    });

    afterAll(async () => {
        await TestHelpers.cleanupDatabase();
    });

    describe('POST /api/v1/properties/:id/ayurveda/analyze', () => {
        it('should analyze property successfully', async () => {
            const response = await request(app)
                .post(`/api/v1/properties/${testProperty.property_id}/ayurveda/analyze`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    temperature: 28,
                    humidity: 80,
                    rainfall: 2000,
                    elevation: 50,
                    waterfront: true,
                    construction_material: 'concrete'
                })
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.analysis_id).toBeDefined();
            expect(response.body.dominant_dosha).toBeDefined();
        }, 60000);

        it('should require authentication', async () => {
            await request(app)
                .post(`/api/v1/properties/${testProperty.property_id}/ayurveda/analyze`)
                .send({
                    temperature: 28
                })
                .expect(401);
        });
    });

    describe('GET /api/v1/properties/:id/ayurveda', () => {
        let analysisId: string;

        beforeAll(async () => {
            // Create analysis
            const response = await request(app)
                .post(`/api/v1/properties/${testProperty.property_id}/ayurveda/analyze`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    temperature: 28,
                    humidity: 80
                });

            analysisId = response.body.analysis_id;
        }, 60000);

        it('should retrieve all property analyses', async () => {
            const response = await request(app)
                .get(`/api/v1/properties/${testProperty.property_id}/ayurveda`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.property_id).toBe(testProperty.property_id);
            expect(response.body.total_analyses).toBeGreaterThan(0);
            expect(response.body.analyses).toBeInstanceOf(Array);
            expect(response.body.analyses[0]).toHaveProperty('dominant_dosha');
        });
    });

    describe('GET /api/v1/properties/:id/ayurveda/:analysisId', () => {
        let analysisId: string;

        beforeAll(async () => {
            const response = await request(app)
                .post(`/api/v1/properties/${testProperty.property_id}/ayurveda/analyze`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    temperature: 28,
                    humidity: 80
                });

            analysisId = response.body.analysis_id;
        }, 60000);

        it('should retrieve detailed analysis', async () => {
            const response = await request(app)
                .get(`/api/v1/properties/${testProperty.property_id}/ayurveda/${analysisId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.analysis_id).toBe(analysisId);
            expect(response.body.vata_score).toBeDefined();
            expect(response.body.pitta_score).toBeDefined();
            expect(response.body.kapha_score).toBeDefined();
            expect(response.body.recommendations).toBeInstanceOf(Array);
        });
    });
});
