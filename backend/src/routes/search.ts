// Advanced Search Routes
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { cacheGet, cacheSet, CACHE_KEYS, CACHE_TTL } from '../utils/redis';
import { asyncHandler } from '../middleware/errorHandler';
import { optionalAuthenticate, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Natural language search schema
const nlSearchSchema = z.object({
    query: z.string().min(3).max(500),
    limit: z.number().int().min(1).max(50).default(20),
});

/**
 * @swagger
 * /search/advanced:
 *   post:
 *     summary: Advanced property search with multiple criteria
 *     tags: [Search]
 */
router.post('/advanced', optionalAuthenticate, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const {
        location,
        propertyTypes,
        priceRange,
        beds,
        baths,
        sqftRange,
        yearBuiltRange,
        features,
        vastuScore,
        climateRisk,
        walkScore,
        schoolRating,
        includeAnalysis,
        sortBy,
        page = 1,
        limit = 20,
    } = req.body;

    const where: any = { status: 'ACTIVE' };

    // Location filter
    if (location) {
        if (location.city) where.city = { contains: location.city, mode: 'insensitive' };
        if (location.state) where.state = location.state;
        if (location.zipCode) where.zipCode = location.zipCode;
        if (location.lat && location.lng && location.radius) {
            // For geo search, would use PostGIS extension in production
            const latRange = location.radius / 69; // ~69 miles per degree
            const lngRange = location.radius / (69 * Math.cos(location.lat * Math.PI / 180));
            where.latitude = { gte: location.lat - latRange, lte: location.lat + latRange };
            where.longitude = { gte: location.lng - lngRange, lte: location.lng + lngRange };
        }
    }

    // Property type filter
    if (propertyTypes?.length) {
        where.propertyType = { in: propertyTypes };
    }

    // Price range
    if (priceRange) {
        where.price = {};
        if (priceRange.min) where.price.gte = priceRange.min;
        if (priceRange.max) where.price.lte = priceRange.max;
    }

    // Beds/baths
    if (beds) {
        where.bedrooms = {};
        if (beds.min) where.bedrooms.gte = beds.min;
        if (beds.max) where.bedrooms.lte = beds.max;
    }

    if (baths) {
        where.bathrooms = {};
        if (baths.min) where.bathrooms.gte = baths.min;
        if (baths.max) where.bathrooms.lte = baths.max;
    }

    // Square footage
    if (sqftRange) {
        where.squareFeet = {};
        if (sqftRange.min) where.squareFeet.gte = sqftRange.min;
        if (sqftRange.max) where.squareFeet.lte = sqftRange.max;
    }

    // Year built
    if (yearBuiltRange) {
        where.yearBuilt = {};
        if (yearBuiltRange.min) where.yearBuilt.gte = yearBuiltRange.min;
        if (yearBuiltRange.max) where.yearBuilt.lte = yearBuiltRange.max;
    }

    // Features filter
    if (features?.length) {
        where.features = { hasEvery: features };
    }

    // Vastu score filter
    if (vastuScore?.min) {
        where.vastuAnalysis = { overallScore: { gte: vastuScore.min } };
    }

    // Climate risk filter
    if (climateRisk?.max) {
        where.climateAnalysis = { overallRiskScore: { lte: climateRisk.max } };
    }

    // Neighborhood filters
    if (walkScore?.min || schoolRating?.min) {
        where.neighborhood = {};
        if (walkScore?.min) where.neighborhood.walkabilityScore = { gte: walkScore.min };
        if (schoolRating?.min) where.neighborhood.schoolRating = { gte: schoolRating.min };
    }

    // Sorting
    let orderBy: any = { listedDate: 'desc' };
    switch (sortBy) {
        case 'price_asc': orderBy = { price: 'asc' }; break;
        case 'price_desc': orderBy = { price: 'desc' }; break;
        case 'newest': orderBy = { listedDate: 'desc' }; break;
        case 'oldest': orderBy = { listedDate: 'asc' }; break;
        case 'largest': orderBy = { squareFeet: 'desc' }; break;
        case 'vastu_score': orderBy = { vastuAnalysis: { overallScore: 'desc' } }; break;
        case 'climate_safe': orderBy = { climateAnalysis: { overallRiskScore: 'asc' } }; break;
    }

    // Execute search
    const [properties, total] = await Promise.all([
        prisma.property.findMany({
            where,
            orderBy,
            skip: (page - 1) * limit,
            take: limit,
            include: {
                photos: { where: { isPrimary: true }, take: 1 },
                vastuAnalysis: includeAnalysis ? { select: { overallScore: true, grade: true } } : false,
                climateAnalysis: includeAnalysis ? { select: { overallRiskScore: true, riskGrade: true } } : false,
                environmentalData: includeAnalysis ? { select: { aqiCurrent: true, airQualityGrade: true } } : false,
                neighborhood: { select: { name: true, walkabilityScore: true, schoolRating: true } },
                listingAgent: {
                    select: { id: true, rating: true, user: { select: { firstName: true, lastName: true } } },
                },
            },
        }),
        prisma.property.count({ where }),
    ]);

    res.json({
        success: true,
        data: {
            properties,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
            filters: where,
        },
    });
}));

