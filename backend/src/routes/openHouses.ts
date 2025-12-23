import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { redis } from '../utils/redis';
import { authenticate, optionalAuthenticate, requireAgent, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// ============================================================================
// SCHEMAS
// ============================================================================

const CreateOpenHouseSchema = z.object({
  propertyId: z.string().uuid(),
  type: z.enum(['IN_PERSON', 'VIRTUAL', 'HYBRID']),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  title: z.string().max(200).optional(),
  description: z.string().max(2000).optional(),
  maxAttendees: z.number().int().min(1).max(500).optional(),
  requiresRSVP: z.boolean().default(false),
  isPrivate: z.boolean().default(false),
  // Virtual meeting details
  virtualPlatform: z.enum(['ZOOM', 'GOOGLE_MEET', 'TEAMS', 'CUSTOM']).optional(),
  virtualMeetingUrl: z.string().url().optional(),
  virtualMeetingId: z.string().optional(),
  virtualMeetingPassword: z.string().optional(),
  // In-person details
  parkingInstructions: z.string().max(500).optional(),
  entryInstructions: z.string().max(500).optional(),
  refreshmentsProvided: z.boolean().default(false),
  // Vastu-auspicious timing
  muhurat: z.object({
    nakshatra: z.string().optional(),
    tithi: z.string().optional(),
    isAuspicious: z.boolean().optional(),
  }).optional(),
  // Features
  features: z.array(z.string()).optional(), // e.g., ['3D_TOUR', 'LIVE_QA', 'REFRESHMENTS']
  tags: z.array(z.string()).optional(),
});

const UpdateOpenHouseSchema = CreateOpenHouseSchema.partial();

const RSVPSchema = z.object({
  attendeeCount: z.number().int().min(1).max(10).default(1),
  questions: z.string().max(1000).optional(),
  dietaryRestrictions: z.string().max(200).optional(),
  accessibilityNeeds: z.string().max(200).optional(),
  interestedInPrivateShowing: z.boolean().default(false),
});

const QuestionSchema = z.object({
  question: z.string().min(1).max(1000),
  isAnonymous: z.boolean().default(false),
});

const FeedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  overallImpression: z.enum(['VERY_NEGATIVE', 'NEGATIVE', 'NEUTRAL', 'POSITIVE', 'VERY_POSITIVE']),
  likedAspects: z.array(z.string()).optional(),
  dislikedAspects: z.array(z.string()).optional(),
  comments: z.string().max(2000).optional(),
  wouldRecommend: z.boolean().optional(),
  interestedInProperty: z.enum(['NOT_INTERESTED', 'SOMEWHAT_INTERESTED', 'VERY_INTERESTED', 'READY_TO_OFFER']).optional(),
  pricePerception: z.enum(['TOO_LOW', 'FAIR', 'SLIGHTLY_HIGH', 'TOO_HIGH']).optional(),
});

// ============================================================================
// OPEN HOUSE CRUD
// ============================================================================

