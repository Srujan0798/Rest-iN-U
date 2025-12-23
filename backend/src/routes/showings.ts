import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// REQUEST SHOWING
// ============================================
router.post('/request', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const data = z.object({
            propertyId: z.string().uuid(),
            preferredDates: z.array(z.object({
                date: z.string(),
                startTime: z.string(),
                endTime: z.string()
            })),
            contactName: z.string(),
            contactPhone: z.string(),
            contactEmail: z.string().email(),
            notes: z.string().optional(),
            tourType: z.enum(['in-person', 'video', 'self-guided']).default('in-person')
        }).parse(req.body);

        const showingId = `show_${Date.now()}`;

        res.status(201).json({
            showingId,
            status: 'pending',
            message: 'Showing request submitted',
            preferredDates: data.preferredDates,
            nextSteps: ['Agent will confirm within 24 hours', 'You will receive calendar invite']
        });
    } catch (error) {
        console.error('Request showing error:', error);
        res.status(500).json({ error: 'Failed to request showing' });
    }
});

// ============================================
// GET SHOWINGS
// ============================================
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { status, date } = req.query;

        res.json({
            showings: [
                {
                    id: 'show_1',
                    propertyId: 'prop_123',
                    propertyAddress: '123 Main St, City, ST',
                    date: '2024-01-20',
                    startTime: '10:00',
                    endTime: '11:00',
                    status: 'confirmed',
                    type: 'in-person',
                    client: {
                        name: 'Michael Johnson',
                        phone: '555-123-4567',
                        email: 'michael.j@email.com'
                    },
                    agent: {
                        name: 'Jane Smith',
                        phone: '555-987-6543'
                    },
                    feedback: null
                },
                {
                    id: 'show_2',
                    propertyId: 'prop_456',
                    propertyAddress: '456 Oak Ave, City, ST',
                    date: '2024-01-20',
                    startTime: '14:00',
                    endTime: '15:00',
                    status: 'pending',
                    type: 'video',
                    client: {
                        name: 'Sarah Williams',
                        phone: '555-234-5678',
                        email: 'sarah.w@email.com'
                    },
                    agent: {
                        name: 'Jane Smith',
                        phone: '555-987-6543'
                    },
                    videoLink: 'https://meet.example.com/show_2',
                    feedback: null
                }
            ],
            total: 2
        });
    } catch (error) {
        console.error('Get showings error:', error);
        res.status(500).json({ error: 'Failed to get showings' });
    }
});

// ============================================
// CONFIRM SHOWING
// ============================================
router.patch('/:showingId/confirm', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { showingId } = req.params;
        const data = z.object({
            confirmedDate: z.string(),
            confirmedTime: z.string(),
            notes: z.string().optional()
        }).parse(req.body);

        res.json({
            showingId,
            status: 'confirmed',
            confirmedDate: data.confirmedDate,
            confirmedTime: data.confirmedTime,
            message: 'Showing confirmed'
        });
    } catch (error) {
        console.error('Confirm showing error:', error);
        res.status(500).json({ error: 'Failed to confirm showing' });
    }
});

// ============================================
// CANCEL SHOWING
// ============================================
router.patch('/:showingId/cancel', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { showingId } = req.params;
        const { reason } = z.object({
            reason: z.string().optional()
        }).parse(req.body);

        res.json({
            showingId,
            status: 'cancelled',
            reason,
            message: 'Showing cancelled'
        });
    } catch (error) {
        console.error('Cancel showing error:', error);
        res.status(500).json({ error: 'Failed to cancel showing' });
    }
});

// ============================================
// RESCHEDULE SHOWING
// ============================================
router.patch('/:showingId/reschedule', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { showingId } = req.params;
        const data = z.object({
            newDate: z.string(),
            newStartTime: z.string(),
            newEndTime: z.string(),
            reason: z.string().optional()
        }).parse(req.body);

        res.json({
            showingId,
            status: 'rescheduled',
            newDate: data.newDate,
            newTime: `${data.newStartTime} - ${data.newEndTime}`,
            message: 'Showing rescheduled'
        });
    } catch (error) {
        console.error('Reschedule showing error:', error);
        res.status(500).json({ error: 'Failed to reschedule showing' });
    }
});

// ============================================
// SUBMIT FEEDBACK
// ============================================
router.post('/:showingId/feedback', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { showingId } = req.params;
        const data = z.object({
            overallRating: z.number().min(1).max(5),
            ratings: z.object({
                location: z.number().min(1).max(5).optional(),
                condition: z.number().min(1).max(5).optional(),
                layout: z.number().min(1).max(5).optional(),
                price: z.number().min(1).max(5).optional()
            }).optional(),
            liked: z.array(z.string()).optional(),
            disliked: z.array(z.string()).optional(),
            wouldBuy: z.enum(['yes', 'no', 'maybe']),
            comments: z.string().optional()
        }).parse(req.body);

        res.status(201).json({
            feedbackId: `fb_${Date.now()}`,
            showingId,
            message: 'Feedback submitted',
            ...data
        });
    } catch (error) {
        console.error('Feedback error:', error);
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
});

// ============================================
// SELF-GUIDED TOUR
// ============================================
router.post('/self-guided', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const data = z.object({
            propertyId: z.string().uuid(),
            date: z.string(),
            timeSlot: z.string(),
            contactName: z.string(),
            contactPhone: z.string(),
            contactEmail: z.string().email()
        }).parse(req.body);

        const tourId = `self_${Date.now()}`;

        res.status(201).json({
            tourId,
            status: 'approved',
            accessCode: Math.random().toString().slice(2, 8),
            lockboxCode: 'Will be sent 30 minutes before tour',
            date: data.date,
            timeSlot: data.timeSlot,
            duration: '1 hour',
            instructions: [
                'Access code will be sent 30 min before',
                'Please arrive within 10 minutes of start time',
                'Lock all doors when leaving',
                'Do not share access codes'
            ]
        });
    } catch (error) {
        console.error('Self-guided error:', error);
        res.status(500).json({ error: 'Failed to book self-guided tour' });
    }
});

export default router;

