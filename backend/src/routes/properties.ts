// Property Routes
import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { 
  cacheGet, 
  cacheSet, 
  cacheDelete, 
  cacheDeletePattern,
  CACHE_KEYS, 
  CACHE_TTL 
} from '../utils/redis';
import { 
  authenticate, 
  optionalAuthenticate,
  requireAgent,
  requireSubscription,
  AuthenticatedRequest 
} from '../middleware/auth';
import { 
  asyncHandler, 
  BadRequestError, 
  NotFoundError,
  ForbiddenError 
} from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = Router();

// Validation schemas
const createPropertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  propertyType: z.enum(['HOUSE', 'CONDO', 'TOWNHOUSE', 'APARTMENT', 'LAND', 'MULTI_FAMILY', 'COMMERCIAL', 'VILLA', 'PENTHOUSE', 'FARMHOUSE', 'ASHRAM', 'PLOT']),
  listingType: z.enum(['SALE', 'RENT', 'LEASE', 'AUCTION']),
  
  // Location
  streetAddress: z.string().min(1, 'Street address is required'),
  unit: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  country: z.string().default('USA'),
  latitude: z.number(),
  longitude: z.number(),
  
  // Details
  price: z.number().positive('Price must be positive'),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().min(0),
  squareFeet: z.number().int().positive().optional(),
  lotSizeAcres: z.number().positive().optional(),
  yearBuilt: z.number().int().min(1800).max(new Date().getFullYear() + 2).optional(),
  stories: z.number().int().min(1).optional(),
  parkingSpaces: z.number().int().min(0).optional(),
  garageSpaces: z.number().int().min(0).optional(),
  constructionDate: z.string().optional(), // For Kundali matching
  
  // Features
  features: z.array(z.string()).default([]),
  amenities: z.array(z.string()).default([]),
  appliances: z.array(z.string()).default([]),
  flooring: z.array(z.string()).default([]),
  heating: z.array(z.string()).default([]),
  cooling: z.array(z.string()).default([]),
  roofType: z.string().optional(),
  exteriorMaterial: z.string().optional(),
  foundationType: z.string().optional(),
  
  // Media
  virtualTourUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  floorPlanUrl: z.string().url().optional(),
  
  // Financial
  hoaFee: z.number().optional(),
  hoaFrequency: z.string().optional(),
  propertyTax: z.number().optional(),
  taxYear: z.number().int().optional(),
  
  // Photos (array of photo objects)
  photos: z.array(z.object({
    url: z.string().url(),
    thumbnailUrl: z.string().url().optional(),
    caption: z.string().optional(),
    roomType: z.string().optional(),
    orderIndex: z.number().int().default(0),
    isPrimary: z.boolean().default(false),
  })).optional(),
});

const updatePropertySchema = createPropertySchema.partial();

const propertyListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(24),
  sortBy: z.enum(['price', 'createdAt', 'bedrooms', 'squareFeet', 'daysOnMarket']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  
  // Filters
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  propertyType: z.string().optional(),
  listingType: z.enum(['SALE', 'RENT', 'LEASE', 'AUCTION']).optional(),
  status: z.enum(['ACTIVE', 'PENDING', 'SOLD', 'OFF_MARKET', 'COMING_SOON']).optional(),
  minBedrooms: z.coerce.number().int().optional(),
  maxBedrooms: z.coerce.number().int().optional(),
  minBathrooms: z.coerce.number().optional(),
  maxBathrooms: z.coerce.number().optional(),
  minSquareFeet: z.coerce.number().int().optional(),
  maxSquareFeet: z.coerce.number().int().optional(),
  minYearBuilt: z.coerce.number().int().optional(),
  maxYearBuilt: z.coerce.number().int().optional(),
  features: z.string().optional(), // Comma-separated list
  
  // Vastu filter
  minVastuScore: z.coerce.number().int().min(0).max(100).optional(),
  
  // Climate filter
  maxClimateRisk: z.coerce.number().int().min(0).max(100).optional(),
  
  // Geo search
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  radiusMiles: z.coerce.number().positive().optional(),
});

