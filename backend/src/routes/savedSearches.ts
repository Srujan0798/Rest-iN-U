import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// GET SAVED SEARCHES
// ============================================
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const searches = await prisma.savedSearch.findMany({
            where: { userId: req.userId },
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            saved_searches: searches.map(s => ({
                search_id: s.id,
                name: s.name,
                filters: s.filters,
                alert_frequency: s.alertFrequency,
                created_at: s.createdAt,
            }))
        });
    } catch (error) {
        console.error('Get saved searches error:', error);
        res.status(500).json({ error: 'Failed to get saved searches' });
    }
});

// ============================================
// CREATE SAVED SEARCH
// ============================================
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const searchSchema = z.object({
            name: z.string().min(1).max(100),
            filters: z.object({
                location: z.string().optional(),
                city: z.string().optional(),
                state: z.string().optional(),
                minPrice: z.number().optional(),
                maxPrice: z.number().optional(),
                bedrooms: z.number().optional(),
                bathrooms: z.number().optional(),
                propertyType: z.string().optional(),
                listingType: z.string().optional(),
            }),
            alertFrequency: z.enum(['INSTANT', 'DAILY', 'WEEKLY']).default('INSTANT'),
        });

        const data = searchSchema.parse(req.body);

        const savedSearch = await prisma.savedSearch.create({
            data: {
                userId: req.userId!,
                name: data.name,
                filters: data.filters,
                alertFrequency: data.alertFrequency,
            }
        });

        // Count matching properties
        const matchingCount = await countMatchingProperties(data.filters);

        res.status(201).json({
            search_id: savedSearch.id,
            name: savedSearch.name,
            alert_frequency: savedSearch.alertFrequency,
            matching_properties: matchingCount,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Create saved search error:', error);
        res.status(500).json({ error: 'Failed to create saved search' });
    }
});

// ============================================
// UPDATE SAVED SEARCH
// ============================================
router.patch('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const search = await prisma.savedSearch.findFirst({
            where: { id: req.params.id, userId: req.userId }
        });

        if (!search) {
            return res.status(404).json({ error: 'Saved search not found' });
        }

        const updateSchema = z.object({
            name: z.string().min(1).max(100).optional(),
            alertFrequency: z.enum(['INSTANT', 'DAILY', 'WEEKLY']).optional(),
        });

        const data = updateSchema.parse(req.body);

        const updated = await prisma.savedSearch.update({
            where: { id: req.params.id },
            data,
        });

        res.json({
            message: 'Saved search updated',
            search_id: updated.id,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Update saved search error:', error);
        res.status(500).json({ error: 'Failed to update saved search' });
    }
});

// ============================================
// DELETE SAVED SEARCH
// ============================================
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const search = await prisma.savedSearch.findFirst({
            where: { id: req.params.id, userId: req.userId }
        });

        if (!search) {
            return res.status(404).json({ error: 'Saved search not found' });
        }

        await prisma.savedSearch.delete({
            where: { id: req.params.id }
        });

        res.json({ message: 'Saved search deleted' });
    } catch (error) {
        console.error('Delete saved search error:', error);
        res.status(500).json({ error: 'Failed to delete saved search' });
    }
});

// Helper function to count matching properties
async function countMatchingProperties(filters: any): Promise<number> {
    const where: any = { status: 'ACTIVE' };

    if (filters.city) where.city = { contains: filters.city, mode: 'insensitive' };
    if (filters.state) where.state = { equals: filters.state, mode: 'insensitive' };
    if (filters.location) {
        where.OR = [
            { city: { contains: filters.location, mode: 'insensitive' } },
            { state: { contains: filters.location, mode: 'insensitive' } },
        ];
    }
    if (filters.minPrice || filters.maxPrice) {
        where.price = {};
        if (filters.minPrice) where.price.gte = filters.minPrice;
        if (filters.maxPrice) where.price.lte = filters.maxPrice;
    }
    if (filters.bedrooms) where.bedrooms = { gte: filters.bedrooms };
    if (filters.bathrooms) where.bathrooms = { gte: filters.bathrooms };
    if (filters.propertyType) where.propertyType = filters.propertyType;
    if (filters.listingType) where.listingType = filters.listingType;

    return prisma.property.count({ where });
}

export default router;
