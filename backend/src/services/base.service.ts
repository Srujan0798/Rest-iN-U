/**
 * Base Service Class
 * Provides common functionality for all services to reduce code duplication
 */

import { prisma } from "../utils/prisma";
import { logger } from "../utils/logger";
import { notificationService } from "./notifications";
import { v4 as uuidv4 } from "uuid";

export abstract class BaseService {
  protected prisma = prisma;
  protected logger = logger;
  protected notifications = notificationService;

  /**
   * Generate a unique ID
   */
  protected generateId(): string {
    return uuidv4();
  }

  /**
   * Handle database errors consistently
   */
  protected handleDatabaseError(error: any, context: string): void {
    this.logger.error(`Database error in ${context}:`, error);
  }

  /**
   * Handle successful operations consistently
   */
  protected logSuccess(context: string, details?: string): void {
    this.logger.info(
      `Operation successful: ${context}${details ? ` - ${details}` : ""}`,
    );
  }

  /**
   * Paginate results consistently
   */
  protected paginate<T>(data: T[], page: number, limit: number) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      data: data.slice(startIndex, endIndex),
      pagination: {
        page,
        limit,
        total: data.length,
        totalPages: Math.ceil(data.length / limit),
        hasNext: endIndex < data.length,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Create standardized API response
   */
  protected createResponse<T>(
    success: boolean,
    data?: T,
    message?: string,
    error?: string,
  ) {
    return {
      success,
      data,
      message,
      error,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Validate rating (1-5 scale)
   */
  protected validateRating(rating: number): boolean {
    return rating >= 1 && rating <= 5 && Number.isInteger(rating);
  }

  /**
   * Check if a value is a positive number
   */
  protected isPositiveNumber(value: any): boolean {
    return typeof value === "number" && value > 0 && !isNaN(value);
  }

  /**
   * Safe JSON parse with error handling
   */
  protected safeJsonParse<T>(json: string, fallback: T): T {
    try {
      return JSON.parse(json);
    } catch {
      return fallback;
    }
  }

  /**
   * Generate cache key with consistent format
   */
  protected generateCacheKey(prefix: string, ...parts: string[]): string {
    return [prefix, ...parts].join(":");
  }

  /**
   * Standard include pattern for property queries
   */
  protected getPropertyIncludes(
    includeOwner: boolean = true,
    includeAgent: boolean = true,
  ) {
    return {
      vastu_analyses: {
        orderBy: { analyzed_at: "desc" },
        take: 1,
      },
      climate_reports: {
        where: {
          expires_at: { gt: new Date() },
        },
        orderBy: { created_at: "desc" },
        take: 1,
      },
      iot_sensors: {
        where: {
          status: "active",
        },
      },
      photos: {
        orderBy: { order: "asc" },
      },
      ...(includeOwner && { owner: true }),
      ...(includeAgent && { listing_agent: true }),
    };
  }

  /**
   * Get date range for recent data
   */
  protected getRecentDateRange(days: number = 30) {
    const now = new Date();
    const past = new Date();
    past.setDate(past.getDate() - days);

    return { past, now };
  }
}

export abstract class CachedService extends BaseService {
  /**
   * Get or set cache pattern - fetch from cache or compute and cache
   */
  protected async getOrSet<T>(
    cacheKey: string,
    fetchFn: () => Promise<T>,
    ttl: number = 3600,
  ): Promise<T> {
    try {
      // Try to get from cache first
      const cached = await this.getFromCache<T>(cacheKey);
      if (cached !== null) {
        this.logger.debug(`Cache hit for key: ${cacheKey}`);
        return cached;
      }

      // Cache miss - fetch data
      this.logger.debug(`Cache miss for key: ${cacheKey}`);
      const data = await fetchFn();

      // Store in cache
      await this.setCache(cacheKey, data, ttl);

      return data;
    } catch (error) {
      this.logger.error(`Cache error for key ${cacheKey}:`, error);
      // Fallback to direct fetch
      return await fetchFn();
    }
  }

  /**
   * Get data from cache (to be implemented by specific cache service)
   */
  protected abstract getFromCache<T>(key: string): Promise<T | null>;

  /**
   * Set data in cache (to be implemented by specific cache service)
   */
  protected abstract setCache(
    key: string,
    value: any,
    ttl?: number,
  ): Promise<void>;

  /**
   * Delete cache key (to be implemented by specific cache service)
   */
  protected abstract deleteCache(key: string): Promise<void>;
}
