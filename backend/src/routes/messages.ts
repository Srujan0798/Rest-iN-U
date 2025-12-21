import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// GET CONVERSATIONS
// ============================================
router.get('/conversations', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        // Find all unique conversation partners
        const sentMessages = await prisma.message.findMany({
            where: { senderId: req.userId },
            select: { receiverId: true, propertyId: true, createdAt: true },
            distinct: ['receiverId', 'propertyId'],
            orderBy: { createdAt: 'desc' },
        });

        const receivedMessages = await prisma.message.findMany({
            where: { receiverId: req.userId },
            select: { senderId: true, propertyId: true, createdAt: true },
            distinct: ['senderId', 'propertyId'],
            orderBy: { createdAt: 'desc' },
        });

        // Combine and deduplicate
        const conversationsMap = new Map();

        for (const msg of sentMessages) {
            const key = `${msg.receiverId}-${msg.propertyId || 'general'}`;
            if (!conversationsMap.has(key)) {
                conversationsMap.set(key, { partnerId: msg.receiverId, propertyId: msg.propertyId, lastActivity: msg.createdAt });
            }
        }

        for (const msg of receivedMessages) {
            const key = `${msg.senderId}-${msg.propertyId || 'general'}`;
            const existing = conversationsMap.get(key);
            if (!existing || msg.createdAt > existing.lastActivity) {
                conversationsMap.set(key, { partnerId: msg.senderId, propertyId: msg.propertyId, lastActivity: msg.createdAt });
            }
        }

        // Fetch conversation details
        const conversations = await Promise.all(
            Array.from(conversationsMap.values()).map(async (conv) => {
                const partner = await prisma.user.findUnique({
                    where: { id: conv.partnerId },
                    select: { id: true, firstName: true, lastName: true, profilePhoto: true, userType: true },
                });

                const property = conv.propertyId ? await prisma.property.findUnique({
                    where: { id: conv.propertyId },
                    select: { id: true, street: true, city: true },
                }) : null;

                const lastMessage = await prisma.message.findFirst({
                    where: {
                        OR: [
                            { senderId: req.userId, receiverId: conv.partnerId },
                            { senderId: conv.partnerId, receiverId: req.userId },
                        ],
                        propertyId: conv.propertyId,
                    },
                    orderBy: { createdAt: 'desc' },
                    select: { content: true, createdAt: true, read: true, senderId: true },
                });

                const unreadCount = await prisma.message.count({
                    where: {
                        senderId: conv.partnerId,
                        receiverId: req.userId,
                        propertyId: conv.propertyId,
                        read: false,
                    },
                });

                return {
                    partner,
                    property,
                    lastMessage,
                    unreadCount,
                };
            })
        );

        res.json({
            conversations: conversations.sort((a, b) =>
                new Date(b.lastMessage?.createdAt || 0).getTime() - new Date(a.lastMessage?.createdAt || 0).getTime()
            )
        });
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({ error: 'Failed to get conversations' });
    }
});

// ============================================
// GET MESSAGES IN CONVERSATION
// ============================================
router.get('/conversation/:userId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { userId } = req.params;
        const { propertyId, page = '1', limit = '50' } = req.query;

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: req.userId, receiverId: userId },
                    { senderId: userId, receiverId: req.userId },
                ],
                propertyId: propertyId as string || undefined,
            },
            orderBy: { createdAt: 'asc' },
            skip: (parseInt(page as string) - 1) * parseInt(limit as string),
            take: parseInt(limit as string),
            include: {
                sender: { select: { id: true, firstName: true, lastName: true, profilePhoto: true } },
            },
        });

        // Mark as read
        await prisma.message.updateMany({
            where: {
                senderId: userId,
                receiverId: req.userId,
                read: false,
            },
            data: { read: true },
        });

        res.json({ messages });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ error: 'Failed to get messages' });
    }
});

// ============================================
// SEND MESSAGE
// ============================================
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const data = z.object({
            receiverId: z.string().uuid(),
            content: z.string().min(1).max(2000),
            propertyId: z.string().uuid().optional(),
        }).parse(req.body);

        const message = await prisma.message.create({
            data: {
                senderId: req.userId!,
                receiverId: data.receiverId,
                content: data.content,
                propertyId: data.propertyId,
            },
            include: {
                sender: { select: { id: true, firstName: true, lastName: true, profilePhoto: true } },
            },
        });

        // TODO: Send push notification / email to receiver

        res.status(201).json({ message });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Send message error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// ============================================
// MARK MESSAGES AS READ
// ============================================
router.patch('/read/:userId', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { userId } = req.params;

        await prisma.message.updateMany({
            where: {
                senderId: userId,
                receiverId: req.userId,
                read: false,
            },
            data: { read: true },
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Mark read error:', error);
        res.status(500).json({ error: 'Failed to mark messages as read' });
    }
});

export default router;