// Create open house
router.post('/', authenticate, requireAgent, asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = CreateOpenHouseSchema.parse(req.body);
  
  // Verify property ownership
  const property = await prisma.property.findFirst({
    where: {
      id: data.propertyId,
      agentId: req.user!.agentId,
    },
  });
  
  if (!property) {
    return res.status(403).json({ error: 'Property not found or access denied' });
  }
  
  // Validate times
  const startTime = new Date(data.startTime);
  const endTime = new Date(data.endTime);
  
  if (startTime >= endTime) {
    return res.status(400).json({ error: 'End time must be after start time' });
  }
  
  if (startTime < new Date()) {
    return res.status(400).json({ error: 'Start time must be in the future' });
  }
  
  // Check for conflicting open houses
  const conflicting = await prisma.openHouse.findFirst({
    where: {
      propertyId: data.propertyId,
      status: { in: ['SCHEDULED', 'LIVE'] },
      OR: [
        { startTime: { lte: endTime }, endTime: { gte: startTime } },
      ],
    },
  });
  
  if (conflicting) {
    return res.status(400).json({ error: 'Conflicting open house already scheduled' });
  }
  
  // Generate virtual meeting link if needed
  let virtualDetails = {};
  if (data.type !== 'IN_PERSON' && !data.virtualMeetingUrl) {
    // Generate a custom meeting room
    virtualDetails = {
      virtualPlatform: 'CUSTOM',
      virtualMeetingId: uuidv4(),
      virtualMeetingUrl: `${process.env.APP_URL}/open-house/virtual/${uuidv4()}`,
    };
  }
  
  const openHouse = await prisma.openHouse.create({
    data: {
      ...data,
      ...virtualDetails,
      agentId: req.user!.agentId!,
      status: 'SCHEDULED',
    },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          address: true,
          city: true,
          state: true,
          price: true,
          photos: { take: 1 },
        },
      },
      agent: {
        select: {
          id: true,
          user: { select: { firstName: true, lastName: true } },
        },
      },
    },
  });
  
  // Schedule reminder notifications
  await prisma.scheduledNotification.createMany({
    data: [
      {
        openHouseId: openHouse.id,
        type: '24_HOUR_REMINDER',
        scheduledFor: new Date(startTime.getTime() - 24 * 60 * 60 * 1000),
      },
      {
        openHouseId: openHouse.id,
        type: '1_HOUR_REMINDER',
        scheduledFor: new Date(startTime.getTime() - 60 * 60 * 1000),
      },
    ],
  });
  
  // Notify users who favorited this property
  const favorites = await prisma.favorite.findMany({
    where: { propertyId: data.propertyId },
    select: { userId: true },
  });
  
  if (favorites.length > 0) {
    await prisma.notification.createMany({
      data: favorites.map(f => ({
        userId: f.userId,
        type: 'OPEN_HOUSE_SCHEDULED',
        title: 'Open House Scheduled',
        message: `An open house has been scheduled for ${property.title || property.address}`,
        data: { openHouseId: openHouse.id, propertyId: property.id },
      })),
    });
  }
  
  res.status(201).json(openHouse);
}));

// List open houses
router.get('/', optionalAuthenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    propertyId,
    agentId,
    type,
    status,
    city,
    startDate,
    endDate,
    upcoming,
    past,
    limit = '20',
    offset = '0',
  } = req.query;
  
  const where: any = {};
  
  if (propertyId) where.propertyId = propertyId;
  if (agentId) where.agentId = agentId;
  if (type) where.type = type;
  if (status) where.status = status;
  if (city) where.property = { city: { contains: city as string, mode: 'insensitive' } };
  
  if (startDate || endDate) {
    where.startTime = {};
    if (startDate) where.startTime.gte = new Date(startDate as string);
    if (endDate) where.startTime.lte = new Date(endDate as string);
  }
  
  if (upcoming === 'true') {
    where.startTime = { gte: new Date() };
    where.status = { in: ['SCHEDULED', 'LIVE'] };
  }
  
  if (past === 'true') {
    where.endTime = { lt: new Date() };
  }
  
  // Hide private open houses for non-authenticated users
  if (!req.user) {
    where.isPrivate = false;
  }
  
  const [openHouses, total] = await Promise.all([
    prisma.openHouse.findMany({
      where,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            address: true,
            city: true,
            state: true,
            price: true,
            bedrooms: true,
            bathrooms: true,
            squareFeet: true,
            photos: { take: 1 },
          },
        },
        agent: {
          select: {
            id: true,
            user: { select: { firstName: true, lastName: true, avatar: true } },
          },
        },
        _count: { select: { rsvps: true, attendances: true } },
      },
      orderBy: { startTime: 'asc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    }),
    prisma.openHouse.count({ where }),
  ]);
  
  res.json({
    openHouses,
    total,
    limit: parseInt(limit as string),
    offset: parseInt(offset as string),
  });
}));

// Get open house details
router.get('/:id', optionalAuthenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  const openHouse = await prisma.openHouse.findUnique({
    where: { id },
    include: {
      property: {
        include: {
          photos: true,
          vastu: { select: { overallScore: true, isCompliant: true } },
          climate: { select: { overallRiskScore: true } },
        },
      },
      agent: {
        select: {
          id: true,
          user: { select: { firstName: true, lastName: true, avatar: true, email: true, phone: true } },
          licenseNumber: true,
          specializations: true,
          karmicScore: true,
        },
      },
      rsvps: req.user ? {
        where: { userId: req.user.id },
        take: 1,
      } : false,
      questions: {
        where: { isApproved: true },
        orderBy: { upvotes: 'desc' },
        take: 20,
      },
      _count: {
        select: { rsvps: true, attendances: true, questions: true },
      },
    },
  });
  
  if (!openHouse) {
    return res.status(404).json({ error: 'Open house not found' });
  }
  
  // Check if private
  if (openHouse.isPrivate && !req.user) {
    return res.status(403).json({ error: 'This is a private open house' });
  }
  
  // Get live visitor count if currently active
  let liveVisitors = 0;
  if (openHouse.status === 'LIVE') {
    liveVisitors = await redis.scard(`openhouse:${id}:visitors`);
  }
  
  res.json({
    ...openHouse,
    liveVisitors,
    userRSVP: openHouse.rsvps?.[0] || null,
  });
}));

