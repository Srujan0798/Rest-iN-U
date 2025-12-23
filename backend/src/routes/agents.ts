// Agent Management Routes
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { cacheGet, cacheSet, CACHE_KEYS, CACHE_TTL } from '../utils/redis';
import { authenticate, requireAgent, AuthenticatedRequest } from '../middleware/auth';
import { asyncHandler, NotFoundError, ForbiddenError } from '../middleware/errorHandler';

const router = Router();

/**
 * @swagger
 * /agents:
 *   get:
 *     summary: Search for agents
 *     tags: [Agents]
 */
router.get('/', asyncHandler(async (req: Request, res: Response) => {
    const { city, specialty, language, rating, page = '1', limit = '20' } = req.query;

    const where: any = { verified: true };

    if (city) where.serviceAreas = { has: city as string };
    if (specialty) where.specialties = { has: specialty as string };
    if (language) where.languages = { has: language as string };
    if (rating) where.rating = { gte: Number(rating) };

    const skip = (Number(page) - 1) * Number(limit);

    const [agents, total] = await Promise.all([
        prisma.agent.findMany({
            where,
            skip,
            take: Number(limit),
            orderBy: [{ rating: 'desc' }, { reviewCount: 'desc' }],
            include: {
                user: {
                    select: { firstName: true, lastName: true, profilePhotoUrl: true },
                },
                _count: { select: { properties: true } },
            },
        }),
        prisma.agent.count({ where }),
    ]);

    res.json({
        success: true,
        data: {
            agents: agents.map(a => ({
                id: a.id,
                name: `${a.user.firstName} ${a.user.lastName}`,
                photo: a.user.profilePhotoUrl,
                brokerage: a.brokerage,
                rating: a.rating,
                reviewCount: a.reviewCount,
                yearsExperience: a.yearsExperience,
                specialties: a.specialties,
                serviceAreas: a.serviceAreas,
                languages: a.languages,
                ethicsScore: a.ethicsScore,
                activeListings: a._count.properties,
                subscriptionTier: a.subscriptionTier,
            })),
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        },
    });
}));

/**
 * @swagger
 * /agents/{id}:
 *   get:
 *     summary: Get agent profile
 *     tags: [Agents]
 */
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const cacheKey = `${CACHE_KEYS.AGENT}${id}`;
    let agent = await cacheGet(cacheKey);

    if (!agent) {
        agent = await prisma.agent.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        profilePhotoUrl: true,
                        email: true,
                        phone: true,
                    },
                },
                properties: {
                    where: { status: 'ACTIVE' },
                    take: 6,
                    orderBy: { listedDate: 'desc' },
                    select: {
                        id: true,
                        title: true,
                        city: true,
                        state: true,
                        price: true,
                        photos: { where: { isPrimary: true }, take: 1 },
                    },
                },
                reviews: {
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        reviewer: {
                            select: { firstName: true, lastName: true, profilePhotoUrl: true },
                        },
                    },
                },
                availability: true,
            },
        });

        if (agent) {
            await cacheSet(cacheKey, agent, CACHE_TTL.MEDIUM);
        }
    }

    if (!agent) {
        throw new NotFoundError('Agent not found');
    }

    res.json({ success: true, data: agent });
}));

/**
 * @swagger
 * /agents/{id}/reviews:
 *   get:
 *     summary: Get agent reviews
 *     tags: [Agents]
 */
router.get('/:id/reviews', asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { page = '1', limit = '10' } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
        prisma.review.findMany({
            where: { agentId: id },
            skip,
            take: Number(limit),
            orderBy: { createdAt: 'desc' },
            include: {
                reviewer: {
                    select: { firstName: true, lastName: true, profilePhotoUrl: true },
                },
            },
        }),
        prisma.review.count({ where: { agentId: id } }),
    ]);

    // Calculate rating distribution
    const ratingDist = await prisma.review.groupBy({
        by: ['rating'],
        where: { agentId: id },
        _count: true,
    });

    const distribution = Array(5).fill(0);
    ratingDist.forEach(r => { distribution[r.rating - 1] = r._count; });

    res.json({
        success: true,
        data: {
            reviews,
            ratingDistribution: distribution,
            pagination: { page: Number(page), limit: Number(limit), total },
        },
    });
}));

