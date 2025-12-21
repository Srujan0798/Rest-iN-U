import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// GET NOTIFICATIONS
// ============================================
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { unreadOnly, limit } = req.query;

        res.json({
            notifications: [
                {
                    id: 'notif_1',
                    type: 'new_listing',
                    title: 'New listing matches your search',
                    message: '3BR/2BA in Downtown - $450,000',
                    read: false,
                    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    actionUrl: '/property/prop_123'
                },
                {
                    id: 'notif_2',
                    type: 'price_drop',
                    title: 'Price reduced on saved property',
                    message: '123 Main St price dropped by $15,000',
                    read: false,
                    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                    actionUrl: '/property/prop_456'
                },
                {
                    id: 'notif_3',
                    type: 'open_house',
                    title: 'Open house this weekend',
                    message: 'Property you liked has open house Saturday 1-4pm',
                    read: true,
                    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    actionUrl: '/property/prop_789'
                },
                {
                    id: 'notif_4',
                    type: 'message',
                    title: 'New message from agent',
                    message: 'Jane Smith sent you a message about 456 Oak Ave',
                    read: true,
                    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
                    actionUrl: '/messages'
                },
                {
                    id: 'notif_5',
                    type: 'document',
                    title: 'Document requires signature',
                    message: 'Purchase agreement ready for your signature',
                    read: false,
                    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
                    actionUrl: '/documents/doc_123'
                }
            ],
            unreadCount: 3,
            total: 5
        });
    } catch (error) {
        console.error('Notifications error:', error);
        res.status(500).json({ error: 'Failed to get notifications' });
    }
});

// ============================================
// MARK AS READ
// ============================================
router.patch('/:notificationId/read', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { notificationId } = req.params;

        res.json({
            notificationId,
            read: true,
            message: 'Notification marked as read'
        });
    } catch (error) {
        console.error('Mark read error:', error);
        res.status(500).json({ error: 'Failed to mark as read' });
    }
});

// ============================================
// MARK ALL AS READ
// ============================================
router.patch('/read-all', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        res.json({
            message: 'All notifications marked as read',
            count: 5
        });
    } catch (error) {
        console.error('Mark all read error:', error);
        res.status(500).json({ error: 'Failed to mark all as read' });
    }
});

// ============================================
// DELETE NOTIFICATION
// ============================================
router.delete('/:notificationId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { notificationId } = req.params;

        res.json({
            message: 'Notification deleted',
            notificationId
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Failed to delete notification' });
    }
});

// ============================================
// NOTIFICATION PREFERENCES
// ============================================
router.get('/preferences', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        res.json({
            email: {
                newListings: true,
                priceChanges: true,
                openHouses: true,
                messages: true,
                documents: true,
                marketReports: false
            },
            push: {
                newListings: true,
                priceChanges: true,
                openHouses: false,
                messages: true,
                documents: true
            },
            sms: {
                messages: true,
                documents: true,
                urgentOnly: true
            },
            frequency: {
                instantAlerts: true,
                dailyDigest: false,
                weeklyDigest: true
            }
        });
    } catch (error) {
        console.error('Preferences error:', error);
        res.status(500).json({ error: 'Failed to get preferences' });
    }
});

// ============================================
// UPDATE PREFERENCES
// ============================================
router.put('/preferences', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const preferences = z.object({
            email: z.record(z.boolean()).optional(),
            push: z.record(z.boolean()).optional(),
            sms: z.record(z.boolean()).optional(),
            frequency: z.record(z.boolean()).optional()
        }).parse(req.body);

        res.json({
            message: 'Preferences updated',
            preferences
        });
    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({ error: 'Failed to update preferences' });
    }
});

// ============================================
// SUBSCRIBE TO PROPERTY ALERTS
// ============================================
router.post('/subscribe', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const data = z.object({
            propertyId: z.string().uuid().optional(),
            searchCriteria: z.object({
                city: z.string().optional(),
                minPrice: z.number().optional(),
                maxPrice: z.number().optional(),
                beds: z.number().optional(),
                propertyType: z.string().optional()
            }).optional(),
            alertTypes: z.array(z.enum(['new_listing', 'price_change', 'status_change', 'open_house']))
        }).parse(req.body);

        res.status(201).json({
            subscriptionId: `sub_${Date.now()}`,
            message: 'Alert subscription created',
            alertTypes: data.alertTypes,
            criteria: data.searchCriteria || { propertyId: data.propertyId }
        });
    } catch (error) {
        console.error('Subscribe error:', error);
        res.status(500).json({ error: 'Failed to create subscription' });
    }
});

export default router;
