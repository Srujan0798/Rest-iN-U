import request from 'supertest';
import { app } from '../../server';
import { TestHelpers } from '../setup';
import * as fs from 'fs';
import * as path from 'path';

describe('Vastu Analysis Integration Tests', () => {
    let testUser: any;
    let testProperty: any;
    let authToken: string;
    let testFloorPlan: string;

    beforeAll(async () => {
        // Create test user and property
        testUser = await TestHelpers.createTestUser({
            email: 'vastu-test@example.com'
        });
        // authToken = generateTestToken(testUser.user_id); // Mock token generation
        authToken = 'mock-token';

        testProperty = await TestHelpers.createTestProperty(testUser.user_id, {
            city: 'Boulder',
            state: 'CO',
            price: 1250000
        });

        // Create sample floor plan image
        const fixturesDir = path.join(__dirname, 'fixtures');
        if (!fs.existsSync(fixturesDir)) {
            fs.mkdirSync(fixturesDir, { recursive: true });
        }
        testFloorPlan = path.join(fixturesDir, 'sample_floor_plan.png');
        await createSampleFloorPlan(testFloorPlan);
    });

    afterAll(async () => {
        await TestHelpers.cleanupDatabase();
        if (fs.existsSync(testFloorPlan)) {
            fs.unlinkSync(testFloorPlan);
        }
    });

    describe('POST /api/v1/properties/:id/vastu/analyze', () => {
        it('should analyze floor plan successfully', async () => {
            const response = await request(app)
                .post(`/api/v1/properties/${testProperty.property_id}/vastu/analyze`)
                .set('Authorization', `Bearer ${authToken}`)
                .attach('floor_plan', testFloorPlan)
                .field('orientation', 'east')
                .field('property_type', 'house')
                .field('include_certificate', 'true')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.analysis_id).toBeDefined();
            expect(response.body.score).toBeGreaterThanOrEqual(0);
            expect(response.body.score).toBeLessThanOrEqual(100);
            expect(response.body.grade).toMatch(/[A-F][+-]?/);
            expect(response.body.visualization_url).toBeDefined();
            expect(response.body.certificate_url).toBeDefined();
        }, 90000); // 90 second timeout for ML processing

        it('should require authentication', async () => {
            await request(app)
                .post(`/api/v1/properties/${testProperty.property_id}/vastu/analyze`)
                .attach('floor_plan', testFloorPlan)
                .expect(401);
        });

        it('should verify property ownership', async () => {
            const otherUser = await TestHelpers.createTestUser({
                email: 'other-user@example.com'
            });
            // const otherToken = generateTestToken(otherUser.user_id);
            const otherToken = 'mock-other-token';

            await request(app)
                .post(`/api/v1/properties/${testProperty.property_id}/vastu/analyze`)
                .set('Authorization', `Bearer ${otherToken}`)
                .attach('floor_plan', testFloorPlan)
                .expect(403);
        });

        it('should validate file type', async () => {
            const textFile = path.join(__dirname, 'fixtures', 'test.txt');
            fs.writeFileSync(textFile, 'Not an image');

            await request(app)
                .post(`/api/v1/properties/${testProperty.property_id}/vastu/analyze`)
                .set('Authorization', `Bearer ${authToken}`)
                .attach('floor_plan', textFile)
                .expect(400);

            fs.unlinkSync(textFile);
        });

        it('should support personalized analysis', async () => {
            const response = await request(app)
                .post(`/api/v1/properties/${testProperty.property_id}/vastu/analyze`)
                .set('Authorization', `Bearer ${authToken}`)
                .attach('floor_plan', testFloorPlan)
                .field('orientation', 'north')
                .field('user_birth_date', '1985-06-15')
                .expect(200);

            expect(response.body.success).toBe(true);
        }, 90000);
    });

    describe('GET /api/v1/properties/:id/vastu', () => {
        let analysisId: string;

        beforeAll(async () => {
            // Create analysis
            const response = await request(app)
                .post(`/api/v1/properties/${testProperty.property_id}/vastu/analyze`)
                .set('Authorization', `Bearer ${authToken}`)
                .attach('floor_plan', testFloorPlan)
                .field('orientation', 'east');

            analysisId = response.body.analysis_id;
        }, 90000);

        it('should retrieve all property analyses', async () => {
            const response = await request(app)
                .get(`/api/v1/properties/${testProperty.property_id}/vastu`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.property_id).toBe(testProperty.property_id);
            expect(response.body.total_analyses).toBeGreaterThan(0);
            expect(response.body.analyses).toBeInstanceOf(Array);
            expect(response.body.analyses[0]).toHaveProperty('analysis_id');
            expect(response.body.analyses[0]).toHaveProperty('score');
            expect(response.body.analyses[0]).toHaveProperty('grade');
        });
    });

    describe('GET /api/v1/properties/:id/vastu/:analysisId', () => {
        let analysisId: string;

        beforeAll(async () => {
            const response = await request(app)
                .post(`/api/v1/properties/${testProperty.property_id}/vastu/analyze`)
                .set('Authorization', `Bearer ${authToken}`)
                .attach('floor_plan', testFloorPlan)
                .field('orientation', 'north');

            analysisId = response.body.analysis_id;
        }, 90000);

        it('should retrieve detailed analysis', async () => {
            const response = await request(app)
                .get(`/api/v1/properties/${testProperty.property_id}/vastu/${analysisId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.analysis_id).toBe(analysisId);
            expect(response.body.score).toBeDefined();
            expect(response.body.grade).toBeDefined();
            expect(response.body.issues).toBeInstanceOf(Array);
            expect(response.body.detailed_analysis).toBeDefined();
            expect(response.body.rooms_detected).toBeInstanceOf(Array);
            expect(response.body.entrance).toBeDefined();
        });
    });

    describe('GET /api/v1/properties/:id/vastu/:analysisId/visualization', () => {
        let analysisId: string;

        beforeAll(async () => {
            const response = await request(app)
                .post(`/api/v1/properties/${testProperty.property_id}/vastu/analyze`)
                .set('Authorization', `Bearer ${authToken}`)
                .attach('floor_plan', testFloorPlan)
                .field('orientation', 'south');

            analysisId = response.body.analysis_id;
        }, 90000);

        it('should download visualization image', async () => {
            const response = await request(app)
                .get(`/api/v1/properties/${testProperty.property_id}/vastu/${analysisId}/visualization`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.header['content-type']).toBe('image/png');
            expect(response.body).toBeInstanceOf(Buffer);
            expect(response.body.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/v1/properties/:id/vastu/:analysisId/certificate', () => {
        let analysisId: string;

        beforeAll(async () => {
            const response = await request(app)
                .post(`/api/v1/properties/${testProperty.property_id}/vastu/analyze`)
                .set('Authorization', `Bearer ${authToken}`)
                .attach('floor_plan', testFloorPlan)
                .field('orientation', 'west')
                .field('include_certificate', 'true');

            analysisId = response.body.analysis_id;
        }, 90000);

        it('should download PDF certificate', async () => {
            const response = await request(app)
                .get(`/api/v1/properties/${testProperty.property_id}/vastu/${analysisId}/certificate`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.header['content-type']).toBe('application/pdf');
            expect(response.body).toBeInstanceOf(Buffer);
            expect(response.body.length).toBeGreaterThan(0);

            // Verify PDF starts with magic bytes
            expect(response.body.slice(0, 4).toString()).toBe('%PDF');
        });
    });

    describe('Performance Tests', () => {
        it('should complete analysis in under 60 seconds', async () => {
            const startTime = Date.now();

            await request(app)
                .post(`/api/v1/properties/${testProperty.property_id}/vastu/analyze`)
                .set('Authorization', `Bearer ${authToken}`)
                .attach('floor_plan', testFloorPlan)
                .field('orientation', 'northeast')
                .expect(200);

            const duration = Date.now() - startTime;
            expect(duration).toBeLessThan(60000);
        }, 90000);
    });
});

// Helper function to create sample floor plan
async function createSampleFloorPlan(filepath: string) {
    // Mock canvas implementation for tests if canvas is not available
    // In a real environment, we would use the canvas package
    try {
        const { createCanvas } = require('canvas');

        const width = 800;
        const height = 600;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // White background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);

        // Draw simple floor plan
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;

        // Outer walls
        ctx.strokeRect(50, 50, 700, 500);

        // Rooms
        ctx.beginPath();
        // Vertical line
        ctx.moveTo(400, 50);
        ctx.lineTo(400, 550);
        // Horizontal line
        ctx.moveTo(50, 300);
        ctx.lineTo(750, 300);
        ctx.stroke();

        // Labels
        ctx.font = '20px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('Living Room', 150, 150);
        ctx.fillText('Kitchen', 500, 150);
        ctx.fillText('Bedroom 1', 150, 400);
        ctx.fillText('Bedroom 2', 500, 400);

        // Save to file
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filepath, buffer);
    } catch (e) {
        // Fallback if canvas is not installed
        fs.writeFileSync(filepath, Buffer.from('mock-image-data'));
    }
}
