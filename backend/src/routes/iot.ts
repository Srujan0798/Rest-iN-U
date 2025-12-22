// IoT API Routes
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { iotService } from '../services/iot';
import { authenticate, requireAgent, AuthenticatedRequest } from '../middleware/auth';
import { asyncHandler, NotFoundError, BadRequestError } from '../middleware/errorHandler';
import { prisma } from '../utils/prisma';

const router = Router();

const readingSchema = z.object({
    value: z.number(),
    unit: z.string(),
    timestamp: z.string().datetime().optional(),
});

const sensorSchema = z.object({
    sensorType: z.enum(['TEMPERATURE', 'HUMIDITY', 'AIR_QUALITY', 'CO2', 'NOISE', 'LIGHT', 'POWER', 'SOLAR', 'WATER', 'GAS']),
    manufacturer: z.string().optional(),
    model: z.string().optional(),
    location: z.string().optional(),
});

/**
 * @swagger
 * /iot/sensors/{propertyId}:
 *   get:
 *     summary: Get all sensors for a property
 *     tags: [IoT]
 */
router.get('/sensors/:propertyId', asyncHandler(async (req: Request, res: Response) => {
    const { propertyId } = req.params;

    const sensors = await prisma.ioTSensor.findMany({
        where: { propertyId },
        orderBy: { sensorType: 'asc' },
    });

    res.json({
        success: true,
        data: sensors,
    });
}));

/**
 * @swagger
 * /iot/sensors/{propertyId}:
 *   post:
 *     summary: Register a new IoT sensor
 *     tags: [IoT]
 *     security:
 *       - bearerAuth: []
 */
router.post('/sensors/:propertyId', authenticate, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { propertyId } = req.params;
    const data = sensorSchema.parse(req.body);

    const property = await prisma.property.findUnique({
        where: { id: propertyId },
    });

    if (!property) {
        throw new NotFoundError('Property not found');
    }

    const sensor = await iotService.registerSensor(propertyId, data);

    res.status(201).json({
        success: true,
        data: sensor,
    });
}));

/**
 * @swagger
 * /iot/reading/{sensorId}:
 *   post:
 *     summary: Submit a sensor reading
 *     tags: [IoT]
 */
router.post('/reading/:sensorId', asyncHandler(async (req: Request, res: Response) => {
    const { sensorId } = req.params;
    const data = readingSchema.parse(req.body);

    const reading = await iotService.processReading(sensorId, {
        sensorId,
        value: data.value,
        unit: data.unit,
        timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
    });

    res.json({
        success: true,
        data: reading,
    });
}));

/**
 * @swagger
 * /iot/readings/{sensorId}/history:
 *   get:
 *     summary: Get historical readings for a sensor
 *     tags: [IoT]
 */
router.get('/readings/:sensorId/history', asyncHandler(async (req: Request, res: Response) => {
    const { sensorId } = req.params;
    const { startDate, endDate, interval = 'hour' } = req.query;

    const start = startDate
        ? new Date(startDate as string)
        : new Date(Date.now() - 24 * 60 * 60 * 1000); // Default 24 hours
    const end = endDate ? new Date(endDate as string) : new Date();

    const history = await iotService.getSensorHistory(
        sensorId,
        start,
        end,
        interval as 'hour' | 'day' | 'week'
    );

    res.json({
        success: true,
        data: {
            sensorId,
            startDate: start,
            endDate: end,
            interval,
            readings: history,
        },
    });
}));

/**
 * @swagger
 * /iot/environmental/{propertyId}:
 *   get:
 *     summary: Get current environmental snapshot
 *     tags: [IoT]
 */
router.get('/environmental/:propertyId', asyncHandler(async (req: Request, res: Response) => {
    const { propertyId } = req.params;

    const data = await iotService.getEnvironmentalData(propertyId);

    if (!data) {
        return res.json({
            success: true,
            data: null,
            message: 'No IoT sensors configured for this property',
        });
    }

    // Add comfort index calculation
    const comfortIndex = calculateComfortIndex(data);

    res.json({
        success: true,
        data: {
            ...data,
            comfortIndex,
            comfortLevel: getComfortLevel(comfortIndex),
            lastUpdated: new Date(),
        },
    });
}));