/**
 * @swagger
 * /properties:
 *   get:
 *     summary: List properties with filters
 *     tags: [Properties]
 */
router.get('/', optionalAuthenticate, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const query = propertyListQuerySchema.parse(req.query);
  const { page, limit, sortBy, sortOrder, ...filters } = query;
  
  // Build cache key from query
  const cacheKey = `${CACHE_KEYS.PROPERTY_LIST}${JSON.stringify(query)}`;
  
  // Try cache
  const cached = await cacheGet(cacheKey);
  if (cached) {
    return res.json({ success: true, data: cached });
  }

  // Build where clause
  const where: any = {
    status: filters.status || 'ACTIVE',
  };

  if (filters.city) where.city = { contains: filters.city, mode: 'insensitive' };
  if (filters.state) where.state = filters.state;
  if (filters.zipCode) where.zipCode = filters.zipCode;
  if (filters.propertyType) {
    where.propertyType = { in: filters.propertyType.split(',') };
  }
  if (filters.listingType) where.listingType = filters.listingType;
  
  if (filters.minPrice || filters.maxPrice) {
    where.price = {};
    if (filters.minPrice) where.price.gte = filters.minPrice;
    if (filters.maxPrice) where.price.lte = filters.maxPrice;
  }
  
  if (filters.minBedrooms || filters.maxBedrooms) {
    where.bedrooms = {};
    if (filters.minBedrooms) where.bedrooms.gte = filters.minBedrooms;
    if (filters.maxBedrooms) where.bedrooms.lte = filters.maxBedrooms;
  }
  
  if (filters.minBathrooms || filters.maxBathrooms) {
    where.bathrooms = {};
    if (filters.minBathrooms) where.bathrooms.gte = filters.minBathrooms;
    if (filters.maxBathrooms) where.bathrooms.lte = filters.maxBathrooms;
  }
  
  if (filters.minSquareFeet || filters.maxSquareFeet) {
    where.squareFeet = {};
    if (filters.minSquareFeet) where.squareFeet.gte = filters.minSquareFeet;
    if (filters.maxSquareFeet) where.squareFeet.lte = filters.maxSquareFeet;
  }
  
  if (filters.minYearBuilt || filters.maxYearBuilt) {
    where.yearBuilt = {};
    if (filters.minYearBuilt) where.yearBuilt.gte = filters.minYearBuilt;
    if (filters.maxYearBuilt) where.yearBuilt.lte = filters.maxYearBuilt;
  }
  
  if (filters.features) {
    where.features = { hasEvery: filters.features.split(',') };
  }
  
  // Vastu score filter
  if (filters.minVastuScore) {
    where.vastuAnalysis = {
      overallScore: { gte: filters.minVastuScore },
    };
  }
  
  // Climate risk filter
  if (filters.maxClimateRisk) {
    where.climateAnalysis = {
      overallRiskScore: { lte: filters.maxClimateRisk },
    };
  }

  // Geo search - using raw SQL for distance calculation
  let geoFilter = '';
  if (filters.latitude && filters.longitude && filters.radiusMiles) {
    // Haversine formula in raw SQL would be added here
    // For now, we'll do a simple bounding box filter
    const latDelta = filters.radiusMiles / 69; // Approx miles per degree latitude
    const lonDelta = filters.radiusMiles / (69 * Math.cos(filters.latitude * Math.PI / 180));
    
    where.latitude = {
      gte: filters.latitude - latDelta,
      lte: filters.latitude + latDelta,
    };
    where.longitude = {
      gte: filters.longitude - lonDelta,
      lte: filters.longitude + lonDelta,
    };
  }

  // Execute query
  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      select: {
        id: true,
        mlsId: true,
        title: true,
        streetAddress: true,
        city: true,
        state: true,
        zipCode: true,
        latitude: true,
        longitude: true,
        price: true,
        pricePerSqft: true,
        bedrooms: true,
        bathrooms: true,
        squareFeet: true,
        lotSizeAcres: true,
        yearBuilt: true,
        propertyType: true,
        listingType: true,
        status: true,
        features: true,
        daysOnMarket: true,
        viewCount: true,
        favoriteCount: true,
        virtualTourUrl: true,
        smartHomeScore: true,
        photos: {
          where: { isPrimary: true },
          take: 1,
          select: { url: true, thumbnailUrl: true },
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
          select: {
            id: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                profilePhotoUrl: true,
              },
            },
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
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };

  // Cache result
  await cacheSet(cacheKey, result, CACHE_TTL.SHORT);

  res.json({
    success: true,
    data: result,
  });
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
  
  // Try cache
  const cacheKey = `${CACHE_KEYS.PROPERTY}${id}`;
  const cached = await cacheGet(cacheKey);
  if (cached) {
    // Track view asynchronously
    trackPropertyView(id, req.user?.id);
    return res.json({ success: true, data: cached });
  }

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      photos: {
        orderBy: { orderIndex: 'asc' },
      },
      priceHistory: {
        orderBy: { changeDate: 'desc' },
        take: 10,
      },
      vastuAnalysis: true,
      fengShuiAnalysis: true,
      climateAnalysis: true,
      environmentalData: true,
      sacredGeometry: true,
      landEnergy: true,
      energyAnalysis: true,
      neighborhood: {
        select: {
          id: true,
          name: true,
          medianHomePrice: true,
          priceTrend6Month: true,
          walkabilityScore: true,
          transitScore: true,
          bikeScore: true,
          crimeIndex: true,
          schoolRating: true,
        },
      },
      listingAgent: {
        select: {
          id: true,
          yearsExperience: true,
          specialties: true,
          rating: true,
          reviewCount: true,
          ethicsScore: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              phone: true,
              email: true,
              profilePhotoUrl: true,
            },
          },
        },
      },
      openHouses: {
        where: {
          startTime: { gte: new Date() },
        },
        orderBy: { startTime: 'asc' },
        take: 5,
      },
      iotSensors: {
        select: {
          sensorType: true,
          lastReading: true,
          status: true,
        },
      },
    },
  });

  if (!property) {
    throw new NotFoundError('Property not found');
  }

  // Calculate estimated monthly payment
  const estimatedPayment = calculateEstimatedPayment(Number(property.price), {
    propertyTax: Number(property.propertyTax) || 0,
    hoaFee: Number(property.hoaFee) || 0,
  });

  // Get favorites count for this user
  let isFavorited = false;
  if (req.user) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId: req.user.id,
          propertyId: id,
        },
      },
    });
    isFavorited = !!favorite;
  }

  const result = {
    ...property,
    estimatedPayment,
    isFavorited,
  };

  // Cache result
  await cacheSet(cacheKey, result, CACHE_TTL.MEDIUM);

  // Track view
  trackPropertyView(id, req.user?.id);

  res.json({
    success: true,
    data: result,
  });
}));

