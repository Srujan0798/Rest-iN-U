import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET FAVORITES
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const favorites = await prisma.favorite.findMany({
            where: { userId: req.userId },
            orderBy: { createdAt: 'desc' },
            include: {
                property: {
                    select: {
                        id: true, street: true, city: true, state: true, zip: true,
                        price: true, bedrooms: true, bathrooms: true, squareFeet: true,
                        status: true, photos: { take: 1, select: { url: true } }
                    }
                }
            }
        });

        res.json({
            favorites: favorites.map(f => ({
                favorite_id: f.id,
                notes: f.notes,
                created_at: f.createdAt,
                property: {
                    property_id: f.property.id,
                    address: `${f.property.street}, ${f.property.city}, ${f.property.state}`,
                    price: f.property.price,
                    bedrooms: f.property.bedrooms,
                    bathrooms: f.property.bathrooms,
                    square_feet: f.property.squareFeet,
                    primary_photo: f.property.photos[0]?.url,
                }
            }))
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get favorites' });
    }
});

// ADD TO FAVORITES
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { propertyId, notes } = z.object({
            propertyId: z.string().uuid(),
            notes: z.string().optional(),
        }).parse(req.body);

        const favorite = await prisma.favorite.create({
            data: { userId: req.userId!, propertyId, notes }
        });

        await prisma.property.update({
            where: { id: propertyId },
            data: { favoriteCount: { increment: 1 } }
        });

        res.status(201).json({ message: 'Added to favorites', favorite_id: favorite.id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add favorite' });
    }
});

// REMOVE FROM FAVORITES
router.delete('/:propertyId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        await prisma.favorite.delete({
            where: { userId_propertyId: { userId: req.userId!, propertyId: req.params.propertyId } }
        });
        res.json({ message: 'Removed from favorites' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove favorite' });
    }
});

export default router;
