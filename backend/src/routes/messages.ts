import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { redis, redisPub } from '../utils/redis';
import { authenticate } from '../middleware/auth';
import { asyncHandler, BadRequestError, NotFoundError, ForbiddenError } from '../middleware/errorHandler';

const router = Router();

// ============================================================================
// SCHEMAS
// ============================================================================

const sendMessageSchema = z.object({
  recipientId: z.string().uuid(),
  content: z.string().min(1).max(5000),
  messageType: z.enum(['TEXT', 'IMAGE', 'DOCUMENT', 'VOICE', 'VIDEO']).default('TEXT'),
  propertyId: z.string().uuid().optional(),
  leadId: z.string().uuid().optional(),
  attachmentUrl: z.string().url().optional(),
});

const updateMessageSchema = z.object({
  read: z.boolean().optional(),
});

// ============================================================================
// CONVERSATIONS
// ============================================================================

// Get all conversations
router.get('/conversations', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  
  // Get all unique conversation partners
  const sentMessages = await prisma.message.findMany({
    where: { senderId: userId },
    select: {
      recipientId: true,
      propertyId: true,
      leadId: true,
    },
    distinct: ['recipientId'],
  });
  
  const receivedMessages = await prisma.message.findMany({
    where: { recipientId: userId },
    select: {
      senderId: true,
      propertyId: true,
      leadId: true,
    },
    distinct: ['senderId'],
  });
  
  // Combine unique partners
  const partnerIds = new Set([
    ...sentMessages.map(m => m.recipientId),
    ...receivedMessages.map(m => m.senderId),
  ]);
  
  // Get conversation details for each partner
  const conversations = await Promise.all(
    Array.from(partnerIds).map(async (partnerId) => {
      // Get partner info
      const partner = await prisma.user.findUnique({
        where: { id: partnerId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          userType: true,
          agent: {
            select: {
              brokerage: true,
              isVerified: true,
            },
          },
        },
      });
      
      // Get last message
      const lastMessage = await prisma.message.findFirst({
        where: {
          OR: [
            { senderId: userId, recipientId: partnerId },
            { senderId: partnerId, recipientId: userId },
          ],
        },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          content: true,
          messageType: true,
          createdAt: true,
          senderId: true,
          read: true,
        },
      });
      
      // Get unread count
      const unreadCount = await prisma.message.count({
        where: {
          senderId: partnerId,
          recipientId: userId,
          read: false,
        },
      });
      
      // Get associated property if any
      const propertyMessage = await prisma.message.findFirst({
        where: {
          OR: [
            { senderId: userId, recipientId: partnerId },
            { senderId: partnerId, recipientId: userId },
          ],
          propertyId: { not: null },
        },
        orderBy: { createdAt: 'desc' },
        include: {
          property: {
            select: {
              id: true,
              title: true,
              address: true,
              photos: {
                where: { isPrimary: true },
                take: 1,
              },
            },
          },
        },
      });
      
      return {
        partnerId,
        partner,
        lastMessage,
        unreadCount,
        property: propertyMessage?.property || null,
        updatedAt: lastMessage?.createdAt,
      };
    })
  );
  
  // Sort by most recent
  conversations.sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return dateB - dateA;
  });
  
  // Get total unread count
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  
  res.json({
    success: true,
    data: {
      conversations,
      totalUnread,
    },
  });
}));

// Get conversation with specific user
router.get('/conversations/:partnerId', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { partnerId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
  const before = req.query.before as string;
  
  // Get partner info
  const partner = await prisma.user.findUnique({
    where: { id: partnerId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      userType: true,
      agent: {
        select: {
          brokerage: true,
          isVerified: true,
          responseTime: true,
        },
      },
    },
  });
  
  if (!partner) {
    throw new NotFoundError('User not found');
  }
  
  // Build query
  const where: any = {
    OR: [
      { senderId: userId, recipientId: partnerId },
      { senderId: partnerId, recipientId: userId },
    ],
  };
  
  if (before) {
    where.createdAt = { lt: new Date(before) };
  }
  
  // Get messages
  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
            address: true,
            price: true,
            photos: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
      },
    }),
    prisma.message.count({ where }),
  ]);
  
  // Mark messages as read
  await prisma.message.updateMany({
    where: {
      senderId: partnerId,
      recipientId: userId,
      read: false,
    },
    data: { read: true },
  });
  
  // Publish read receipt via Redis
  await redisPub.publish(`user:${partnerId}:messages`, JSON.stringify({
    type: 'READ_RECEIPT',
    conversationWith: userId,
    timestamp: new Date().toISOString(),
  }));
  
  res.json({
    success: true,
    data: {
      partner,
      messages: messages.reverse(), // Return in chronological order
      pagination: {
        total,
        hasMore: total > page * limit,
        oldestMessageDate: messages.length > 0 ? messages[messages.length - 1].createdAt : null,
      },
    },
  });
}));