/**
 * @swagger
 * /properties:
 *   post:
 *     summary: Create a new property listing (Agent only)
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticate, requireAgent, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const data = createPropertySchema.parse(req.body);

  // Calculate price per sqft
  const pricePerSqft = data.squareFeet 
    ? data.price / data.squareFeet 
    : null;

  // Create property
  const property = await prisma.property.create({
    data: {
      ...data,
      pricePerSqft,
      originalPrice: data.price,
      listingAgentId: req.user!.agentId,
      photos: data.photos ? {
        create: data.photos.map((photo, index) => ({
          ...photo,
          orderIndex: photo.orderIndex ?? index,
          isPrimary: photo.isPrimary ?? index === 0,
        })),
      } : undefined,
      constructionDate: data.constructionDate ? new Date(data.constructionDate) : undefined,
    },
    include: {
      photos: true,
      listingAgent: {
        select: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });

  // Clear list caches
  await cacheDeletePattern(`${CACHE_KEYS.PROPERTY_LIST}*`);

  logger.info(`Property created: ${property.id} by agent ${req.user!.agentId}`);

  res.status(201).json({
    success: true,
    data: property,
  });
}));

/**
 * @swagger
 * /properties/{id}:
 *   put:
 *     summary: Update a property listing (Owner agent only)
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authenticate, requireAgent, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const data = updatePropertySchema.parse(req.body);

  // Check ownership
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

  // Track price change
  if (data.price && data.price !== Number(property.price)) {
    await prisma.priceHistory.create({
      data: {
        propertyId: id,
        previousPrice: property.price,
        newPrice: data.price,
        changeReason: 'Price update',
      },
    });
  }

  // Update property
  const updated = await prisma.property.update({
    where: { id },
    data: {
      ...data,
      pricePerSqft: data.squareFeet && data.price 
        ? data.price / data.squareFeet 
        : undefined,
      updatedAt: new Date(),
    },
    include: {
      photos: true,
    },
  });

  // Clear caches
  await cacheDelete(`${CACHE_KEYS.PROPERTY}${id}`);
  await cacheDeletePattern(`${CACHE_KEYS.PROPERTY_LIST}*`);

  logger.info(`Property updated: ${id} by agent ${req.user!.agentId}`);

  res.json({
    success: true,
    data: updated,
  });
}));

/**
 * @swagger
 * /properties/{id}:
 *   delete:
 *     summary: Delete a property listing (Owner agent only)
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authenticate, requireAgent, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  // Check ownership
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

  // Delete property (cascades to related records)
  await prisma.property.delete({
    where: { id },
  });

  // Clear caches
  await cacheDelete(`${CACHE_KEYS.PROPERTY}${id}`);
  await cacheDeletePattern(`${CACHE_KEYS.PROPERTY_LIST}*`);

  logger.info(`Property deleted: ${id} by agent ${req.user!.agentId}`);

  res.json({
    success: true,
    message: 'Property deleted successfully',
  });
}));

/**
 * @swagger
 * /properties/{id}/photos:
 *   post:
 *     summary: Add photos to a property
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/photos', authenticate, requireAgent, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { photos } = req.body;

  // Check ownership
  const property = await prisma.property.findUnique({
    where: { id },
    select: { listingAgentId: true },
  });

  if (!property) {
    throw new NotFoundError('Property not found');
  }

  if (property.listingAgentId !== req.user!.agentId) {
    throw new ForbiddenError('You can only edit your own listings');
  }

  // Get current max order index
  const maxOrder = await prisma.propertyPhoto.findFirst({
    where: { propertyId: id },
    orderBy: { orderIndex: 'desc' },
    select: { orderIndex: true },
  });

  const startIndex = (maxOrder?.orderIndex || 0) + 1;

  // Create photos
  const created = await prisma.propertyPhoto.createMany({
    data: photos.map((photo: any, index: number) => ({
      propertyId: id,
      url: photo.url,
      thumbnailUrl: photo.thumbnailUrl,
      caption: photo.caption,
      roomType: photo.roomType,
      orderIndex: startIndex + index,
      isPrimary: false,
    })),
  });

  // Clear cache
  await cacheDelete(`${CACHE_KEYS.PROPERTY}${id}`);

  res.status(201).json({
    success: true,
    data: { count: created.count },
  });
}));

/**
 * @swagger
 * /properties/{id}/similar:
 *   get:
 *     summary: Get similar properties
 *     tags: [Properties]
 */
