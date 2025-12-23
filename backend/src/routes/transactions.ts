import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// GET TRANSACTIONS
// ============================================
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { status, type } = req.query;

        res.json({
            transactions: [
                {
                    id: 'txn_1',
                    propertyId: 'prop_123',
                    propertyAddress: '123 Main St, City, ST 12345',
                    type: 'purchase',
                    status: 'under_contract',
                    price: 595000,
                    commission: 17850,
                    buyer: { name: 'Michael Johnson', agentId: 'agent_123' },
                    seller: { name: 'Previous Owner', agentId: 'agent_456' },
                    timeline: {
                        offerAccepted: '2024-01-10',
                        inspectionDeadline: '2024-01-20',
                        appraisalDeadline: '2024-01-25',
                        financingDeadline: '2024-01-30',
                        closingDate: '2024-02-15'
                    },
                    milestones: [
                        { name: 'Offer Accepted', date: '2024-01-10', completed: true },
                        { name: 'Earnest Money', date: '2024-01-12', completed: true },
                        { name: 'Inspection', date: '2024-01-18', completed: false },
                        { name: 'Appraisal', date: '2024-01-22', completed: false },
                        { name: 'Financing', date: '2024-01-28', completed: false },
                        { name: 'Final Walkthrough', date: '2024-02-14', completed: false },
                        { name: 'Closing', date: '2024-02-15', completed: false }
                    ]
                },
                {
                    id: 'txn_2',
                    propertyId: 'prop_456',
                    propertyAddress: '456 Oak Ave, City, ST 12345',
                    type: 'listing',
                    status: 'active',
                    listPrice: 650000,
                    commission: 19500,
                    seller: { name: 'Sarah Williams', agentId: 'agent_123' },
                    timeline: {
                        listed: '2024-01-05',
                        expirationDate: '2024-07-05'
                    },
                    showings: 12,
                    offers: 2
                }
            ],
            stats: {
                active: 3,
                pending: 2,
                closedThisMonth: 1,
                totalVolume: 1245000
            }
        });
    } catch (error) {
        console.error('Transactions error:', error);
        res.status(500).json({ error: 'Failed to get transactions' });
    }
});

// ============================================
// CREATE TRANSACTION
// ============================================
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const data = z.object({
            propertyId: z.string().uuid(),
            type: z.enum(['purchase', 'listing', 'rental']),
            price: z.number().positive(),
            buyer: z.object({
                name: z.string(),
                email: z.string().email().optional(),
                phone: z.string().optional()
            }).optional(),
            seller: z.object({
                name: z.string(),
                email: z.string().email().optional(),
                phone: z.string().optional()
            }).optional(),
            closingDate: z.string().optional(),
            commissionRate: z.number().optional()
        }).parse(req.body);

        const transactionId = `txn_${Date.now()}`;

        res.status(201).json({
            transactionId,
            status: 'created',
            message: 'Transaction created',
            ...data
        });
    } catch (error) {
        console.error('Create transaction error:', error);
        res.status(500).json({ error: 'Failed to create transaction' });
    }
});

// ============================================
// UPDATE MILESTONE
// ============================================
router.patch('/:transactionId/milestone', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { transactionId } = req.params;
        const data = z.object({
            milestone: z.string(),
            completed: z.boolean(),
            completedDate: z.string().optional(),
            notes: z.string().optional()
        }).parse(req.body);

        res.json({
            transactionId,
            milestone: data.milestone,
            completed: data.completed,
            message: 'Milestone updated'
        });
    } catch (error) {
        console.error('Update milestone error:', error);
        res.status(500).json({ error: 'Failed to update milestone' });
    }
});

// ============================================
// ADD PARTY TO TRANSACTION
// ============================================
router.post('/:transactionId/parties', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { transactionId } = req.params;
        const data = z.object({
            role: z.enum([
                'buyer', 'seller', 'buyer_agent', 'seller_agent',
                'lender', 'title_company', 'escrow', 'inspector',
                'appraiser', 'attorney', 'other'
            ]),
            name: z.string(),
            company: z.string().optional(),
            email: z.string().email().optional(),
            phone: z.string().optional()
        }).parse(req.body);

        res.status(201).json({
            partyId: `party_${Date.now()}`,
            transactionId,
            ...data,
            message: 'Party added'
        });
    } catch (error) {
        console.error('Add party error:', error);
        res.status(500).json({ error: 'Failed to add party' });
    }
});

// ============================================
// TRANSACTION TIMELINE
// ============================================
router.get('/:transactionId/timeline', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { transactionId } = req.params;

        res.json({
            transactionId,
            events: [
                { date: '2024-01-05', event: 'Property Listed', type: 'milestone' },
                { date: '2024-01-08', event: 'First Showing', type: 'activity' },
                { date: '2024-01-10', event: 'Offer Received', type: 'milestone' },
                { date: '2024-01-10', event: 'Counter Offer Sent', type: 'activity' },
                { date: '2024-01-11', event: 'Offer Accepted', type: 'milestone' },
                { date: '2024-01-12', event: 'Earnest Money Deposited', type: 'milestone' },
                { date: '2024-01-15', event: 'Inspection Scheduled', type: 'activity' },
                { date: '2024-01-18', event: 'Inspection Completed', type: 'milestone' },
                { date: '2024-01-19', event: 'Repair Request Sent', type: 'activity' }
            ]
        });
    } catch (error) {
        console.error('Timeline error:', error);
        res.status(500).json({ error: 'Failed to get timeline' });
    }
});

// ============================================
// CLOSING CHECKLIST
// ============================================
router.get('/:transactionId/closing-checklist', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { transactionId } = req.params;

        res.json({
            transactionId,
            checklist: [
                { item: 'Signed purchase agreement', status: 'complete' },
                { item: 'Earnest money deposit', status: 'complete' },
                { item: 'Home inspection', status: 'complete' },
                { item: 'Repair negotiations', status: 'complete' },
                { item: 'Appraisal ordered', status: 'in_progress' },
                { item: 'Loan approval', status: 'pending' },
                { item: 'Title search', status: 'pending' },
                { item: 'Homeowners insurance', status: 'pending' },
                { item: 'Final walkthrough', status: 'pending' },
                { item: 'Sign closing documents', status: 'pending' },
                { item: 'Fund transfer', status: 'pending' },
                { item: 'Keys handed over', status: 'pending' }
            ],
            progress: 33
        });
    } catch (error) {
        console.error('Closing checklist error:', error);
        res.status(500).json({ error: 'Failed to get checklist' });
    }
});

export default router;