/**
 * @swagger
 * /search/natural-language:
 *   post:
 *     summary: Natural language property search
 *     tags: [Search]
 */
router.post('/natural-language', asyncHandler(async (req: Request, res: Response) => {
    const { query, limit } = nlSearchSchema.parse(req.body);

    // Parse natural language query
    const parsed = parseNaturalLanguageQuery(query);

    const where: any = { status: 'ACTIVE' };

    if (parsed.city) where.city = { contains: parsed.city, mode: 'insensitive' };
    if (parsed.propertyType) where.propertyType = parsed.propertyType;
    if (parsed.minBeds) where.bedrooms = { gte: parsed.minBeds };
    if (parsed.minBaths) where.bathrooms = { gte: parsed.minBaths };
    if (parsed.maxPrice) where.price = { lte: parsed.maxPrice };
    if (parsed.minPrice) where.price = { ...where.price, gte: parsed.minPrice };
    if (parsed.features?.length) where.features = { hasEvery: parsed.features };

    const properties = await prisma.property.findMany({
        where,
        take: limit,
        include: {
            photos: { where: { isPrimary: true }, take: 1 },
            vastuAnalysis: { select: { overallScore: true } },
        },
    });

    res.json({
        success: true,
        data: {
            properties,
            parsedQuery: parsed,
            originalQuery: query,
        },
    });
}));

/**
 * @swagger
 * /search/autocomplete:
 *   get:
 *     summary: Autocomplete for search
 *     tags: [Search]
 */