router.get('/:id/similar', optionalAuthenticate, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const limit = parseInt(req.query.limit as string) || 6;

  const property = await prisma.property.findUnique({
    where: { id },
    select: {
      city: true,
      state: true,
      price: true,
      bedrooms: true,
      propertyType: true,
      latitude: true,
      longitude: true,
    },
  });

  if (!property) {
    throw new NotFoundError('Property not found');
  }

  const priceRange = Number(property.price) * 0.2; // 20% price range

  const similar = await prisma.property.findMany({
    where: {
      id: { not: id },
      status: 'ACTIVE',
      propertyType: property.propertyType,
      city: property.city,
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
    orderBy: { price: 'asc' },
    select: {
      id: true,
      title: true,
      streetAddress: true,
      city: true,
      state: true,
      price: true,
      bedrooms: true,
      bathrooms: true,
      squareFeet: true,
      photos: {
        where: { isPrimary: true },
        take: 1,
        select: { url: true, thumbnailUrl: true },
      },
      vastuAnalysis: {
        select: { overallScore: true },
      },
    },
  });

  res.json({
    success: true,
    data: similar,
  });
}));

/**
 * @swagger
 * /properties/{id}/schedule-showing:
 *   post:
 *     summary: Schedule a property showing
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/schedule-showing', authenticate, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { scheduledAt, type, notes } = req.body;

  const property = await prisma.property.findUnique({
    where: { id },
    select: { 
      id: true, 
      listingAgentId: true,
      title: true,
      streetAddress: true,
    },
  });

  if (!property) {
    throw new NotFoundError('Property not found');
  }

  // Create or get lead
  let lead = await prisma.lead.findFirst({
    where: {
      propertyId: id,
      userId: req.user!.id,
    },
  });

  if (!lead) {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { firstName: true, lastName: true, email: true, phone: true },
    });

    lead = await prisma.lead.create({
      data: {
        propertyId: id,
        agentId: property.listingAgentId,
        userId: req.user!.id,
        name: `${user!.firstName} ${user!.lastName}`,
        email: user!.email,
        phone: user!.phone,
        status: 'SHOWING_SCHEDULED',
        source: 'INQUIRY',
      },
    });
  }

  // Create showing
  const showing = await prisma.showing.create({
    data: {
      leadId: lead.id,
      scheduledAt: new Date(scheduledAt),
      type: type || 'IN_PERSON',
      notes,
      status: 'SCHEDULED',
    },
  });

  // Update lead status
  await prisma.lead.update({
    where: { id: lead.id },
    data: { status: 'SHOWING_SCHEDULED' },
  });

  // TODO: Send notification to agent
  // TODO: Send confirmation email to user

  res.status(201).json({
    success: true,
    data: showing,
  });
}));

// Helper: Track property view
async function trackPropertyView(propertyId: string, userId?: string) {
  try {
    // Increment view count
    await prisma.property.update({
      where: { id: propertyId },
      data: { viewCount: { increment: 1 } },
    });

    // Record view
    await prisma.propertyView.create({
      data: {
        propertyId,
        userId,
      },
    });
  } catch (error) {
    logger.error('Error tracking property view:', error);
  }
}

// Helper: Calculate estimated monthly payment
function calculateEstimatedPayment(
  price: number,
  options: { propertyTax?: number; hoaFee?: number; downPaymentPercent?: number; interestRate?: number; loanTermYears?: number }
) {
  const {
    propertyTax = 0,
    hoaFee = 0,
    downPaymentPercent = 20,
    interestRate = 6.5,
    loanTermYears = 30,
  } = options;

  const downPayment = price * (downPaymentPercent / 100);
  const loanAmount = price - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTermYears * 12;

  // Principal & Interest
  const principalInterest = loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  // Monthly property tax
  const monthlyTax = propertyTax / 12;

  // Estimated insurance (0.35% of home value annually)
  const monthlyInsurance = (price * 0.0035) / 12;

  // HOA
  const monthlyHoa = hoaFee;

  return {
    principalInterest: Math.round(principalInterest),
    propertyTax: Math.round(monthlyTax),
    insurance: Math.round(monthlyInsurance),
    hoa: Math.round(monthlyHoa),
    total: Math.round(principalInterest + monthlyTax + monthlyInsurance + monthlyHoa),
  };
}

export default router;