// Update open house
router.put('/:id', authenticate, requireAgent, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = UpdateOpenHouseSchema.parse(req.body);
  
  const openHouse = await prisma.openHouse.findFirst({
    where: {
      id,
      agentId: req.user!.agentId,
      status: { in: ['SCHEDULED'] }, // Can only update scheduled ones
    },
  });
  
  if (!openHouse) {
    return res.status(404).json({ error: 'Open house not found or cannot be modified' });
  }
  
  const updated = await prisma.openHouse.update({
    where: { id },
    data,
    include: {
      property: { select: { id: true, title: true, address: true } },
    },
  });
  
  // Notify RSVPed attendees of changes
  if (data.startTime || data.endTime) {
    const rsvps = await prisma.openHouseRSVP.findMany({
      where: { openHouseId: id, status: 'CONFIRMED' },
      select: { userId: true },
    });
    
    if (rsvps.length > 0) {
      await prisma.notification.createMany({
        data: rsvps.map(r => ({
          userId: r.userId,
          type: 'OPEN_HOUSE_UPDATED',
          title: 'Open House Time Changed',
          message: `The open house for ${updated.property.title || updated.property.address} has been rescheduled`,
          data: { openHouseId: id },
        })),
      });
    }
  }
  
  res.json(updated);
}));

// Cancel open house
router.post('/:id/cancel', authenticate, requireAgent, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  
  const openHouse = await prisma.openHouse.findFirst({
    where: {
      id,
      agentId: req.user!.agentId,
      status: { in: ['SCHEDULED', 'LIVE'] },
    },
    include: {
      property: { select: { title: true, address: true } },
    },
  });
  
  if (!openHouse) {
    return res.status(404).json({ error: 'Open house not found or already completed' });
  }
  
  await prisma.openHouse.update({
    where: { id },
    data: {
      status: 'CANCELLED',
      cancellationReason: reason,
      cancelledAt: new Date(),
    },
  });
  
  // Notify all RSVPed attendees
  const rsvps = await prisma.openHouseRSVP.findMany({
    where: { openHouseId: id },
    select: { userId: true },
  });
  
  if (rsvps.length > 0) {
    await prisma.notification.createMany({
      data: rsvps.map(r => ({
        userId: r.userId,
        type: 'OPEN_HOUSE_CANCELLED',
        title: 'Open House Cancelled',
        message: `The open house for ${openHouse.property.title || openHouse.property.address} has been cancelled${reason ? `: ${reason}` : ''}`,
        data: { openHouseId: id },
        priority: 'HIGH',
      })),
    });
  }
  
  res.json({ success: true, message: 'Open house cancelled' });
}));

// Start open house (go live)
router.post('/:id/start', authenticate, requireAgent, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  const openHouse = await prisma.openHouse.findFirst({
    where: {
      id,
      agentId: req.user!.agentId,
      status: 'SCHEDULED',
    },
  });
  
  if (!openHouse) {
    return res.status(404).json({ error: 'Open house not found or not in scheduled status' });
  }
  
  await prisma.openHouse.update({
    where: { id },
    data: {
      status: 'LIVE',
      actualStartTime: new Date(),
    },
  });
  
  // Initialize Redis tracking
  await redis.del(`openhouse:${id}:visitors`);
  await redis.set(`openhouse:${id}:status`, 'LIVE', 'EX', 86400);
  
  // Notify RSVPed attendees
  const rsvps = await prisma.openHouseRSVP.findMany({
    where: { openHouseId: id, status: 'CONFIRMED' },
    select: { userId: true },
  });
  
  if (rsvps.length > 0) {
    await prisma.notification.createMany({
      data: rsvps.map(r => ({
        userId: r.userId,
        type: 'OPEN_HOUSE_STARTED',
        title: 'Open House is Now Live!',
        message: 'The open house you RSVPed to is now live. Join now!',
        data: { openHouseId: id },
        priority: 'URGENT',
      })),
    });
  }
  
  res.json({ success: true, message: 'Open house is now live' });
}));

