import { PrismaClient, Prisma, Property, PropertyPhoto } from '@prisma/client';

export interface PropertyFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  city?: string;
  state?: string;
  zipCode?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  listingType?: string;
  status?: string;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minSquareFeet?: number;
  maxSquareFeet?: number;
  minYearBuilt?: number;
  maxYearBuilt?: number;
  features?: string; // Comma separated
  minVastuScore?: number;
  maxClimateRisk?: number;
  latitude?: number;
  longitude?: number;
  radiusMiles?: number;
}

export class PropertyRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(filters: PropertyFilters) {
    const {
      page = 1,
      limit = 24,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      ...rest
    } = filters;

    const where: Prisma.PropertyWhereInput = {
      status: (rest.status as any) || 'ACTIVE',
    };

    if (rest.city) where.city = { contains: rest.city, mode: 'insensitive' };
    if (rest.state) where.state = rest.state;
    if (rest.zipCode) where.zipCode = rest.zipCode;
    if (rest.propertyType) {
      where.propertyType = { in: rest.propertyType.split(',') as any };
    }
    if (rest.listingType) where.listingType = rest.listingType as any;

    if (rest.minPrice || rest.maxPrice) {
      where.price = {};
      if (rest.minPrice) where.price.gte = rest.minPrice;
      if (rest.maxPrice) where.price.lte = rest.maxPrice;
    }

    if (rest.minBedrooms || rest.maxBedrooms) {
      where.bedrooms = {};
      if (rest.minBedrooms) where.bedrooms.gte = rest.minBedrooms;
      if (rest.maxBedrooms) where.bedrooms.lte = rest.maxBedrooms;
    }

    if (rest.minBathrooms || rest.maxBathrooms) {
      where.bathrooms = {};
      if (rest.minBathrooms) where.bathrooms.gte = rest.minBathrooms;
      if (rest.maxBathrooms) where.bathrooms.lte = rest.maxBathrooms;
    }

    if (rest.minSquareFeet || rest.maxSquareFeet) {
      where.squareFeet = {};
      if (rest.minSquareFeet) where.squareFeet.gte = rest.minSquareFeet;
      if (rest.maxSquareFeet) where.squareFeet.lte = rest.maxSquareFeet;
    }

    if (rest.minYearBuilt || rest.maxYearBuilt) {
      where.yearBuilt = {};
      if (rest.minYearBuilt) where.yearBuilt.gte = rest.minYearBuilt;
      if (rest.maxYearBuilt) where.yearBuilt.lte = rest.maxYearBuilt;
    }

    if (rest.features) {
      where.features = { hasEvery: rest.features.split(',') };
    }

    if (rest.minVastuScore) {
      where.vastuAnalysis = {
        overallScore: { gte: rest.minVastuScore },
      };
    }

    if (rest.maxClimateRisk) {
      where.climateAnalysis = {
        overallRiskScore: { lte: rest.maxClimateRisk },
      };
    }

    // Geo search bounding box logic
    if (rest.latitude && rest.longitude && rest.radiusMiles) {
      const latDelta = rest.radiusMiles / 69;
      const lonDelta = rest.radiusMiles / (69 * Math.cos(rest.latitude * Math.PI / 180));

      where.latitude = {
        gte: rest.latitude - latDelta,
        lte: rest.latitude + latDelta,
      };
      where.longitude = {
        gte: rest.longitude - lonDelta,
        lte: rest.longitude + lonDelta,
      };
    }

    const [properties, total] = await Promise.all([
      this.prisma.property.findMany({
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
      this.prisma.property.count({ where }),
    ]);

    return { properties, total };
  }

  async findById(id: string) {
    return this.prisma.property.findUnique({
      where: { id },
      include: {
        photos: {
          orderBy: { orderIndex: 'asc' },
        },
        vastuAnalysis: true,
        climateAnalysis: true,
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
        favorites: {
          select: { id: true },
        },
        leads: {
          select: { id: true },
          take: 1,
        },
      },
    });
  }

  async findBasicById(id: string) {
    return this.prisma.property.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.PropertyCreateInput) {
    return this.prisma.property.create({
      data,
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
  }

  async update(id: string, data: Prisma.PropertyUpdateInput) {
    return this.prisma.property.update({
      where: { id },
      data,
      include: {
        photos: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.property.delete({
      where: { id },
    });
  }

  async createPhotos(photos: Prisma.PropertyPhotoCreateManyInput[]) {
    return this.prisma.propertyPhoto.createMany({
      data: photos,
    });
  }

  async getMaxPhotoOrderIndex(propertyId: string) {
    return this.prisma.propertyPhoto.findFirst({
      where: { propertyId },
      orderBy: { orderIndex: 'desc' },
      select: { orderIndex: true },
    });
  }

  async findSimilar(property: Property, limit: number) {
    const priceRange = Number(property.price) * 0.2;
    return this.prisma.property.findMany({
      where: {
        id: { not: property.id },
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
  }

  async incrementViewCount(id: string) {
    return this.prisma.property.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }

  async recordView(propertyId: string, userId?: string) {
    return this.prisma.propertyView.create({
      data: {
        propertyId,
        userId,
      },
    });
  }
}
