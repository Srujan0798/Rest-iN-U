// Property Management Routes
import { Router } from 'express';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma';
import { cacheGet, cacheSet, cacheDelete, cacheDeletePattern, CACHE_KEYS, CACHE_TTL } from '../utils/redis';
import { authenticate, optionalAuthenticate, requireAgent, AuthenticatedRequest } from '../middleware/auth';
import { asyncHandler, NotFoundError, BadRequestError, ForbiddenError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = Router();

// Validation schemas
const createPropertySchema = z.object({
    title: z.string().min(5).max(200),
    description: z.string().min(20).max(5000),
    propertyType: z.enum(['HOUSE', 'CONDO', 'TOWNHOUSE', 'APARTMENT', 'LAND', 'MULTI_FAMILY', 'COMMERCIAL', 'VILLA', 'PENTHOUSE', 'FARMHOUSE', 'ASHRAM', 'PLOT']),
    listingType: z.enum(['SALE', 'RENT', 'LEASE', 'AUCTION']),
    streetAddress: z.string().min(5),
    unit: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().min(5),
    country: z.string().default('USA'),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    price: z.number().positive(),
    bedrooms: z.number().int().min(0),
    bathrooms: z.number().min(0),
    squareFeet: z.number().int().positive().optional(),
    lotSizeAcres: z.number().positive().optional(),
    yearBuilt: z.number().int().min(1800).max(new Date().getFullYear() + 2).optional(),
    stories: z.number().int().min(1).optional(),
    parkingSpaces: z.number().int().min(0).optional(),
    garageSpaces: z.number().int().min(0).optional(),
    features: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional(),
    appliances: z.array(z.string()).optional(),
    flooring: z.array(z.string()).optional(),
    heating: z.array(z.string()).optional(),
    cooling: z.array(z.string()).optional(),
    roofType: z.string().optional(),
    exteriorMaterial: z.string().optional(),
    foundationType: z.string().optional(),
    virtualTourUrl: z.string().url().optional(),
    videoUrl: z.string().url().optional(),
    hoaFee: z.number().min(0).optional(),
    hoaFrequency: z.string().optional(),
    propertyTax: z.number().min(0).optional(),
    taxYear: z.number().int().optional(),
});

const searchSchema = z.object({
    city: z.string().optional(),
    state: z.string().optional(),
    propertyType: z.array(z.string()).optional(),
    listingType: z.array(z.string()).optional(),
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
    minBeds: z.number().optional(),
    maxBeds: z.number().optional(),
    minBaths: z.number().optional(),
    maxBaths: z.number().optional(),
    minSqft: z.number().optional(),
    maxSqft: z.number().optional(),
    yearBuiltMin: z.number().optional(),
    yearBuiltMax: z.number().optional(),
    features: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional(),
    vastuScoreMin: z.number().optional(),
    climateRiskMax: z.number().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    radiusMiles: z.number().optional(),
    sortBy: z.enum(['price', 'price_desc', 'date', 'date_desc', 'vastu', 'beds', 'sqft']).optional(),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
});

/**
 * @swagger
 * /properties:
 *   get:
 *     summary: Search properties with filters
 *     tags: [Properties]
 */
router.get('/', optionalAuthenticate, asyncHandler(async (req: AuthenticatedRequest, res) => {
    const params = searchSchema.parse({
        ...req.query,
        propertyType: req.query.propertyType ? (req.query.propertyType as string).split(',') : undefined,
        listingType: req.query.listingType ? (req.query.listingType as string).split(',') : undefined,
        features: req.query.features ? (req.query.features as string).split(',') : undefined,
        amenities: req.query.amenities ? (req.query.amenities as string).split(',') : undefined,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        minBeds: req.query.minBeds ? Number(req.query.minBeds) : undefined,
        maxBeds: req.query.maxBeds ? Number(req.query.maxBeds) : undefined,
        minBaths: req.query.minBaths ? Number(req.query.minBaths) : undefined,
        maxBaths: req.query.maxBaths ? Number(req.query.maxBaths) : undefined,
        minSqft: req.query.minSqft ? Number(req.query.minSqft) : undefined,
        maxSqft: req.query.maxSqft ? Number(req.query.maxSqft) : undefined,
        vastuScoreMin: req.query.vastuScoreMin ? Number(req.query.vastuScoreMin) : undefined,
        climateRiskMax: req.query.climateRiskMax ? Number(req.query.climateRiskMax) : undefined,
        latitude: req.query.latitude ? Number(req.query.latitude) : undefined,
        longitude: req.query.longitude ? Number(req.query.longitude) : undefined,
        radiusMiles: req.query.radiusMiles ? Number(req.query.radiusMiles) : undefined,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 20,
    });

    // Build cache key
    const cacheKey = `${CACHE_KEYS.PROPERTY_LIST}${JSON.stringify(params)}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
        return res.json({ success: true, data: cached, cached: true });
    }

    // Build where clause
    const where: Prisma.PropertyWhereInput = {
        status: 'ACTIVE',
    };

    if (params.city) where.city = { contains: params.city, mode: 'insensitive' };
    if (params.state) where.state = params.state;
    if (params.propertyType?.length) where.propertyType = { in: params.propertyType as any };
    if (params.listingType?.length) where.listingType = { in: params.listingType as any };

    if (params.minPrice || params.maxPrice) {
        where.price = {};
        if (params.minPrice) where.price.gte = params.minPrice;
        if (params.maxPrice) where.price.lte = params.maxPrice;
    }

    if (params.minBeds || params.maxBeds) {
        where.bedrooms = {};
        if (params.minBeds) where.bedrooms.gte = params.minBeds;
        if (params.maxBeds) where.bedrooms.lte = params.maxBeds;
    }

    if (params.minBaths || params.maxBaths) {
        where.bathrooms = {};
        if (params.minBaths) where.bathrooms.gte = params.minBaths;
        if (params.maxBaths) where.bathrooms.lte = params.maxBaths;
    }

    if (params.minSqft || params.maxSqft) {
        where.squareFeet = {};
        if (params.minSqft) where.squareFeet.gte = params.minSqft;
        if (params.maxSqft) where.squareFeet.lte = params.maxSqft;
    }

    if (params.yearBuiltMin || params.yearBuiltMax) {
        where.yearBuilt = {};
        if (params.yearBuiltMin) where.yearBuilt.gte = params.yearBuiltMin;
        if (params.yearBuiltMax) where.yearBuilt.lte = params.yearBuiltMax;
    }

    if (params.features?.length) {
        where.features = { hasEvery: params.features };
    }

    if (params.amenities?.length) {
        where.amenities = { hasEvery: params.amenities };
    }

    if (params.vastuScoreMin) {
        where.vastuAnalysis = { overallScore: { gte: params.vastuScoreMin } };
    }

    if (params.climateRiskMax) {
        where.climateAnalysis = { overallRiskScore: { lte: params.climateRiskMax } };
    }

    // Sorting
    let orderBy: Prisma.PropertyOrderByWithRelationInput = { listedDate: 'desc' };
    switch (params.sortBy) {
        case 'price': orderBy = { price: 'asc' }; break;
        case 'price_desc': orderBy = { price: 'desc' }; break;
        case 'date': orderBy = { listedDate: 'asc' }; break;
        case 'date_desc': orderBy = { listedDate: 'desc' }; break;
        case 'beds': orderBy = { bedrooms: 'desc' }; break;
        case 'sqft': orderBy = { squareFeet: 'desc' }; break;
    }

    const skip = (params.page - 1) * params.limit;

    const [properties, total] = await Promise.all([
        prisma.property.findMany({
            where,
            orderBy,
            skip,
            take: params.limit,
            select: {
                id: true,
                title: true,
                propertyType: true,
                listingType: true,
                status: true,
                streetAddress: true,
                city: true,
                state: true,
                zipCode: true,
                latitude: true,
                longitude: true,
                price: true,
                bedrooms: true,
                bathrooms: true,
                squareFeet: true,
                yearBuilt: true,
                listedDate: true,
                daysOnMarket: true,
                photos: {
                    where: { isPrimary: true },
                    take: 1,
                    select: { url: true, thumbnailUrl: true },
                },
                vastuAnalysis: {
                    select: { overallScore: true, grade: true },
                },
                climateAnalysis: {
                    select: { overallRiskScore: true, riskGrade: true },
                },
                listingAgent: {
                    select: {
                        id: true,
                        user: { select: { firstName: true, lastName: true, profilePhotoUrl: true } },
                        rating: true,
                    },
                },
            },
        }),
        prisma.property.count({ where }),
    ]);

    const result = {
        properties,
        pagination: {
            page: params.page,
            limit: params.limit,
            total,
            pages: Math.ceil(total / params.limit),
        },
    };

    await cacheSet(cacheKey, result, CACHE_TTL.SHORT);

    res.json({ success: true, data: result });
}));

/**
 * @swagger
 * /properties/{id}:
 *   get:
 *     summary: Get property details
 *     tags: [Properties]
 */
router.get('/:id', optionalAuthenticate, asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;

    const cacheKey = `${CACHE_KEYS.PROPERTY}${id}`;
    let property = await cacheGet(cacheKey);

    if (!property) {
        property = await prisma.property.findUnique({
            where: { id },
            include: {
                photos: { orderBy: { orderIndex: 'asc' } },
                listingAgent: {
                    include: {
                        user: {
                            select: { firstName: true, lastName: true, email: true, phone: true, profilePhotoUrl: true },
                        },
                    },
                },
                vastuAnalysis: true,
                fengShuiAnalysis: true,
                climateAnalysis: true,
                environmentalData: true,
                sacredGeometry: true,
                landEnergy: true,
                energyAnalysis: true,
                priceHistory: { orderBy: { changeDate: 'desc' }, take: 10 },
                neighborhood: true,
                openHouses: {
                    where: { startTime: { gte: new Date() } },
                    orderBy: { startTime: 'asc' },
                    take: 5,
                },
            },
        });

        if (property) {
            await cacheSet(cacheKey, property, CACHE_TTL.MEDIUM);
        }
    }

    if (!property) {
        throw new NotFoundError('Property not found');
    }

    // Track view
    await prisma.$transaction([
        prisma.property.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        }),
        prisma.propertyView.create({
            data: {
                propertyId: id,
                userId: req.user?.id,
                sessionId: req.headers['x-session-id'] as string,
                source: req.headers.referer,
            },
        }),
    ]);

    // Check if user has favorited
    let isFavorited = false;
    if (req.user) {
        const favorite = await prisma.favorite.findUnique({
            where: { userId_propertyId: { userId: req.user.id, propertyId: id } },
        });
        isFavorited = !!favorite;
    }

    res.json({ success: true, data: { ...property, isFavorited } });
}));

/**
 * @swagger
 * /properties:
 *   post:
 *     summary: Create a new property listing
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticate, requireAgent, asyncHandler(async (req: AuthenticatedRequest, res) => {
    const data = createPropertySchema.parse(req.body);

    const pricePerSqft = data.squareFeet ? data.price / data.squareFeet : null;

    const property = await prisma.property.create({
        data: {
            ...data,
            price: data.price,
            hoaFee: data.hoaFee || null,
            propertyTax: data.propertyTax || null,
            pricePerSqft: pricePerSqft ? new Prisma.Decimal(pricePerSqft) : null,
            listingAgentId: req.user!.agentId,
            features: data.features || [],
            amenities: data.amenities || [],
            appliances: data.appliances || [],
            flooring: data.flooring || [],
            heating: data.heating || [],
            cooling: data.cooling || [],
        },
    });

    // Invalidate list cache
    await cacheDeletePattern(`${CACHE_KEYS.PROPERTY_LIST}*`);

    logger.info(`Property created: ${property.id} by agent ${req.user!.agentId}`);

    res.status(201).json({ success: true, data: property });
}));

/**
 * @swagger
 * /properties/{id}:
 *   put:
 *     summary: Update a property
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authenticate, requireAgent, asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    const data = createPropertySchema.partial().parse(req.body);

    const property = await prisma.property.findUnique({
        where: { id },
        select: { listingAgentId: true, price: true },
    });

    if (!property) {
        throw new NotFoundError('Property not found');
    }

    if (property.listingAgentId !== req.user!.agentId) {
        throw new ForbiddenError('You can only edit your own listings');
    }

    // Track price changes
    if (data.price && data.price !== Number(property.price)) {
        await prisma.priceHistory.create({
            data: {
                propertyId: id,
                previousPrice: property.price,
                newPrice: data.price,
                changeReason: req.body.priceChangeReason,
            },
        });
    }

    const updated = await prisma.property.update({
        where: { id },
        data: {
            ...data,
            price: data.price,
            hoaFee: data.hoaFee,
            propertyTax: data.propertyTax,
            pricePerSqft: data.squareFeet && data.price ? data.price / data.squareFeet : undefined,
            updatedAt: new Date(),
        },
    });

    await cacheDelete(`${CACHE_KEYS.PROPERTY}${id}`);
    await cacheDeletePattern(`${CACHE_KEYS.PROPERTY_LIST}*`);

    res.json({ success: true, data: updated });
}));

/**
 * @swagger
 * /properties/{id}:
 *   delete:
 *     summary: Delete a property
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authenticate, requireAgent, asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
        where: { id },
        select: { listingAgentId: true },
    });

    if (!property) {
        throw new NotFoundError('Property not found');
    }

    if (property.listingAgentId !== req.user!.agentId && req.user!.userType !== 'ADMIN') {
        throw new ForbiddenError('You can only delete your own listings');
    }

    await prisma.property.delete({ where: { id } });

    await cacheDelete(`${CACHE_KEYS.PROPERTY}${id}`);
    await cacheDeletePattern(`${CACHE_KEYS.PROPERTY_LIST}*`);

    logger.info(`Property deleted: ${id}`);

    res.json({ success: true, message: 'Property deleted successfully' });
}));

/**
 * @swagger
 * /properties/{id}/favorite:
 *   post:
 *     summary: Toggle property favorite
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/favorite', authenticate, asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;

    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) {
        throw new NotFoundError('Property not found');
    }

    const existing = await prisma.favorite.findUnique({
        where: { userId_propertyId: { userId: req.user!.id, propertyId: id } },
    });

    if (existing) {
        await prisma.favorite.delete({ where: { id: existing.id } });
        await prisma.property.update({
            where: { id },
            data: { favoriteCount: { decrement: 1 } },
        });
        res.json({ success: true, favorited: false });
    } else {
        await prisma.favorite.create({
            data: { userId: req.user!.id, propertyId: id },
        });
        await prisma.property.update({
            where: { id },
            data: { favoriteCount: { increment: 1 } },
        });
        res.json({ success: true, favorited: true });
    }
}));

/**
 * @swagger
 * /properties/{id}/inquiry:
 *   post:
 *     summary: Submit inquiry for a property
 *     tags: [Properties]
 */
router.post('/:id/inquiry', optionalAuthenticate, asyncHandler(async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    const { name, email, phone, message } = req.body;

    if (!name || !email) {
        throw new BadRequestError('Name and email are required');
    }

    const property = await prisma.property.findUnique({
        where: { id },
        select: { id: true, listingAgentId: true },
    });

    if (!property) {
        throw new NotFoundError('Property not found');
    }

    // Create lead
    const lead = await prisma.lead.create({
        data: {
            propertyId: id,
            agentId: property.listingAgentId,
            userId: req.user?.id,
            name,
            email,
            phone,
            message,
            source: 'INQUIRY',
        },
    });

    // Update inquiry count
    await prisma.property.update({
        where: { id },
        data: { inquiryCount: { increment: 1 } },
    });

    logger.info(`Lead created: ${lead.id} for property ${id}`);

    res.status(201).json({ success: true, data: { leadId: lead.id } });
}));

/**
 * @swagger
 * /properties/{id}/similar:
 *   get:
 *     summary: Get similar properties
 *     tags: [Properties]
 */
router.get('/:id/similar', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const limit = Math.min(Number(req.query.limit) || 6, 20);

    const property = await prisma.property.findUnique({
        where: { id },
        select: { city: true, state: true, propertyType: true, price: true, bedrooms: true },
    });

    if (!property) {
        throw new NotFoundError('Property not found');
    }

    const priceRange = Number(property.price) * 0.25;

    const similar = await prisma.property.findMany({
        where: {
            id: { not: id },
            status: 'ACTIVE',
            city: property.city,
            propertyType: property.propertyType,
            price: {
                gte: Number(property.price) - priceRange,
                lte: Number(property.price) + priceRange,
            },
            bedrooms: {
                gte: property.bedrooms - 1,
                lte: property.bedrooms + 1,
            },
        },
        take: limit,
        select: {
            id: true,
            title: true,
            city: true,
            state: true,
            price: true,
            bedrooms: true,
            bathrooms: true,
            squareFeet: true,
            photos: { where: { isPrimary: true }, take: 1 },
            vastuAnalysis: { select: { overallScore: true } },
        },
    });

    res.json({ success: true, data: similar });
}));

export default router;