// End open house
router.post('/:id/end', authenticate, requireAgent, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  const openHouse = await prisma.openHouse.findFirst({
    where: {
      id,
      agentId: req.user!.agentId,
      status: 'LIVE',
    },
  });
  
  if (!openHouse) {
    return res.status(404).json({ error: 'Open house not found or not live' });
  }
  
  // Get final attendance count
  const attendanceCount = await prisma.openHouseAttendance.count({
    where: { openHouseId: id },
  });
  
  await prisma.openHouse.update({
    where: { id },
    data: {
      status: 'COMPLETED',
      actualEndTime: new Date(),
      actualAttendees: attendanceCount,
    },
  });
  
  // Clean up Redis
  await redis.del(`openhouse:${id}:visitors`);
  await redis.del(`openhouse:${id}:status`);
  
  // Send feedback request to attendees
  const attendances = await prisma.openHouseAttendance.findMany({
    where: { openHouseId: id },
    select: { userId: true },
  });
  
  if (attendances.length > 0) {
    await prisma.notification.createMany({
      data: attendances.map(a => ({
        userId: a.userId,
        type: 'FEEDBACK_REQUEST',
        title: 'How was the open house?',
        message: 'Please share your feedback about the open house you attended',
        data: { openHouseId: id },
      })),
    });
  }
  
  res.json({ success: true, message: 'Open house ended', attendanceCount });
}));

// ============================================================================
// RSVP MANAGEMENT
// ============================================================================

// RSVP to open house
router.post('/:id/rsvp', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = RSVPSchema.parse(req.body);
  
  const openHouse = await prisma.openHouse.findUnique({
    where: { id },
    include: {
      _count: { select: { rsvps: true } },
      property: { select: { title: true, address: true } },
    },
  });
  
  if (!openHouse) {
    return res.status(404).json({ error: 'Open house not found' });
  }
  
  if (openHouse.status !== 'SCHEDULED') {
    return res.status(400).json({ error: 'Cannot RSVP to this open house' });
  }
  
  // Check capacity
  if (openHouse.maxAttendees && openHouse._count.rsvps >= openHouse.maxAttendees) {
    return res.status(400).json({ error: 'Open house is at capacity' });
  }
  
  // Check for existing RSVP
  const existing = await prisma.openHouseRSVP.findUnique({
    where: {
      openHouseId_userId: {
        openHouseId: id,
        userId: req.user!.id,
      },
    },
  });
  
  if (existing) {
    return res.status(400).json({ error: 'You have already RSVPed to this open house' });
  }
  
  const rsvp = await prisma.openHouseRSVP.create({
    data: {
      openHouseId: id,
      userId: req.user!.id,
      ...data,
      status: 'CONFIRMED',
    },
  });
  
  // Create lead if user interested in private showing
  if (data.interestedInPrivateShowing) {
    await prisma.lead.create({
      data: {
        propertyId: openHouse.propertyId,
        agentId: openHouse.agentId,
        userId: req.user!.id,
        source: 'OPEN_HOUSE',
        status: 'NEW',
        notes: `Interested in private showing after open house. Questions: ${data.questions || 'None'}`,
      },
    });
  }
  
  // Notify agent
  await prisma.notification.create({
    data: {
      userId: openHouse.agentId,
      type: 'NEW_RSVP',
      title: 'New Open House RSVP',
      message: `Someone RSVPed to your open house for ${openHouse.property.title || openHouse.property.address}`,
      data: { openHouseId: id, rsvpId: rsvp.id },
    },
  });
  
  res.status(201).json(rsvp);
}));

// Cancel RSVP
router.delete('/:id/rsvp', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  const rsvp = await prisma.openHouseRSVP.findUnique({
    where: {
      openHouseId_userId: {
        openHouseId: id,
        userId: req.user!.id,
      },
    },
  });
  
  if (!rsvp) {
    return res.status(404).json({ error: 'RSVP not found' });
  }
  
  await prisma.openHouseRSVP.update({
    where: { id: rsvp.id },
    data: { status: 'CANCELLED' },
  });
  
  res.json({ success: true, message: 'RSVP cancelled' });
}));

