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

const notificationPreferencesSchema = z.object({
  email: z.object({
    newListings: z.boolean().default(true),
    priceChanges: z.boolean().default(true),
    messages: z.boolean().default(true),
    showingReminders: z.boolean().default(true),
    auspiciousDates: z.boolean().default(true),
    climateAlerts: z.boolean().default(true),
    sensorAlerts: z.boolean().default(false),
    weeklyDigest: z.boolean().default(true),
  }).optional(),
  push: z.object({
    newListings: z.boolean().default(true),
    priceChanges: z.boolean().default(true),
    messages: z.boolean().default(true),
    showingReminders: z.boolean().default(true),
    auspiciousDates: z.boolean().default(false),
    climateAlerts: z.boolean().default(true),
    sensorAlerts: z.boolean().default(false),
  }).optional(),
  sms: z.object({
    messages: z.boolean().default(false),
    showingReminders: z.boolean().default(true),
    urgentAlerts: z.boolean().default(true),
  }).optional(),
});

const createNotificationSchema = z.object({
  userId: z.string().uuid(),
  type: z.enum([
    'NEW_LISTING', 'PRICE_CHANGE', 'NEW_LEAD', 'MESSAGE', 
    'SHOWING_REMINDER', 'AUSPICIOUS_DATE', 'CLIMATE_ALERT', 
    'SENSOR_ALERT', 'SYSTEM', 'PROPERTY_UPDATE', 'OFFER_RECEIVED',
    'OFFER_ACCEPTED', 'OFFER_REJECTED', 'DOCUMENT_READY',
    'VASTU_CERTIFICATE', 'TOKEN_REWARD', 'DAO_PROPOSAL'
  ]),
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(1000),
  data: z.record(z.any()).optional(),
  actionUrl: z.string().optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
});

// ============================================================================
// NOTIFICATIONS
// ============================================================================

// Get all notifications for user
router.get('/', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const unreadOnly = req.query.unreadOnly === 'true';
  const type = req.query.type as string;
  
  const where: any = { userId };
  
  if (unreadOnly) {
    where.read = false;
  }
  
  if (type) {
    where.type = type;
  }
  
  const [notifications, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.notification.count({ where }),
    prisma.notification.count({ where: { userId, read: false } }),
  ]);
  
  res.json({
    success: true,
    data: {
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
}));

// Get notification by ID
router.get('/:id', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  
  const notification = await prisma.notification.findUnique({
    where: { id },
  });
  
  if (!notification) {
    throw new NotFoundError('Notification not found');
  }
  
  if (notification.userId !== userId) {
    throw new ForbiddenError('Not authorized to view this notification');
  }
  
  // Mark as read
  if (!notification.read) {
    await prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }
  
  res.json({
    success: true,
    data: { notification },
  });
}));

// Mark notification as read
router.put('/:id/read', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  
  const notification = await prisma.notification.findUnique({
    where: { id },
  });
  
  if (!notification) {
    throw new NotFoundError('Notification not found');
  }
  
  if (notification.userId !== userId) {
    throw new ForbiddenError('Not authorized to update this notification');
  }
  
  await prisma.notification.update({
    where: { id },
    data: { read: true },
  });
  
  res.json({
    success: true,
    message: 'Notification marked as read',
  });
}));

// Mark all notifications as read
router.put('/read-all', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const type = req.query.type as string;
  
  const where: any = { userId, read: false };
  if (type) {
    where.type = type;
  }
  
  const result = await prisma.notification.updateMany({
    where,
    data: { read: true },
  });
  
  res.json({
    success: true,
    message: `${result.count} notifications marked as read`,
  });
}));

// Delete notification
router.delete('/:id', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  
  const notification = await prisma.notification.findUnique({
    where: { id },
  });
  
  if (!notification) {
    throw new NotFoundError('Notification not found');
  }
  
  if (notification.userId !== userId) {
    throw new ForbiddenError('Not authorized to delete this notification');
  }
  
  await prisma.notification.delete({ where: { id } });
  
  res.json({
    success: true,
    message: 'Notification deleted',
  });
}));

