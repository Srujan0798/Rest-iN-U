import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { redis, cacheKeys, cacheTTL } from '../utils/redis';
import { authenticate, optionalAuthenticate } from '../middleware/auth';
import { asyncHandler, BadRequestError, NotFoundError } from '../middleware/errorHandler';
import { Prisma } from '@prisma/client';

const router = Router();

// ============================================================================
// SEARCH SCHEMAS
// ============================================================================

const advancedSearchSchema = z.object({
  // Text search
  query: z.string().optional(),

  // Location
  location: z.object({
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    radiusMiles: z.number().min(0.1).max(100).default(25),
  }).optional(),

  // Property details
  propertyType: z.array(z.enum(['HOUSE', 'CONDO', 'TOWNHOUSE', 'VILLA', 'PENTHOUSE', 'APARTMENT', 'ASHRAM', 'PLOT', 'COMMERCIAL', 'LAND', 'MULTI_FAMILY', 'FARMHOUSE'])).optional(),
  listingType: z.enum(['SALE', 'RENT', 'AUCTION', 'LEASE']).optional(),
  status: z.array(z.enum(['ACTIVE', 'PENDING', 'SOLD', 'OFF_MARKET', 'COMING_SOON'])).optional(),

  // Price range
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),

  // Size
  minBedrooms: z.number().min(0).optional(),
  maxBedrooms: z.number().optional(),
  minBathrooms: z.number().min(0).optional(),
  maxBathrooms: z.number().optional(),
  minSquareFeet: z.number().min(0).optional(),
  maxSquareFeet: z.number().optional(),
  minLotSize: z.number().min(0).optional(),
  maxLotSize: z.number().optional(),

  // Year
  minYearBuilt: z.number().min(1800).optional(),
  maxYearBuilt: z.number().optional(),

  // Features
  features: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  mustHaveFeatures: z.array(z.string()).optional(), // Required features (AND logic)

  // Ancient Wisdom Filters
  minVastuScore: z.number().min(0).max(100).optional(),
  vastuGrade: z.array(z.enum(['A+', 'A', 'B+', 'B', 'C', 'D', 'F'])).optional(),
  entranceDirection: z.array(z.enum(['NORTH', 'NORTH_EAST', 'EAST', 'SOUTH_EAST', 'SOUTH', 'SOUTH_WEST', 'WEST', 'NORTH_WEST'])).optional(),
  minFengShuiScore: z.number().min(0).max(100).optional(),

  // Climate Filters
  maxClimateRiskScore: z.number().min(0).max(100).optional(),
  climateRiskGrade: z.array(z.enum(['LOW', 'MODERATE', 'HIGH', 'EXTREME'])).optional(),
  maxFloodRisk: z.number().min(0).max(100).optional(),
  maxWildfireRisk: z.number().min(0).max(100).optional(),
  maxHurricaneRisk: z.number().min(0).max(100).optional(),

  // Environmental Filters
  maxAQI: z.number().min(0).max(500).optional(),
  maxNoiseLevel: z.number().min(0).max(150).optional(),
  maxEMFLevel: z.number().min(0).optional(),

  // Neighborhood Filters
  minWalkScore: z.number().min(0).max(100).optional(),
  minTransitScore: z.number().min(0).max(100).optional(),
  minSchoolRating: z.number().min(1).max(10).optional(),
  maxCrimeIndex: z.number().min(0).optional(),

  // Other
  hasVirtualTour: z.boolean().optional(),
  hasOpenHouse: z.boolean().optional(),
  newConstruction: z.boolean().optional(),
  foreclosure: z.boolean().optional(),
  shortSale: z.boolean().optional(),
  priceReduced: z.boolean().optional(),
  daysOnMarket: z.number().min(0).optional(),

  // Pagination & Sorting
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.enum(['relevance', 'price', 'pricePerSqft', 'bedrooms', 'bathrooms', 'squareFeet', 'yearBuilt', 'daysOnMarket', 'vastuScore', 'climateRisk', 'createdAt']).default('relevance'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

const naturalLanguageSearchSchema = z.object({
  query: z.string().min(3).max(500),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

const autocompleteSchema = z.object({
  query: z.string().min(1).max(100),
  type: z.enum(['location', 'feature', 'agent', 'all']).default('all'),
  limit: z.number().min(1).max(20).default(10),
});

// ============================================================================
// NATURAL LANGUAGE PARSER
// ============================================================================

interface ParsedQuery {
  propertyType?: string[];
  listingType?: string;
  location?: { city?: string; state?: string; neighborhood?: string };
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  minSquareFeet?: number;
  features?: string[];
  minVastuScore?: number;
  maxClimateRiskScore?: number;
  keywords?: string[];
}

function parseNaturalLanguageQuery(query: string): ParsedQuery {
  const parsed: ParsedQuery = {};
  const lowerQuery = query.toLowerCase();

  // Property type detection
  const propertyTypes: { [key: string]: string } = {
    'house': 'HOUSE',
    'home': 'HOUSE',
    'condo': 'CONDO',
    'condominium': 'CONDO',
    'townhouse': 'TOWNHOUSE',
    'townhome': 'TOWNHOUSE',
    'villa': 'VILLA',
    'mansion': 'VILLA',
    'penthouse': 'PENTHOUSE',
    'apartment': 'APARTMENT',
    'apt': 'APARTMENT',
    'studio': 'STUDIO',
    'loft': 'LOFT',
    'duplex': 'DUPLEX',
    'ashram': 'ASHRAM',
    'spiritual retreat': 'ASHRAM',
    'plot': 'PLOT',
    'land': 'PLOT',
    'lot': 'PLOT',
    'farm': 'FARM',
    'farmhouse': 'FARM',
    'commercial': 'COMMERCIAL',
    'office': 'COMMERCIAL',
  };

  const detectedTypes: string[] = [];
  for (const [keyword, type] of Object.entries(propertyTypes)) {
    if (lowerQuery.includes(keyword)) {
      if (!detectedTypes.includes(type)) {
        detectedTypes.push(type);
      }
    }
  }
  if (detectedTypes.length > 0) {
    parsed.propertyType = detectedTypes;
  }

  // Listing type detection
  if (lowerQuery.includes('rent') || lowerQuery.includes('rental') || lowerQuery.includes('lease')) {
    parsed.listingType = 'RENT';
  } else if (lowerQuery.includes('buy') || lowerQuery.includes('purchase') || lowerQuery.includes('for sale')) {
    parsed.listingType = 'SALE';
  } else if (lowerQuery.includes('auction')) {
    parsed.listingType = 'AUCTION';
  }

  // Bedroom detection
  const bedroomPatterns = [
    /(\d+)\s*(?:bed|bedroom|br|bed room)/i,
    /(\d+)\s*(?:bd|bdrm)/i,
    /(\d+)\+?\s*(?:bed|bedroom)/i,
  ];
  for (const pattern of bedroomPatterns) {
    const match = query.match(pattern);
    if (match) {
      parsed.minBedrooms = parseInt(match[1]);
      break;
    }
  }

  // Bathroom detection
  const bathroomPatterns = [
    /(\d+(?:\.\d+)?)\s*(?:bath|bathroom|ba)/i,
    /(\d+)\s*(?:full bath)/i,
  ];
  for (const pattern of bathroomPatterns) {
    const match = query.match(pattern);
    if (match) {
      parsed.minBathrooms = parseFloat(match[1]);
      break;
    }
  }

  // Price detection
  const pricePatterns = [
    /under\s*\$?\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:k|m|million|thousand)?/i,
    /below\s*\$?\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:k|m|million|thousand)?/i,
    /less than\s*\$?\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:k|m|million|thousand)?/i,
    /max(?:imum)?\s*\$?\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:k|m|million|thousand)?/i,
    /\$?\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:k|m|million|thousand)?\s*(?:or less|max)/i,
  ];

  for (const pattern of pricePatterns) {
    const match = query.match(pattern);
    if (match) {
      let price = parseFloat(match[1].replace(/,/g, ''));
      const suffix = match[0].toLowerCase();
      if (suffix.includes('m') || suffix.includes('million')) {
        price *= 1000000;
      } else if (suffix.includes('k') || suffix.includes('thousand')) {
        price *= 1000;
      }
      parsed.maxPrice = price;
      break;
    }
  }

  // Minimum price detection
  const minPricePatterns = [
    /over\s*\$?\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:k|m|million|thousand)?/i,
    /above\s*\$?\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:k|m|million|thousand)?/i,
    /more than\s*\$?\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:k|m|million|thousand)?/i,
    /min(?:imum)?\s*\$?\s*(\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:k|m|million|thousand)?/i,
  ];

  for (const pattern of minPricePatterns) {
    const match = query.match(pattern);
    if (match) {
      let price = parseFloat(match[1].replace(/,/g, ''));
      const suffix = match[0].toLowerCase();
      if (suffix.includes('m') || suffix.includes('million')) {
        price *= 1000000;
      } else if (suffix.includes('k') || suffix.includes('thousand')) {
        price *= 1000;
      }
      parsed.minPrice = price;
      break;
    }
  }

  // Square footage detection
  const sqftPatterns = [
    /(\d+(?:,\d{3})*)\s*(?:sq\.?\s*ft|square feet|sqft)/i,
    /(\d+(?:,\d{3})*)\s*(?:sf)/i,
  ];
  for (const pattern of sqftPatterns) {
    const match = query.match(pattern);
    if (match) {
      parsed.minSquareFeet = parseInt(match[1].replace(/,/g, ''));
      break;
    }
  }

  // Location detection (simplified - in production would use NLP/NER)
  const locationPatterns = [
    /in\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
    /near\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:area|neighborhood|district)/i,
  ];

  for (const pattern of locationPatterns) {
    const match = query.match(pattern);
    if (match) {
      const location = match[1];
      // Check if it's a US state
      const usStates = ['California', 'Texas', 'Florida', 'New York', 'Arizona', 'Nevada', 'Colorado', 'Washington', 'Oregon', 'Georgia'];
      if (usStates.some(state => location.includes(state))) {
        parsed.location = { state: location };
      } else {
        parsed.location = { city: location };
      }
      break;
    }
  }

  // Feature detection
  const features: string[] = [];
  const featureKeywords: { [key: string]: string } = {
    'pool': 'POOL',
    'swimming pool': 'POOL',
    'garage': 'GARAGE',
    'parking': 'PARKING',
    'garden': 'GARDEN',
    'backyard': 'BACKYARD',
    'fireplace': 'FIREPLACE',
    'balcony': 'BALCONY',
    'terrace': 'TERRACE',
    'waterfront': 'WATERFRONT',
    'ocean view': 'OCEAN_VIEW',
    'mountain view': 'MOUNTAIN_VIEW',
    'city view': 'CITY_VIEW',
    'gym': 'GYM',
    'fitness': 'FITNESS_CENTER',
    'spa': 'SPA',
    'elevator': 'ELEVATOR',
    'smart home': 'SMART_HOME',
    'solar': 'SOLAR_PANELS',
    'ev charger': 'EV_CHARGING',
    'guest house': 'GUEST_HOUSE',
    'home office': 'HOME_OFFICE',
    'wine cellar': 'WINE_CELLAR',
    'theater': 'HOME_THEATER',
    'puja room': 'PUJA_ROOM',
    'pooja room': 'PUJA_ROOM',
    'meditation': 'MEDITATION_ROOM',
    'yoga': 'YOGA_ROOM',
  };

  for (const [keyword, feature] of Object.entries(featureKeywords)) {
    if (lowerQuery.includes(keyword)) {
      features.push(feature);
    }
  }
  if (features.length > 0) {
    parsed.features = features;
  }

  // Vastu detection
  if (lowerQuery.includes('vastu') || lowerQuery.includes('vaastu')) {
    if (lowerQuery.includes('excellent') || lowerQuery.includes('great') || lowerQuery.includes('good')) {
      parsed.minVastuScore = 80;
    } else {
      parsed.minVastuScore = 60; // Default minimum if Vastu mentioned
    }
  }

  // Climate risk detection
  if (lowerQuery.includes('safe') && (lowerQuery.includes('climate') || lowerQuery.includes('flood') || lowerQuery.includes('fire'))) {
    parsed.maxClimateRiskScore = 30;
  }
  if (lowerQuery.includes('low risk') || lowerQuery.includes('low flood') || lowerQuery.includes('no flood')) {
    parsed.maxClimateRiskScore = 25;
  }

  return parsed;
}

