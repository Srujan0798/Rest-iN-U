/**
 * Integration Tests for Property API
 * Tests complete API workflows with database
 */

import request from 'supertest';
import app from '../../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Property API Integration Tests', () => {
    let authToken: string;
    let testPropertyId: string;

    beforeAll(async () => {
        // Get auth token
        const loginRes = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'test@example.com',
                password: 'Test123!'
            });

        authToken = loginRes.body.data.token;
    });

    afterAll(async () => {
        // Cleanup
        if (testPropertyId) {
            await prisma.property.delete({ where: { id: testPropertyId } });
        }
        await prisma.$disconnect();
    });

    describe('POST /api/v1/properties', () => {
        it('should create a new property', async () => {
            const res = await request(app)
                .post('/api/v1/properties')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Test Property',
                    description: 'A beautiful test property',
                    price: 5000000,
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    bedrooms: 3,
                    bathrooms: 2,
                    squareFeet: 1500
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.title).toBe('Test Property');

            testPropertyId = res.body.data.id;
        });

        it('should fail without authentication', async () => {
            const res = await request(app)
                .post('/api/v1/properties')
                .send({
                    title: 'Test Property',
                    price: 5000000
                });

            expect(res.status).toBe(401);
        });

        it('should validate required fields', async () => {
            const res = await request(app)
                .post('/api/v1/properties')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Test Property'
                    // Missing required fields
                });

            expect(res.status).toBe(400);
        });
    });

    describe('GET /api/v1/properties/:id', () => {
        it('should get property by ID', async () => {
            const res = await request(app)
                .get(`/api/v1/properties/${testPropertyId}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.id).toBe(testPropertyId);
        });

        it('should return 404 for non-existent property', async () => {
            const res = await request(app)
                .get('/api/v1/properties/non-existent-id');

            expect(res.status).toBe(404);
        });
    });

    describe('GET /api/v1/properties', () => {
        it('should list properties with pagination', async () => {
            const res = await request(app)
                .get('/api/v1/properties')
                .query({ page: 1, limit: 10 });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.pagination).toBeDefined();
        });

        it('should filter properties by city', async () => {
            const res = await request(app)
                .get('/api/v1/properties')
                .query({ city: 'Mumbai' });

            expect(res.status).toBe(200);
            res.body.data.forEach((property: any) => {
                expect(property.city).toBe('Mumbai');
            });
        });
    });

    describe('PUT /api/v1/properties/:id', () => {
        it('should update property', async () => {
            const res = await request(app)
                .put(`/api/v1/properties/${testPropertyId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    price: 5500000
                });

            expect(res.status).toBe(200);
            expect(res.body.data.price).toBe(5500000);
        });
    });

    describe('DELETE /api/v1/properties/:id', () => {
        it('should delete property', async () => {
            const res = await request(app)
                .delete(`/api/v1/properties/${testPropertyId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);

            // Verify deletion
            const getRes = await request(app)
                .get(`/api/v1/properties/${testPropertyId}`);

            expect(getRes.status).toBe(404);
        });
    });
});

describe('Health Check Endpoints', () => {
    it('should return healthy status', async () => {
        const res = await request(app).get('/api/v1/health');

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('healthy');
    });

    it('should return detailed health status', async () => {
        const res = await request(app).get('/api/v1/health/detailed');

        expect(res.status).toBe(200);
        expect(res.body.services).toBeDefined();
        expect(res.body.services.database).toBe('up');
        expect(res.body.services.redis).toBe('up');
    });
});
