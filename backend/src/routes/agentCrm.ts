import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// GET LEADS
// ============================================
router.get('/leads', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { status, source, sortBy } = req.query;

        res.json({
            leads: [
                {
                    id: 'lead_1',
                    name: 'Michael Johnson',
                    email: 'michael.j@email.com',
                    phone: '555-123-4567',
                    source: 'website',
                    status: 'hot',
                    type: 'buyer',
                    budget: '$500,000 - $700,000',
                    timeline: '1-3 months',
                    interests: ['3+ bedrooms', 'Downtown', 'Pool'],
                    lastContact: '2024-01-18',
                    nextFollowUp: '2024-01-20',
                    assignedTo: 'agent_123',
                    notes: 'Pre-approved, ready to tour'
                },
                {
                    id: 'lead_2',
                    name: 'Sarah Williams',
                    email: 'sarah.w@email.com',
                    phone: '555-234-5678',
                    source: 'referral',
                    status: 'warm',
                    type: 'seller',
                    propertyAddress: '123 Oak Street',
                    timeline: '3-6 months',
                    lastContact: '2024-01-15',
                    nextFollowUp: '2024-01-22',
                    assignedTo: 'agent_123',
                    notes: 'Considering selling in spring'
                },
                {
                    id: 'lead_3',
                    name: 'David Chen',
                    email: 'david.c@email.com',
                    phone: '555-345-6789',
                    source: 'zillow',
                    status: 'new',
                    type: 'buyer',
                    budget: '$300,000 - $400,000',
                    timeline: '6+ months',
                    interests: ['2 bedrooms', 'Condo'],
                    lastContact: null,
                    nextFollowUp: '2024-01-19',
                    assignedTo: 'agent_123',
                    notes: 'First-time buyer'
                }
            ],
            total: 3,
            stats: {
                hot: 1,
                warm: 1,
                new: 1,
                cold: 0
            }
        });
    } catch (error) {
        console.error('Leads error:', error);
        res.status(500).json({ error: 'Failed to get leads' });
    }
});

// ============================================
// CREATE LEAD
// ============================================
router.post('/leads', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const data = z.object({
            name: z.string(),
            email: z.string().email().optional(),
            phone: z.string().optional(),
            source: z.string(),
            type: z.enum(['buyer', 'seller', 'both', 'investor']),
            budget: z.string().optional(),
            timeline: z.string().optional(),
            interests: z.array(z.string()).optional(),
            notes: z.string().optional()
        }).parse(req.body);

        const leadId = `lead_${Date.now()}`;

        res.status(201).json({
            leadId,
            message: 'Lead created successfully',
            ...data,
            status: 'new',
            createdAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Create lead error:', error);
        res.status(500).json({ error: 'Failed to create lead' });
    }
});

// ============================================
// UPDATE LEAD STATUS
// ============================================
router.patch('/leads/:leadId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { leadId } = req.params;
        const updates = z.object({
            status: z.enum(['new', 'contacted', 'warm', 'hot', 'cold', 'closed', 'lost']).optional(),
            notes: z.string().optional(),
            nextFollowUp: z.string().optional()
        }).parse(req.body);

        res.json({
            leadId,
            message: 'Lead updated',
            ...updates
        });
    } catch (error) {
        console.error('Update lead error:', error);
        res.status(500).json({ error: 'Failed to update lead' });
    }
});

// ============================================
// LOG ACTIVITY
// ============================================
router.post('/leads/:leadId/activity', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { leadId } = req.params;
        const data = z.object({
            type: z.enum(['call', 'email', 'text', 'meeting', 'showing', 'note']),
            description: z.string(),
            outcome: z.string().optional(),
            followUpDate: z.string().optional()
        }).parse(req.body);

        res.status(201).json({
            activityId: `act_${Date.now()}`,
            leadId,
            ...data,
            loggedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Log activity error:', error);
        res.status(500).json({ error: 'Failed to log activity' });
    }
});

// ============================================
// GET PIPELINE
// ============================================
router.get('/pipeline', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        res.json({
            pipeline: [
                { stage: 'New Leads', count: 8, value: 0 },
                { stage: 'Contacted', count: 12, value: 0 },
                { stage: 'Qualified', count: 6, value: 4200000 },
                { stage: 'Showing Properties', count: 4, value: 2800000 },
                { stage: 'Offer Made', count: 3, value: 2100000 },
                { stage: 'Under Contract', count: 2, value: 1400000 },
                { stage: 'Closed', count: 18, value: 12500000 }
            ],
            conversionRates: {
                leadToContact: '85%',
                contactToQualified: '50%',
                qualifiedToOffer: '50%',
                offerToClosed: '67%',
                overallConversion: '22%'
            }
        });
    } catch (error) {
        console.error('Pipeline error:', error);
        res.status(500).json({ error: 'Failed to get pipeline' });
    }
});

// ============================================
// TASKS
// ============================================
router.get('/tasks', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        res.json({
            tasks: [
                {
                    id: 'task_1',
                    title: 'Follow up with Michael Johnson',
                    type: 'follow_up',
                    dueDate: '2024-01-20',
                    priority: 'high',
                    status: 'pending',
                    relatedTo: { type: 'lead', id: 'lead_1', name: 'Michael Johnson' }
                },
                {
                    id: 'task_2',
                    title: 'Schedule showing at 456 Oak Ave',
                    type: 'showing',
                    dueDate: '2024-01-21',
                    priority: 'medium',
                    status: 'pending',
                    relatedTo: { type: 'property', id: 'prop_456', name: '456 Oak Ave' }
                },
                {
                    id: 'task_3',
                    title: 'Review and sign listing agreement',
                    type: 'document',
                    dueDate: '2024-01-19',
                    priority: 'high',
                    status: 'overdue',
                    relatedTo: { type: 'lead', id: 'lead_2', name: 'Sarah Williams' }
                }
            ],
            stats: {
                overdue: 1,
                dueToday: 2,
                upcoming: 5
            }
        });
    } catch (error) {
        console.error('Tasks error:', error);
        res.status(500).json({ error: 'Failed to get tasks' });
    }
});

// ============================================
// EMAIL CAMPAIGNS
// ============================================
router.get('/campaigns', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        res.json({
            campaigns: [
                {
                    id: 'camp_1',
                    name: 'New Listing Alert - Downtown',
                    type: 'drip',
                    status: 'active',
                    recipients: 125,
                    opens: 68,
                    clicks: 24,
                    lastSent: '2024-01-18'
                },
                {
                    id: 'camp_2',
                    name: 'Market Update - January',
                    type: 'newsletter',
                    status: 'scheduled',
                    recipients: 450,
                    scheduledFor: '2024-01-25'
                }
            ]
        });
    } catch (error) {
        console.error('Campaigns error:', error);
        res.status(500).json({ error: 'Failed to get campaigns' });
    }
});

export default router;