// ============================================================================
// ADVANCED SEARCH
// ============================================================================

router.post('/advanced', optionalAuthenticate, asyncHandler(async (req: Request, res: Response) => {
  const validated = advancedSearchSchema.parse(req.body);
  const { page, limit, sortBy, sortOrder, ...filters } = validated;

  // Build WHERE clause
  const where: Prisma.PropertyWhereInput = {
    status: filters.status ? { in: filters.status } : 'ACTIVE',
  };

  // Property type filter
  if (filters.propertyType && filters.propertyType.length > 0) {
    where.propertyType = { in: filters.propertyType };
  }

  // Listing type filter
  if (filters.listingType) {
    where.listingType = filters.listingType;
  }

  // Price range
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
  }

  // Bedrooms
  if (filters.minBedrooms !== undefined || filters.maxBedrooms !== undefined) {
    where.bedrooms = {};
    if (filters.minBedrooms !== undefined) where.bedrooms.gte = filters.minBedrooms;
    if (filters.maxBedrooms !== undefined) where.bedrooms.lte = filters.maxBedrooms;
  }

  // Bathrooms
  if (filters.minBathrooms !== undefined || filters.maxBathrooms !== undefined) {
    where.bathrooms = {};
    if (filters.minBathrooms !== undefined) where.bathrooms.gte = filters.minBathrooms;
    if (filters.maxBathrooms !== undefined) where.bathrooms.lte = filters.maxBathrooms;
  }

  // Square feet
  if (filters.minSquareFeet !== undefined || filters.maxSquareFeet !== undefined) {
    where.squareFeet = {};
    if (filters.minSquareFeet !== undefined) where.squareFeet.gte = filters.minSquareFeet;
    if (filters.maxSquareFeet !== undefined) where.squareFeet.lte = filters.maxSquareFeet;
  }

  // Lot size
  if (filters.minLotSize !== undefined || filters.maxLotSize !== undefined) {
    where.lotSizeAcres = {};
    if (filters.minLotSize !== undefined) where.lotSizeAcres.gte = filters.minLotSize;
    if (filters.maxLotSize !== undefined) where.lotSizeAcres.lte = filters.maxLotSize;
  }

  // Year built
  if (filters.minYearBuilt !== undefined || filters.maxYearBuilt !== undefined) {
    where.yearBuilt = {};
    if (filters.minYearBuilt !== undefined) where.yearBuilt.gte = filters.minYearBuilt;
    if (filters.maxYearBuilt !== undefined) where.yearBuilt.lte = filters.maxYearBuilt;
  }

  // Location filters
  if (filters.location) {
    if (filters.location.city) where.city = { contains: filters.location.city, mode: 'insensitive' };
    if (filters.location.state) where.state = { contains: filters.location.state, mode: 'insensitive' };
    if (filters.location.zipCode) where.zipCode = filters.location.zipCode;

    // Geo search (bounding box)
    if (filters.location.latitude && filters.location.longitude) {
      const radiusKm = (filters.location.radiusMiles || 25) * 1.60934;
      const latDelta = radiusKm / 111;
      const lngDelta = radiusKm / (111 * Math.cos(filters.location.latitude * Math.PI / 180));

      where.latitude = {
        gte: filters.location.latitude - latDelta,
        lte: filters.location.latitude + latDelta,
      };
      where.longitude = {
        gte: filters.location.longitude - lngDelta,
        lte: filters.location.longitude + lngDelta,
      };
    }
  }

  // Features filter (OR logic by default)
  if (filters.features && filters.features.length > 0) {
    where.features = { hasSome: filters.features };
  }

  // Must have features (AND logic)
  if (filters.mustHaveFeatures && filters.mustHaveFeatures.length > 0) {
    where.features = { hasEvery: filters.mustHaveFeatures };
  }

  // Amenities filter
  if (filters.amenities && filters.amenities.length > 0) {
    where.amenities = { hasSome: filters.amenities };
  }

  // Vastu filters
  if (filters.minVastuScore !== undefined || filters.vastuGrade || filters.entranceDirection) {
    where.vastuAnalysis = {};
    if (filters.minVastuScore !== undefined) {
      where.vastuAnalysis.overallScore = { gte: filters.minVastuScore };
    }
    if (filters.vastuGrade && filters.vastuGrade.length > 0) {
      where.vastuAnalysis.grade = { in: filters.vastuGrade };
    }
    if (filters.entranceDirection && filters.entranceDirection.length > 0) {
      where.vastuAnalysis.entranceDirection = { in: filters.entranceDirection };
    }
  }

  // Feng Shui filter
  if (filters.minFengShuiScore !== undefined) {
    where.fengShuiAnalysis = {
      overallScore: { gte: filters.minFengShuiScore },
    };
  }

  // Climate filters
  if (filters.maxClimateRiskScore !== undefined || filters.climateRiskGrade ||
    filters.maxFloodRisk !== undefined || filters.maxWildfireRisk !== undefined ||
    filters.maxHurricaneRisk !== undefined) {
    where.climateAnalysis = {};
    if (filters.maxClimateRiskScore !== undefined) {
      where.climateAnalysis.overallRiskScore = { lte: filters.maxClimateRiskScore };
    }
    if (filters.climateRiskGrade && filters.climateRiskGrade.length > 0) {
      where.climateAnalysis.riskGrade = { in: filters.climateRiskGrade };
    }
    if (filters.maxFloodRisk !== undefined) {
      where.climateAnalysis.floodRisk2030 = { lte: filters.maxFloodRisk };
    }
    if (filters.maxWildfireRisk !== undefined) {
      where.climateAnalysis.wildfireRisk = { lte: filters.maxWildfireRisk };
    }
    if (filters.maxHurricaneRisk !== undefined) {
      where.climateAnalysis.hurricaneRisk = { lte: filters.maxHurricaneRisk };
    }
  }

  // Environmental filters
  if (filters.maxAQI !== undefined || filters.maxNoiseLevel !== undefined ||
    filters.maxEMFLevel !== undefined) {
    where.environmentalData = {};
    if (filters.maxAQI !== undefined) {
      where.environmentalData.aqiCurrent = { lte: filters.maxAQI };
    }
    if (filters.maxNoiseLevel !== undefined) {
      where.environmentalData.avgNoiseDecibels = { lte: filters.maxNoiseLevel };
    }
    if (filters.maxEMFLevel !== undefined) {
      where.environmentalData.emfLevel = { lte: filters.maxEMFLevel };
    }
  }

  // Neighborhood filters
  if (filters.minWalkScore !== undefined || filters.minTransitScore !== undefined ||
    filters.minSchoolRating !== undefined || filters.maxCrimeIndex !== undefined) {
    where.neighborhood = {};
    if (filters.minWalkScore !== undefined) {
      where.neighborhood.walkabilityScore = { gte: filters.minWalkScore };
    }
    if (filters.minTransitScore !== undefined) {
      where.neighborhood.transitScore = { gte: filters.minTransitScore };
    }
    if (filters.minSchoolRating !== undefined) {
      where.neighborhood.schoolRating = { gte: filters.minSchoolRating };
    }
    if (filters.maxCrimeIndex !== undefined) {
      where.neighborhood.crimeIndex = { lte: filters.maxCrimeIndex };
    }
  }

  // Other filters
  if (filters.hasVirtualTour) {
    where.virtualTourUrl = { not: null };
  }

  if (filters.hasOpenHouse) {
    where.openHouses = {
      some: {
        startTime: { gte: new Date() },
      },
    };
  }

  if (filters.newConstruction) {
    const currentYear = new Date().getFullYear();
    where.yearBuilt = { gte: currentYear - 2 };
  }

  if (filters.priceReduced) {
    where.priceHistory = {
      some: {
        newPrice: { lt: prisma.priceHistory.fields.previousPrice },
        changeDate: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
      },
    };
  }

  if (filters.daysOnMarket !== undefined) {
    const cutoffDate = new Date(Date.now() - filters.daysOnMarket * 24 * 60 * 60 * 1000);
    where.listedDate = { gte: cutoffDate };
  }

  // Build ORDER BY
  let orderBy: Prisma.PropertyOrderByWithRelationInput = {};
  switch (sortBy) {
    case 'price':
      orderBy = { price: sortOrder };
      break;
    case 'pricePerSqft':
      orderBy = { pricePerSqft: sortOrder };
      break;
    case 'bedrooms':
      orderBy = { bedrooms: sortOrder };
      break;
    case 'bathrooms':
      orderBy = { bathrooms: sortOrder };
      break;
    case 'squareFeet':
      orderBy = { squareFeet: sortOrder };
      break;
    case 'yearBuilt':
      orderBy = { yearBuilt: sortOrder };
      break;
    case 'daysOnMarket':
      orderBy = { listedDate: sortOrder === 'asc' ? 'desc' : 'asc' };
      break;
    case 'vastuScore':
      orderBy = { vastuAnalysis: { overallScore: sortOrder } };
      break;
    case 'climateRisk':
      orderBy = { climateAnalysis: { overallRiskScore: sortOrder === 'asc' ? 'desc' : 'asc' } };
      break;
    case 'createdAt':
      orderBy = { createdAt: sortOrder };
      break;
    default:
      // Relevance - prioritize featured, then recent
      orderBy = { createdAt: 'desc' };
  }

  // Execute query
  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        photos: {
          where: { isPrimary: true },
          take: 1,
        },
        vastuAnalysis: {
          select: {
            overallScore: true,
            grade: true,
            entranceDirection: true,
          },
        },
        climateAnalysis: {
          select: {
            overallRiskScore: true,
            riskGrade: true,
          },
        },
        listingAgent: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        neighborhood: {
          select: {
            name: true,
            walkabilityScore: true,
            transitScore: true,
            schoolRating: true,
          },
        },
      },
    }),
    prisma.property.count({ where }),
  ]);

  // Track search if user is authenticated
  if ((req as any).user) {
    // Could save search history here for recommendations
  }

  res.json({
    success: true,
    data: {
      properties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
      filters: {
        applied: Object.keys(filters).filter(k => filters[k as keyof typeof filters] !== undefined).length,
        available: {
          propertyTypes: ['HOUSE', 'CONDO', 'TOWNHOUSE', 'VILLA', 'PENTHOUSE', 'APARTMENT', 'STUDIO', 'LOFT', 'DUPLEX', 'ASHRAM', 'PLOT', 'FARM', 'COMMERCIAL', 'MIXED_USE'],
          vastuGrades: ['A+', 'A', 'B+', 'B', 'C', 'D', 'F'],
          climateRiskGrades: ['LOW', 'MODERATE', 'HIGH', 'EXTREME'],
        },
      },
    },
  });
}));

