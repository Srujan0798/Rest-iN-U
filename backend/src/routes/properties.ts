// Property Routes
import { Router } from 'express';
import { z } from 'zod';
import {
  authenticate,
  optionalAuthenticate,
  requireAgent,
  AuthenticatedRequest
} from '../middleware/auth';
import {
  asyncHandler,
} from '../middleware/errorHandler';
import { propertyService } from '../services/property.service';

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
  const result = await propertyService.findAll(query);
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
  const result = await propertyService.findById(id, req.user?.id);
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
  const property = await propertyService.create(data, req.user!.agentId!);

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
  const updated = await propertyService.update(id, data, req.user!.agentId!);

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
  await propertyService.delete(id, req.user!.agentId!, req.user!.userType === 'ADMIN');

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

  const result = await propertyService.addPhotos(id, photos, req.user!.agentId!);

  res.status(201).json({
    success: true,
    data: { count: result.count },
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
  const similar = await propertyService.findSimilar(id, limit);

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
  const { scheduledAt, notes } = req.body;

  const result = await propertyService.scheduleShowing(id, req.user!.id, scheduledAt, notes);

  res.status(201).json({
    success: true,
    data: result,
  });
}));

export default router;
