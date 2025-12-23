import Redis from 'ioredis';

// Redis Service for Caching and Real-time Data
class RedisService {
    private client: Redis;
    private subscriber: Redis;
    private publisher: Redis;

    constructor() {
        const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

        this.client = new Redis(redisUrl);
        this.subscriber = new Redis(redisUrl);
        this.publisher = new Redis(redisUrl);

        this.client.on('error', (err) => console.error('Redis Client Error:', err));
        this.client.on('connect', () => console.log('Redis connected'));
    }

    // ============================================
    // BASIC OPERATIONS
    // ============================================

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
        if (ttlSeconds) {
            await this.client.setex(key, ttlSeconds, value);
        } else {
            await this.client.set(key, value);
        }
    }

    async setex(key: string, ttlSeconds: number, value: string): Promise<void> {
        await this.client.setex(key, ttlSeconds, value);
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    async exists(key: string): Promise<boolean> {
        const result = await this.client.exists(key);
        return result === 1;
    }

    async expire(key: string, ttlSeconds: number): Promise<void> {
        await this.client.expire(key, ttlSeconds);
    }

    async ttl(key: string): Promise<number> {
        return this.client.ttl(key);
    }

    // ============================================
    // JSON OPERATIONS
    // ============================================

    async getJson<T>(key: string): Promise<T | null> {
        const data = await this.client.get(key);
        return data ? JSON.parse(data) : null;
    }

    async setJson(key: string, value: any, ttlSeconds?: number): Promise<void> {
        const json = JSON.stringify(value);
        if (ttlSeconds) {
            await this.client.setex(key, ttlSeconds, json);
        } else {
            await this.client.set(key, json);
        }
    }

    // ============================================
    // HASH OPERATIONS
    // ============================================

    async hget(key: string, field: string): Promise<string | null> {
        return this.client.hget(key, field);
    }

    async hset(key: string, field: string, value: string): Promise<void> {
        await this.client.hset(key, field, value);
    }

    async hgetall(key: string): Promise<Record<string, string>> {
        return this.client.hgetall(key);
    }

    async hmset(key: string, data: Record<string, string>): Promise<void> {
        await this.client.hmset(key, data);
    }

    async hincrby(key: string, field: string, increment: number): Promise<number> {
        return this.client.hincrby(key, field, increment);
    }

    // ============================================
    // SET OPERATIONS
    // ============================================

    async sadd(key: string, ...members: string[]): Promise<number> {
        return this.client.sadd(key, ...members);
    }

    async srem(key: string, ...members: string[]): Promise<number> {
        return this.client.srem(key, ...members);
    }

    async smembers(key: string): Promise<string[]> {
        return this.client.smembers(key);
    }

    async sismember(key: string, member: string): Promise<boolean> {
        const result = await this.client.sismember(key, member);
        return result === 1;
    }

    async scard(key: string): Promise<number> {
        return this.client.scard(key);
    }

    // ============================================
    // SORTED SET OPERATIONS
    // ============================================

    async zadd(key: string, score: number, member: string): Promise<number> {
        return this.client.zadd(key, score, member);
    }

    async zrange(key: string, start: number, stop: number): Promise<string[]> {
        return this.client.zrange(key, start, stop);
    }

    async zrevrange(key: string, start: number, stop: number): Promise<string[]> {
        return this.client.zrevrange(key, start, stop);
    }

    async zrank(key: string, member: string): Promise<number | null> {
        return this.client.zrank(key, member);
    }

    async zincrby(key: string, increment: number, member: string): Promise<string> {
        return this.client.zincrby(key, increment, member);
    }

    // ============================================
    // LIST OPERATIONS
    // ============================================

    async lpush(key: string, ...values: string[]): Promise<number> {
        return this.client.lpush(key, ...values);
    }

    async rpush(key: string, ...values: string[]): Promise<number> {
        return this.client.rpush(key, ...values);
    }

    async lrange(key: string, start: number, stop: number): Promise<string[]> {
        return this.client.lrange(key, start, stop);
    }

    async lpop(key: string): Promise<string | null> {
        return this.client.lpop(key);
    }

    async llen(key: string): Promise<number> {
        return this.client.llen(key);
    }

    // ============================================
    // COUNTER OPERATIONS
    // ============================================

    async incr(key: string): Promise<number> {
        return this.client.incr(key);
    }

    async incrby(key: string, increment: number): Promise<number> {
        return this.client.incrby(key, increment);
    }

    async decr(key: string): Promise<number> {
        return this.client.decr(key);
    }

    // ============================================
    // PROPERTY VIEW TRACKING
    // ============================================

    async trackPropertyView(propertyId: string, userId?: string): Promise<void> {
        const viewKey = `property:${propertyId}:views`;
        const dailyKey = `property:${propertyId}:views:${new Date().toISOString().split('T')[0]}`;

        await Promise.all([
            this.client.incr(viewKey),
            this.client.incr(dailyKey),
            this.client.sadd('properties:engagement_changed', propertyId)
        ]);

        // Expire daily key after 90 days
        await this.client.expire(dailyKey, 90 * 24 * 60 * 60);

        if (userId) {
            await this.client.sadd(`user:${userId}:viewed_properties`, propertyId);
        }
    }

    async getPropertyViews(propertyId: string): Promise<number> {
        const views = await this.client.get(`property:${propertyId}:views`);
        return parseInt(views || '0');
    }

    async getPropertyViewsHistory(propertyId: string, days: number = 30): Promise<Record<string, number>> {
        const history: Record<string, number> = {};
        const today = new Date();

        for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const views = await this.client.get(`property:${propertyId}:views:${dateStr}`);
            history[dateStr] = parseInt(views || '0');
        }

        return history;
    }

    // ============================================
    // FAVORITE TRACKING
    // ============================================

    async trackPropertyFavorite(propertyId: string): Promise<void> {
        await this.client.incr(`property:${propertyId}:favorites`);
        await this.client.sadd('properties:engagement_changed', propertyId);
    }

    async getPropertyFavorites(propertyId: string): Promise<number> {
        const favorites = await this.client.get(`property:${propertyId}:favorites`);
        return parseInt(favorites || '0');
    }

    // ============================================
    // SEARCH CACHING
    // ============================================

    async cacheSearchResults(queryHash: string, results: any, ttlSeconds: number = 120): Promise<void> {
        await this.setJson(`search:${queryHash}`, results, ttlSeconds);
    }

    async getCachedSearchResults(queryHash: string): Promise<any | null> {
        return this.getJson(`search:${queryHash}`);
    }

    // ============================================
    // SESSION MANAGEMENT
    // ============================================

    async setSession(sessionId: string, data: any, ttlSeconds: number = 86400): Promise<void> {
        await this.setJson(`session:${sessionId}`, data, ttlSeconds);
    }

    async getSession(sessionId: string): Promise<any | null> {
        return this.getJson(`session:${sessionId}`);
    }

    async deleteSession(sessionId: string): Promise<void> {
        await this.del(`session:${sessionId}`);
    }

    // ============================================
    // RATE LIMITING
    // ============================================

    async checkRateLimit(key: string, limit: number, windowSeconds: number): Promise<{ allowed: boolean; remaining: number }> {
        const current = await this.client.incr(`ratelimit:${key}`);

        if (current === 1) {
            await this.client.expire(`ratelimit:${key}`, windowSeconds);
        }

        return {
            allowed: current <= limit,
            remaining: Math.max(0, limit - current)
        };
    }

    // ============================================
    // PUB/SUB
    // ============================================

    async publish(channel: string, message: any): Promise<void> {
        await this.publisher.publish(channel, JSON.stringify(message));
    }

    async subscribe(channel: string, callback: (message: any) => void): Promise<void> {
        await this.subscriber.subscribe(channel);
        this.subscriber.on('message', (ch, msg) => {
            if (ch === channel) {
                callback(JSON.parse(msg));
            }
        });
    }

    // ============================================
    // REAL-TIME NOTIFICATIONS
    // ============================================

    async publishNotification(userId: string, notification: any): Promise<void> {
        await this.publish(`notifications:${userId}`, notification);
        await this.lpush(`user:${userId}:notifications`, JSON.stringify({
            ...notification,
            timestamp: new Date().toISOString()
        }));
        await this.client.ltrim(`user:${userId}:notifications`, 0, 99); // Keep last 100
    }

    async getRecentNotifications(userId: string, count: number = 20): Promise<any[]> {
        const notifications = await this.lrange(`user:${userId}:notifications`, 0, count - 1);
        return notifications.map(n => JSON.parse(n));
    }

    // ============================================
    // LEADERBOARDS
    // ============================================

    async updateAgentLeaderboard(agentId: string, score: number): Promise<void> {
        await this.zadd('leaderboard:agents', score, agentId);
    }

    async getTopAgents(count: number = 10): Promise<string[]> {
        return this.zrevrange('leaderboard:agents', 0, count - 1);
    }

    // ============================================
    // HEALTH CHECK
    // ============================================

    async healthCheck(): Promise<boolean> {
        try {
            await this.client.ping();
            return true;
        } catch {
            return false;
        }
    }

    // ============================================
    // CLEANUP
    // ============================================

    async disconnect(): Promise<void> {
        await this.client.quit();
        await this.subscriber.quit();
        await this.publisher.quit();
    }
}

// Export singleton instance
export const redisService = new RedisService();
export default RedisService;