// Delete all read notifications
router.delete('/clear-read', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  
  const result = await prisma.notification.deleteMany({
    where: { userId, read: true },
  });
  
  res.json({
    success: true,
    message: `${result.count} notifications deleted`,
  });
}));

// Get unread count
router.get('/count/unread', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  
  const [total, byType] = await Promise.all([
    prisma.notification.count({ where: { userId, read: false } }),
    prisma.notification.groupBy({
      by: ['type'],
      where: { userId, read: false },
      _count: true,
    }),
  ]);
  
  const typeBreakdown = byType.reduce((acc, item) => {
    acc[item.type] = item._count;
    return acc;
  }, {} as Record<string, number>);
  
  res.json({
    success: true,
    data: {
      total,
      byType: typeBreakdown,
    },
  });
}));

// ============================================================================
// NOTIFICATION PREFERENCES
// ============================================================================

// Get notification preferences
router.get('/preferences', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  
  // Get or create preferences
  let preferences = await redis.get(`user:${userId}:notification_preferences`);
  
  if (!preferences) {
    // Default preferences
    preferences = JSON.stringify({
      email: {
        newListings: true,
        priceChanges: true,
        messages: true,
        showingReminders: true,
        auspiciousDates: true,
        climateAlerts: true,
        sensorAlerts: false,
        weeklyDigest: true,
      },
      push: {
        newListings: true,
        priceChanges: true,
        messages: true,
        showingReminders: true,
        auspiciousDates: false,
        climateAlerts: true,
        sensorAlerts: false,
      },
      sms: {
        messages: false,
        showingReminders: true,
        urgentAlerts: true,
      },
    });
  }
  
  res.json({
    success: true,
    data: { preferences: JSON.parse(preferences as string) },
  });
}));

// Update notification preferences
router.put('/preferences', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const validated = notificationPreferencesSchema.parse(req.body);
  
  // Get existing preferences
  let existing = await redis.get(`user:${userId}:notification_preferences`);
  let preferences = existing ? JSON.parse(existing as string) : {};
  
  // Merge with updates
  if (validated.email) {
    preferences.email = { ...preferences.email, ...validated.email };
  }
  if (validated.push) {
    preferences.push = { ...preferences.push, ...validated.push };
  }
  if (validated.sms) {
    preferences.sms = { ...preferences.sms, ...validated.sms };
  }
  
  // Save preferences
  await redis.setex(`user:${userId}:notification_preferences`, 86400 * 365, JSON.stringify(preferences));
  
  res.json({
    success: true,
    data: { preferences },
  });
}));

// ============================================================================
// ADMIN: CREATE NOTIFICATION
// ============================================================================

router.post('/admin/create', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const adminUser = (req as any).user;
  
  // Check if admin
  if (adminUser.userType !== 'ADMIN') {
    throw new ForbiddenError('Admin access required');
  }
  
  const validated = createNotificationSchema.parse(req.body);
  
  const notification = await prisma.notification.create({
    data: validated,
  });
  
  // Publish via Redis for real-time delivery
  await redisPub.publish(`user:${validated.userId}:notifications`, JSON.stringify({
    type: 'NEW_NOTIFICATION',
    notification,
  }));
  
  res.status(201).json({
    success: true,
    data: { notification },
  });
}));

// Broadcast notification to all users
router.post('/admin/broadcast', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const adminUser = (req as any).user;
  
  // Check if admin
  if (adminUser.userType !== 'ADMIN') {
    throw new ForbiddenError('Admin access required');
  }
  
  const { title, message, type = 'SYSTEM', data, actionUrl, userFilter } = req.body;
  
  if (!title || !message) {
    throw new BadRequestError('Title and message are required');
  }
  
  // Build user filter
  const where: any = {};
  if (userFilter?.userType) {
    where.userType = userFilter.userType;
  }
  
  // Get all matching users
  const users = await prisma.user.findMany({
    where,
    select: { id: true },
  });
  
  // Create notifications in batch
  const notifications = await prisma.notification.createMany({
    data: users.map(user => ({
      userId: user.id,
      type,
      title,
      message,
      data,
      actionUrl,
    })),
  });
  
  res.json({
    success: true,
    data: {
      sent: notifications.count,
      message: `Notification broadcast to ${notifications.count} users`,
    },
  });
}));

