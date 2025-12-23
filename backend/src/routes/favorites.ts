import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { redis, cacheKeys, cacheTTL } from '../utils/redis';
import { authenticate } from '../middleware/auth';
import { asyncHandler, BadRequestError, NotFoundError, ForbiddenError } from '../middleware/errorHandler';

const router = Router();

// ============================================================================
// SCHEMAS
// ============================================================================

const createSavedSearchSchema = z.object({
  name: z.string().min(1).max(100),
  filters: z.record(z.any()),
  alertFrequency: z.enum(['INSTANT', 'DAILY', 'WEEKLY', 'NEVER']).default('DAILY'),
});

const updateSavedSearchSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  filters: z.record(z.any()).optional(),
  alertFrequency: z.enum(['INSTANT', 'DAILY', 'WEEKLY', 'NEVER']).optional(),
  isActive: z.boolean().optional(),
});

const addFavoriteSchema = z.object({
  propertyId: z.string().uuid(),
  notes: z.string().max(500).optional(),
});

const updateFavoriteSchema = z.object({
  notes: z.string().max(500).optional(),
});

const comparisonGroupSchema = z.object({
  propertyIds: z.array(z.string().uuid()).min(2).max(10),
  name: z.string().min(1).max(100).optional(),
});

// ============================================================================
// SAVED SEARCHES
// ============================================================================

// Get all saved searches for user
router.get('/saved-searches', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  
  const savedSearches = await prisma.savedSearch.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      filters: true,
      alertFrequency: true,
      isActive: true,
      lastAlertAt: true,
      matchCount: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  
  res.json({
    success: true,
    data: { savedSearches },
  });
}));

// Create saved search
router.post('/saved-searches', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const validated = createSavedSearchSchema.parse(req.body);
  
  // Check limit (max 20 saved searches per user)
  const existingCount = await prisma.savedSearch.count({ where: { userId } });
  if (existingCount >= 20) {
    throw new BadRequestError('Maximum of 20 saved searches allowed. Please delete some existing searches.');
  }
  
  // Get initial match count
  const matchCount = await countMatchingProperties(validated.filters);
  
  const savedSearch = await prisma.savedSearch.create({
    data: {
      userId,
      name: validated.name,
      filters: validated.filters,
      alertFrequency: validated.alertFrequency,
      matchCount,
      isActive: true,
    },
  });
  
  res.status(201).json({
    success: true,
    data: { savedSearch },
    message: `Saved search created. Found ${matchCount} matching properties.`,
  });
}));

// Get saved search by ID
router.get('/saved-searches/:id', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  
  const savedSearch = await prisma.savedSearch.findUnique({
    where: { id },
  });
  
  if (!savedSearch) {
    throw new NotFoundError('Saved search not found');
  }
  
  if (savedSearch.userId !== userId) {
    throw new ForbiddenError('Not authorized to access this saved search');
  }
  
  res.json({
    success: true,
    data: { savedSearch },
  });
}));

// Update saved search
router.put('/saved-searches/:id', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  const validated = updateSavedSearchSchema.parse(req.body);
  
  const savedSearch = await prisma.savedSearch.findUnique({
    where: { id },
  });
  
  if (!savedSearch) {
    throw new NotFoundError('Saved search not found');
  }
  
  if (savedSearch.userId !== userId) {
    throw new ForbiddenError('Not authorized to update this saved search');
  }
  
  // Recalculate match count if filters changed
  let matchCount = savedSearch.matchCount;
  if (validated.filters) {
    matchCount = await countMatchingProperties(validated.filters);
  }
  
  const updated = await prisma.savedSearch.update({
    where: { id },
    data: {
      ...validated,
      matchCount,
    },
  });
  
  res.json({
    success: true,
    data: { savedSearch: updated },
  });
}));

// Delete saved search
router.delete('/saved-searches/:id', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  
  const savedSearch = await prisma.savedSearch.findUnique({
    where: { id },
  });
  
  if (!savedSearch) {
    throw new NotFoundError('Saved search not found');
  }
  
  if (savedSearch.userId !== userId) {
    throw new ForbiddenError('Not authorized to delete this saved search');
  }
  
  await prisma.savedSearch.delete({ where: { id } });
  
  res.json({
    success: true,
    message: 'Saved search deleted successfully',
  });
}));