// ============================================================================
// MESSAGES
// ============================================================================

// Send message
router.post('/', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const senderId = (req as any).user.id;
  const validated = sendMessageSchema.parse(req.body);
  
  // Verify recipient exists
  const recipient = await prisma.user.findUnique({
    where: { id: validated.recipientId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  });
  
  if (!recipient) {
    throw new NotFoundError('Recipient not found');
  }
  
  // Can't message yourself
  if (senderId === validated.recipientId) {
    throw new BadRequestError('Cannot send message to yourself');
  }
  
  // Verify property if provided
  if (validated.propertyId) {
    const property = await prisma.property.findUnique({
      where: { id: validated.propertyId },
    });
    if (!property) {
      throw new NotFoundError('Property not found');
    }
  }
  
  // Verify lead if provided
  if (validated.leadId) {
    const lead = await prisma.lead.findUnique({
      where: { id: validated.leadId },
    });
    if (!lead) {
      throw new NotFoundError('Lead not found');
    }
  }
  
  // Create message
  const message = await prisma.message.create({
    data: {
      senderId,
      recipientId: validated.recipientId,
      content: validated.content,
      messageType: validated.messageType,
      propertyId: validated.propertyId,
      leadId: validated.leadId,
      read: false,
    },
    include: {
      sender: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
          address: true,
        },
      },
    },
  });
  
  // Publish message via Redis for real-time delivery
  await redisPub.publish(`user:${validated.recipientId}:messages`, JSON.stringify({
    type: 'NEW_MESSAGE',
    message,
  }));
  
  // Create notification for recipient
  await prisma.notification.create({
    data: {
      userId: validated.recipientId,
      type: 'MESSAGE',
      title: `New message from ${(req as any).user.firstName}`,
      message: validated.content.substring(0, 100) + (validated.content.length > 100 ? '...' : ''),
      data: {
        senderId,
        messageId: message.id,
        propertyId: validated.propertyId,
      },
      actionUrl: `/messages/${senderId}`,
    },
  });
  
  // Update lead activity if lead is associated
  if (validated.leadId) {
    await prisma.lead.update({
      where: { id: validated.leadId },
      data: { updatedAt: new Date() },
    });
  }
  
  res.status(201).json({
    success: true,
    data: { message },
  });
}));

// Get all messages (paginated)
router.get('/', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
  const unreadOnly = req.query.unreadOnly === 'true';
  
  const where: any = {
    OR: [
      { senderId: userId },
      { recipientId: userId },
    ],
  };
  
  if (unreadOnly) {
    where.recipientId = userId;
    where.read = false;
  }
  
  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        recipient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    }),
    prisma.message.count({ where }),
  ]);
  
  res.json({
    success: true,
    data: {
      messages,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
}));

// Get single message
router.get('/:id', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  
  const message = await prisma.message.findUnique({
    where: { id },
    include: {
      sender: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      recipient: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
          address: true,
          photos: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      },
    },
  });
  
  if (!message) {
    throw new NotFoundError('Message not found');
  }
  
  // Verify user is sender or recipient
  if (message.senderId !== userId && message.recipientId !== userId) {
    throw new ForbiddenError('Not authorized to view this message');
  }
  
  // Mark as read if recipient
  if (message.recipientId === userId && !message.read) {
    await prisma.message.update({
      where: { id },
      data: { read: true },
    });
    
    // Publish read receipt
    await redisPub.publish(`user:${message.senderId}:messages`, JSON.stringify({
      type: 'READ_RECEIPT',
      messageId: id,
      timestamp: new Date().toISOString(),
    }));
  }
  
  res.json({
    success: true,
    data: { message },
  });
}));

// Mark message as read
router.put('/:id/read', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  
  const message = await prisma.message.findUnique({
    where: { id },
  });
  
  if (!message) {
    throw new NotFoundError('Message not found');
  }
  
  if (message.recipientId !== userId) {
    throw new ForbiddenError('Not authorized to mark this message as read');
  }
  
  if (!message.read) {
    await prisma.message.update({
      where: { id },
      data: { read: true },
    });
    
    // Publish read receipt
    await redisPub.publish(`user:${message.senderId}:messages`, JSON.stringify({
      type: 'READ_RECEIPT',
      messageId: id,
      timestamp: new Date().toISOString(),
    }));
  }
  
  res.json({
    success: true,
    message: 'Message marked as read',
  });
}));