// Get RSVPs for open house (agent only)
router.get('/:id/rsvps', authenticate, requireAgent, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  const openHouse = await prisma.openHouse.findFirst({
    where: {
      id,
      agentId: req.user!.agentId,
    },
  });
  
  if (!openHouse) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const rsvps = await prisma.openHouseRSVP.findMany({
    where: { openHouseId: id },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });
  
  const stats = {
    total: rsvps.length,
    confirmed: rsvps.filter(r => r.status === 'CONFIRMED').length,
    cancelled: rsvps.filter(r => r.status === 'CANCELLED').length,
    totalAttendees: rsvps.reduce((sum, r) => sum + r.attendeeCount, 0),
    interestedInPrivateShowing: rsvps.filter(r => r.interestedInPrivateShowing).length,
  };
  
  res.json({ rsvps, stats });
}));

// ============================================================================
// ATTENDANCE & CHECK-IN
// ============================================================================

// Check in to open house
router.post('/:id/checkin', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { checkInMethod = 'APP' } = req.body;
  
  const openHouse = await prisma.openHouse.findUnique({
    where: { id },
  });
  
  if (!openHouse) {
    return res.status(404).json({ error: 'Open house not found' });
  }
  
  if (openHouse.status !== 'LIVE') {
    return res.status(400).json({ error: 'Open house is not currently live' });
  }
  
  // Check for existing attendance
  const existing = await prisma.openHouseAttendance.findUnique({
    where: {
      openHouseId_userId: {
        openHouseId: id,
        userId: req.user!.id,
      },
    },
  });
  
  if (existing) {
    return res.status(400).json({ error: 'Already checked in' });
  }
  
  const attendance = await prisma.openHouseAttendance.create({
    data: {
      openHouseId: id,
      userId: req.user!.id,
      checkInTime: new Date(),
      checkInMethod,
    },
  });
  
  // Update RSVP if exists
  await prisma.openHouseRSVP.updateMany({
    where: {
      openHouseId: id,
      userId: req.user!.id,
    },
    data: { attended: true },
  });
  
  // Track in Redis for real-time
  await redis.sadd(`openhouse:${id}:visitors`, req.user!.id);
  
  res.status(201).json(attendance);
}));

// Check out from open house
router.post('/:id/checkout', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  const attendance = await prisma.openHouseAttendance.findUnique({
    where: {
      openHouseId_userId: {
        openHouseId: id,
        userId: req.user!.id,
      },
    },
  });
  
  if (!attendance) {
    return res.status(404).json({ error: 'Not checked in' });
  }
  
  const checkOutTime = new Date();
  const duration = Math.round((checkOutTime.getTime() - attendance.checkInTime.getTime()) / 60000);
  
  await prisma.openHouseAttendance.update({
    where: { id: attendance.id },
    data: {
      checkOutTime,
      duration,
    },
  });
  
  // Remove from Redis
  await redis.srem(`openhouse:${id}:visitors`, req.user!.id);
  
  res.json({ success: true, duration });
}));

// Get attendance list (agent only)
router.get('/:id/attendance', authenticate, requireAgent, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  const openHouse = await prisma.openHouse.findFirst({
    where: {
      id,
      agentId: req.user!.agentId,
    },
  });
  
  if (!openHouse) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const attendances = await prisma.openHouseAttendance.findMany({
    where: { openHouseId: id },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
      feedback: true,
    },
    orderBy: { checkInTime: 'asc' },
  });
  
  const stats = {
    total: attendances.length,
    averageDuration: attendances.filter(a => a.duration).reduce((sum, a) => sum + (a.duration || 0), 0) / attendances.length || 0,
    withFeedback: attendances.filter(a => a.feedback).length,
    currentlyPresent: await redis.scard(`openhouse:${id}:visitors`),
  };
  
  res.json({ attendances, stats });
}));

// ============================================================================
// QUESTIONS & Q&A
// ============================================================================

// Ask a question
router.post('/:id/questions', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = QuestionSchema.parse(req.body);
  
  const openHouse = await prisma.openHouse.findUnique({
    where: { id },
  });
  
  if (!openHouse) {
    return res.status(404).json({ error: 'Open house not found' });
  }
  
  const question = await prisma.openHouseQuestion.create({
    data: {
      openHouseId: id,
      userId: req.user!.id,
      question: data.question,
      isAnonymous: data.isAnonymous,
      isApproved: true, // Auto-approve, agent can hide later
    },
    include: {
      user: data.isAnonymous ? false : {
        select: { firstName: true, lastName: true },
      },
    },
  });
  
  // Broadcast via WebSocket if open house is live
  if (openHouse.status === 'LIVE') {
    await redis.publish(`openhouse:${id}:questions`, JSON.stringify(question));
  }
  
  res.status(201).json(question);
}));