// Get matching properties for saved search
router.get('/saved-searches/:id/matches', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const newOnly = req.query.newOnly === 'true';
  
  const savedSearch = await prisma.savedSearch.findUnique({
    where: { id },
  });
  
  if (!savedSearch) {
    throw new NotFoundError('Saved search not found');
  }
  
  if (savedSearch.userId !== userId) {
    throw new ForbiddenError('Not authorized to access this saved search');
  }
  
  const filters = savedSearch.filters as Record<string, any>;
  const where = buildWhereClause(filters);
  
  // If newOnly, filter by properties created after last alert
  if (newOnly && savedSearch.lastAlertAt) {
    where.createdAt = { gt: savedSearch.lastAlertAt };
  }
  
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
      },
    }),
    prisma.property.count({ where }),
  ]);
  
  // Update match count
  await prisma.savedSearch.update({
    where: { id },
    data: { matchCount: total },
  });
  
  res.json({
    success: true,
    data: {
      properties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      newMatches: newOnly ? properties.length : undefined,
    },
  });
}));

// ============================================================================
// FAVORITES
// ============================================================================

// Get all favorites for user
router.get('/favorites', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const sortBy = (req.query.sortBy as string) || 'createdAt';
  const sortOrder = (req.query.sortOrder as string) === 'asc' ? 'asc' : 'desc';
  
  const orderBy: any = {};
  if (sortBy === 'price' || sortBy === 'bedrooms' || sortBy === 'squareFeet') {
    orderBy.property = { [sortBy]: sortOrder };
  } else {
    orderBy[sortBy] = sortOrder;
  }
  
  const [favorites, total] = await Promise.all([
    prisma.favorite.findMany({
      where: { userId },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        property: {
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
        },
      },
    }),
    prisma.favorite.count({ where: { userId } }),
  ]);
  
  res.json({
    success: true,
    data: {
      favorites,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
}));

// Add to favorites
router.post('/favorites', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const validated = addFavoriteSchema.parse(req.body);
  
  // Check if property exists
  const property = await prisma.property.findUnique({
    where: { id: validated.propertyId },
  });
  
  if (!property) {
    throw new NotFoundError('Property not found');
  }
  
  // Check if already favorited
  const existing = await prisma.favorite.findUnique({
    where: {
      userId_propertyId: {
        userId,
        propertyId: validated.propertyId,
      },
    },
  });
  
  if (existing) {
    throw new BadRequestError('Property already in favorites');
  }
  
  // Check limit (max 100 favorites per user)
  const favoriteCount = await prisma.favorite.count({ where: { userId } });
  if (favoriteCount >= 100) {
    throw new BadRequestError('Maximum of 100 favorites allowed. Please remove some existing favorites.');
  }
  
  const favorite = await prisma.favorite.create({
    data: {
      userId,
      propertyId: validated.propertyId,
      notes: validated.notes,
    },
    include: {
      property: {
        include: {
          photos: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      },
    },
  });
  
  res.status(201).json({
    success: true,
    data: { favorite },
    message: 'Property added to favorites',
  });
}));

// Update favorite (notes)
router.put('/favorites/:propertyId', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { propertyId } = req.params;
  const validated = updateFavoriteSchema.parse(req.body);
  
  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_propertyId: {
        userId,
        propertyId,
      },
    },
  });
  
  if (!favorite) {
    throw new NotFoundError('Favorite not found');
  }
  
  const updated = await prisma.favorite.update({
    where: {
      userId_propertyId: {
        userId,
        propertyId,
      },
    },
    data: { notes: validated.notes },
    include: {
      property: {
        include: {
          photos: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      },
    },
  });
  
  res.json({
    success: true,
    data: { favorite: updated },
  });
}));

// Remove from favorites
router.delete('/favorites/:propertyId', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { propertyId } = req.params;
  
  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_propertyId: {
        userId,
        propertyId,
      },
    },
  });
  
  if (!favorite) {
    throw new NotFoundError('Property not in favorites');
  }
  
  await prisma.favorite.delete({
    where: {
      userId_propertyId: {
        userId,
        propertyId,
      },
    },
  });
  
  res.json({
    success: true,
    message: 'Property removed from favorites',
  });
}));

// Check if property is favorited
router.get('/favorites/check/:propertyId', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { propertyId } = req.params;
  
  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_propertyId: {
        userId,
        propertyId,
      },
    },
    select: {
      id: true,
      notes: true,
      createdAt: true,
    },
  });
  
  res.json({
    success: true,
    data: {
      isFavorited: !!favorite,
      favorite,
    },
  });
}));

