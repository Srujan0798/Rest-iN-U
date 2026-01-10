/**
 * Rate Limiting Middleware
 * Protects API endpoints from abuse and DDoS attacks
 */

import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

let store: any;

if (process.env.USE_MOCK_REDIS === 'true') {
    // Use default MemoryStore
    store = undefined;
} else {
    const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    store = new RedisStore({
        client: redis,
        prefix: 'rl:'
    });
}

// General API rate limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    store: store ? new RedisStore({ client: (store as any).client, prefix: 'rl:api:' }) : undefined
});

// Strict rate limiter for authentication endpoints
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // 5 attempts per 15 minutes
    message: 'Too many login attempts, please try again later',
    skipSuccessfulRequests: true,
    store: store ? new RedisStore({ client: (store as any).client, prefix: 'rl:auth:' }) : undefined
});

// Rate limiter for property creation
export const createPropertyLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 properties per hour
    message: 'Too many properties created, please try again later',
    store: store ? new RedisStore({ client: (store as any).client, prefix: 'rl:property:' }) : undefined
});

// Rate limiter for AI/ML endpoints
export const aiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 AI requests per minute
    message: 'AI service rate limit exceeded',
    store: store ? new RedisStore({ client: (store as any).client, prefix: 'rl:ai:' }) : undefined
});

// Rate limiter for lead creation (contact form)
export const leadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 leads per hour per IP
    message: 'Too many messages sent, please try again later',
    store: store ? new RedisStore({ client: (store as any).client, prefix: 'rl:lead:' }) : undefined
});
