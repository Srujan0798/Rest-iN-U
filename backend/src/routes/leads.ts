import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// CREATE LEAD (Contact Agent)
// ============================================
router.post('/', async (req: Request, res: Response) => {
    try {
        const leadSchema = z.object({
            propertyId: z.string().uuid().optional(),
            agentId: z.string().uuid(),
            name: z.string().min(1),
            email: z.string().email(),
            phone: z.string().optional(),
            message: z.string().optional(),
            preferredContact: z.enum(['email', 'phone']).default('email'),
        });

        const data = leadSchema.parse(req.body);

        // Verify agent exists
        const agent = await prisma.agent.findUnique({
            where: { id: data.agentId },
            include: {
                user: { select: { email: true, firstName: true } }
            }
        });

        if (!agent) {
            return res.status(404).json({ error: 'Agent not found' });
        }

        // Create lead
        const lead = await prisma.lead.create({
            data: {
                propertyId: data.propertyId,
                agentId: data.agentId,
                name: data.name,
                email: data.email,
                phone: data.phone,
                message: data.message,
                status: 'NEW',
                source: 'INQUIRY',
            }
        });

        // TODO: Send email notification to agent
        // await sendEmail(agent.user.email, 'New Lead', ...)

        res.status(201).json({
            lead_id: lead.id,
            agent_email: agent.user.email,
            confirmation: `Your message has been sent. ${agent.user.firstName} typically responds within 2 hours.`,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Create lead error:', error);
        res.status(500).json({ error: 'Failed to create lead' });
    }
});

// ============================================
// GET AGENT'S LEADS
// ============================================
router.get('/agent', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const agent = await prisma.agent.findUnique({
            where: { userId: req.userId }
        });

        if (!agent) {
            return res.status(403).json({ error: 'Agent access required' });
        }

        const { status, page = '1', limit = '20' } = req.query;

        const where: any = { agentId: agent.id };
        if (status) where.status = status as string;

        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

        const [leads, total] = await Promise.all([
            prisma.lead.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: parseInt(limit as string),
                include: {
                    property: {
                        select: {
                            street: true,
                            city: true,
                            state: true,
                            price: true,
                            photos: { take: 1, select: { url: true } }
                        }
                    },
                    messages: {
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                    }
                }
            }),
            prisma.lead.count({ where })
        ]);

        res.json({
            leads: leads.map(l => ({
                lead_id: l.id,
                name: l.name,
                email: l.email,
                phone: l.phone,
                message: l.message,
                status: l.status,
                source: l.source,
                created_at: l.createdAt,
                property: l.property ? {
                    address: `${l.property.street}, ${l.property.city}, ${l.property.state}`,
                    price: l.property.price,
                    photo: l.property.photos[0]?.url,
                } : null,
                last_message: l.messages[0] ? {
                    content: l.messages[0].content,
                    created_at: l.messages[0].createdAt,
                } : null,
            })),
            total,
            page: parseInt(page as string),
            total_pages: Math.ceil(total / parseInt(limit as string)),
        });
    } catch (error) {
        console.error('Get leads error:', error);
        res.status(500).json({ error: 'Failed to get leads' });
    }
});

// ============================================
// UPDATE LEAD STATUS
// ============================================
router.patch('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const agent = await prisma.agent.findUnique({
            where: { userId: req.userId }
        });

        if (!agent) {
            return res.status(403).json({ error: 'Agent access required' });
        }

        const lead = await prisma.lead.findFirst({
            where: { id: req.params.id, agentId: agent.id }
        });

        if (!lead) {
            return res.status(404).json({ error: 'Lead not found' });
        }

        const updateSchema = z.object({
            status: z.enum(['NEW', 'CONTACTED', 'SHOWING_SCHEDULED', 'OFFER_MADE', 'CLOSED', 'LOST']).optional(),
        });

        const data = updateSchema.parse(req.body);

        const updated = await prisma.lead.update({
            where: { id: req.params.id },
            data,
        });

        res.json({
            message: 'Lead updated',
            lead_id: updated.id,
            status: updated.status,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Update lead error:', error);
        res.status(500).json({ error: 'Failed to update lead' });
    }
});

// ============================================
// LEAD STATISTICS
// ============================================
router.get('/stats', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const agent = await prisma.agent.findUnique({
            where: { userId: req.userId }
        });

        if (!agent) {
            return res.status(403).json({ error: 'Agent access required' });
        }

        const stats = await prisma.lead.groupBy({
            by: ['status'],
            where: { agentId: agent.id },
            _count: { id: true }
        });

        const totalLeads = await prisma.lead.count({
            where: { agentId: agent.id }
        });

        const thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0, 0, 0, 0);

        const monthlyLeads = await prisma.lead.count({
            where: {
                agentId: agent.id,
                createdAt: { gte: thisMonth }
            }
        });

        res.json({
            total_leads: totalLeads,
            monthly_leads: monthlyLeads,
            by_status: stats.reduce((acc, s) => {
                acc[s.status.toLowerCase()] = s._count.id;
                return acc;
            }, {} as Record<string, number>),
        });
    } catch (error) {
        console.error('Get lead stats error:', error);
        res.status(500).json({ error: 'Failed to get lead stats' });
    }
});

export default router;