// ============================================================================
// NOTIFICATION TEMPLATES
// ============================================================================

// Get notification templates
router.get('/templates', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const templates = {
    NEW_LISTING: {
      title: 'New Listing Alert',
      message: 'A new property matching your search criteria has been listed: {propertyTitle} in {city}',
      variables: ['propertyTitle', 'city', 'price', 'bedrooms'],
    },
    PRICE_CHANGE: {
      title: 'Price Drop Alert',
      message: '{propertyTitle} has dropped in price from {oldPrice} to {newPrice} - a {percentChange}% reduction!',
      variables: ['propertyTitle', 'oldPrice', 'newPrice', 'percentChange'],
    },
    SHOWING_REMINDER: {
      title: 'Showing Reminder',
      message: 'Reminder: You have a showing scheduled for {propertyTitle} at {time} on {date}',
      variables: ['propertyTitle', 'time', 'date', 'agentName'],
    },
    AUSPICIOUS_DATE: {
      title: 'Auspicious Date Alert',
      message: '{date} is an auspicious day for {eventType} based on Vedic astrology. Consider scheduling your {eventType} on this date.',
      variables: ['date', 'eventType', 'nakshatra', 'tithi'],
    },
    CLIMATE_ALERT: {
      title: 'Climate Risk Update',
      message: 'Climate risk assessment has been updated for properties in {area}. {count} saved properties may be affected.',
      variables: ['area', 'count', 'riskType'],
    },
    SENSOR_ALERT: {
      title: 'Environmental Alert',
      message: '{sensorType} reading at {propertyAddress} has exceeded threshold: {reading} {unit}',
      variables: ['sensorType', 'propertyAddress', 'reading', 'unit', 'threshold'],
    },
    VASTU_CERTIFICATE: {
      title: 'Vastu Certificate Ready',
      message: 'The Vastu compliance certificate for {propertyTitle} is ready. Overall score: {score}/100 ({grade})',
      variables: ['propertyTitle', 'score', 'grade'],
    },
    TOKEN_REWARD: {
      title: 'Token Reward',
      message: 'You earned {amount} DHARMA tokens for {reason}. Your new balance is {balance}.',
      variables: ['amount', 'reason', 'balance'],
    },
    DAO_PROPOSAL: {
      title: 'New DAO Proposal',
      message: 'A new governance proposal has been submitted: "{proposalTitle}". Voting ends {endDate}.',
      variables: ['proposalTitle', 'endDate', 'proposalType'],
    },
  };
  
  res.json({
    success: true,
    data: { templates },
  });
}));

// ============================================================================
// HELPER: Send notification with template
// ============================================================================

export async function sendNotification(
  userId: string,
  type: string,
  variables: Record<string, any>,
  options?: {
    actionUrl?: string;
    priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  }
): Promise<void> {
  const templates: Record<string, { title: string; message: string }> = {
    NEW_LISTING: {
      title: 'New Listing Alert',
      message: `A new property matching your search: ${variables.propertyTitle} in ${variables.city}`,
    },
    PRICE_CHANGE: {
      title: 'Price Drop Alert',
      message: `${variables.propertyTitle} price dropped to ${variables.newPrice}`,
    },
    MESSAGE: {
      title: `New message from ${variables.senderName}`,
      message: variables.preview || 'You have a new message',
    },
    SHOWING_REMINDER: {
      title: 'Showing Reminder',
      message: `Showing for ${variables.propertyTitle} at ${variables.time}`,
    },
    AUSPICIOUS_DATE: {
      title: 'Auspicious Date',
      message: `${variables.date} is favorable for ${variables.eventType}`,
    },
  };
  
  const template = templates[type] || { title: type, message: JSON.stringify(variables) };
  
  const notification = await prisma.notification.create({
    data: {
      userId,
      type: type as any,
      title: template.title,
      message: template.message,
      data: variables,
      actionUrl: options?.actionUrl,
    },
  });
  
  // Publish for real-time delivery
  await redisPub.publish(`user:${userId}:notifications`, JSON.stringify({
    type: 'NEW_NOTIFICATION',
    notification,
  }));
}

export default router;
