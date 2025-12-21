import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, agentOnly, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// GET UPCOMING OPEN HOUSES
// ============================================
router.get('/', async (req: Request, res: Response) => {
    try {
        const { city, startDate, endDate, page = '1', limit = '20' } = req.query;

        const where: any = {
            startTime: {
                gte: startDate ? new Date(startDate as string) : new Date(),
            },
        };

        if (endDate) {
            where.startTime = { ...where.startTime, lte: new Date(endDate as string) };
        }

        if (city) {
            where.property = { city: { contains: city as string, mode: 'insensitive' } };
        }

        const openHouses = await prisma.openHouse.findMany({
            where,
            orderBy: { startTime: 'asc' },
            skip: (parseInt(page as string) - 1) * parseInt(limit as string),
            take: parseInt(limit as string),
            include: {
                property: {
                    select: {
                        id: true,
                        street: true,
                        city: true,
                        state: true,
                        price: true,
                        bedrooms: true,
                        bathrooms: true,
                        photos: { take: 1, orderBy: { order: 'asc' } },
                        listingAgent: {
                            include: {
                                user: { select: { firstName: true, lastName: true } },
                            },
                        },
                    },
                },
            },
        });

        const total = await prisma.openHouse.count({ where });

        res.json({
            open_houses: openHouses.map(oh => ({
                id: oh.id,
                start_time: oh.startTime,
                end_time: oh.endTime,
                notes: oh.notes,
                property: {
                    property_id: oh.property.id,
                    address: `${oh.property.street}, ${oh.property.city}, ${oh.property.state}`,
                    price: oh.property.price,
                    bedrooms: oh.property.bedrooms,
                    bathrooms: oh.property.bathrooms,
                    primary_photo: oh.property.photos[0]?.url,
                    agent_name: `${oh.property.listingAgent.user.firstName} ${oh.property.listingAgent.user.lastName}`,
                },
            })),
            total,
            page: parseInt(page as string),
            total_pages: Math.ceil(total / parseInt(limit as string)),
        });
    } catch (error) {
        console.error('Get open houses error:', error);
        res.status(500).json({ error: 'Failed to get open houses' });
    }
});

// ============================================
// GET OPEN HOUSE BY ID
// ============================================
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const openHouse = await prisma.openHouse.findUnique({
            where: { id },
            include: {
                property: {
                    include: {
                        photos: { orderBy: { order: 'asc' } },
                        listingAgent: {
                            include: {
                                user: { select: { firstName: true, lastName: true, phone: true, email: true, profilePhoto: true } },
                            },
                        },
                    },
                },
            },
        });

        if (!openHouse) {
            return res.status(404).json({ error: 'Open house not found' });
        }

        res.json({ open_house: openHouse });
    } catch (error) {
        console.error('Get open house error:', error);
        res.status(500).json({ error: 'Failed to get open house' });
    }
});

// ============================================
// CREATE OPEN HOUSE (Agents only)
// ============================================
router.post('/', authMiddleware, agentOnly, async (req: AuthRequest, res: Response) => {
    try {
        const data = z.object({
            propertyId: z.string().uuid(),
            startTime: z.string().datetime(),
            endTime: z.string().datetime(),
            notes: z.string().optional(),
        }).parse(req.body);

        // Verify agent owns this property
        const agent = await prisma.agent.findUnique({ where: { userId: req.userId } });
        const property = await prisma.property.findUnique({ where: { id: data.propertyId } });

        if (!property || property.listingAgentId !== agent?.id) {
            return res.status(403).json({ error: 'You can only create open houses for your listings' });
        }

        const openHouse = await prisma.openHouse.create({
            data: {
                propertyId: data.propertyId,
                startTime: new Date(data.startTime),
                endTime: new Date(data.endTime),
                notes: data.notes,
            },
        });

        res.status(201).json({
            message: 'Open house scheduled',
            open_house: openHouse,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Create open house error:', error);
        res.status(500).json({ error: 'Failed to create open house' });
    }
});

// ============================================
// DELETE OPEN HOUSE (Agents only)
// ============================================
router.delete('/:id', authMiddleware, agentOnly, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const agent = await prisma.agent.findUnique({ where: { userId: req.userId } });
        const openHouse = await prisma.openHouse.findUnique({
            where: { id },
            include: { property: true },
        });

        if (!openHouse || openHouse.property.listingAgentId !== agent?.id) {
            return res.status(403).json({ error: 'You can only delete your open houses' });
        }

        await prisma.openHouse.delete({ where: { id } });

        res.json({ message: 'Open house cancelled' });
    } catch (error) {
        console.error('Delete open house error:', error);
        res.status(500).json({ error: 'Failed to delete open house' });
    }
});

export default router;
