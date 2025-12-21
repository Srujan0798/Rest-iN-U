import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// DRONE PHOTO PACKAGES
// ============================================
const DRONE_PACKAGES = {
    basic: {
        id: 'basic',
        name: 'Basic Package',
        price: 14900, // $149
        photos: 20,
        videos: 1,
        features: ['20 aerial photos', '1 property video (30 sec)', 'Basic editing']
    },
    premium: {
        id: 'premium',
        name: 'Premium Package',
        price: 29900, // $299
        photos: 40,
        videos: 3,
        features: [
            '40 aerial photos',
            '3 videos (intro, flyover, close-up)',
            '360° panorama',
            'Professional editing',
            'Same-day delivery'
        ]
    },
    luxury: {
        id: 'luxury',
        name: 'Luxury Package',
        price: 59900, // $599
        photos: 100,
        videos: 10,
        features: [
            '100 aerial photos',
            '10 videos including twilight shots',
            '3D property model',
            'Matterport-style walkthrough',
            'Cinematic editing',
            'Rush 24-hour delivery',
            'Social media cuts'
        ]
    }
};

// ============================================
// GET PACKAGES
// ============================================
router.get('/packages', (req: Request, res: Response) => {
    res.json({ packages: DRONE_PACKAGES });
});

// ============================================
// ORDER DRONE PHOTOS
// ============================================
const orderSchema = z.object({
    propertyId: z.string().uuid(),
    packageId: z.enum(['basic', 'premium', 'luxury']),
    preferredDate: z.string().datetime().optional(),
    preferredTime: z.enum(['morning', 'afternoon', 'golden_hour', 'twilight']).optional(),
    specialInstructions: z.string().max(500).optional(),
});

router.post('/order', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const data = orderSchema.parse(req.body);
        const package_ = DRONE_PACKAGES[data.packageId];

        // Get property details
        const property = await prisma.property.findUnique({
            where: { id: data.propertyId }
        });

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Create order
        const order = await prisma.droneOrder.create({
            data: {
                propertyId: data.propertyId,
                userId: req.userId!,
                packageId: data.packageId,
                packageName: package_.name,
                price: package_.price,
                preferredDate: data.preferredDate ? new Date(data.preferredDate) : null,
                preferredTime: data.preferredTime,
                specialInstructions: data.specialInstructions,
                status: 'PENDING',
                address: `${property.street}, ${property.city}, ${property.state} ${property.zip}`,
            }
        });

        // In production, notify drone pilots via queue
        // await notifyPilots(order);

        res.status(201).json({
            message: 'Drone photo order placed successfully',
            order: {
                id: order.id,
                package: package_.name,
                price: package_.price / 100,
                estimatedDelivery: getEstimatedDelivery(data.packageId),
                status: order.status
            }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Drone order error:', error);
        res.status(500).json({ error: 'Failed to place order' });
    }
});

function getEstimatedDelivery(packageId: string): string {
    switch (packageId) {
        case 'luxury': return '24 hours';
        case 'premium': return '2-3 days';
        default: return '3-5 days';
    }
}

// ============================================
// GET ORDER STATUS
// ============================================
router.get('/order/:orderId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { orderId } = req.params;

        const order = await prisma.droneOrder.findFirst({
            where: {
                id: orderId,
                userId: req.userId
            },
            include: {
                photos: true
            }
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ order });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ error: 'Failed to get order' });
    }
});

// ============================================
// PILOT: ACCEPT ORDER
// ============================================
router.post('/accept/:orderId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { orderId } = req.params;

        // Verify user is a pilot
        const pilot = await prisma.dronePilot.findUnique({
            where: { userId: req.userId }
        });

        if (!pilot) {
            return res.status(403).json({ error: 'Not a registered drone pilot' });
        }

        const order = await prisma.droneOrder.update({
            where: { id: orderId },
            data: {
                pilotId: pilot.id,
                status: 'ASSIGNED',
                assignedAt: new Date()
            }
        });

        res.json({
            message: 'Order accepted',
            order
        });
    } catch (error) {
        console.error('Accept order error:', error);
        res.status(500).json({ error: 'Failed to accept order' });
    }
});

// ============================================
// PILOT: UPLOAD PHOTOS
// ============================================
const uploadSchema = z.object({
    orderId: z.string().uuid(),
    photos: z.array(z.object({
        url: z.string().url(),
        type: z.enum(['aerial', 'closeup', 'panorama', 'twilight']),
        caption: z.string().optional()
    })),
    videos: z.array(z.object({
        url: z.string().url(),
        type: z.enum(['intro', 'flyover', 'cinematic', 'walkthrough']),
        duration: z.number()
    })).optional()
});

router.post('/upload', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const data = uploadSchema.parse(req.body);

        // Verify pilot owns this order
        const pilot = await prisma.dronePilot.findUnique({
            where: { userId: req.userId }
        });

        const order = await prisma.droneOrder.findFirst({
            where: {
                id: data.orderId,
                pilotId: pilot?.id
            }
        });

        if (!order) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        // Create photo records
        for (const photo of data.photos) {
            await prisma.dronePhoto.create({
                data: {
                    orderId: data.orderId,
                    url: photo.url,
                    type: photo.type,
                    caption: photo.caption
                }
            });
        }

        // Update order status
        await prisma.droneOrder.update({
            where: { id: data.orderId },
            data: {
                status: 'COMPLETED',
                completedAt: new Date()
            }
        });

        // Notify customer
        // await sendCompletionEmail(order.userId, data.orderId);

        res.json({
            message: 'Photos uploaded successfully',
            photosCount: data.photos.length,
            videosCount: data.videos?.length || 0
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload photos' });
    }
});

// ============================================
// PILOT: REGISTER
// ============================================
const pilotSchema = z.object({
    licenseNumber: z.string(),
    licenseExpiry: z.string(),
    insuranceNumber: z.string(),
    droneModel: z.string(),
    serviceAreas: z.array(z.string()),
    portfolio: z.array(z.string().url()).optional()
});

router.post('/pilot/register', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const data = pilotSchema.parse(req.body);

        // Check if already registered
        const existing = await prisma.dronePilot.findUnique({
            where: { userId: req.userId }
        });

        if (existing) {
            return res.status(400).json({ error: 'Already registered as pilot' });
        }

        const pilot = await prisma.dronePilot.create({
            data: {
                userId: req.userId!,
                licenseNumber: data.licenseNumber,
                licenseExpiry: new Date(data.licenseExpiry),
                insuranceNumber: data.insuranceNumber,
                droneModel: data.droneModel,
                serviceAreas: data.serviceAreas,
                portfolio: data.portfolio || [],
                verified: false,
                rating: 0,
                completedJobs: 0
            }
        });

        res.status(201).json({
            message: 'Pilot registration submitted for review',
            pilotId: pilot.id
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Pilot registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

export default router;
