// Backend Tests - Auth Routes
import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const API_URL = 'http://localhost:4000/api/v1';

describe('Auth Routes', () => {
    let authToken: string;
    const testUser = {
        email: `test${Date.now()}@example.com`,
        password: 'TestPass123!',
        firstName: 'Test',
        lastName: 'User',
    };

    describe('POST /auth/register', () => {
        it('should register a new user', async () => {
            const response = await request(API_URL)
                .post('/auth/register')
                .send(testUser);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe(testUser.email);
            expect(response.body.data.token).toBeDefined();
        });

        it('should reject duplicate email', async () => {
            const response = await request(API_URL)
                .post('/auth/register')
                .send(testUser);

            expect(response.status).toBe(409);
        });

        it('should validate required fields', async () => {
            const response = await request(API_URL)
                .post('/auth/register')
                .send({ email: 'test@test.com' });

            expect(response.status).toBe(400);
        });
    });

    describe('POST /auth/login', () => {
        it('should login with valid credentials', async () => {
            const response = await request(API_URL)
                .post('/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password,
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.token).toBeDefined();
            authToken = response.body.data.token;
        });

        it('should reject invalid password', async () => {
            const response = await request(API_URL)
                .post('/auth/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword',
                });

            expect(response.status).toBe(401);
        });

        it('should reject non-existent user', async () => {
            const response = await request(API_URL)
                .post('/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password',
                });

            expect(response.status).toBe(401);
        });
    });

    describe('GET /auth/me', () => {
        it('should return user profile with valid token', async () => {
            const response = await request(API_URL)
                .get('/auth/me')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data.email).toBe(testUser.email);
        });

        it('should reject without token', async () => {
            const response = await request(API_URL).get('/auth/me');

            expect(response.status).toBe(401);
        });

        it('should reject invalid token', async () => {
            const response = await request(API_URL)
                .get('/auth/me')
                .set('Authorization', 'Bearer invalidtoken');

            expect(response.status).toBe(401);
        });
    });
});

describe('Properties Routes', () => {
    describe('GET /properties', () => {
        it('should return paginated properties', async () => {
            const response = await request(API_URL).get('/properties');

            expect(response.status).toBe(200);
            expect(response.body.data).toBeDefined();
            expect(Array.isArray(response.body.data.properties)).toBe(true);
        });

        it('should filter by property type', async () => {
            const response = await request(API_URL)
                .get('/properties')
                .query({ propertyType: 'HOUSE' });

            expect(response.status).toBe(200);
        });

        it('should filter by price range', async () => {
            const response = await request(API_URL)
                .get('/properties')
                .query({ minPrice: 100000, maxPrice: 500000 });

            expect(response.status).toBe(200);
        });
    });

    describe('GET /properties/:id', () => {
        it('should return property details', async () => {
            // First get a property ID
            const listResponse = await request(API_URL).get('/properties');
            const propertyId = listResponse.body.data?.properties?.[0]?.id;

            if (propertyId) {
                const response = await request(API_URL).get(`/properties/${propertyId}`);
                expect(response.status).toBe(200);
                expect(response.body.data.id).toBe(propertyId);
            }
        });

        it('should return 404 for non-existent property', async () => {
            const response = await request(API_URL).get('/properties/nonexistent-id');
            expect(response.status).toBe(404);
        });
    });
});

describe('Vastu Routes', () => {
    describe('GET /vastu/rules', () => {
        it('should return Vastu rules', async () => {
            const response = await request(API_URL).get('/vastu/rules');

            expect(response.status).toBe(200);
            expect(response.body.data).toBeDefined();
        });
    });

    describe('POST /vastu/analyze', () => {
        it('should analyze property Vastu', async () => {
            const response = await request(API_URL)
                .post('/vastu/analyze')
                .send({
                    facing: 'EAST',
                    entranceDirection: 'NORTH',
                    plotShape: 'RECTANGULAR',
                    roomConfigurations: [
                        { name: 'Kitchen', direction: 'SOUTHEAST' },
                        { name: 'MasterBedroom', direction: 'SOUTHWEST' },
                    ],
                });

            expect(response.status).toBe(200);
            expect(response.body.data.overallScore).toBeDefined();
        });
    });
});

describe('Search Routes', () => {
    describe('POST /search/natural', () => {
        it('should handle natural language search', async () => {
            const response = await request(API_URL)
                .post('/search/natural')
                .send({ query: '3 bedroom house under 500k' });

            expect(response.status).toBe(200);
            expect(response.body.data).toBeDefined();
        });
    });

    describe('GET /search/autocomplete', () => {
        it('should return autocomplete suggestions', async () => {
            const response = await request(API_URL)
                .get('/search/autocomplete')
                .query({ q: 'san' });

            expect(response.status).toBe(200);
        });
    });
});

describe('Health Routes', () => {
    describe('GET /health', () => {
        it('should return healthy status', async () => {
            const response = await request(API_URL).get('/health');

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('ok');
        });
    });

    describe('GET /health/ready', () => {
        it('should check readiness', async () => {
            const response = await request(API_URL).get('/health/ready');

            expect(response.status).toBe(200);
        });
    });
});
