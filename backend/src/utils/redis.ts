// Redis Client & Caching Utilities
import Redis from 'ioredis';
import { config } from '../config';
import { logger } from './logger';

// Create Redis client
export const redisClient = new Redis(config.redis.url, {
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    enableReadyCheck: true,
    lazyConnect: true,
});

// Event handlers
redisClient.on('connect', () => {
    logger.info('Redis client connected');
});

redisClient.on('error', (error) => {
    logger.error('Redis client error:', error);
});

redisClient.on('reconnecting', () => {
    logger.warn('Redis client reconnecting...');
});

// Cache key prefixes
export const CACHE_KEYS = {
    PROPERTY: 'property:',
    PROPERTY_LIST: 'property_list:',
    SEARCH: 'search:',
    USER: 'user:',
    AGENT: 'agent:',
    VASTU: 'vastu:',
    CLIMATE: 'climate:',
    NEIGHBORHOOD: 'neighborhood:',
    VALUATION: 'valuation:',
    SESSION: 'session:',
    RATE_LIMIT: 'rate_limit:',
    ANALYTICS: 'analytics:',
} as const;

// Cache TTL values (in seconds)
export const CACHE_TTL = {
    SHORT: 60, // 1 minute
    MEDIUM: 300, // 5 minutes
    LONG: 3600, // 1 hour
    DAY: 86400, // 24 hours
    WEEK: 604800, // 7 days
} as const;

// Generic cache get
export async function cacheGet<T>(key: string): Promise<T | null> {
    try {
        const cached = await redisClient.get(key);
        if (cached) {
            return JSON.parse(cached) as T;
        }
        return null;
    } catch (error) {
        logger.error(`Cache get error for key ${key}:`, error);
        return null;
    }
}

// Generic cache set
export async function cacheSet(
    key: string,
    value: unknown,
    ttlSeconds: number = CACHE_TTL.MEDIUM
): Promise<void> {
    try {
        await redisClient.setex(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
        logger.error(`Cache set error for key ${key}:`, error);
    }
}

// Generic cache delete
export async function cacheDelete(key: string): Promise<void> {
    try {
        await redisClient.del(key);
    } catch (error) {
        logger.error(`Cache delete error for key ${key}:`, error);
    }
}

// Delete cache by pattern
export async function cacheDeletePattern(pattern: string): Promise<void> {
    try {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
            await redisClient.del(...keys);
            logger.debug(`Deleted ${keys.length} cache keys matching pattern: ${pattern}`);
        }
    } catch (error) {
        logger.error(`Cache delete pattern error for ${pattern}:`, error);
    }
}

// Rate limiting helper
export async function checkRateLimit(
    key: string,
    maxRequests: number,
    windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
    const fullKey = `${CACHE_KEYS.RATE_LIMIT}${key}`;

    try {
        const multi = redisClient.multi();
        multi.incr(fullKey);
        multi.ttl(fullKey);
        const results = await multi.exec();

        const currentCount = results?.[0]?.[1] as number || 0;
        const ttl = results?.[1]?.[1] as number || -1;

        // Set expiry if this is a new key
        if (ttl === -1) {
            await redisClient.expire(fullKey, windowSeconds);
        }

        const allowed = currentCount <= maxRequests;
        const remaining = Math.max(0, maxRequests - currentCount);
        const resetIn = ttl === -1 ? windowSeconds : ttl;

        return { allowed, remaining, resetIn };
    } catch (error) {
        logger.error(`Rate limit check error for ${key}:`, error);
        // Allow request on error
        return { allowed: true, remaining: maxRequests, resetIn: windowSeconds };
    }
}

// Pub/Sub for real-time features
export const redisPubClient = redisClient.duplicate();
export const redisSubClient = redisClient.duplicate();

export default redisClient;
