import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { authenticate, AuthenticatedRequest, requireAdmin } from '../middleware/auth';

const router = Router();

// ============================================
// GET SYSTEM STATS (Mock for now)
// ============================================
router.get('/stats', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
        // In a real implementation, these would be aggregated queries
        res.json({
            users: {
                total: await prisma.user.count(),
                active: await prisma.user.count({ where: { isActive: true } }),
                newThisMonth: 342, // Mock
                growth: '+8.5%'
            },
            agents: {
                total: await prisma.agent.count(),
                active: await prisma.agent.count({ where: { verified: true } }),
                pendingApproval: await prisma.agent.count({ where: { verified: false } })
            },
            properties: {
                total: await prisma.property.count(),
                active: await prisma.property.count({ where: { status: 'AVAILABLE' } }),
                pending: 450, // Mock
                sold: await prisma.property.count({ where: { status: 'SOLD' } })
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
router.get('/users', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                userType: true,
                isActive: true,
                createdAt: true,
                lastLoginAt: true
            },
            orderBy: { createdAt: 'desc' },
            take: 50 // Limit for now
        });

        // Map to frontend expected format
        const formattedUsers = users.map(u => ({
            id: u.id,
            email: u.email,
            name: u.name || 'Unknown',
            role: u.userType,
            status: u.isActive ? 'ACTIVE' : 'SUSPENDED',
            joinDate: u.createdAt.toISOString().split('T')[0],
            lastLogin: u.lastLoginAt
        }));

        res.json(formattedUsers);
    } catch (error) {
        console.error('Users error:', error);
        res.status(500).json({ error: 'Failed to get users' });
    }
});

// ============================================
// UPDATE USER STATUS/ROLE
// ============================================
router.patch('/users/:userId', authenticate, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { userId } = req.params;
        const { role, status } = req.body;

        const updateData: any = {};
        if (role) updateData.userType = role;
        if (status) updateData.isActive = status === 'ACTIVE';

        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        res.json({
            id: user.id,
            role: user.userType,
            status: user.isActive ? 'ACTIVE' : 'SUSPENDED'
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

export default router;