/**
 * @swagger
 * /iot/energy/{propertyId}:
 *   get:
 *     summary: Get energy efficiency analysis
 *     tags: [IoT]
 */
router.get('/energy/:propertyId', asyncHandler(async (req: Request, res: Response) => {
    const { propertyId } = req.params;

    const analysis = await iotService.calculateEnergyScore(propertyId);

    if (!analysis) {
        // Return estimated data if no sensors
        const property = await prisma.property.findUnique({
            where: { id: propertyId },
            select: { squareFeet: true, yearBuilt: true },
        });

        return res.json({
            success: true,
            data: {
                estimated: true,
                score: property?.yearBuilt && property.yearBuilt > 2010 ? 70 : 55,
                grade: property?.yearBuilt && property.yearBuilt > 2010 ? 'B' : 'C',
                estimatedMonthlyCost: Math.round((property?.squareFeet || 2000) * 0.1),
                recommendations: [
                    'Install smart energy monitoring sensors',
                    'Consider solar panel assessment',
                ],
            },
        });
    }

    res.json({
        success: true,
        data: analysis,
    });
}));

/**
 * @swagger
 * /iot/dashboard/{propertyId}:
 *   get:
 *     summary: Get complete IoT dashboard data
 *     tags: [IoT]
 */
router.get('/dashboard/:propertyId', asyncHandler(async (req: Request, res: Response) => {
    const { propertyId } = req.params;

    const [sensors, environmental, energy, recentReadings] = await Promise.all([
        prisma.ioTSensor.findMany({
            where: { propertyId },
            select: {
                id: true,
                sensorType: true,
                status: true,
                location: true,
                lastReading: true,
            },
        }),
        iotService.getEnvironmentalData(propertyId),
        iotService.calculateEnergyScore(propertyId),
        prisma.ioTReading.findMany({
            where: { sensor: { propertyId } },
            orderBy: { timestamp: 'desc' },
            take: 20,
            include: {
                sensor: { select: { sensorType: true } },
            },
        }),
    ]);

    res.json({
        success: true,
        data: {
            sensors: {
                total: sensors.length,
                online: sensors.filter(s => s.status === 'ONLINE').length,
                list: sensors,
            },
            environmental: environmental ? {
                ...environmental,
                comfortIndex: calculateComfortIndex(environmental),
            } : null,
            energy,
            recentActivity: recentReadings.map(r => ({
                type: r.sensor.sensorType,
                value: r.value,
                unit: r.unit,
                timestamp: r.timestamp,
            })),
        },
    });
}));

// Helper functions
function calculateComfortIndex(data: any): number {
    let score = 100;

    // Temperature comfort (ideal: 68-72°F)
    if (data.temperature) {
        if (data.temperature < 65 || data.temperature > 78) score -= 20;
        else if (data.temperature < 68 || data.temperature > 72) score -= 10;
    }

    // Humidity comfort (ideal: 40-60%)
    if (data.humidity) {
        if (data.humidity < 30 || data.humidity > 70) score -= 20;
        else if (data.humidity < 40 || data.humidity > 60) score -= 10;
    }

    // Air quality (lower is better)
    if (data.airQuality) {
        if (data.airQuality > 100) score -= 25;
        else if (data.airQuality > 50) score -= 10;
    }

    // CO2 levels
    if (data.co2Level) {
        if (data.co2Level > 1000) score -= 20;
        else if (data.co2Level > 800) score -= 10;
    }

    return Math.max(0, score);
}

function getComfortLevel(index: number): string {
    if (index >= 90) return 'Excellent';
    if (index >= 75) return 'Good';
    if (index >= 60) return 'Moderate';
    if (index >= 40) return 'Fair';
    return 'Poor';
}

export default router;
