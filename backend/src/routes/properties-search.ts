// @B1-API: Property Search Endpoint for ESTATE Mode
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../utils/prisma";

const router = Router();

// Search query validation schema
const searchSchema = z.object({
  city: z.string().optional(),
  state: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  propertyType: z
    .enum([
      "HOUSE",
      "CONDO",
      "TOWNHOUSE",
      "APARTMENT",
      "LAND",
      "MULTI_FAMILY",
      "COMMERCIAL",
      "VILLA",
      "PENTHOUSE",
      "FARMHOUSE",
      "ASHRAM",
      "PLOT",
    ])
    .optional(),
  listingType: z.enum(["SALE", "RENT", "LEASE", "AUCTION"]).optional(),
  minBedrooms: z.coerce.number().optional(),
  maxBedrooms: z.coerce.number().optional(),
  minBathrooms: z.coerce.number().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
});

// GET /api/properties - Search properties
router.get("/properties", async (req, res) => {
  try {
    const query = searchSchema.parse(req.query);

    // Build where clause
    const where: any = {
      status: "ACTIVE",
    };

    if (query.city) {
      where.city = { contains: query.city, mode: "insensitive" };
    }

    if (query.state) {
      where.state = { contains: query.state, mode: "insensitive" };
    }

    if (query.minPrice || query.maxPrice) {
      where.price = {};
      if (query.minPrice) where.price.gte = query.minPrice;
      if (query.maxPrice) where.price.lte = query.maxPrice;
    }

    if (query.propertyType) {
      where.propertyType = query.propertyType;
    }

    if (query.listingType) {
      where.listingType = query.listingType;
    }

    if (query.minBedrooms || query.maxBedrooms) {
      where.bedrooms = {};
      if (query.minBedrooms) where.bedrooms.gte = query.minBedrooms;
      if (query.maxBedrooms) where.bedrooms.lte = query.maxBedrooms;
    }

    if (query.minBathrooms) {
      where.bathrooms = { gte: query.minBathrooms };
    }

    // Pagination
    const skip = (query.page - 1) * query.limit;

    // Fetch properties with relations
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
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
        },
        skip,
        take: query.limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.property.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        properties,
        pagination: {
          page: query.page,
          limit: query.limit,
          total,
          totalPages: Math.ceil(total / query.limit),
        },
      },
    });
  } catch (error) {
    console.error("Property search error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid query parameters",
        },
      });
    }
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Search failed",
      },
    });
  }
});

// GET /api/properties/:id - Get single property
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        photos: true,
        vastuAnalysis: true,
      },
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Property not found",
        },
      });
    }

    res.json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error("Property fetch error:", error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to fetch property",
      },
    });
  }
});

export default router;