// ============================================================================
// PROPERTY COMPARISON
// ============================================================================

// Create comparison group
router.post('/comparisons', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const validated = comparisonGroupSchema.parse(req.body);
  
  // Verify all properties exist and get their details
  const properties = await prisma.property.findMany({
    where: { id: { in: validated.propertyIds } },
    include: {
      photos: {
        where: { isPrimary: true },
        take: 1,
      },
      vastuAnalysis: true,
      fengShuiAnalysis: true,
      climateAnalysis: true,
      environmentalData: true,
      energyAnalysis: true,
      neighborhood: true,
    },
  });
  
  if (properties.length !== validated.propertyIds.length) {
    throw new BadRequestError('One or more properties not found');
  }
  
  // Generate unique group ID
  const groupId = `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Create comparison records
  await prisma.propertyComparison.createMany({
    data: validated.propertyIds.map(propertyId => ({
      userId,
      propertyId,
      groupId,
    })),
  });
  
  // Build comparison data
  const comparison = buildComparisonData(properties);
  
  res.status(201).json({
    success: true,
    data: {
      groupId,
      name: validated.name || `Comparison ${new Date().toLocaleDateString()}`,
      properties,
      comparison,
    },
  });
}));

// Get comparison groups
router.get('/comparisons', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  
  const comparisons = await prisma.propertyComparison.findMany({
    where: { userId },
    include: {
      property: {
        include: {
          photos: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  
  // Group by groupId
  const grouped = comparisons.reduce((acc, comp) => {
    if (!acc[comp.groupId]) {
      acc[comp.groupId] = {
        groupId: comp.groupId,
        createdAt: comp.createdAt,
        properties: [],
      };
    }
    acc[comp.groupId].properties.push(comp.property);
    return acc;
  }, {} as Record<string, any>);
  
  res.json({
    success: true,
    data: { comparisons: Object.values(grouped) },
  });
}));

// Get specific comparison
router.get('/comparisons/:groupId', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { groupId } = req.params;
  
  const comparisons = await prisma.propertyComparison.findMany({
    where: { userId, groupId },
    include: {
      property: {
        include: {
          photos: true,
          vastuAnalysis: true,
          fengShuiAnalysis: true,
          climateAnalysis: true,
          environmentalData: true,
          energyAnalysis: true,
          neighborhood: true,
          priceHistory: {
            orderBy: { changeDate: 'desc' },
            take: 5,
          },
        },
      },
    },
  });
  
  if (comparisons.length === 0) {
    throw new NotFoundError('Comparison not found');
  }
  
  const properties = comparisons.map(c => c.property);
  const comparison = buildComparisonData(properties);
  
  res.json({
    success: true,
    data: {
      groupId,
      properties,
      comparison,
    },
  });
}));

// Delete comparison group
router.delete('/comparisons/:groupId', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { groupId } = req.params;
  
  const deleted = await prisma.propertyComparison.deleteMany({
    where: { userId, groupId },
  });
  
  if (deleted.count === 0) {
    throw new NotFoundError('Comparison not found');
  }
  
  res.json({
    success: true,
    message: 'Comparison deleted successfully',
  });
}));

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function countMatchingProperties(filters: Record<string, any>): Promise<number> {
  const where = buildWhereClause(filters);
  return prisma.property.count({ where });
}

function buildWhereClause(filters: Record<string, any>): any {
  const where: any = {
    status: filters.status || 'ACTIVE',
  };
  
  if (filters.propertyType?.length > 0) {
    where.propertyType = { in: filters.propertyType };
  }
  
  if (filters.listingType) {
    where.listingType = filters.listingType;
  }
  
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
  }
  
  if (filters.minBedrooms !== undefined || filters.maxBedrooms !== undefined) {
    where.bedrooms = {};
    if (filters.minBedrooms !== undefined) where.bedrooms.gte = filters.minBedrooms;
    if (filters.maxBedrooms !== undefined) where.bedrooms.lte = filters.maxBedrooms;
  }
  
  if (filters.minBathrooms !== undefined) {
    where.bathrooms = { gte: filters.minBathrooms };
  }
  
  if (filters.minSquareFeet !== undefined || filters.maxSquareFeet !== undefined) {
    where.squareFeet = {};
    if (filters.minSquareFeet !== undefined) where.squareFeet.gte = filters.minSquareFeet;
    if (filters.maxSquareFeet !== undefined) where.squareFeet.lte = filters.maxSquareFeet;
  }
  
  if (filters.location?.city) {
    where.city = { contains: filters.location.city, mode: 'insensitive' };
  }
  
  if (filters.location?.state) {
    where.state = { contains: filters.location.state, mode: 'insensitive' };
  }
  
  if (filters.features?.length > 0) {
    where.features = { hasSome: filters.features };
  }
  
  if (filters.minVastuScore !== undefined) {
    where.vastuAnalysis = { overallScore: { gte: filters.minVastuScore } };
  }
  
  if (filters.maxClimateRiskScore !== undefined) {
    where.climateAnalysis = { overallRiskScore: { lte: filters.maxClimateRiskScore } };
  }
  
  return where;
}

function buildComparisonData(properties: any[]): any {
  const comparison: any = {
    categories: [],
    winner: null,
    scores: {},
  };
  
  // Basic info comparison
  comparison.categories.push({
    name: 'Basic Info',
    metrics: [
      {
        name: 'Price',
        values: properties.map(p => p.price),
        winner: properties.reduce((min, p) => p.price < min.price ? p : min, properties[0]).id,
        format: 'currency',
      },
      {
        name: 'Price/SqFt',
        values: properties.map(p => p.pricePerSqft),
        winner: properties.reduce((min, p) => (p.pricePerSqft || Infinity) < (min.pricePerSqft || Infinity) ? p : min, properties[0]).id,
        format: 'currency',
      },
      {
        name: 'Square Feet',
        values: properties.map(p => p.squareFeet),
        winner: properties.reduce((max, p) => (p.squareFeet || 0) > (max.squareFeet || 0) ? p : max, properties[0]).id,
        format: 'number',
      },
      {
        name: 'Bedrooms',
        values: properties.map(p => p.bedrooms),
        format: 'number',
      },
      {
        name: 'Bathrooms',
        values: properties.map(p => p.bathrooms),
        format: 'number',
      },
      {
        name: 'Year Built',
        values: properties.map(p => p.yearBuilt),
        winner: properties.reduce((max, p) => (p.yearBuilt || 0) > (max.yearBuilt || 0) ? p : max, properties[0]).id,
        format: 'year',
      },
    ],
  });
  
  // Vastu comparison
  if (properties.some(p => p.vastuAnalysis)) {
    comparison.categories.push({
      name: 'Vastu Shastra',
      metrics: [
        {
          name: 'Overall Score',
          values: properties.map(p => p.vastuAnalysis?.overallScore || null),
          winner: properties.reduce((max, p) => (p.vastuAnalysis?.overallScore || 0) > (max.vastuAnalysis?.overallScore || 0) ? p : max, properties[0]).id,
          format: 'score',
        },
        {
          name: 'Grade',
          values: properties.map(p => p.vastuAnalysis?.grade || 'N/A'),
          format: 'grade',
        },
        {
          name: 'Entrance Direction',
          values: properties.map(p => p.vastuAnalysis?.entranceDirection || 'N/A'),
          format: 'text',
        },
      ],
    });
  }
  
  // Climate comparison
  if (properties.some(p => p.climateAnalysis)) {
    comparison.categories.push({
      name: 'Climate Risk',
      metrics: [
        {
          name: 'Overall Risk',
          values: properties.map(p => p.climateAnalysis?.overallRiskScore || null),
          winner: properties.reduce((min, p) => (p.climateAnalysis?.overallRiskScore || 100) < (min.climateAnalysis?.overallRiskScore || 100) ? p : min, properties[0]).id,
          format: 'risk',
          lowerIsBetter: true,
        },
        {
          name: 'Risk Grade',
          values: properties.map(p => p.climateAnalysis?.riskGrade || 'N/A'),
          format: 'grade',
        },
        {
          name: 'Flood Risk 2030',
          values: properties.map(p => p.climateAnalysis?.floodRisk2030 || null),
          format: 'percent',
          lowerIsBetter: true,
        },
        {
          name: 'Wildfire Risk',
          values: properties.map(p => p.climateAnalysis?.wildfireRisk || null),
          format: 'percent',
          lowerIsBetter: true,
        },
      ],
    });
  }
  
  // Environmental comparison
  if (properties.some(p => p.environmentalData)) {
    comparison.categories.push({
      name: 'Environment',
      metrics: [
        {
          name: 'Air Quality (AQI)',
          values: properties.map(p => p.environmentalData?.aqiCurrent || null),
          winner: properties.reduce((min, p) => (p.environmentalData?.aqiCurrent || 500) < (min.environmentalData?.aqiCurrent || 500) ? p : min, properties[0]).id,
          format: 'number',
          lowerIsBetter: true,
        },
        {
          name: 'Noise Level (dB)',
          values: properties.map(p => p.environmentalData?.avgNoiseDecibels || null),
          format: 'number',
          lowerIsBetter: true,
        },
        {
          name: 'EMF Level',
          values: properties.map(p => p.environmentalData?.emfLevel || null),
          format: 'number',
          lowerIsBetter: true,
        },
      ],
    });
  }
  
  // Neighborhood comparison
  if (properties.some(p => p.neighborhood)) {
    comparison.categories.push({
      name: 'Neighborhood',
      metrics: [
        {
          name: 'Walk Score',
          values: properties.map(p => p.neighborhood?.walkabilityScore || null),
          winner: properties.reduce((max, p) => (p.neighborhood?.walkabilityScore || 0) > (max.neighborhood?.walkabilityScore || 0) ? p : max, properties[0]).id,
          format: 'score',
        },
        {
          name: 'Transit Score',
          values: properties.map(p => p.neighborhood?.transitScore || null),
          format: 'score',
        },
        {
          name: 'School Rating',
          values: properties.map(p => p.neighborhood?.schoolRating || null),
          format: 'rating',
        },
        {
          name: 'Crime Index',
          values: properties.map(p => p.neighborhood?.crimeIndex || null),
          format: 'number',
          lowerIsBetter: true,
        },
      ],
    });
  }
  
  // Energy comparison
  if (properties.some(p => p.energyAnalysis)) {
    comparison.categories.push({
      name: 'Energy',
      metrics: [
        {
          name: 'Efficiency Score',
          values: properties.map(p => p.energyAnalysis?.energyEfficiencyScore || null),
          winner: properties.reduce((max, p) => (p.energyAnalysis?.energyEfficiencyScore || 0) > (max.energyAnalysis?.energyEfficiencyScore || 0) ? p : max, properties[0]).id,
          format: 'score',
        },
        {
          name: 'Annual Electricity (kWh)',
          values: properties.map(p => p.energyAnalysis?.annualElectricityKwh || null),
          format: 'number',
          lowerIsBetter: true,
        },
        {
          name: 'Solar Potential (kWh)',
          values: properties.map(p => p.energyAnalysis?.solarPotentialKwh || null),
          format: 'number',
        },
        {
          name: 'Carbon Footprint (tons)',
          values: properties.map(p => p.energyAnalysis?.carbonFootprintTons || null),
          format: 'number',
          lowerIsBetter: true,
        },
      ],
    });
  }
  
  // Calculate overall winner based on weighted scoring
  const scores: Record<string, number> = {};
  properties.forEach(p => {
    scores[p.id] = 0;
    
    // Price efficiency (30% weight)
    const avgPrice = properties.reduce((sum, prop) => sum + prop.price, 0) / properties.length;
    scores[p.id] += (1 - p.price / avgPrice) * 30;
    
    // Vastu score (25% weight)
    if (p.vastuAnalysis?.overallScore) {
      scores[p.id] += (p.vastuAnalysis.overallScore / 100) * 25;
    }
    
    // Climate safety (20% weight)
    if (p.climateAnalysis?.overallRiskScore !== undefined) {
      scores[p.id] += (1 - p.climateAnalysis.overallRiskScore / 100) * 20;
    }
    
    // Size value (15% weight)
    const avgSqft = properties.reduce((sum, prop) => sum + (prop.squareFeet || 0), 0) / properties.length;
    if (p.squareFeet) {
      scores[p.id] += (p.squareFeet / avgSqft) * 15;
    }
    
    // Neighborhood (10% weight)
    if (p.neighborhood?.walkabilityScore) {
      scores[p.id] += (p.neighborhood.walkabilityScore / 100) * 10;
    }
  });
  
  comparison.scores = scores;
  comparison.winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  
  return comparison;
}

export default router;

