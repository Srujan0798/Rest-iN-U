/**
 * Health Check Routes
 * Monitors system health and dependencies
 */

import express from 'express';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

const router = express.Router();
const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

/**
 * Basic health check
 */
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

/**
 * Detailed health check with dependencies
 */
router.get('/health/detailed', async (req, res) => {
    const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
            api: 'up',
            database: 'unknown',
            redis: 'unknown'
        },
        system: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            cpu: process.cpuUsage()
        }
    };

    // Check database
    try {
        await prisma.$queryRaw`SELECT 1`;
        health.services.database = 'up';
    } catch (error) {
        health.services.database = 'down';
        health.status = 'degraded';
    }

    // Check Redis
    try {
        await redis.ping();
        health.services.redis = 'up';
    } catch (error) {
        health.services.redis = 'down';
        health.status = 'degraded';
    }

    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
});

/**
 * Readiness probe (for Kubernetes)
 */
router.get('/ready', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({ ready: true });
    } catch (error) {
        res.status(503).json({ ready: false, error: error.message });
    }
});

/**
 * Liveness probe (for Kubernetes)
 */
router.get('/live', (req, res) => {
    res.status(200).json({ alive: true });
});

export default router;
