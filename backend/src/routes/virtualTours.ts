import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// GET 3D TOUR FOR PROPERTY
// ============================================
router.get('/property/:propertyId', async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;

        const tour = await prisma.virtualTour.findFirst({
            where: { propertyId },
            include: {
                property: {
                    select: {
                        id: true,
                        address: true,
                        city: true,
                        state: true,
                        photos: true,
                    }
                },
                hotspots: true,
            }
        });

        if (!tour) {
            return res.status(404).json({ error: 'Virtual tour not found for this property' });
        }

        res.json({ tour });
    } catch (error) {
        console.error('Get tour error:', error);
        res.status(500).json({ error: 'Failed to fetch virtual tour' });
    }
});

// ============================================
// CREATE 3D TOUR (Matterport Integration)
// ============================================
const createTourSchema = z.object({
    propertyId: z.string().uuid(),
    provider: z.enum(['matterport', 'zillow3d', 'custom', 'metaverse']).default('matterport'),
    matterportId: z.string().optional(), // Matterport model ID
    customUrl: z.string().url().optional(), // Custom tour URL
    metaverseCoords: z.object({
        platform: z.enum(['decentraland', 'sandbox', 'spatial']),
        x: z.number(),
        y: z.number(),
        parcel: z.string().optional(),
    }).optional(),
    floorPlanUrl: z.string().url().optional(),
    dollhouseUrl: z.string().url().optional(),
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const data = createTourSchema.parse(req.body);

        // Verify property ownership/agent permission
        const property = await prisma.property.findFirst({
            where: {
                id: data.propertyId,
                OR: [
                    { ownerId: req.userId },
                    { agent: { userId: req.userId } }
                ]
            }
        });

        if (!property) {
            return res.status(403).json({ error: 'Not authorized to create tour for this property' });
        }

        // Generate embed URLs based on provider
        let embedUrl = '';
        let showcaseUrl = '';

        switch (data.provider) {
            case 'matterport':
                embedUrl = `https://my.matterport.com/show/?m=${data.matterportId}`;
                showcaseUrl = `https://my.matterport.com/show/?m=${data.matterportId}&play=1`;
                break;
            case 'zillow3d':
                embedUrl = data.customUrl || '';
                showcaseUrl = data.customUrl || '';
                break;
            case 'metaverse':
                if (data.metaverseCoords?.platform === 'decentraland') {
                    embedUrl = `https://play.decentraland.org/?position=${data.metaverseCoords.x},${data.metaverseCoords.y}`;
                } else if (data.metaverseCoords?.platform === 'sandbox') {
                    embedUrl = `https://www.sandbox.game/en/map/?x=${data.metaverseCoords.x}&y=${data.metaverseCoords.y}`;
                }
                showcaseUrl = embedUrl;
                break;
            default:
                embedUrl = data.customUrl || '';
                showcaseUrl = data.customUrl || '';
        }

        // Create tour record
        const tour = await prisma.virtualTour.create({
            data: {
                propertyId: data.propertyId,
                provider: data.provider,
                matterportId: data.matterportId,
                embedUrl,
                showcaseUrl,
                floorPlanUrl: data.floorPlanUrl,
                dollhouseUrl: data.dollhouseUrl,
                metaversePlatform: data.metaverseCoords?.platform,
                metaverseX: data.metaverseCoords?.x,
                metaverseY: data.metaverseCoords?.y,
                status: 'ACTIVE',
            }
        });

        res.status(201).json({
            message: 'Virtual tour created successfully',
            tour
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Create tour error:', error);
        res.status(500).json({ error: 'Failed to create virtual tour' });
    }
});

// ============================================
// ADD HOTSPOT TO TOUR
// ============================================
const hotspotSchema = z.object({
    tourId: z.string().uuid(),
    type: z.enum(['info', 'link', 'media', 'navigation']),
    title: z.string().min(1),
    description: z.string().optional(),
    position: z.object({
        x: z.number(),
        y: z.number(),
        z: z.number(),
    }),
    rotation: z.object({
        x: z.number(),
        y: z.number(),
        z: z.number(),
    }).optional(),
    targetUrl: z.string().url().optional(),
    mediaUrl: z.string().url().optional(),
    room: z.string().optional(),
});

router.post('/hotspot', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const data = hotspotSchema.parse(req.body);

        const hotspot = await prisma.tourHotspot.create({
            data: {
                tourId: data.tourId,
                type: data.type,
                title: data.title,
                description: data.description,
                positionX: data.position.x,
                positionY: data.position.y,
                positionZ: data.position.z,
                rotationX: data.rotation?.x,
                rotationY: data.rotation?.y,
                rotationZ: data.rotation?.z,
                targetUrl: data.targetUrl,
                mediaUrl: data.mediaUrl,
                room: data.room,
            }
        });

        res.status(201).json({ hotspot });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Add hotspot error:', error);
        res.status(500).json({ error: 'Failed to add hotspot' });
    }
});

