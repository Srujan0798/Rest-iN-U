// Messages API Routes - Simplified stub
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { asyncHandler, BadRequestError, NotFoundError, ForbiddenError } from '../middleware/errorHandler';

const router = Router();

const sendMessageSchema = z.object({
  recipientId: z.string().uuid(),
  content: z.string().min(1).max(5000),
  messageType: z.enum(['TEXT', 'IMAGE', 'DOCUMENT', 'VOICE', 'VIDEO']).default('TEXT'),
  leadId: z.string().uuid().optional(),
});

// Get all conversations
router.get('/conversations', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user?.id;

  const sentMessages = await prisma.message.findMany({
    where: { senderId: userId },
    select: { recipientId: true, leadId: true },
    distinct: ['recipientId'],
  });

  const receivedMessages = await prisma.message.findMany({
    where: { recipientId: userId },
    select: { senderId: true, leadId: true },
    distinct: ['senderId'],
  });

  const partnerIds = new Set([
    ...sentMessages.map(m => m.recipientId),
    ...receivedMessages.map(m => m.senderId),
  ]);

  const conversations = await Promise.all(
    Array.from(partnerIds).map(async (partnerId) => {
      const partner = await prisma.user.findUnique({
        where: { id: partnerId },
        select: { id: true, firstName: true, lastName: true, email: true, userType: true },
      });

      const lastMessage = await prisma.message.findFirst({
        where: {
          OR: [
            { senderId: userId, recipientId: partnerId },
            { senderId: partnerId, recipientId: userId },
          ],
        },
        orderBy: { createdAt: 'desc' },
        select: { id: true, content: true, createdAt: true, senderId: true, read: true },
      });

      const unreadCount = await prisma.message.count({
        where: { senderId: partnerId, recipientId: userId, read: false },
      });

      return { partnerId, partner, lastMessage, unreadCount, updatedAt: lastMessage?.createdAt };
    })
  );

  conversations.sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return dateB - dateA;
  });

  res.json({
    success: true,
    data: { conversations, totalUnread: conversations.reduce((sum, c) => sum + c.unreadCount, 0) },
  });
}));

// Get conversation with specific user
router.get('/conversations/:partnerId', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user?.id;
  const { partnerId } = req.params;
  const limit = 50;

  const partner = await prisma.user.findUnique({
    where: { id: partnerId },
    select: { id: true, firstName: true, lastName: true, email: true, userType: true },
  });

  if (!partner) throw new NotFoundError('User not found');

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, recipientId: partnerId },
        { senderId: partnerId, recipientId: userId },
      ],
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      sender: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  await prisma.message.updateMany({
    where: { senderId: partnerId, recipientId: userId, read: false },
    data: { read: true },
  });

  res.json({
    success: true,
    data: { partner, messages: messages.reverse() },
  });
}));

// Send message
router.post('/', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const senderId = (req as AuthenticatedRequest).user?.id as string;
  const validated = sendMessageSchema.parse(req.body);

  const recipient = await prisma.user.findUnique({
    where: { id: validated.recipientId },
    select: { id: true, firstName: true },
  });

  if (!recipient) throw new NotFoundError('Recipient not found');
  if (senderId === validated.recipientId) throw new BadRequestError('Cannot send message to yourself');

  const message = await prisma.message.create({
    data: {
      senderId,
      recipientId: validated.recipientId,
      content: validated.content,
      messageType: validated.messageType,
      leadId: validated.leadId,
      read: false,
    },
    include: { sender: { select: { id: true, firstName: true, lastName: true } } },
  });

  await prisma.notification.create({
    data: {
      userId: validated.recipientId,
      type: 'MESSAGE',
      title: `New message`,
      message: validated.content.substring(0, 100) + (validated.content.length > 100 ? '...' : ''),
      actionUrl: `/messages/${senderId}`,
    },
  });

  res.status(201).json({ success: true, data: { message } });
}));

// Get all messages
router.get('/', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user?.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = 50;

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where: { OR: [{ senderId: userId }, { recipientId: userId }] },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        sender: { select: { id: true, firstName: true, lastName: true } },
        recipient: { select: { id: true, firstName: true, lastName: true } },
      },
    }),
    prisma.message.count({ where: { OR: [{ senderId: userId }, { recipientId: userId }] } }),
  ]);

  res.json({
    success: true,
    data: { messages, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } },
  });
}));

// Mark message as read
router.put('/:id/read', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user?.id;
  const { id } = req.params;

  const message = await prisma.message.findUnique({ where: { id } });
  if (!message) throw new NotFoundError('Message not found');
  if (message.recipientId !== userId) throw new ForbiddenError('Not authorized');

  if (!message.read) {
    await prisma.message.update({ where: { id }, data: { read: true } });
  }

  res.json({ success: true, message: 'Message marked as read' });
}));

// Delete message
router.delete('/:id', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as AuthenticatedRequest).user?.id;
  const { id } = req.params;

  const message = await prisma.message.findUnique({ where: { id } });
  if (!message) throw new NotFoundError('Message not found');
  if (message.senderId !== userId) throw new ForbiddenError('Not authorized');

  await prisma.message.delete({ where: { id } });
  res.json({ success: true, message: 'Message deleted' });
}));

export default router;
