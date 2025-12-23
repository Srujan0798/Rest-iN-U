import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Admin middleware - check if user is admin
const adminMiddleware = (req: AuthRequest, res: Response, next: any) => {
    // In production, verify admin role from JWT
    const isAdmin = true; // Simplified for demo
    if (!isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// ============================================
// GET SYSTEM STATS
// ============================================
router.get('/stats', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        res.json({
            users: {
                total: 15420,
                active: 12850,
                newThisMonth: 342,
                growth: '+8.5%'
            },
            agents: {
                total: 856,
                active: 742,
                pendingApproval: 12
            },
            properties: {
                total: 24500,
                active: 18200,
                pending: 450,
                sold: 5850
            },
            transactions: {
                thisMonth: 285,
                volume: 185000000,
                avgPrice: 649123
            },
            system: {
                uptime: '99.98%',
                responseTime: '125ms avg',
                errorRate: '0.02%'
            }
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to get stats' });
    }
});

// ============================================
// MANAGE USERS
// ============================================
router.get('/users', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { role, status, page, limit } = req.query;

        res.json({
            users: [
                {
                    id: 'user_1',
                    email: 'john@example.com',
                    name: 'John Smith',
                    role: 'user',
                    status: 'active',
                    createdAt: '2023-06-15',
                    lastLogin: '2024-01-18'
                },
                {
                    id: 'user_2',
                    email: 'jane@realty.com',
                    name: 'Jane Doe',
                    role: 'agent',
                    status: 'active',
                    agentId: 'agent_123',
                    createdAt: '2023-03-20',
                    lastLogin: '2024-01-18'
                },
                {
                    id: 'user_3',
                    email: 'admin@platform.com',
                    name: 'Admin User',
                    role: 'admin',
                    status: 'active',
                    createdAt: '2023-01-01',
                    lastLogin: '2024-01-18'
                }
            ],
            pagination: {
                page: 1,
                limit: 20,
                total: 15420,
                pages: 771
            }
        });
    } catch (error) {
        console.error('Users error:', error);
        res.status(500).json({ error: 'Failed to get users' });
    }
});

// ============================================
// UPDATE USER STATUS
// ============================================
router.patch('/users/:userId', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { userId } = req.params;
        const data = z.object({
            status: z.enum(['active', 'suspended', 'banned']).optional(),
            role: z.enum(['user', 'agent', 'admin']).optional(),
            verified: z.boolean().optional()
        }).parse(req.body);

        res.json({
            userId,
            message: 'User updated',
            ...data
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// ============================================
// PENDING APPROVALS
// ============================================
router.get('/approvals', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        res.json({
            agentApplications: [
                {
                    id: 'app_1',
                    name: 'New Agent',
                    email: 'new.agent@email.com',
                    license: 'CA-12345678',
                    brokerage: 'ABC Realty',
                    appliedAt: '2024-01-16',
                    documents: ['license', 'id', 'brokerage_confirmation']
                }
            ],
            propertyListings: [
                {
                    id: 'prop_pending_1',
                    address: '999 New St',
                    agentId: 'agent_456',
                    submittedAt: '2024-01-17',
                    reason: 'New listing'
                }
            ],
            flaggedContent: [
                {
                    id: 'flag_1',
                    type: 'review',
                    contentId: 'rev_123',
                    reason: 'Inappropriate language',
                    reportedAt: '2024-01-18'
                }
            ]
        });
    } catch (error) {
        console.error('Approvals error:', error);
        res.status(500).json({ error: 'Failed to get approvals' });
    }
});

// ============================================
// APPROVE/REJECT
// ============================================
router.post('/approve/:type/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { type, id } = req.params;
        const { action, reason } = z.object({
            action: z.enum(['approve', 'reject']),
            reason: z.string().optional()
        }).parse(req.body);

        res.json({
            type,
            id,
            action,
            message: `${type} ${action}d successfully`,
            reason
        });
    } catch (error) {
        console.error('Approve error:', error);
        res.status(500).json({ error: 'Action failed' });
    }
});

// ============================================
// SYSTEM SETTINGS
// ============================================
router.get('/settings', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        res.json({
            general: {
                siteName: 'Rest-iN-U',
                supportEmail: 'support@restinu.com',
                defaultCurrency: 'USD',
                timezone: 'America/Los_Angeles'
            },
            features: {
                virtualTours: true,
                arViewer: true,
                blockchain: true,
                aiAnalysis: true,
                sacredGeometry: true
            },
            notifications: {
                emailEnabled: true,
                smsEnabled: true,
                pushEnabled: true
            },
            integrations: {
                mls: { enabled: true, provider: 'CRMLS' },
                stripe: { enabled: true },
                matterport: { enabled: true },
                googleMaps: { enabled: true }
            }
        });
    } catch (error) {
        console.error('Settings error:', error);
        res.status(500).json({ error: 'Failed to get settings' });
    }
});

// ============================================
// UPDATE SETTINGS
// ============================================
router.put('/settings', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const settings = req.body;

        res.json({
            message: 'Settings updated',
            settings
        });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

// ============================================
// AUDIT LOG
// ============================================
router.get('/audit-log', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        res.json({
            logs: [
                {
                    id: 'log_1',
                    timestamp: '2024-01-18T10:30:00Z',
                    user: 'admin@platform.com',
                    action: 'user.update',
                    details: 'Updated user status to suspended',
                    ipAddress: '192.168.1.1'
                },
                {
                    id: 'log_2',
                    timestamp: '2024-01-18T10:15:00Z',
                    user: 'admin@platform.com',
                    action: 'agent.approve',
                    details: 'Approved agent application',
                    ipAddress: '192.168.1.1'
                },
                {
                    id: 'log_3',
                    timestamp: '2024-01-18T09:45:00Z',
                    user: 'system',
                    action: 'backup.complete',
                    details: 'Daily backup completed successfully',
                    ipAddress: 'internal'
                }
            ],
            pagination: {
                page: 1,
                total: 5420
            }
        });
    } catch (error) {
        console.error('Audit log error:', error);
        res.status(500).json({ error: 'Failed to get audit log' });
    }
});

export default router;

