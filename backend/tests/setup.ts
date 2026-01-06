// Test Setup
import { beforeAll, afterAll, vi } from 'vitest';

// Set mock env vars
process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.ENCRYPTION_KEY = 'test-encryption-key';

// Mock Redis
vi.mock('../src/utils/redis', () => ({
    redisClient: {
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
            on: vi.fn(),
        })),
        multi: vi.fn(() => ({
            incr: vi.fn(),
            ttl: vi.fn(),
            exec: vi.fn().mockResolvedValue([[null, 1], [null, 60]]),
        })),
        expire: vi.fn(),
    },
    redisPub: {
        publish: vi.fn(),
    },
    redisSub: {
        subscribe: vi.fn(),
        on: vi.fn(),
    },
    CACHE_KEYS: {
        PROPERTY: 'property:',
        RATE_LIMIT: 'rate_limit:',
    },
    checkRateLimit: vi.fn().mockResolvedValue({ allowed: true, remaining: 10, resetIn: 60 }),
}));

// Mock Prisma
vi.mock('../src/utils/prisma', () => ({
    prisma: {
        $connect: vi.fn(),
        $disconnect: vi.fn(),
        user: {
            findUnique: vi.fn(),
            create: vi.fn(),
            findFirst: vi.fn(),
        },
        property: {
            findMany: vi.fn(),
            count: vi.fn(),
            findUnique: vi.fn(),
        },
        vastuAnalysis: {
            upsert: vi.fn(),
            findUnique: vi.fn(),
        },
        // Add other models as needed by tests
        message: {
            findMany: vi.fn(),
        },
    },
}));

beforeAll(async () => {
    console.log('Setting up test environment...');
});

afterAll(async () => {
    console.log('Cleaning up test environment...');
    vi.clearAllMocks();
});
