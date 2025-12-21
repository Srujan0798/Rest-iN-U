import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// GET AGENT PROFILE
// ============================================
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const agent = await prisma.agent.findUnique({
            where: { id: req.params.id },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        profilePhoto: true,
                    }
                },
                properties: {
                    where: { status: 'ACTIVE' },
                    take: 10,
                    orderBy: { listedDate: 'desc' },
                    select: {
                        id: true,
                        street: true,
                        city: true,
                        state: true,
                        price: true,
                        bedrooms: true,
                        bathrooms: true,
                        squareFeet: true,
                        photos: { take: 1, select: { url: true } }
                    }
                },
                reviews: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                    include: {
                        reviewer: {
                            select: { firstName: true, lastName: true, profilePhoto: true }
                        }
                    }
                }
            }
        });

        if (!agent) {
            return res.status(404).json({ error: 'Agent not found' });
        }

        res.json({
            agent_id: agent.id,
            name: `${agent.user.firstName} ${agent.user.lastName}`,
            email: agent.user.email,
            phone: agent.user.phone,
            photo: agent.user.profilePhoto,
            license_number: agent.licenseNumber,
            brokerage: agent.brokerage,
            years_experience: agent.yearsExperience,
            specialties: agent.specialties,
            service_areas: agent.serviceAreas,
            bio: agent.bio,
            website_url: agent.websiteUrl,
            rating: agent.rating,
            review_count: agent.reviewCount,
            verified: agent.verified,
            active_listings: agent.properties.map(p => ({
                property_id: p.id,
                address: `${p.street}, ${p.city}, ${p.state}`,
                price: p.price,
                bedrooms: p.bedrooms,
                bathrooms: p.bathrooms,
                square_feet: p.squareFeet,
                photo: p.photos[0]?.url,
            })),
            reviews: agent.reviews.map(r => ({
                rating: r.rating,
                comment: r.comment,
                transaction_type: r.transactionType,
                created_at: r.createdAt,
                reviewer: {
                    name: `${r.reviewer.firstName} ${r.reviewer.lastName}`,
                    photo: r.reviewer.profilePhoto,
                }
            })),
        });
    } catch (error) {
        console.error('Get agent error:', error);
        res.status(500).json({ error: 'Failed to get agent' });
    }
});

// ============================================
// SEARCH AGENTS
// ============================================
router.get('/', async (req: Request, res: Response) => {
    try {
        const { area, specialty, page = '1', limit = '20' } = req.query;

        const where: any = { verified: true };

        if (area) {
            where.serviceAreas = { has: area as string };
        }

        if (specialty) {
            where.specialties = { has: specialty as string };
        }

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

        const [agents, total] = await Promise.all([
            prisma.agent.findMany({
                where,
                orderBy: [
                    { rating: 'desc' },
                    { reviewCount: 'desc' }
                ],
                skip,
                take: parseInt(limit as string),
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            profilePhoto: true,
                        }
                    },
                    _count: {
                        select: { properties: { where: { status: 'ACTIVE' } } }
                    }
                }
            }),
            prisma.agent.count({ where })
        ]);

        res.json({
            agents: agents.map(a => ({
                agent_id: a.id,
                name: `${a.user.firstName} ${a.user.lastName}`,
                photo: a.user.profilePhoto,
                brokerage: a.brokerage,
                years_experience: a.yearsExperience,
                specialties: a.specialties,
                service_areas: a.serviceAreas,
                rating: a.rating,
                review_count: a.reviewCount,
                active_listings_count: a._count.properties,
            })),
            total,
            page: parseInt(page as string),
            total_pages: Math.ceil(total / parseInt(limit as string)),
        });
    } catch (error) {
        console.error('Search agents error:', error);
        res.status(500).json({ error: 'Failed to search agents' });
    }
});

// ============================================
// CREATE/UPDATE AGENT PROFILE
// ============================================
router.post('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const agentSchema = z.object({
            licenseNumber: z.string().min(1),
            brokerage: z.string().optional(),
            yearsExperience: z.number().int().min(0).default(0),
            specialties: z.array(z.string()).default([]),
            serviceAreas: z.array(z.string()).default([]),
            bio: z.string().optional(),
            websiteUrl: z.string().url().optional(),
        });

        const data = agentSchema.parse(req.body);

        // Check if agent profile exists
        const existing = await prisma.agent.findUnique({
            where: { userId: req.userId }
        });

        let agent;
        if (existing) {
            agent = await prisma.agent.update({
                where: { id: existing.id },
                data,
            });
        } else {
            // Update user type to AGENT
            await prisma.user.update({
                where: { id: req.userId },
                data: { userType: 'AGENT' }
            });

            agent = await prisma.agent.create({
                data: {
                    ...data,
                    userId: req.userId!,
                }
            });
        }

        res.json({
            message: existing ? 'Agent profile updated' : 'Agent profile created',
            agent_id: agent.id,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Create/update agent error:', error);
        res.status(500).json({ error: 'Failed to save agent profile' });
    }
});

// ============================================
// ADD REVIEW
// ============================================
router.post('/:id/reviews', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const reviewSchema = z.object({
            rating: z.number().int().min(1).max(5),
            comment: z.string().optional(),
            transactionType: z.enum(['BOUGHT', 'SOLD', 'RENTED']),
        });

        const data = reviewSchema.parse(req.body);

        const agent = await prisma.agent.findUnique({
            where: { id: req.params.id }
        });

        if (!agent) {
            return res.status(404).json({ error: 'Agent not found' });
        }

        // Create review
        const review = await prisma.review.create({
            data: {
                agentId: agent.id,
                reviewerUserId: req.userId!,
                rating: data.rating,
                comment: data.comment,
                transactionType: data.transactionType,
            }
        });

        // Update agent rating
        const reviews = await prisma.review.aggregate({
            where: { agentId: agent.id },
            _avg: { rating: true },
            _count: { id: true }
        });

        await prisma.agent.update({
            where: { id: agent.id },
            data: {
                rating: reviews._avg.rating || 0,
                reviewCount: reviews._count.id,
            }
        });

        res.status(201).json({
            message: 'Review added',
            review_id: review.id,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Add review error:', error);
        res.status(500).json({ error: 'Failed to add review' });
    }
});

export default router;