// ============================================================================
// NATURAL LANGUAGE SEARCH
// ============================================================================

router.post('/natural-language', optionalAuthenticate, asyncHandler(async (req: Request, res: Response) => {
  const validated = naturalLanguageSearchSchema.parse(req.body);
  const { query, page, limit } = validated;

  // Parse natural language query
  const parsed = parseNaturalLanguageQuery(query);

  // Build WHERE clause from parsed query
  const where: Prisma.PropertyWhereInput = {
    status: 'ACTIVE',
  };

  if (parsed.propertyType && parsed.propertyType.length > 0) {
    where.propertyType = { in: parsed.propertyType };
  }

  if (parsed.listingType) {
    where.listingType = parsed.listingType;
  }

  if (parsed.location) {
    if (parsed.location.city) where.city = { contains: parsed.location.city, mode: 'insensitive' };
    if (parsed.location.state) where.state = { contains: parsed.location.state, mode: 'insensitive' };
  }

  if (parsed.minBedrooms !== undefined) {
    where.bedrooms = { gte: parsed.minBedrooms };
  }

  if (parsed.minBathrooms !== undefined) {
    where.bathrooms = { gte: parsed.minBathrooms };
  }

  if (parsed.minPrice !== undefined || parsed.maxPrice !== undefined) {
    where.price = {};
    if (parsed.minPrice !== undefined) where.price.gte = parsed.minPrice;
    if (parsed.maxPrice !== undefined) where.price.lte = parsed.maxPrice;
  }

  if (parsed.minSquareFeet !== undefined) {
    where.squareFeet = { gte: parsed.minSquareFeet };
  }

  if (parsed.features && parsed.features.length > 0) {
    where.features = { hasSome: parsed.features };
  }

  if (parsed.minVastuScore !== undefined) {
    where.vastuAnalysis = { overallScore: { gte: parsed.minVastuScore } };
  }

  if (parsed.maxClimateRiskScore !== undefined) {
    where.climateAnalysis = { overallRiskScore: { lte: parsed.maxClimateRiskScore } };
  }

  // Execute query
  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        photos: {
          where: { isPrimary: true },
          take: 1,
        },
        vastuAnalysis: {
          select: {
            overallScore: true,
            grade: true,
          },
        },
        climateAnalysis: {
          select: {
            overallRiskScore: true,
            riskGrade: true,
          },
        },
        listingAgent: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    }),
    prisma.property.count({ where }),
  ]);

  res.json({
    success: true,
    data: {
      originalQuery: query,
      parsedFilters: parsed,
      properties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      suggestions: properties.length === 0 ? [
        'Try removing some filters',
        'Expand your search area',
        'Adjust your price range',
      ] : [],
    },
  });
}));

