// Property Valuation Routes
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { propertyValuationService } from '../services/propertyValuation';
import { authenticate, optionalAuthenticate, AuthenticatedRequest } from '../middleware/auth';
import { asyncHandler, NotFoundError } from '../middleware/errorHandler';
import { prisma } from '../utils/prisma';

const router = Router();

const valuateSchema = z.object({
    propertyId: z.string().optional(),
    address: z.string().optional(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    propertyType: z.string(),
    bedrooms: z.number().int().min(0),
    bathrooms: z.number().min(0),
    squareFeet: z.number().int().positive(),
    lotSizeAcres: z.number().optional(),
    yearBuilt: z.number().int().optional(),
    features: z.array(z.string()).optional(),
    condition: z.enum(['EXCELLENT', 'GOOD', 'FAIR', 'POOR']).optional(),
    vastuScore: z.number().min(0).max(100).optional(),
});

/**
 * @swagger
 * /valuation/estimate:
 *   post:
 *     summary: Get AI-powered property valuation
 *     tags: [Valuation]
 */
router.post('/estimate', optionalAuthenticate, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const data = valuateSchema.parse(req.body);

    const valuation = await propertyValuationService.valuateProperty(data);

    res.json({ success: true, data: valuation });
}));

/**
 * @swagger
 * /valuation/property/{propertyId}:
 *   get:
 *     summary: Get valuation for an existing property
 *     tags: [Valuation]
 */
router.get('/property/:propertyId', asyncHandler(async (req: Request, res: Response) => {
    const { propertyId } = req.params;

    const property = await prisma.property.findUnique({
        where: { id: propertyId },
        include: {
            vastuAnalysis: { select: { overallScore: true } },
        },
    });

    if (!property) {
        throw new NotFoundError('Property not found');
    }

    const valuation = await propertyValuationService.valuateProperty({
        propertyId,
        city: property.city,
        state: property.state,
        zipCode: property.zipCode,
        propertyType: property.propertyType,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        squareFeet: property.squareFeet || 0,
        lotSizeAcres: property.lotSizeAcres || undefined,
        yearBuilt: property.yearBuilt || undefined,
        features: property.features,
        vastuScore: property.vastuAnalysis?.overallScore,
    });

    res.json({ success: true, data: valuation });
}));

/**
 * @swagger
 * /valuation/history/{propertyId}:
 *   get:
 *     summary: Get valuation history for a property
 *     tags: [Valuation]
 */
router.get('/history/:propertyId', asyncHandler(async (req: Request, res: Response) => {
    const { propertyId } = req.params;

    const history = await prisma.propertyValuation.findMany({
        where: { propertyId },
        orderBy: { valuationDate: 'desc' },
        take: 10,
    });

    res.json({ success: true, data: history });
}));

/**
 * @swagger
 * /valuation/market-trends:
 *   get:
 *     summary: Get market trends for a location
 *     tags: [Valuation]
 */
router.get('/market-trends', asyncHandler(async (req: Request, res: Response) => {
    const { city, state } = req.query;

    if (!city || !state) {
        return res.status(400).json({ success: false, error: 'City and state required' });
    }

    // Get market data
    const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);

    const [currentListings, recentSales, yearAgoSales] = await Promise.all([
        prisma.property.count({
            where: {
                city: { equals: city as string, mode: 'insensitive' },
                state: state as string,
                status: 'ACTIVE',
            },
        }),
        prisma.property.findMany({
            where: {
                city: { equals: city as string, mode: 'insensitive' },
                state: state as string,
                status: 'SOLD',
                soldDate: { gte: sixMonthsAgo },
            },
            select: { price: true, squareFeet: true, daysOnMarket: true },
        }),
        prisma.property.findMany({
            where: {
                city: { equals: city as string, mode: 'insensitive' },
                state: state as string,
                status: 'SOLD',
                soldDate: { gte: oneYearAgo, lt: sixMonthsAgo },
            },
            select: { price: true, squareFeet: true },
        }),
    ]);

    const avgRecentPrice = recentSales.length > 0
        ? recentSales.reduce((s, p) => s + Number(p.price), 0) / recentSales.length
        : 0;

    const avgYearAgoPrice = yearAgoSales.length > 0
        ? yearAgoSales.reduce((s, p) => s + Number(p.price), 0) / yearAgoSales.length
        : avgRecentPrice;

    const priceChange = avgYearAgoPrice > 0
        ? ((avgRecentPrice - avgYearAgoPrice) / avgYearAgoPrice) * 100
        : 0;

    const avgDaysOnMarket = recentSales.length > 0
        ? recentSales.reduce((s, p) => s + (p.daysOnMarket || 0), 0) / recentSales.length
        : 45;

    res.json({
        success: true,
        data: {
            location: { city, state },
            inventory: currentListings,
            recentSales: recentSales.length,
            medianPrice: avgRecentPrice,
            priceChangeYoY: Math.round(priceChange * 10) / 10,
            avgDaysOnMarket: Math.round(avgDaysOnMarket),
            marketCondition: priceChange > 5 ? 'SELLER' : priceChange < -5 ? 'BUYER' : 'BALANCED',
        },
    });
}));

export default router;