// Get questions
router.get('/:id/questions', optionalAuthenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { answered, limit = '50' } = req.query;
  
  const where: any = {
    openHouseId: id,
    isApproved: true,
  };
  
  if (answered === 'true') where.isAnswered = true;
  if (answered === 'false') where.isAnswered = false;
  
  const questions = await prisma.openHouseQuestion.findMany({
    where,
    include: {
      user: {
        select: { firstName: true, lastName: true },
      },
    },
    orderBy: [{ upvotes: 'desc' }, { createdAt: 'asc' }],
    take: parseInt(limit as string),
  });
  
  // Hide user info for anonymous questions
  const processed = questions.map(q => ({
    ...q,
    user: q.isAnonymous ? null : q.user,
  }));
  
  res.json(processed);
}));

// Upvote a question
router.post('/:id/questions/:questionId/upvote', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { questionId } = req.params;
  
  // Check for existing upvote
  const existing = await prisma.questionUpvote.findUnique({
    where: {
      questionId_userId: {
        questionId,
        userId: req.user!.id,
      },
    },
  });
  
  if (existing) {
    // Remove upvote
    await prisma.questionUpvote.delete({ where: { id: existing.id } });
    await prisma.openHouseQuestion.update({
      where: { id: questionId },
      data: { upvotes: { decrement: 1 } },
    });
    return res.json({ upvoted: false });
  }
  
  // Add upvote
  await prisma.questionUpvote.create({
    data: { questionId, userId: req.user!.id },
  });
  await prisma.openHouseQuestion.update({
    where: { id: questionId },
    data: { upvotes: { increment: 1 } },
  });
  
  res.json({ upvoted: true });
}));

// Answer a question (agent only)
router.post('/:id/questions/:questionId/answer', authenticate, requireAgent, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id, questionId } = req.params;
  const { answer } = req.body;
  
  const openHouse = await prisma.openHouse.findFirst({
    where: {
      id,
      agentId: req.user!.agentId,
    },
  });
  
  if (!openHouse) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const question = await prisma.openHouseQuestion.update({
    where: { id: questionId },
    data: {
      answer,
      isAnswered: true,
      answeredAt: new Date(),
    },
  });
  
  // Broadcast via WebSocket if live
  if (openHouse.status === 'LIVE') {
    await redis.publish(`openhouse:${id}:answers`, JSON.stringify(question));
  }
  
  res.json(question);
}));

// ============================================================================
// FEEDBACK
// ============================================================================

// Submit feedback
router.post('/:id/feedback', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = FeedbackSchema.parse(req.body);
  
  // Check user attended
  const attendance = await prisma.openHouseAttendance.findUnique({
    where: {
      openHouseId_userId: {
        openHouseId: id,
        userId: req.user!.id,
      },
    },
  });
  
  if (!attendance) {
    return res.status(403).json({ error: 'You must attend the open house to leave feedback' });
  }
  
  // Check for existing feedback
  const existing = await prisma.openHouseFeedback.findFirst({
    where: {
      openHouseId: id,
      userId: req.user!.id,
    },
  });
  
  if (existing) {
    return res.status(400).json({ error: 'You have already submitted feedback' });
  }
  
  const feedback = await prisma.openHouseFeedback.create({
    data: {
      openHouseId: id,
      userId: req.user!.id,
      attendanceId: attendance.id,
      ...data,
    },
  });
  
  // Create lead if very interested or ready to offer
  if (data.interestedInProperty === 'VERY_INTERESTED' || data.interestedInProperty === 'READY_TO_OFFER') {
    const openHouse = await prisma.openHouse.findUnique({
      where: { id },
    });
    
    if (openHouse) {
      await prisma.lead.create({
        data: {
          propertyId: openHouse.propertyId,
          agentId: openHouse.agentId,
          userId: req.user!.id,
          source: 'OPEN_HOUSE',
          status: data.interestedInProperty === 'READY_TO_OFFER' ? 'HOT' : 'WARM',
          notes: `From open house feedback: ${data.interestedInProperty}. Comments: ${data.comments || 'None'}`,
          priority: data.interestedInProperty === 'READY_TO_OFFER' ? 'HIGH' : 'MEDIUM',
        },
      });
    }
  }
  
  res.status(201).json(feedback);
}));

