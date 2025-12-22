// Health Check Routes
import { Router } from 'express';
import { prisma } from '../utils/prisma';
import { redisClient } from '../utils/redis';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 */
router.get('/', async (req, res) => {
    const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        services: {
            database: 'unknown',
            redis: 'unknown',
        },
    };

    try {
        await prisma.$queryRaw`SELECT 1`;
        health.services.database = 'healthy';
    } catch (error) {
        health.services.database = 'unhealthy';
        health.status = 'degraded';
    }

    try {
        await redisClient.ping();
        health.services.redis = 'healthy';
    } catch (error) {
        health.services.redis = 'unhealthy';
        health.status = 'degraded';
    }

    const statusCode = health.status === 'ok' ? 200 : 503;
    res.status(statusCode).json(health);
});

/**
 * @swagger
 * /health/ready:
 *   get:
 *     summary: Readiness probe
 *     tags: [Health]
 */
router.get('/ready', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        await redisClient.ping();
        res.status(200).json({ status: 'ready' });
    } catch (error) {
        res.status(503).json({ status: 'not ready' });
    }
});

/**
 * @swagger
 * /health/live:
 *   get:
 *     summary: Liveness probe
 *     tags: [Health]
 */
router.get('/live', (req, res) => {
    res.status(200).json({ status: 'alive' });
});

export default router;
