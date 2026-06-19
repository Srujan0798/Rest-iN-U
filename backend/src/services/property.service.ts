import { PropertyRepository, PropertyFilters } from '../repositories/property.repository';
import { prisma } from '../utils/prisma';
import {
  cacheGet,
  cacheSet,
  cacheDelete,
  cacheDeletePattern,
  CACHE_KEYS,
  CACHE_TTL
} from '../utils/redis';
import { emailService } from './email.service';
import { logger } from '../utils/logger';
import { Prisma, Property, PropertyStatus } from '@prisma/client';
import { NotFoundError, ForbiddenError, BadRequestError } from '../middleware/errorHandler';

export class PropertyService {
  constructor(private repository: PropertyRepository) {}

  async findAll(query: PropertyFilters) {
    // Build cache key from query
    // Since objects can be unordered, sorting keys helps but isn't foolproof.
    // Given the query is simple, JSON.stringify works well enough for now.
    const cacheKey = `${CACHE_KEYS.PROPERTY_LIST}${JSON.stringify(query)}`;

    // Try cache
    const cached = await cacheGet(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await this.repository.findAll(query);

    const response = {
      properties: result.properties,
      pagination: {
        page: query.page || 1,
        limit: query.limit || 24,
        total: result.total,
        totalPages: Math.ceil(result.total / (query.limit || 24)),
      },
    };

    // Cache result
    await cacheSet(cacheKey, response, CACHE_TTL.SHORT);

    return response;
  }

  async findById(id: string, userId?: string) {
    const cacheKey = `${CACHE_KEYS.PROPERTY}${id}`;

    // Try cache
    let result = await cacheGet<any>(cacheKey);

    if (!result) {
      const property = await this.repository.findById(id);

      if (!property) {
        throw new NotFoundError('Property not found');
      }

      // Calculate estimated monthly payment
      const estimatedPayment = this.calculateEstimatedPayment(Number(property.price), {
        propertyTax: Number(property.propertyTax) || 0,
        hoaFee: Number(property.hoaFee) || 0,
      });

      result = {
        ...property,
        estimatedPayment,
      };

      // Cache result
      await cacheSet(cacheKey, result, CACHE_TTL.MEDIUM);
    }

    // Get favorites count for this user
    let isFavorited = false;
    if (userId) {
      const favorite = await prisma.favorite.findUnique({
        where: {
          userId_propertyId: {
            userId: userId,
            propertyId: id,
          },
        },
      });
      isFavorited = !!favorite;
    }

    // Track view asynchronously
    this.trackPropertyView(id, userId);

    return {
      ...result,
      isFavorited,
    };
  }

  async create(data: any, agentId: string) {
    // Calculate price per sqft
    const pricePerSqft = data.squareFeet
      ? data.price / data.squareFeet
      : null;

    // Create property
    // Adapting data structure to match what repository expects/prisma needs
    const propertyCreateData: Prisma.PropertyCreateInput = {
      ...data,
      pricePerSqft,
      originalPrice: data.price,
      // Connect listing agent
      listingAgent: { connect: { id: agentId } },
      // Handle photos nested create
      photos: data.photos ? {
        create: data.photos.map((photo: any, index: number) => ({
          ...photo,
          orderIndex: photo.orderIndex ?? index,
          isPrimary: photo.isPrimary ?? index === 0,
        })),
      } : undefined,
      constructionDate: data.constructionDate ? new Date(data.constructionDate) : undefined,
    };

    const property = await this.repository.create(propertyCreateData);

    // Clear list caches
    await cacheDeletePattern(`${CACHE_KEYS.PROPERTY_LIST}*`);

    logger.info(`Property created: ${property.id} by agent ${agentId}`);

    return property;
  }

  async update(id: string, data: any, agentId: string) {
    // Check ownership
    const property = await this.repository.findBasicById(id);

    if (!property) {
      throw new NotFoundError('Property not found');
    }

    if (property.listingAgentId !== agentId) {
      throw new ForbiddenError('You can only edit your own listings');
    }

    // Remove photos from data as it needs specific handling if updated here,
    // but the route usually handles photos separately or just basic fields here.
    // The route code: const { photos: _photos, ...updateData } = data as any;
    const { photos: _photos, ...updateData } = data;

    const updateInput: Prisma.PropertyUpdateInput = {
      ...updateData,
      pricePerSqft: data.squareFeet && data.price
        ? data.price / data.squareFeet
        : undefined,
      updatedAt: new Date(),
    };

    const updated = await this.repository.update(id, updateInput);

    // Clear caches
    await cacheDelete(`${CACHE_KEYS.PROPERTY}${id}`);
    await cacheDeletePattern(`${CACHE_KEYS.PROPERTY_LIST}*`);

    logger.info(`Property updated: ${id} by agent ${agentId}`);

    return updated;
  }

  async delete(id: string, agentId: string, isAdmin: boolean = false) {
    // Check ownership
    const property = await this.repository.findBasicById(id);

    if (!property) {
      throw new NotFoundError('Property not found');
    }

    if (property.listingAgentId !== agentId && !isAdmin) {
      throw new ForbiddenError('You can only delete your own listings');
    }

    await this.repository.delete(id);

    // Clear caches
    await cacheDelete(`${CACHE_KEYS.PROPERTY}${id}`);
    await cacheDeletePattern(`${CACHE_KEYS.PROPERTY_LIST}*`);

    logger.info(`Property deleted: ${id} by agent ${agentId}`);
  }

  async addPhotos(id: string, photos: any[], agentId: string) {
    // Check ownership
    const property = await this.repository.findBasicById(id);

    if (!property) {
      throw new NotFoundError('Property not found');
    }

    if (property.listingAgentId !== agentId) {
      throw new ForbiddenError('You can only edit your own listings');
    }

    // Get current max order index
    const maxOrder = await this.repository.getMaxPhotoOrderIndex(id);
    const startIndex = (maxOrder?.orderIndex || 0) + 1;

    // Create photos
    const photoData = photos.map((photo: any, index: number) => ({
      propertyId: id,
      url: photo.url,
      thumbnailUrl: photo.thumbnailUrl,
      caption: photo.caption,
      roomType: photo.roomType,
      orderIndex: startIndex + index,
      isPrimary: false,
    }));

    const created = await this.repository.createPhotos(photoData);

    // Clear cache
    await cacheDelete(`${CACHE_KEYS.PROPERTY}${id}`);

    return created;
  }

  async findSimilar(id: string, limit: number) {
    const property = await this.repository.findBasicById(id);

    if (!property) {
      throw new NotFoundError('Property not found');
    }

    return this.repository.findSimilar(property, limit);
  }

  async scheduleShowing(id: string, userId: string, scheduledAt: string, notes?: string) {
    if (!scheduledAt) {
      throw new BadRequestError('scheduledAt is required');
    }

    const property = await this.repository.findBasicById(id);

    if (!property) {
      throw new NotFoundError('Property not found');
    }

    if (!property.listingAgentId) {
      throw new BadRequestError('Property has no listing agent');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { firstName: true, lastName: true, email: true, phone: true },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const scheduledDate = new Date(scheduledAt);

    // Create or update lead with showing request
    // This logic is specific to Leads, so keeping it here using prisma is okay
    // or ideally should be in LeadRepository/Service.
    const lead = await prisma.lead.upsert({
      where: {
        // Use a composite check - find existing lead for this user/property
        // Ideally schema has composite unique key, but here we do logic
        id: (await prisma.lead.findFirst({
          where: {
            propertyId: id,
            userId: userId,
          },
          select: { id: true },
        }))?.id || '',
      },
      update: {
        status: 'SHOWING_SCHEDULED',
        message: `Showing requested for ${scheduledDate.toLocaleDateString()} at ${scheduledDate.toLocaleTimeString()}. ${notes || ''}`.trim(),
      },
      create: {
        propertyId: id,
        agentId: property.listingAgentId,
        userId: userId,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
        status: 'SHOWING_SCHEDULED',
        message: `Showing requested for ${scheduledDate.toLocaleDateString()} at ${scheduledDate.toLocaleTimeString()}. ${notes || ''}`.trim(),
        source: 'WEBSITE',
      },
    });

    // Get agent info for email
    const agentUser = await prisma.agent.findUnique({
      where: { id: property.listingAgentId },
      select: {
        user: {
          select: { email: true, firstName: true },
        },
      },
    });

    // Send notification emails (fire and forget)
    if (agentUser?.user) {
      emailService.sendShowingRequest(
        { email: agentUser.user.email, firstName: agentUser.user.firstName },
        {
          buyerName: `${user.firstName} ${user.lastName}`,
          propertyAddress: property.streetAddress,
          requestedDate: scheduledDate.toLocaleDateString(),
          requestedTime: scheduledDate.toLocaleTimeString(),
        }
      ).catch(err => logger.error('Failed to send showing request email:', err));
    }

    emailService.sendShowingConfirmation(
      { email: user.email, firstName: user.firstName },
      {
        propertyAddress: property.streetAddress,
        scheduledDate: scheduledDate.toLocaleDateString(),
        scheduledTime: scheduledDate.toLocaleTimeString(),
      }
    ).catch(err => logger.error('Failed to send showing confirmation email:', err));

    return {
      leadId: lead.id,
      propertyId: id,
      scheduledAt: scheduledDate.toISOString(),
      status: 'SHOWING_SCHEDULED',
    };
  }

  // Helper: Track property view
  private async trackPropertyView(propertyId: string, userId?: string) {
    try {
      await this.repository.incrementViewCount(propertyId);
      await this.repository.recordView(propertyId, userId);
    } catch (error) {
      logger.error('Error tracking property view:', error);
    }
  }

  // Helper: Calculate estimated monthly payment
  private calculateEstimatedPayment(
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

  // Keep existing methods if relevant or needed for other parts of the app
  async getBrowsingHistory(userId: string) {
     return prisma.propertyView.findMany({
        where: { userId },
        orderBy: { viewedAt: 'desc' },
        take: 50,
        include: { property: true }
    });
  }

  async getUserFavorites(userId: string, propertyIds: string[]): Promise<Record<string, boolean>> {
      const favorites = await prisma.favorite.findMany({
          where: {
              userId,
              propertyId: { in: propertyIds }
          }
      });

      const result: Record<string, boolean> = {};
      favorites.forEach(fav => result[fav.propertyId] = true);
      return result;
  }
}

export const propertyService = new PropertyService(new PropertyRepository(prisma));
