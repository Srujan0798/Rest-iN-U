import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

// ============================================
// GET NEIGHBORHOODS
// ============================================
router.get('/', async (req: Request, res: Response) => {
    try {
        const { city, state, page = '1', limit = '20' } = req.query;

        const where: any = {};
        if (city) where.city = { contains: city as string, mode: 'insensitive' };
        if (state) where.state = state;

        const neighborhoods = await prisma.neighborhood.findMany({
            where,
            skip: (parseInt(page as string) - 1) * parseInt(limit as string),
            take: parseInt(limit as string),
            orderBy: { name: 'asc' },
            include: {
                _count: { select: { properties: true } },
            },
        });

        const total = await prisma.neighborhood.count({ where });

        res.json({
            neighborhoods: neighborhoods.map(n => ({
                ...n,
                property_count: n._count.properties,
                _count: undefined,
            })),
            total,
            page: parseInt(page as string),
            total_pages: Math.ceil(total / parseInt(limit as string)),
        });
    } catch (error) {
        console.error('Get neighborhoods error:', error);
        res.status(500).json({ error: 'Failed to get neighborhoods' });
    }
});

// ============================================
// GET NEIGHBORHOOD BY ID
// ============================================
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const neighborhood = await prisma.neighborhood.findUnique({
            where: { id },
            include: {
                schools: {
                    orderBy: { rating: 'desc' },
                    take: 10,
                },
                properties: {
                    where: { status: 'ACTIVE' },
                    take: 6,
                    orderBy: { createdAt: 'desc' },
                    select: {
                        id: true,
                        street: true,
                        city: true,
                        price: true,
                        bedrooms: true,
                        bathrooms: true,
                        photos: { take: 1, orderBy: { order: 'asc' } },
                    },
                },
            },
        });

        if (!neighborhood) {
            return res.status(404).json({ error: 'Neighborhood not found' });
        }

        // Calculate additional stats
        const priceStats = await prisma.property.aggregate({
            where: { neighborhoodId: id, status: 'ACTIVE' },
            _avg: { price: true },
            _min: { price: true },
            _max: { price: true },
            _count: true,
        });

        res.json({
            neighborhood: {
                ...neighborhood,
                stats: {
                    average_price: priceStats._avg.price,
                    min_price: priceStats._min.price,
                    max_price: priceStats._max.price,
                    active_listings: priceStats._count,
                },
            },
        });
    } catch (error) {
        console.error('Get neighborhood error:', error);
        res.status(500).json({ error: 'Failed to get neighborhood' });
    }
});

// ============================================
// SEARCH NEIGHBORHOODS (for autocomplete)
// ============================================
router.get('/search/autocomplete', async (req: Request, res: Response) => {
    try {
        const { q } = req.query;

        if (!q || (q as string).length < 2) {
            return res.json({ suggestions: [] });
        }

        const neighborhoods = await prisma.neighborhood.findMany({
            where: {
                OR: [
                    { name: { contains: q as string, mode: 'insensitive' } },
                    { city: { contains: q as string, mode: 'insensitive' } },
                ],
            },
            take: 10,
            select: {
                id: true,
                name: true,
                city: true,
                state: true,
            },
        });

        res.json({
            suggestions: neighborhoods.map(n => ({
                id: n.id,
                label: `${n.name}, ${n.city}, ${n.state}`,
                type: 'neighborhood',
            })),
        });
    } catch (error) {
        console.error('Search neighborhoods error:', error);
        res.status(500).json({ error: 'Failed to search neighborhoods' });
    }
});

export default router;