// ============================================
// RECORD TOUR ANALYTICS
// ============================================
const analyticsSchema = z.object({
    tourId: z.string().uuid(),
    eventType: z.enum(['view', 'hotspot_click', 'room_visit', 'share', 'complete']),
    duration: z.number().optional(), // seconds
    room: z.string().optional(),
    hotspotId: z.string().uuid().optional(),
    deviceType: z.string().optional(),
    isVR: z.boolean().optional(),
});

router.post('/analytics', async (req: Request, res: Response) => {
    try {
        const data = analyticsSchema.parse(req.body);

        await prisma.tourAnalytics.create({
            data: {
                tourId: data.tourId,
                eventType: data.eventType,
                duration: data.duration,
                room: data.room,
                hotspotId: data.hotspotId,
                deviceType: data.deviceType,
                isVR: data.isVR,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
            }
        });

        // Update tour view count
        if (data.eventType === 'view') {
            await prisma.virtualTour.update({
                where: { id: data.tourId },
                data: { viewCount: { increment: 1 } }
            });
        }

        res.json({ recorded: true });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: 'Failed to record analytics' });
    }
});

// ============================================
// GET TOUR ANALYTICS
// ============================================
router.get('/analytics/:tourId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { tourId } = req.params;

        const tour = await prisma.virtualTour.findUnique({
            where: { id: tourId },
            include: {
                property: {
                    select: { ownerId: true, agentId: true }
                }
            }
        });

        if (!tour) {
            return res.status(404).json({ error: 'Tour not found' });
        }

        // Verify ownership
        const property = tour.property;
        if (property?.ownerId !== req.userId) {
            const agent = await prisma.agent.findUnique({
                where: { id: property?.agentId || '' }
            });
            if (agent?.userId !== req.userId) {
                return res.status(403).json({ error: 'Not authorized' });
            }
        }

        // Get analytics
        const analytics = await prisma.tourAnalytics.groupBy({
            by: ['eventType'],
            where: { tourId },
            _count: true,
        });

        const avgDuration = await prisma.tourAnalytics.aggregate({
            where: { tourId, eventType: 'complete' },
            _avg: { duration: true },
        });

        const roomVisits = await prisma.tourAnalytics.groupBy({
            by: ['room'],
            where: { tourId, eventType: 'room_visit', room: { not: null } },
            _count: true,
            orderBy: { _count: { room: 'desc' } },
            take: 10,
        });

        res.json({
            tourId,
            totalViews: tour.viewCount,
            events: analytics.map(a => ({ type: a.eventType, count: a._count })),
            averageCompletionTime: avgDuration._avg.duration,
            topRooms: roomVisits.map(r => ({ room: r.room, visits: r._count })),
        });
    } catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

// ============================================
// SCHEDULE LIVE VIRTUAL TOUR
// ============================================
const scheduleTourSchema = z.object({
    propertyId: z.string().uuid(),
    scheduledAt: z.string().datetime(),
    duration: z.number().min(15).max(120).default(30), // minutes
    maxAttendees: z.number().min(1).max(100).default(20),
    isVR: z.boolean().default(false),
    meetingUrl: z.string().url().optional(),
});

router.post('/schedule', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const data = scheduleTourSchema.parse(req.body);

        // Generate meeting URL if not provided
        const meetingId = `tour_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        const meetingUrl = data.meetingUrl || `https://meet.restinu.com/${meetingId}`;

        const scheduledTour = await prisma.scheduledTour.create({
            data: {
                propertyId: data.propertyId,
                hostId: req.userId!,
                scheduledAt: new Date(data.scheduledAt),
                duration: data.duration,
                maxAttendees: data.maxAttendees,
                isVR: data.isVR,
                meetingUrl,
                status: 'SCHEDULED',
            }
        });

        res.status(201).json({
            message: 'Virtual tour scheduled successfully',
            scheduledTour,
            joinUrl: meetingUrl,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Schedule tour error:', error);
        res.status(500).json({ error: 'Failed to schedule tour' });
    }
});

// ============================================
// REGISTER FOR SCHEDULED TOUR
// ============================================
router.post('/register/:tourId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { tourId } = req.params;

        const scheduledTour = await prisma.scheduledTour.findUnique({
            where: { id: tourId },
            include: { _count: { select: { attendees: true } } }
        });

        if (!scheduledTour) {
            return res.status(404).json({ error: 'Scheduled tour not found' });
        }

        if (scheduledTour._count.attendees >= scheduledTour.maxAttendees) {
            return res.status(400).json({ error: 'Tour is at full capacity' });
        }

        // Check if already registered
        const existing = await prisma.tourAttendee.findFirst({
            where: {
                scheduledTourId: tourId,
                userId: req.userId
            }
        });

        if (existing) {
            return res.status(400).json({ error: 'Already registered for this tour' });
        }

        await prisma.tourAttendee.create({
            data: {
                scheduledTourId: tourId,
                userId: req.userId!,
                status: 'REGISTERED',
            }
        });

        res.json({
            message: 'Registered for tour successfully',
            joinUrl: scheduledTour.meetingUrl,
            scheduledAt: scheduledTour.scheduledAt,
        });
    } catch (error) {
        console.error('Register tour error:', error);
        res.status(500).json({ error: 'Failed to register for tour' });
    }
});

export default router;
