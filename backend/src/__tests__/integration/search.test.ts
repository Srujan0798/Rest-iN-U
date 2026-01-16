
import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';

// Mock utils/prisma
vi.mock('../../utils/prisma', () => ({
  prisma: {
    property: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
    favorite: {
      findUnique: vi.fn(),
    },
  },
}));

// Mock utils/redis
vi.mock('../../utils/redis', () => ({
  cacheGet: vi.fn().mockResolvedValue(null),
  cacheSet: vi.fn(),
  cacheDelete: vi.fn(),
  cacheDeletePattern: vi.fn(),
  CACHE_KEYS: {
    PROPERTY_LIST: 'properties:',
    PROPERTY: 'property:',
  },
  CACHE_TTL: {
    SHORT: 60,
    MEDIUM: 300,
  },
}));

// Mock middleware/auth
vi.mock('../../middleware/auth', () => ({
  authenticate: (req, res, next) => next(),
  optionalAuthenticate: (req, res, next) => {
    // req.user = { id: 'test-user', userType: 'BUYER' }; // Optional: simulate logged in
    next();
  },
  requireAgent: (req, res, next) => next(),
  requireSubscription: (req, res, next) => next(),
}));

// Mock email service
vi.mock('../../services/email.service', () => ({
  emailService: {
    sendShowingRequest: vi.fn(),
    sendShowingConfirmation: vi.fn(),
  },
}));

// Import modules *after* mocks
import propertiesRouter from '../../routes/properties';
import { prisma } from '../../utils/prisma';

const app = express();
app.use(express.json());
app.use('/properties', propertiesRouter);

describe('Property Search Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call prisma.findMany with correct price filters when minPrice and maxPrice are provided', async () => {
    (prisma.property.findMany as any).mockResolvedValue([]);
    (prisma.property.count as any).mockResolvedValue(0);

    const minPrice = 100000;
    const maxPrice = 500000;

    await request(app)
      .get('/properties')
      .query({ minPrice, maxPrice });

    expect(prisma.property.findMany).toHaveBeenCalled();
    const callArgs = (prisma.property.findMany as any).mock.calls[0][0];

    // Check if the where clause is constructed correctly
    expect(callArgs.where.price).toBeDefined();
    expect(callArgs.where.price.gte).toBe(minPrice);
    expect(callArgs.where.price.lte).toBe(maxPrice);
  });

  it('should call prisma.findMany with correct price filters when only minPrice is provided', async () => {
    (prisma.property.findMany as any).mockResolvedValue([]);
    (prisma.property.count as any).mockResolvedValue(0);

    const minPrice = 250000;

    await request(app)
      .get('/properties')
      .query({ minPrice });

    expect(prisma.property.findMany).toHaveBeenCalled();
    const callArgs = (prisma.property.findMany as any).mock.calls[0][0];

    expect(callArgs.where.price).toBeDefined();
    expect(callArgs.where.price.gte).toBe(minPrice);
    // Ensure lte is not set or undefined
    expect(callArgs.where.price.lte).toBeUndefined();
  });
});
