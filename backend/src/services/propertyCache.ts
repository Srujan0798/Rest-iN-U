/**
 * Property Caching Service
 *
 * Implements Redis caching for frequently accessed property data
 * to dramatically improve API response times and reduce database load.
 *
 * Cache Strategy:
 * - Property details: 1 hour TTL
 * - Search results: 15 minutes TTL
 * - Vastu analyses: 24 hours TTL (expensive calculations)
 * - Agent profiles: 30 minutes TTL
 */

import { redisClient } from '../utils/redis';
import { logger } from '../utils/logger';

// Cache TTLs (in seconds)
const CACHE_TTL = {
  PROPERTY_DETAIL: 3600,        // 1 hour
  PROPERTY_LIST: 900,            // 15 minutes
  SEARCH_RESULTS: 900,           // 15 minutes
  VASTU_ANALYSIS: 86400,         // 24 hours
  CLIMATE_ANALYSIS: 86400,       // 24 hours
  AGENT_PROFILE: 1800,           // 30 minutes
  NEIGHBORHOOD_DATA: 86400,      // 24 hours
};

/**
 * Generate cache key for properties
 */
export function getCacheKey(type: string, identifier: string | object): string {
  if (typeof identifier === 'object') {
    return `${type}:${JSON.stringify(identifier)}`;
  }
  return `${type}:${identifier}`;
}

/**
 * Get cached data
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const cached = await redisClient.get(key);
    if (cached) {
      logger.debug(`Cache HIT: ${key}`);
      return JSON.parse(cached) as T;
    }
    logger.debug(`Cache MISS: ${key}`);
    return null;
  } catch (error) {
    logger.error(`Cache GET error for ${key}:`, error);
    return null; // Fail gracefully - return null if cache is down
  }
}

/**
 * Set cached data
 */
export async function setCache(key: string, data: any, ttl: number): Promise<void> {
  try {
    await redisClient.setex(key, ttl, JSON.stringify(data));
    logger.debug(`Cache SET: ${key} (TTL: ${ttl}s)`);
  } catch (error) {
    logger.error(`Cache SET error for ${key}:`, error);
    // Fail gracefully - don't throw error if cache is down
  }
}

/**
 * Invalidate cache for a specific key
 */
export async function invalidateCache(key: string): Promise<void> {
  try {
    await redisClient.del(key);
    logger.debug(`Cache INVALIDATED: ${key}`);
  } catch (error) {
    logger.error(`Cache invalidation error for ${key}:`, error);
  }
}

/**
 * Invalidate cache by pattern (use carefully - can be slow)
 */
export async function invalidateCachePattern(pattern: string): Promise<void> {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(...keys);
      logger.info(`Cache INVALIDATED: ${keys.length} keys matching ${pattern}`);
    }
  } catch (error) {
    logger.error(`Cache pattern invalidation error for ${pattern}:`, error);
  }
}

/**
 * Cache wrapper for property details
 */
export async function cachePropertyDetail<T>(
  propertyId: string,
  fetchFunction: () => Promise<T>
): Promise<T> {
  const cacheKey = getCacheKey('property', propertyId);

  // Try to get from cache
  const cached = await getCache<T>(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from database
  const data = await fetchFunction();

  // Store in cache
  await setCache(cacheKey, data, CACHE_TTL.PROPERTY_DETAIL);

  return data;
}

/**
 * Cache wrapper for search results
 */
export async function cacheSearchResults<T>(
  filters: object,
  fetchFunction: () => Promise<T>
): Promise<T> {
  const cacheKey = getCacheKey('search', filters);

  // Try to get from cache
  const cached = await getCache<T>(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch from database
  const data = await fetchFunction();

  // Store in cache
  await setCache(cacheKey, data, CACHE_TTL.SEARCH_RESULTS);

  return data;
}

/**
 * Cache wrapper for Vastu analysis
 */
export async function cacheVastuAnalysis<T>(
  propertyId: string,
  fetchFunction: () => Promise<T>
): Promise<T> {
  const cacheKey = getCacheKey('vastu', propertyId);

  // Try to get from cache
  const cached = await getCache<T>(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch/calculate analysis
  const data = await fetchFunction();

  // Store in cache (24 hours - expensive calculation)
  await setCache(cacheKey, data, CACHE_TTL.VASTU_ANALYSIS);

  return data;
}

/**
 * Invalidate all caches related to a property
 */
export async function invalidatePropertyCaches(propertyId: string): Promise<void> {
  // Invalidate specific property
  await invalidateCache(getCacheKey('property', propertyId));

  // Invalidate all search results (since they might include this property)
  await invalidateCachePattern('search:*');

  // Invalidate property analyses
  await invalidateCache(getCacheKey('vastu', propertyId));
  await invalidateCache(getCacheKey('climate', propertyId));

  logger.info(`Invalidated all caches for property ${propertyId}`);
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  hits: number;
  misses: number;
  keys: number;
}> {
  try {
    const info = await redisClient.info('stats');
    const keys = await redisClient.dbsize();

    // Parse Redis INFO output
    const stats = info.split('\r\n').reduce((acc: any, line) => {
      const [key, value] = line.split(':');
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    }, {});

    return {
      hits: parseInt(stats.keyspace_hits || '0'),
      misses: parseInt(stats.keyspace_misses || '0'),
      keys,
    };
  } catch (error) {
    logger.error('Error getting cache stats:', error);
    return { hits: 0, misses: 0, keys: 0 };
  }
}
