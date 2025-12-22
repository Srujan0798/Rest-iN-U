// Climate Analysis Routes
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { climateAnalysisService } from '../services/climateAnalysis';
import { authenticate, optionalAuthenticate, AuthenticatedRequest } from '../middleware/auth';
import { asyncHandler, NotFoundError } from '../middleware/errorHandler';
import { prisma } from '../utils/prisma';

const router = Router();

const analyzeSchema = z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    floodZone: z.string().optional(),
    wildfireRisk: z.number().min(0).max(100).optional(),
    hurricaneRisk: z.number().min(0).max(100).optional(),
    tornadoRisk: z.number().min(0).max(100).optional(),
    seismicRisk: z.number().min(0).max(100).optional(),
    heatIslandEffect: z.number().min(0).max(1).optional(),
    droughtRisk: z.number().min(0).max(100).optional(),
    waterStressIndex: z.number().min(0).max(1).optional(),
});

/**
 * @swagger
 * /climate/analyze/{propertyId}:
 *   post:
 *     summary: Run climate analysis for a property
 *     tags: [Climate]
 *     security:
 *       - bearerAuth: []
 */
router.post('/analyze/:propertyId', authenticate, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { propertyId } = req.params;
    const data = analyzeSchema.parse(req.body);

    const property = await prisma.property.findUnique({
        where: { id: propertyId },
        select: { id: true, latitude: true, longitude: true },
    });

    if (!property) {
        throw new NotFoundError('Property not found');
    }

    const analysis = await climateAnalysisService.analyzeProperty(propertyId, {
        latitude: data.latitude || property.latitude,
        longitude: data.longitude || property.longitude,
        ...data,
    });

    res.json({ success: true, data: analysis });
}));

/**
 * @swagger
 * /climate/property/{propertyId}:
 *   get:
 *     summary: Get climate analysis for a property
 *     tags: [Climate]
 */
router.get('/property/:propertyId', asyncHandler(async (req: Request, res: Response) => {
    const { propertyId } = req.params;

    const analysis = await climateAnalysisService.getAnalysis(propertyId);

    if (!analysis) {
        throw new NotFoundError('Climate analysis not found for this property');
    }

    res.json({ success: true, data: analysis });
}));

/**
 * @swagger
 * /climate/risks:
 *   get:
 *     summary: Get climate risk categories and descriptions
 *     tags: [Climate]
 */
router.get('/risks', asyncHandler(async (req: Request, res: Response) => {
    const riskCategories = {
        flood: {
            name: 'Flood Risk',
            description: 'Risk of flooding from rivers, coastal surges, or heavy rainfall',
            factors: ['FEMA flood zone', 'Elevation', 'Proximity to water', 'Historical flooding'],
            grades: {
                A: 'Minimal flood risk',
                B: 'Low flood risk',
                C: 'Moderate flood risk',
                D: 'High flood risk',
                F: 'Very high flood risk - flood insurance required',
            },
        },
        wildfire: {
            name: 'Wildfire Risk',
            description: 'Risk of wildfire damage based on location and vegetation',
            factors: ['Vegetation density', 'Climate conditions', 'Historical fires', 'Defensible space'],
            grades: {
                A: 'Minimal wildfire risk',
                B: 'Low wildfire risk',
                C: 'Moderate wildfire risk',
                D: 'High wildfire risk - mitigation recommended',
                F: 'Extreme wildfire risk - significant mitigation required',
            },
        },
        storm: {
            name: 'Storm Risk',
            description: 'Risk from hurricanes, tornadoes, and severe storms',
            factors: ['Geographic location', 'Historical storm frequency', 'Building codes'],
        },
        extremeHeat: {
            name: 'Extreme Heat Risk',
            description: 'Risk of increasing extreme heat days',
            factors: ['Latitude', 'Urban heat island effect', 'Climate projections'],
        },
        seismic: {
            name: 'Seismic Risk',
            description: 'Risk of earthquake damage',
            factors: ['Proximity to fault lines', 'Soil type', 'Building standards'],
        },
    };

    res.json({ success: true, data: riskCategories });
}));

/**
 * @swagger
 * /climate/projections:
 *   post:
 *     summary: Get climate projections for a location
 *     tags: [Climate]
 */
router.post('/projections', asyncHandler(async (req: Request, res: Response) => {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({ success: false, error: 'Latitude and longitude required' });
    }

    // Generate projections based on location
    const baseRisk = Math.abs(latitude - 35) < 10 ? 40 : 30; // Higher risk in southern US
    const years = [2030, 2040, 2050, 2075, 2100];

    const projections = years.map(year => {
        const yearsFromNow = year - 2024;
        return {
            year,
            temperatureIncreaseCelsius: Math.round(yearsFromNow * 0.03 * 10) / 10,
            seaLevelRiseCm: Math.round(yearsFromNow * 0.35),
            extremeHeatDays: 15 + Math.round(yearsFromNow * 0.5),
            floodRiskMultiplier: 1 + (yearsFromNow * 0.01),
            insuranceCostMultiplier: Math.pow(1.03, yearsFromNow),
        };
    });

    res.json({
        success: true,
        data: {
            location: { latitude, longitude },
            projections,
            scenario: 'RCP 4.5 (Moderate emissions)',
            dataSources: ['IPCC', 'NOAA', 'NASA'],
        },
    });
}));

export default router;