router.get('/autocomplete', asyncHandler(async (req: Request, res: Response) => {
    const { q, type = 'all' } = req.query;

    if (!q || (q as string).length < 2) {
        return res.json({ success: true, data: [] });
    }

    const query = q as string;
    const cacheKey = `autocomplete:${type}:${query.toLowerCase()}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
        return res.json({ success: true, data: cached });
    }

    const results: any[] = [];

    // City suggestions
    if (type === 'all' || type === 'city') {
        const cities = await prisma.property.groupBy({
            by: ['city', 'state'],
            where: { city: { contains: query, mode: 'insensitive' }, status: 'ACTIVE' },
            _count: true,
            take: 5,
        });
        results.push(...cities.map(c => ({
            type: 'city',
            value: `${c.city}, ${c.state}`,
            count: c._count,
        })));
    }

    // Neighborhood suggestions
    if (type === 'all' || type === 'neighborhood') {
        const neighborhoods = await prisma.neighborhood.findMany({
            where: { name: { contains: query, mode: 'insensitive' } },
            select: { name: true, city: true, state: true },
            take: 5,
        });
        results.push(...neighborhoods.map(n => ({
            type: 'neighborhood',
            value: `${n.name}, ${n.city}`,
        })));
    }

    // ZIP code suggestions
    if (type === 'all' || type === 'zip') {
        const zips = await prisma.property.groupBy({
            by: ['zipCode', 'city'],
            where: { zipCode: { startsWith: query }, status: 'ACTIVE' },
            _count: true,
            take: 5,
        });
        results.push(...zips.map(z => ({
            type: 'zip',
            value: z.zipCode,
            city: z.city,
            count: z._count,
        })));
    }

    await cacheSet(cacheKey, results, CACHE_TTL.MEDIUM);

    res.json({ success: true, data: results });
}));

/**
 * @swagger
 * /search/saved:
 *   get:
 *     summary: Get user's saved searches
 *     tags: [Search]
 */
router.get('/saved', optionalAuthenticate, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        return res.json({ success: true, data: [] });
    }

    const searches = await prisma.savedSearch.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: searches });
}));

/**
 * @swagger
 * /search/saved:
 *   post:
 *     summary: Save a search
 *     tags: [Search]
 */
router.post('/saved', optionalAuthenticate, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const { name, filters, alertFrequency = 'DAILY' } = req.body;

    const search = await prisma.savedSearch.create({
        data: {
            userId: req.user.id,
            name,
            filters,
            alertFrequency,
        },
    });

    res.status(201).json({ success: true, data: search });
}));

// Helper: Parse natural language query
function parseNaturalLanguageQuery(query: string) {
    const result: any = {};
    const q = query.toLowerCase();

    // Property types
    const typeMap: Record<string, string> = {
        'house': 'HOUSE', 'home': 'HOUSE', 'condo': 'CONDO', 'apartment': 'APARTMENT',
        'townhouse': 'TOWNHOUSE', 'villa': 'VILLA', 'land': 'LAND', 'plot': 'PLOT',
        'commercial': 'COMMERCIAL', 'farmhouse': 'FARMHOUSE',
    };
    for (const [key, value] of Object.entries(typeMap)) {
        if (q.includes(key)) { result.propertyType = value; break; }
    }

    // Bedrooms
    const bedMatch = q.match(/(\d+)\s*(bed|bedroom|br)/i);
    if (bedMatch) result.minBeds = parseInt(bedMatch[1]);

    // Bathrooms
    const bathMatch = q.match(/(\d+)\s*(bath|bathroom|ba)/i);
    if (bathMatch) result.minBaths = parseInt(bathMatch[1]);

    // Price
    const priceMatch = q.match(/(under|below|max|less than)\s*\$?(\d+[km]?)/i);
    if (priceMatch) {
        let price = priceMatch[2].toLowerCase();
        let multiplier = 1;
        if (price.endsWith('k')) { multiplier = 1000; price = price.slice(0, -1); }
        if (price.endsWith('m')) { multiplier = 1000000; price = price.slice(0, -1); }
        result.maxPrice = parseInt(price) * multiplier;
    }

    const minPriceMatch = q.match(/(over|above|min|more than)\s*\$?(\d+[km]?)/i);
    if (minPriceMatch) {
        let price = minPriceMatch[2].toLowerCase();
        let multiplier = 1;
        if (price.endsWith('k')) { multiplier = 1000; price = price.slice(0, -1); }
        if (price.endsWith('m')) { multiplier = 1000000; price = price.slice(0, -1); }
        result.minPrice = parseInt(price) * multiplier;
    }

    // Features
    const featureKeywords = ['pool', 'garage', 'fireplace', 'basement', 'garden', 'balcony', 'gym', 'waterfront'];
    result.features = featureKeywords.filter(f => q.includes(f));

    // City detection (simplified - would use NLP in production)
    const commonCities = ['miami', 'new york', 'los angeles', 'chicago', 'houston', 'phoenix', 'austin', 'denver', 'seattle', 'boston'];
    for (const city of commonCities) {
        if (q.includes(city)) { result.city = city; break; }
    }

    // Vastu requirements
    if (q.includes('vastu') || q.includes('good energy')) {
        result.vastuScoreMin = 70;
    }

    return result;
}

export default router;
