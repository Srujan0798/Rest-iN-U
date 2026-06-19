import { describe, it, expect, vi } from "vitest";
import request from "supertest";

// Mock Redis (hoisted factory, cannot use external variables, define inside)
vi.mock('../../utils/redis', () => {
    const redisMock = {
        get: vi.fn(),
        set: vi.fn(),
        setex: vi.fn(),
        del: vi.fn(),
        keys: vi.fn(),
        ping: vi.fn(),
        quit: vi.fn(),
        on: vi.fn(),
        duplicate: vi.fn(() => ({
            publish: vi.fn(),
            subscribe: vi.fn(),
            psubscribe: vi.fn(),
            on: vi.fn(),
        })),
        multi: vi.fn(() => ({
            incr: vi.fn(),
            ttl: vi.fn(),
            exec: vi.fn().mockResolvedValue([[null, 1], [null, 60]]),
        })),
        expire: vi.fn(),
        status: 'ready',
        call: vi.fn(),
    };

    return {
        redisClient: redisMock,
        redisPub: {
            publish: vi.fn(),
        },
        redisSub: {
            subscribe: vi.fn(),
            on: vi.fn(),
        },
        CACHE_KEYS: {
            PROPERTY: 'property:',
            PROPERTY_LIST: 'property_list:',
            RATE_LIMIT: 'rate_limit:',
        },
        CACHE_TTL: {
            SHORT: 60,
            MEDIUM: 300,
        },
        cacheGet: vi.fn().mockResolvedValue(null),
        cacheSet: vi.fn(),
        cacheDelete: vi.fn(),
        cacheDeletePattern: vi.fn(),
        checkRateLimit: vi.fn().mockResolvedValue({ allowed: true, remaining: 10, resetIn: 60 }),
        default: redisMock, // Must export default as well
    };
});

// Mock Prisma
vi.mock('../../utils/prisma', () => {
  const mockPrisma = {
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    user: {
        findUnique: vi.fn(),
        create: vi.fn(),
        findFirst: vi.fn(),
    },
    property: {
        findMany: vi.fn().mockResolvedValue([]),
        count: vi.fn().mockResolvedValue(0),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        findFirst: vi.fn(),
    },
    propertyPhoto: {
        createMany: vi.fn(),
        findFirst: vi.fn(),
    },
    propertyView: {
        create: vi.fn(),
        findMany: vi.fn(),
    },
    lead: {
        upsert: vi.fn(),
        findFirst: vi.fn(),
    },
    agent: {
        findUnique: vi.fn(),
    },
    favorite: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
    },
    vastuAnalysis: {
        upsert: vi.fn(),
        findUnique: vi.fn(),
    },
    message: {
        findMany: vi.fn(),
    },
  };
  return {
    prisma: mockPrisma,
    default: mockPrisma,
  };
});

vi.mock('@prisma/client', () => {
    return {
        PrismaClient: vi.fn(() => ({})),
        Prisma: {
            PropertyScalarFieldEnum: {},
        }
    };
});

import { app } from "../../server";
import { prisma } from "../../utils/prisma";

describe("Properties API", () => {
  describe("GET /api/properties", () => {
    it("should return 200 and array of properties", async () => {
      (prisma.property.findMany as any).mockResolvedValue([
        { id: '1', title: 'Test Prop', price: 100000, city: 'Bangalore' }
      ]);
      (prisma.property.count as any).mockResolvedValue(1);

      const res = await request(app).get("/api/v1/properties");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.properties).toBeInstanceOf(Array);
      expect(res.body.data.pagination).toBeDefined();
    });

    it("should filter by city correctly", async () => {
      (prisma.property.findMany as any).mockResolvedValue([
        { id: '1', title: 'Test Prop', price: 100000, city: 'Bangalore' }
      ]);

      const res = await request(app)
        .get("/api/v1/properties")
        .query({ city: "Bangalore" });

      expect(res.status).toBe(200);
      const calls = (prisma.property.findMany as any).mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall[0].where.city.contains).toBe('Bangalore');
    });

    it("should filter by price range correctly", async () => {
      const res = await request(app)
        .get("/api/v1/properties")
        .query({ minPrice: 500000, maxPrice: 1000000 });

      expect(res.status).toBe(200);
      const calls = (prisma.property.findMany as any).mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall[0].where.price.gte).toBe(500000);
      expect(lastCall[0].where.price.lte).toBe(1000000);
    });
  });

  describe("GET /api/properties/:id", () => {
    it("should return property details", async () => {
        (prisma.property.findUnique as any).mockResolvedValue({
            id: '1',
            title: 'Test Prop',
            price: 100000,
            city: 'Bangalore',
            propertyTax: 500,
            hoaFee: 100,
            listingAgent: { user: {} },
            photos: [],
            vastuAnalysis: null,
            climateAnalysis: null
        });

        const res = await request(app).get("/api/v1/properties/1");

        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe('1');
        expect(res.body.data.estimatedPayment).toBeDefined();
    });

    it("should return 404 for non-existent property", async () => {
        (prisma.property.findUnique as any).mockResolvedValue(null);

        const res = await request(app).get("/api/v1/properties/999");

        expect(res.status).toBe(404);
    });
  });
});