// Mark all messages in conversation as read
router.put('/conversations/:partnerId/read-all', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { partnerId } = req.params;
  
  const updated = await prisma.message.updateMany({
    where: {
      senderId: partnerId,
      recipientId: userId,
      read: false,
    },
    data: { read: true },
  });
  
  // Publish read receipt
  await redisPub.publish(`user:${partnerId}:messages`, JSON.stringify({
    type: 'READ_ALL_RECEIPT',
    conversationWith: userId,
    timestamp: new Date().toISOString(),
  }));
  
  res.json({
    success: true,
    message: `${updated.count} messages marked as read`,
  });
}));

// Delete message (soft delete - just removes for sender)
router.delete('/:id', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  
  const message = await prisma.message.findUnique({
    where: { id },
  });
  
  if (!message) {
    throw new NotFoundError('Message not found');
  }
  
  // Only sender can delete
  if (message.senderId !== userId) {
    throw new ForbiddenError('Not authorized to delete this message');
  }
  
  // For now, hard delete (in production, would soft delete)
  await prisma.message.delete({ where: { id } });
  
  res.json({
    success: true,
    message: 'Message deleted',
  });
}));

// ============================================================================
// TYPING INDICATORS
// ============================================================================

// Send typing indicator
router.post('/typing', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { recipientId, isTyping } = req.body;
  
  if (!recipientId) {
    throw new BadRequestError('recipientId is required');
  }
  
  // Publish typing indicator via Redis
  await redisPub.publish(`user:${recipientId}:messages`, JSON.stringify({
    type: 'TYPING_INDICATOR',
    senderId: userId,
    isTyping: !!isTyping,
    timestamp: new Date().toISOString(),
  }));
  
  res.json({
    success: true,
  });
}));

// ============================================================================
// QUICK REPLIES
// ============================================================================

// Get quick reply templates
router.get('/quick-replies', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userType = (req as any).user.userType;
  
  let quickReplies: Array<{ id: string; label: string; message: string }> = [];
  
  if (userType === 'AGENT') {
    quickReplies = [
      { id: 'available', label: 'Property Available', message: 'Yes, this property is still available! When would you like to schedule a viewing?' },
      { id: 'schedule', label: 'Schedule Viewing', message: 'I\'d be happy to arrange a viewing. What times work best for you this week?' },
      { id: 'more_info', label: 'Send More Info', message: 'I\'ll send you the full property details including the Vastu analysis and climate report shortly.' },
      { id: 'price_drop', label: 'Price Negotiable', message: 'The seller may be open to negotiation. Would you like to discuss making an offer?' },
      { id: 'similar', label: 'Similar Properties', message: 'I have a few similar properties that might interest you. Would you like me to share them?' },
      { id: 'vastu_certified', label: 'Vastu Certified', message: 'This property has been certified as Vastu-compliant with a score of [X]/100. I can share the full analysis report.' },
      { id: 'climate_safe', label: 'Climate Safe', message: 'This property has a low climate risk rating with minimal flood and fire exposure projected through 2050.' },
      { id: 'thank_you', label: 'Thank You', message: 'Thank you for your interest! Please don\'t hesitate to reach out if you have any questions.' },
    ];
  } else {
    quickReplies = [
      { id: 'interested', label: 'I\'m Interested', message: 'I\'m very interested in this property. Can you tell me more about it?' },
      { id: 'schedule', label: 'Schedule Viewing', message: 'I\'d like to schedule a viewing. What times are available?' },
      { id: 'vastu', label: 'Vastu Info', message: 'Can you share the Vastu analysis for this property?' },
      { id: 'climate', label: 'Climate Report', message: 'I\'d like to see the climate risk assessment for this property.' },
      { id: 'price', label: 'Price Question', message: 'Is the price negotiable? What\'s the best offer you\'ve received?' },
      { id: 'similar', label: 'Similar Properties', message: 'Do you have similar properties in this area?' },
      { id: 'financing', label: 'Financing', message: 'What financing options are available for this property?' },
      { id: 'thank_you', label: 'Thank You', message: 'Thank you for the information! I\'ll get back to you soon.' },
    ];
  }
  
  res.json({
    success: true,
    data: { quickReplies },
  });
}));

export default router;