// ============================================================================
// AUTOCOMPLETE
// ============================================================================

router.get('/autocomplete', asyncHandler(async (req: Request, res: Response) => {
  const validated = autocompleteSchema.parse(req.query);
  const { query, type, limit } = validated;

  const suggestions: Array<{
    type: string;
    value: string;
    display: string;
    metadata?: Record<string, any>;
  }> = [];

  // Location autocomplete
  if (type === 'all' || type === 'location') {
    // Cities
    const cities = await prisma.property.findMany({
      where: {
        city: { contains: query, mode: 'insensitive' },
        status: 'ACTIVE',
      },
      select: { city: true, state: true },
      distinct: ['city'],
      take: limit,
    });

    cities.forEach(c => {
      suggestions.push({
        type: 'city',
        value: c.city,
        display: `${c.city}, ${c.state}`,
        metadata: { state: c.state },
      });
    });

    // Neighborhoods
    const neighborhoods = await prisma.neighborhood.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
      },
      select: { name: true, city: true, state: true },
      take: limit,
    });

    neighborhoods.forEach(n => {
      suggestions.push({
        type: 'neighborhood',
        value: n.name,
        display: `${n.name}, ${n.city}`,
        metadata: { city: n.city, state: n.state },
      });
    });

    // Zip codes
    if (/^\d{1,5}$/.test(query)) {
      const zips = await prisma.property.findMany({
        where: {
          zipCode: { startsWith: query },
          status: 'ACTIVE',
        },
        select: { zipCode: true, city: true, state: true },
        distinct: ['zipCode'],
        take: limit,
      });

      zips.forEach(z => {
        suggestions.push({
          type: 'zipCode',
          value: z.zipCode,
          display: `${z.zipCode} - ${z.city}, ${z.state}`,
          metadata: { city: z.city, state: z.state },
        });
      });
    }
  }

  // Feature autocomplete
  if (type === 'all' || type === 'feature') {
    const allFeatures = [
      'POOL', 'GARAGE', 'GARDEN', 'FIREPLACE', 'BALCONY', 'TERRACE',
      'WATERFRONT', 'OCEAN_VIEW', 'MOUNTAIN_VIEW', 'CITY_VIEW',
      'GYM', 'SPA', 'ELEVATOR', 'SMART_HOME', 'SOLAR_PANELS',
      'EV_CHARGING', 'GUEST_HOUSE', 'HOME_OFFICE', 'WINE_CELLAR',
      'HOME_THEATER', 'PUJA_ROOM', 'MEDITATION_ROOM', 'YOGA_ROOM',
      'SECURITY_SYSTEM', 'GATED', 'CONCIERGE', 'DOORMAN',
    ];

    const matchingFeatures = allFeatures.filter(f =>
      f.toLowerCase().includes(query.toLowerCase()) ||
      f.replace(/_/g, ' ').toLowerCase().includes(query.toLowerCase())
    );

    matchingFeatures.slice(0, limit).forEach(f => {
      suggestions.push({
        type: 'feature',
        value: f,
        display: f.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
      });
    });
  }

  // Agent autocomplete
  if (type === 'all' || type === 'agent') {
    const agents = await prisma.agent.findMany({
      where: {
        OR: [
          { user: { firstName: { contains: query, mode: 'insensitive' } } },
          { user: { lastName: { contains: query, mode: 'insensitive' } } },
          { brokerage: { contains: query, mode: 'insensitive' } },
        ],
        verified: true,
      },
      include: {
        user: {
          select: { firstName: true, lastName: true },
        },
      },
      take: limit,
    });

    agents.forEach(a => {
      suggestions.push({
        type: 'agent',
        value: a.id,
        display: `${a.user.firstName} ${a.user.lastName}`,
        metadata: { brokerage: a.brokerage },
      });
    });
  }

  res.json({
    success: true,
    data: {
      query,
      suggestions: suggestions.slice(0, limit),
    },
  });
}));

