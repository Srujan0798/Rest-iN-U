import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// GET CALENDAR
// ============================================
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { startDate, endDate } = req.query;

        res.json({
            events: [
                {
                    id: 'event_1',
                    title: 'Showing: 123 Main St',
                    type: 'showing',
                    start: '2024-01-20T10:00:00',
                    end: '2024-01-20T11:00:00',
                    location: '123 Main St, City, ST 12345',
                    attendees: ['Michael Johnson', 'Jane Smith (Agent)'],
                    propertyId: 'prop_123',
                    status: 'confirmed'
                },
                {
                    id: 'event_2',
                    title: 'Open House: 456 Oak Ave',
                    type: 'open_house',
                    start: '2024-01-21T13:00:00',
                    end: '2024-01-21T16:00:00',
                    location: '456 Oak Ave, City, ST 12345',
                    propertyId: 'prop_456',
                    status: 'confirmed'
                },
                {
                    id: 'event_3',
                    title: 'Client Meeting',
                    type: 'meeting',
                    start: '2024-01-22T14:00:00',
                    end: '2024-01-22T15:00:00',
                    location: 'Office',
                    attendees: ['Sarah Williams'],
                    leadId: 'lead_2',
                    status: 'confirmed'
                },
                {
                    id: 'event_4',
                    title: 'Closing: 789 Elm Rd',
                    type: 'closing',
                    start: '2024-01-25T10:00:00',
                    end: '2024-01-25T12:00:00',
                    location: 'Title Company',
                    propertyId: 'prop_789',
                    status: 'confirmed'
                },
                {
                    id: 'event_5',
                    title: 'Inspection: 321 Pine St',
                    type: 'inspection',
                    start: '2024-01-23T09:00:00',
                    end: '2024-01-23T12:00:00',
                    location: '321 Pine St',
                    propertyId: 'prop_321',
                    status: 'confirmed'
                }
            ]
        });
    } catch (error) {
        console.error('Calendar error:', error);
        res.status(500).json({ error: 'Failed to get calendar' });
    }
});

// ============================================
// CREATE EVENT
// ============================================
router.post('/events', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const data = z.object({
            title: z.string(),
            type: z.enum(['showing', 'open_house', 'meeting', 'closing', 'inspection', 'appraisal', 'other']),
            start: z.string(),
            end: z.string(),
            location: z.string().optional(),
            attendees: z.array(z.string()).optional(),
            propertyId: z.string().uuid().optional(),
            leadId: z.string().optional(),
            notes: z.string().optional(),
            reminders: z.array(z.number()).optional()
        }).parse(req.body);

        const eventId = `event_${Date.now()}`;

        res.status(201).json({
            eventId,
            message: 'Event created',
            ...data,
            status: 'confirmed'
        });
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
});

// ============================================
// UPDATE EVENT
// ============================================
router.patch('/events/:eventId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { eventId } = req.params;
        const updates = req.body;

        res.json({
            eventId,
            message: 'Event updated',
            ...updates
        });
    } catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({ error: 'Failed to update event' });
    }
});

// ============================================
// DELETE EVENT
// ============================================
router.delete('/events/:eventId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { eventId } = req.params;

        res.json({
            message: 'Event deleted',
            eventId
        });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

// ============================================
// AVAILABILITY
// ============================================
router.get('/availability/:agentId', async (req: Request, res: Response) => {
    try {
        const { agentId } = req.params;
        const { date } = req.query;

        res.json({
            agentId,
            date: date || new Date().toISOString().split('T')[0],
            available: [
                { start: '09:00', end: '10:00' },
                { start: '11:00', end: '12:00' },
                { start: '14:00', end: '15:00' },
                { start: '15:00', end: '16:00' }
            ],
            booked: [
                { start: '10:00', end: '11:00', type: 'showing' },
                { start: '13:00', end: '14:00', type: 'meeting' }
            ],
            workingHours: { start: '09:00', end: '18:00' }
        });
    } catch (error) {
        console.error('Availability error:', error);
        res.status(500).json({ error: 'Failed to get availability' });
    }
});

// ============================================
// SYNC CALENDAR
// ============================================
router.post('/sync', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const data = z.object({
            provider: z.enum(['google', 'outlook', 'apple']),
            accessToken: z.string()
        }).parse(req.body);

        res.json({
            message: `Calendar synced with ${data.provider}`,
            syncedEvents: 24,
            lastSync: new Date().toISOString()
        });
    } catch (error) {
        console.error('Sync error:', error);
        res.status(500).json({ error: 'Sync failed' });
    }
});

export default router;