/**
 * @swagger
 * /agents/{id}/reviews:
 *   post:
 *     summary: Submit a review for an agent
 *     tags: [Agents]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/reviews', authenticate, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { rating, title, comment, transactionType } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, error: 'Rating must be 1-5' });
    }

    const agent = await prisma.agent.findUnique({ where: { id } });
    if (!agent) throw new NotFoundError('Agent not found');

    // Check if user already reviewed this agent
    const existing = await prisma.review.findFirst({
        where: { agentId: id, reviewerId: req.user!.id },
    });

    if (existing) {
        return res.status(400).json({ success: false, error: 'You have already reviewed this agent' });
    }

    const review = await prisma.review.create({
        data: {
            agentId: id,
            reviewerId: req.user!.id,
            rating,
            title,
            comment,
            transactionType: transactionType || 'BOUGHT',
        },
    });

    // Update agent stats
    const stats = await prisma.review.aggregate({
        where: { agentId: id },
        _avg: { rating: true },
        _count: true,
    });

    await prisma.agent.update({
        where: { id },
        data: {
            rating: stats._avg.rating || 0,
            reviewCount: stats._count,
        },
    });

    res.status(201).json({ success: true, data: review });
}));

/**
 * @swagger
 * /agents/me/dashboard:
 *   get:
 *     summary: Get agent dashboard stats
 *     tags: [Agents]
 *     security:
 *       - bearerAuth: []
 */
router.get('/me/dashboard', authenticate, requireAgent, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const agentId = req.user!.agentId!;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
        activeListings,
        totalLeads,
        newLeads,
        scheduledShowings,
        recentMessages,
        performance,
    ] = await Promise.all([
        prisma.property.count({ where: { listingAgentId: agentId, status: 'ACTIVE' } }),
        prisma.lead.count({ where: { agentId } }),
        prisma.lead.count({ where: { agentId, createdAt: { gte: thirtyDaysAgo } } }),
        prisma.showing.count({
            where: {
                lead: { agentId },
                scheduledAt: { gte: now },
                status: 'SCHEDULED',
            },
        }),
        prisma.message.findMany({
            where: { recipientId: req.user!.id, read: false },
            take: 5,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.agentPerformance.findFirst({
            where: { agentId },
            orderBy: { month: 'desc' },
        }),
    ]);

    res.json({
        success: true,
        data: {
            activeListings,
            totalLeads,
            newLeads,
            scheduledShowings,
            unreadMessages: recentMessages.length,
            performance: performance || {
                leadsReceived: 0,
                leadsConverted: 0,
                propertiesListed: 0,
                propertiesSold: 0,
            },
        },
    });
}));

/**
 * @swagger
 * /agents/me/leads:
 *   get:
 *     summary: Get agent's leads
 *     tags: [Agents]
 *     security:
 *       - bearerAuth: []
 */
router.get('/me/leads', authenticate, requireAgent, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { status, priority, page = '1', limit = '20' } = req.query;

    const where: any = { agentId: req.user!.agentId };
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const skip = (Number(page) - 1) * Number(limit);

    const [leads, total] = await Promise.all([
        prisma.lead.findMany({
            where,
            skip,
            take: Number(limit),
            orderBy: { createdAt: 'desc' },
            include: {
                property: {
                    select: { id: true, title: true, streetAddress: true, city: true },
                },
                user: {
                    select: { firstName: true, lastName: true, profilePhotoUrl: true },
                },
            },
        }),
        prisma.lead.count({ where }),
    ]);

    res.json({
        success: true,
        data: {
            leads,
            pagination: { page: Number(page), limit: Number(limit), total },
        },
    });
}));

export default router;