// ============================================================================
// SEARCH SUGGESTIONS
// ============================================================================

router.get('/suggestions', optionalAuthenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  const suggestions: Array<{
    type: string;
    title: string;
    query: Record<string, any>;
  }> = [];

  // Popular searches
  suggestions.push(
    {
      type: 'popular',
      title: '3+ BR Houses under $500K',
      query: { propertyType: ['HOUSE'], minBedrooms: 3, maxPrice: 500000 },
    },
    {
      type: 'popular',
      title: 'High Vastu Score Properties',
      query: { minVastuScore: 80 },
    },
    {
      type: 'popular',
      title: 'Low Climate Risk Homes',
      query: { maxClimateRiskScore: 25 },
    },
    {
      type: 'popular',
      title: 'Luxury Villas with Pool',
      query: { propertyType: ['VILLA'], minPrice: 1000000, features: ['POOL'] },
    },
    {
      type: 'popular',
      title: 'New Construction',
      query: { newConstruction: true },
    },
  );

  // User-specific suggestions based on saved searches and viewing history
  if (userId) {
    // Get user's most common search criteria
    const savedSearches = await prisma.savedSearch.findMany({
      where: { userId },
      orderBy: { matchCount: 'desc' },
      take: 3,
    });

    savedSearches.forEach(search => {
      suggestions.push({
        type: 'saved',
        title: search.name,
        query: search.filters as Record<string, any>,
      });
    });

    // Get recently viewed property types
    const recentViews = await prisma.propertyView.findMany({
      where: { userId },
      include: { property: { select: { propertyType: true, city: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    if (recentViews.length > 0) {
      const mostViewedType = recentViews
        .map(v => v.property.propertyType)
        .reduce((acc, type) => {
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

      const topType = Object.entries(mostViewedType).sort((a, b) => b[1] - a[1])[0];
      if (topType) {
        suggestions.push({
          type: 'personalized',
          title: `More ${topType[0].toLowerCase()}s you might like`,
          query: { propertyType: [topType[0]] },
        });
      }
    }
  }

  res.json({
    success: true,
    data: { suggestions },
  });
}));

// ============================================================================
// TRENDING SEARCHES
// ============================================================================

router.get('/trending', asyncHandler(async (req: Request, res: Response) => {
  // In production, this would track actual search queries
  // For now, return curated trending searches
  const trending = [
    {
      rank: 1,
      term: 'Vastu compliant homes',
      searchCount: 15420,
      trend: 'up',
      change: 23,
    },
    {
      rank: 2,
      term: 'Climate safe properties',
      searchCount: 12350,
      trend: 'up',
      change: 45,
    },
    {
      rank: 3,
      term: 'Waterfront condos',
      searchCount: 9870,
      trend: 'stable',
      change: 2,
    },
    {
      rank: 4,
      term: 'Smart homes',
      searchCount: 8540,
      trend: 'up',
      change: 18,
    },
    {
      rank: 5,
      term: 'Spiritual retreats',
      searchCount: 6230,
      trend: 'up',
      change: 67,
    },
    {
      rank: 6,
      term: 'Solar powered homes',
      searchCount: 5890,
      trend: 'up',
      change: 31,
    },
    {
      rank: 7,
      term: 'Mountain view properties',
      searchCount: 5420,
      trend: 'stable',
      change: 5,
    },
    {
      rank: 8,
      term: 'Investment properties',
      searchCount: 4980,
      trend: 'down',
      change: -8,
    },
    {
      rank: 9,
      term: 'New construction',
      searchCount: 4750,
      trend: 'stable',
      change: 1,
    },
    {
      rank: 10,
      term: 'Puja room homes',
      searchCount: 4320,
      trend: 'up',
      change: 89,
    },
  ];

  res.json({
    success: true,
    data: { trending },
  });
}));

export default router;

