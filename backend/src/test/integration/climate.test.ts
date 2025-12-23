import request from 'supertest';
import { app } from '../../server';
import { TestHelpers } from '../setup';

describe('Climate Risk Analysis Integration Tests', () => {
    let testUser: any;
    let testProperty: any;
    let authToken: string;

    beforeAll(async () => {
        // Create test user and property
        testUser = await TestHelpers.createTestUser({
            email: 'climate-test@example.com'
        });
        authToken = 'mock-token';

        testProperty = await TestHelpers.createTestProperty(testUser.user_id, {
            city: 'Miami',
            state: 'FL',
            price: 2500000
        });
    });

    afterAll(async () => {
        await TestHelpers.cleanupDatabase();
    });

    describe('POST /api/v1/properties/:id/climate/analyze', () => {
        it('should analyze climate risk successfully', async () => {
            const response = await request(app)
                .post(`/api/v1/properties/${testProperty.property_id}/climate/analyze`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    latitude: 25.7617,
                    longitude: -80.1918,
                    elevation: 5,
                    property_data: {
                        price: 2500000,
                        current_insurance: 5000
                    }
                })
                .expect(201); // NestJS default for POST is 201

            expect(response.body.success).toBe(true);
            expect(response.body.analysis_id).toBeDefined();
            expect(response.body.overall_risk_score).toBeGreaterThanOrEqual(0);
            expect(response.body.overall_risk_score).toBeLessThanOrEqual(100);
            expect(response.body.grade).toBeDefined();
        }, 60000);

        it('should require authentication', async () => {
            await request(app)
                .post(`/api/v1/properties/${testProperty.property_id}/climate/analyze`)
                .send({
                    latitude: 25.7617,
                    longitude: -80.1918,
                    elevation: 5
                })
                .expect(401);
        });

        it('should verify property ownership', async () => {
            const otherUser = await TestHelpers.createTestUser({
                email: 'other-climate-user@example.com'
            });
            const otherToken = 'mock-other-token';

            await request(app)
                .post(`/api/v1/properties/${testProperty.property_id}/climate/analyze`)
                .set('Authorization', `Bearer ${otherToken}`)
                .send({
                    latitude: 25.7617,
                    longitude: -80.1918,
                    elevation: 5
                })
                .expect(403);
        });
    });

    describe('GET /api/v1/properties/:id/climate', () => {
        let analysisId: string;

        beforeAll(async () => {
            // Create analysis
            const response = await request(app)
                .post(`/api/v1/properties/${testProperty.property_id}/climate/analyze`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    latitude: 25.7617,
                    longitude: -80.1918,
                    elevation: 5
                });

            analysisId = response.body.analysis_id;
        }, 60000);

        it('should retrieve all property analyses', async () => {
            const response = await request(app)
                .get(`/api/v1/properties/${testProperty.property_id}/climate`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.property_id).toBe(testProperty.property_id);
            expect(response.body.total_analyses).toBeGreaterThan(0);
            expect(response.body.analyses).toBeInstanceOf(Array);
            expect(response.body.analyses[0]).toHaveProperty('analysis_id');
            expect(response.body.analyses[0]).toHaveProperty('overall_risk_score');
        });
    });

    describe('GET /api/v1/properties/:id/climate/:analysisId', () => {
        let analysisId: string;

        beforeAll(async () => {
            const response = await request(app)
                .post(`/api/v1/properties/${testProperty.property_id}/climate/analyze`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    latitude: 34.0522,
                    longitude: -118.2437,
                    elevation: 100
                });

            analysisId = response.body.analysis_id;
        }, 60000);

        it('should retrieve detailed analysis', async () => {
            const response = await request(app)
                .get(`/api/v1/properties/${testProperty.property_id}/climate/${analysisId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.analysis_id).toBe(analysisId);
            expect(response.body.overall_risk_score).toBeDefined();
            expect(response.body.timeline).toBeDefined();
            expect(response.body.specific_risks).toBeDefined();
            expect(response.body.mitigation_strategies).toBeInstanceOf(Array);
        });
    });
});