// Get feedback summary (agent only)
router.get('/:id/feedback', authenticate, requireAgent, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  const openHouse = await prisma.openHouse.findFirst({
    where: {
      id,
      agentId: req.user!.agentId,
    },
  });
  
  if (!openHouse) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const feedback = await prisma.openHouseFeedback.findMany({
    where: { openHouseId: id },
    include: {
      user: {
        select: { firstName: true, lastName: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  
  // Calculate statistics
  const stats = {
    total: feedback.length,
    averageRating: feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length || 0,
    impressions: {
      veryPositive: feedback.filter(f => f.overallImpression === 'VERY_POSITIVE').length,
      positive: feedback.filter(f => f.overallImpression === 'POSITIVE').length,
      neutral: feedback.filter(f => f.overallImpression === 'NEUTRAL').length,
      negative: feedback.filter(f => f.overallImpression === 'NEGATIVE').length,
      veryNegative: feedback.filter(f => f.overallImpression === 'VERY_NEGATIVE').length,
    },
    interest: {
      readyToOffer: feedback.filter(f => f.interestedInProperty === 'READY_TO_OFFER').length,
      veryInterested: feedback.filter(f => f.interestedInProperty === 'VERY_INTERESTED').length,
      somewhatInterested: feedback.filter(f => f.interestedInProperty === 'SOMEWHAT_INTERESTED').length,
      notInterested: feedback.filter(f => f.interestedInProperty === 'NOT_INTERESTED').length,
    },
    pricePerception: {
      tooLow: feedback.filter(f => f.pricePerception === 'TOO_LOW').length,
      fair: feedback.filter(f => f.pricePerception === 'FAIR').length,
      slightlyHigh: feedback.filter(f => f.pricePerception === 'SLIGHTLY_HIGH').length,
      tooHigh: feedback.filter(f => f.pricePerception === 'TOO_HIGH').length,
    },
    wouldRecommend: feedback.filter(f => f.wouldRecommend).length,
    // Aggregate liked/disliked aspects
    likedAspects: feedback.flatMap(f => f.likedAspects || []).reduce((acc, aspect) => {
      acc[aspect] = (acc[aspect] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    dislikedAspects: feedback.flatMap(f => f.dislikedAspects || []).reduce((acc, aspect) => {
      acc[aspect] = (acc[aspect] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
  
  res.json({ feedback, stats });
}));

// ============================================================================
// ANALYTICS
// ============================================================================

// Get open house analytics (agent only)
router.get('/:id/analytics', authenticate, requireAgent, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  const openHouse = await prisma.openHouse.findFirst({
    where: {
      id,
      agentId: req.user!.agentId,
    },
    include: {
      property: { select: { id: true, title: true, price: true } },
    },
  });
  
  if (!openHouse) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const [rsvps, attendances, feedback, questions, leads] = await Promise.all([
    prisma.openHouseRSVP.count({ where: { openHouseId: id } }),
    prisma.openHouseAttendance.findMany({
      where: { openHouseId: id },
      select: { duration: true, checkInMethod: true },
    }),
    prisma.openHouseFeedback.aggregate({
      where: { openHouseId: id },
      _avg: { rating: true },
      _count: true,
    }),
    prisma.openHouseQuestion.count({ where: { openHouseId: id } }),
    prisma.lead.count({
      where: {
        propertyId: openHouse.propertyId,
        source: 'OPEN_HOUSE',
        createdAt: { gte: openHouse.startTime },
      },
    }),
  ]);
  
  const analytics = {
    overview: {
      totalRSVPs: rsvps,
      totalAttendees: attendances.length,
      showRate: rsvps > 0 ? Math.round((attendances.length / rsvps) * 100) : 0,
      averageDuration: attendances.filter(a => a.duration).reduce((sum, a) => sum + (a.duration || 0), 0) / attendances.length || 0,
      totalQuestions: questions,
      leadsGenerated: leads,
      averageRating: feedback._avg.rating || 0,
      feedbackCount: feedback._count,
    },
    checkInMethods: attendances.reduce((acc, a) => {
      acc[a.checkInMethod || 'UNKNOWN'] = (acc[a.checkInMethod || 'UNKNOWN'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    conversionFunnel: {
      propertyViews: await prisma.propertyView.count({
        where: {
          propertyId: openHouse.propertyId,
          viewedAt: { gte: new Date(openHouse.createdAt.getTime() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
      rsvps,
      attended: attendances.length,
      leadsGenerated: leads,
    },
  };
  
  res.json(analytics);
}));

// Agent dashboard - all open houses analytics
router.get('/analytics/dashboard', authenticate, requireAgent, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { period = '30' } = req.query;
  const since = new Date(Date.now() - parseInt(period as string) * 24 * 60 * 60 * 1000);
  
  const openHouses = await prisma.openHouse.findMany({
    where: {
      agentId: req.user!.agentId,
      startTime: { gte: since },
    },
    include: {
      property: { select: { id: true, title: true, city: true } },
      _count: {
        select: { rsvps: true, attendances: true, feedback: true },
      },
    },
    orderBy: { startTime: 'desc' },
  });
  
  const stats = {
    totalOpenHouses: openHouses.length,
    completed: openHouses.filter(oh => oh.status === 'COMPLETED').length,
    scheduled: openHouses.filter(oh => oh.status === 'SCHEDULED').length,
    cancelled: openHouses.filter(oh => oh.status === 'CANCELLED').length,
    totalRSVPs: openHouses.reduce((sum, oh) => sum + oh._count.rsvps, 0),
    totalAttendees: openHouses.reduce((sum, oh) => sum + oh._count.attendances, 0),
    averageShowRate: openHouses.length > 0 
      ? Math.round(openHouses.reduce((sum, oh) => {
          return sum + (oh._count.rsvps > 0 ? oh._count.attendances / oh._count.rsvps : 0);
        }, 0) / openHouses.length * 100)
      : 0,
    leadsGenerated: await prisma.lead.count({
      where: {
        agentId: req.user!.agentId,
        source: 'OPEN_HOUSE',
        createdAt: { gte: since },
      },
    }),
  };
  
  // Top performing properties by attendance
  const topProperties = openHouses
    .filter(oh => oh.status === 'COMPLETED')
    .sort((a, b) => b._count.attendances - a._count.attendances)
    .slice(0, 5)
    .map(oh => ({
      propertyId: oh.property.id,
      title: oh.property.title,
      city: oh.property.city,
      attendees: oh._count.attendances,
      date: oh.startTime,
    }));
  
  res.json({ stats, openHouses, topProperties });
}));

// ============================================================================
// CALENDAR INTEGRATION
// ============================================================================

// Get calendar feed URL
router.get('/calendar/feed', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  // Generate a unique calendar token for the user
  let token = await redis.get(`calendar:token:${req.user!.id}`);
  
  if (!token) {
    token = uuidv4();
    await redis.set(`calendar:token:${req.user!.id}`, token);
    await redis.set(`calendar:user:${token}`, req.user!.id);
  }
  
  const feedUrl = `${process.env.APP_URL}/api/openhouses/calendar/${token}.ics`;
  
  res.json({ feedUrl });
}));

// ICS calendar feed (public endpoint with token auth)
router.get('/calendar/:token.ics', asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;
  
  const userId = await redis.get(`calendar:user:${token}`);
  
  if (!userId) {
    return res.status(401).json({ error: 'Invalid calendar token' });
  }
  
  // Get user's RSVPed open houses
  const rsvps = await prisma.openHouseRSVP.findMany({
    where: {
      userId,
      status: 'CONFIRMED',
      openHouse: {
        status: { in: ['SCHEDULED', 'LIVE'] },
      },
    },
    include: {
      openHouse: {
        include: {
          property: { select: { address: true, city: true, state: true } },
        },
      },
    },
  });
  
  // Generate ICS content
  let ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//REST-iN-U//Open Houses//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:REST-iN-U Open Houses
`;

  for (const rsvp of rsvps) {
    const oh = rsvp.openHouse;
    const location = `${oh.property.address}, ${oh.property.city}, ${oh.property.state}`;
    
    ics += `BEGIN:VEVENT
UID:${oh.id}@restinu.com
DTSTART:${formatICSDate(oh.startTime)}
DTEND:${formatICSDate(oh.endTime)}
SUMMARY:Open House: ${oh.title || location}
LOCATION:${oh.type === 'VIRTUAL' ? oh.virtualMeetingUrl : location}
DESCRIPTION:${oh.description || ''}
STATUS:CONFIRMED
END:VEVENT
`;
  }

  ics += 'END:VCALENDAR';

  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="openhouses.ics"');
  res.send(ics);
}));

function formatICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export default router;

