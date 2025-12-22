import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import redis from '../utils/redis';
import { authenticate, optionalAuthenticate, requireAgent, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import twilio from 'twilio';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const ChatGrant = AccessToken.ChatGrant;

// ============================================================================
// SCHEMAS
// ============================================================================

const CallTypeEnum = z.enum([
  'VIRTUAL_TOUR',
  'PROPERTY_WALKTHROUGH',
  'CONSULTATION',
  'SHOWING',
  'NEGOTIATION',
  'CLOSING_MEETING',
  'INTERVIEW',
  'SUPPORT',
  'OTHER',
]);

const CreateRoomSchema = z.object({
  name: z.string().max(200),
  type: CallTypeEnum,
  propertyId: z.string().uuid().optional(),
  transactionId: z.string().uuid().optional(),
  scheduledAt: z.string().datetime().optional(),
  duration: z.number().int().min(15).max(480).default(60), // minutes
  maxParticipants: z.number().int().min(2).max(50).default(10),
  isRecorded: z.boolean().default(false),
  waitingRoomEnabled: z.boolean().default(true),
  participants: z.array(z.object({
    userId: z.string().uuid().optional(),
    email: z.string().email(),
    name: z.string(),
    role: z.enum(['HOST', 'CO_HOST', 'PARTICIPANT', 'VIEWER']),
  })).optional(),
  settings: z.object({
    enableChat: z.boolean().default(true),
    enableScreenShare: z.boolean().default(true),
    enableWhiteboard: z.boolean().default(false),
    enableRecording: z.boolean().default(false),
    enableTranscription: z.boolean().default(false),
    autoStartRecording: z.boolean().default(false),
    muteOnEntry: z.boolean().default(false),
  }).optional(),
  description: z.string().max(1000).optional(),
  agenda: z.array(z.string()).optional(),
});

const UpdateRoomSchema = CreateRoomSchema.partial();

const ScheduleRecurringSchema = z.object({
  name: z.string().max(200),
  type: CallTypeEnum,
  pattern: z.enum(['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY']),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  occurrences: z.number().int().min(1).max(52).optional(),
  duration: z.number().int().min(15).max(480).default(60),
  participants: z.array(z.object({
    email: z.string().email(),
    name: z.string(),
    role: z.enum(['HOST', 'CO_HOST', 'PARTICIPANT']),
  })),
  settings: z.object({
    enableChat: z.boolean().default(true),
    enableScreenShare: z.boolean().default(true),
  }).optional(),
});

// ============================================================================
// ROOM MANAGEMENT
// ============================================================================

// Create video room
router.post('/rooms', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = CreateRoomSchema.parse(req.body);

  // Generate unique room name
  const roomUniqueName = `dharma-${uuidv4()}`;

  // Create Twilio room
  const twilioRoom = await twilioClient.video.v1.rooms.create({
    uniqueName: roomUniqueName,
    type: data.maxParticipants > 4 ? 'group' : 'group-small',
    maxParticipants: data.maxParticipants,
    recordParticipantsOnConnect: data.settings?.autoStartRecording || false,
    statusCallback: `${process.env.APP_URL}/api/video/webhook/room-status`,
    statusCallbackMethod: 'POST',
  });

  // Create room in database
  const room = await prisma.videoRoom.create({
    data: {
      twilioSid: twilioRoom.sid,
      uniqueName: roomUniqueName,
      name: data.name,
      type: data.type,
      propertyId: data.propertyId,
      transactionId: data.transactionId,
      hostId: req.user!.id,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      duration: data.duration,
      maxParticipants: data.maxParticipants,
      isRecorded: data.isRecorded,
      waitingRoomEnabled: data.waitingRoomEnabled,
      settings: data.settings || {},
      description: data.description,
      agenda: data.agenda || [],
      status: 'SCHEDULED',
    },
  });

  // Create participant records
  if (data.participants?.length) {
    await prisma.videoParticipant.createMany({
      data: data.participants.map(p => ({
        roomId: room.id,
        userId: p.userId,
        email: p.email,
        name: p.name,
        role: p.role,
        status: 'INVITED',
      })),
    });

    // Send invitations
    await prisma.notification.createMany({
      data: data.participants.map(p => ({
        userId: p.userId || p.email, // Will need to look up by email
        type: 'VIDEO_CALL_INVITATION',
        title: 'Video Call Invitation',
        message: `You've been invited to "${data.name}"${data.scheduledAt ? ` on ${new Date(data.scheduledAt).toLocaleString()}` : ''}`,
        data: { roomId: room.id },
      })),
    });
  }

  // Generate host token immediately
  const hostToken = generateAccessToken(req.user!.id, roomUniqueName, true);

  res.status(201).json({
    room,
    hostToken,
    joinUrl: `${process.env.APP_URL}/video/${room.id}`,
  });
}));

// List rooms
router.get('/rooms', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    status,
    type,
    propertyId,
    upcoming,
    past,
    limit = '20',
    offset = '0',
  } = req.query;

  const where: any = {
    OR: [
      { hostId: req.user!.id },
      { participants: { some: { userId: req.user!.id } } },
      { participants: { some: { email: req.user!.email } } },
    ],
  };

  if (status) where.status = status;
  if (type) where.type = type;
  if (propertyId) where.propertyId = propertyId;

  if (upcoming === 'true') {
    where.scheduledAt = { gte: new Date() };
    where.status = { in: ['SCHEDULED', 'IN_PROGRESS'] };
  }

  if (past === 'true') {
    where.OR = [
      { status: 'COMPLETED' },
      { endedAt: { lt: new Date() } },
    ];
  }

  const [rooms, total] = await Promise.all([
    prisma.videoRoom.findMany({
      where,
      include: {
        host: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        property: { select: { id: true, title: true, address: true, photos: { take: 1 } } },
        participants: { select: { name: true, role: true, status: true } },
        _count: { select: { participants: true, recordings: true } },
      },
      orderBy: { scheduledAt: 'asc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    }),
    prisma.videoRoom.count({ where }),
  ]);

  res.json({
    rooms,
    total,
    limit: parseInt(limit as string),
    offset: parseInt(offset as string),
  });
}));

// Get room details
router.get('/rooms/:id', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const room = await prisma.videoRoom.findFirst({
    where: {
      id,
      OR: [
        { hostId: req.user!.id },
        { participants: { some: { userId: req.user!.id } } },
        { participants: { some: { email: req.user!.email } } },
      ],
    },
    include: {
      host: { select: { id: true, firstName: true, lastName: true, avatar: true, email: true } },
      property: {
        select: {
          id: true,
          title: true,
          address: true,
          city: true,
          state: true,
          photos: { take: 5 },
        },
      },
      transaction: { select: { id: true, status: true } },
      participants: {
        include: {
          user: { select: { firstName: true, lastName: true, avatar: true } },
        },
      },
      recordings: true,
      chatMessages: {
        orderBy: { createdAt: 'asc' },
        take: 100,
      },
    },
  });

  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  // Get current participant count if room is live
  let currentParticipants = 0;
  if (room.status === 'IN_PROGRESS' && room.twilioSid) {
    try {
      const twilioRoom = await twilioClient.video.v1.rooms(room.twilioSid).fetch();
      currentParticipants = twilioRoom.maxParticipants; // Would need actual count from participants list
    } catch (e) {
      // Room may not exist yet in Twilio
    }
  }

  res.json({
    ...room,
    currentParticipants,
  });
}));

// Update room
router.put('/rooms/:id', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = UpdateRoomSchema.parse(req.body);

  const room = await prisma.videoRoom.findFirst({
    where: {
      id,
      hostId: req.user!.id,
      status: { in: ['SCHEDULED'] },
    },
  });

  if (!room) {
    return res.status(404).json({ error: 'Room not found or cannot be modified' });
  }

  const updated = await prisma.videoRoom.update({
    where: { id },
    data: {
      ...data,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
    },
  });

  // Notify participants of changes
  if (data.scheduledAt) {
    const participants = await prisma.videoParticipant.findMany({
      where: { roomId: id },
    });

    await prisma.notification.createMany({
      data: participants.map(p => ({
        userId: p.userId || p.email,
        type: 'VIDEO_CALL_UPDATED',
        title: 'Video Call Rescheduled',
        message: `"${updated.name}" has been rescheduled to ${new Date(data.scheduledAt!).toLocaleString()}`,
        data: { roomId: id },
      })),
    });
  }

  res.json(updated);
}));

// Cancel room
router.post('/rooms/:id/cancel', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;

  const room = await prisma.videoRoom.findFirst({
    where: {
      id,
      hostId: req.user!.id,
      status: { in: ['SCHEDULED'] },
    },
    include: { participants: true },
  });

  if (!room) {
    return res.status(404).json({ error: 'Room not found or cannot be cancelled' });
  }

  await prisma.videoRoom.update({
    where: { id },
    data: {
      status: 'CANCELLED',
      cancelledAt: new Date(),
      cancellationReason: reason,
    },
  });

  // Notify participants
  await prisma.notification.createMany({
    data: room.participants.map(p => ({
      userId: p.userId || p.email,
      type: 'VIDEO_CALL_CANCELLED',
      title: 'Video Call Cancelled',
      message: `"${room.name}" has been cancelled${reason ? `: ${reason}` : ''}`,
      data: { roomId: id },
    })),
  });

  res.json({ success: true, message: 'Room cancelled' });
}));

// ============================================================================
// JOIN & TOKENS
// ============================================================================

// Get access token to join room
router.post('/rooms/:id/token', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const room = await prisma.videoRoom.findFirst({
    where: {
      id,
      OR: [
        { hostId: req.user!.id },
        { participants: { some: { userId: req.user!.id } } },
        { participants: { some: { email: req.user!.email } } },
      ],
    },
    include: {
      participants: {
        where: {
          OR: [
            { userId: req.user!.id },
            { email: req.user!.email },
          ],
        },
      },
    },
  });

  if (!room) {
    return res.status(404).json({ error: 'Room not found or access denied' });
  }

  // Check waiting room
  if (room.waitingRoomEnabled && room.hostId !== req.user!.id) {
    const participant = room.participants[0];
    if (participant && participant.status === 'WAITING') {
      return res.status(403).json({
        error: 'Waiting for host approval',
        status: 'WAITING',
      });
    }
  }

  const isHost = room.hostId === req.user!.id;
  const token = generateAccessToken(req.user!.id, room.uniqueName, isHost);

  // Update participant status
  if (room.participants.length > 0) {
    await prisma.videoParticipant.update({
      where: { id: room.participants[0].id },
      data: { status: 'CONNECTED', joinedAt: new Date() },
    });
  }

  // Update room status if first join
  if (room.status === 'SCHEDULED') {
    await prisma.videoRoom.update({
      where: { id },
      data: { status: 'IN_PROGRESS', startedAt: new Date() },
    });
  }

  res.json({
    token,
    roomName: room.uniqueName,
    identity: req.user!.id,
    isHost,
  });
}));

// Generate guest token (for non-authenticated users)
router.post('/rooms/:id/guest-token', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: 'Email and name required' });
  }

  const room = await prisma.videoRoom.findFirst({
    where: {
      id,
      participants: { some: { email } },
    },
    include: {
      participants: { where: { email } },
    },
  });

  if (!room) {
    return res.status(403).json({ error: 'Not invited to this room' });
  }

  const participant = room.participants[0];

  // Check waiting room
  if (room.waitingRoomEnabled && participant.status === 'INVITED') {
    // Add to waiting room
    await prisma.videoParticipant.update({
      where: { id: participant.id },
      data: { status: 'WAITING' },
    });

    // Notify host
    await redis.publish(`video:${room.id}:waiting`, JSON.stringify({
      participantId: participant.id,
      email,
      name,
    }));

    return res.json({
      status: 'WAITING',
      message: 'Waiting for host to admit you',
    });
  }

  const guestId = `guest-${uuidv4()}`;
  const token = generateAccessToken(guestId, room.uniqueName, false);

  // Update participant
  await prisma.videoParticipant.update({
    where: { id: participant.id },
    data: { status: 'CONNECTED', joinedAt: new Date() },
  });

  res.json({
    token,
    roomName: room.uniqueName,
    identity: guestId,
    isHost: false,
  });
}));

// Admit participant from waiting room
router.post('/rooms/:id/admit', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { participantId, admit } = req.body;

  const room = await prisma.videoRoom.findFirst({
    where: { id, hostId: req.user!.id },
  });

  if (!room) {
    return res.status(403).json({ error: 'Only host can admit participants' });
  }

  if (admit) {
    await prisma.videoParticipant.update({
      where: { id: participantId },
      data: { status: 'ADMITTED' },
    });

    // Notify participant they can join
    await redis.publish(`video:${id}:admitted`, JSON.stringify({ participantId }));
  } else {
    await prisma.videoParticipant.update({
      where: { id: participantId },
      data: { status: 'REJECTED' },
    });
  }

  res.json({ success: true });
}));

// ============================================================================
// IN-CALL FEATURES
// ============================================================================

// Start recording
router.post('/rooms/:id/recording/start', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const room = await prisma.videoRoom.findFirst({
    where: { id, hostId: req.user!.id, status: 'IN_PROGRESS' },
  });

  if (!room) {
    return res.status(404).json({ error: 'Room not found or not in progress' });
  }

  // Start Twilio recording
  const recording = await twilioClient.video.v1.rooms(room.twilioSid!)
    .recordings.create();

  await prisma.videoRecording.create({
    data: {
      roomId: room.id,
      twilioSid: recording.sid,
      status: 'RECORDING',
      startedAt: new Date(),
      startedById: req.user!.id,
    },
  });

  // Notify participants
  await redis.publish(`video:${id}:recording`, JSON.stringify({ status: 'started' }));

  res.json({ success: true, recordingSid: recording.sid });
}));

// Stop recording
router.post('/rooms/:id/recording/stop', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const room = await prisma.videoRoom.findFirst({
    where: { id, hostId: req.user!.id },
    include: {
      recordings: { where: { status: 'RECORDING' } },
    },
  });

  if (!room || !room.recordings.length) {
    return res.status(404).json({ error: 'No active recording found' });
  }

  const recording = room.recordings[0];

  // Stop Twilio recording
  await twilioClient.video.v1.rooms(room.twilioSid!)
    .recordings(recording.twilioSid!)
    .update({ status: 'stopped' });

  await prisma.videoRecording.update({
    where: { id: recording.id },
    data: { status: 'STOPPED', endedAt: new Date() },
  });

  // Notify participants
  await redis.publish(`video:${id}:recording`, JSON.stringify({ status: 'stopped' }));

  res.json({ success: true });
}));

// Send chat message
router.post('/rooms/:id/chat', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { message, type = 'TEXT' } = req.body;

  const room = await prisma.videoRoom.findFirst({
    where: {
      id,
      OR: [
        { hostId: req.user!.id },
        { participants: { some: { userId: req.user!.id } } },
      ],
      status: 'IN_PROGRESS',
    },
  });

  if (!room) {
    return res.status(404).json({ error: 'Room not found or not active' });
  }

  const chatMessage = await prisma.videoChatMessage.create({
    data: {
      roomId: id,
      senderId: req.user!.id,
      message,
      type,
    },
    include: {
      sender: { select: { firstName: true, lastName: true, avatar: true } },
    },
  });

  // Broadcast via WebSocket/Redis
  await redis.publish(`video:${id}:chat`, JSON.stringify(chatMessage));

  res.status(201).json(chatMessage);
}));

// Share screen annotation/pointer
router.post('/rooms/:id/annotation', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { type, data } = req.body; // type: 'pointer', 'drawing', 'highlight'

  // Broadcast to all participants
  await redis.publish(`video:${id}:annotation`, JSON.stringify({
    userId: req.user!.id,
    type,
    data,
    timestamp: Date.now(),
  }));

  res.json({ success: true });
}));

// ============================================================================
// END CALL
// ============================================================================

// End room
router.post('/rooms/:id/end', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const room = await prisma.videoRoom.findFirst({
    where: {
      id,
      hostId: req.user!.id,
      status: 'IN_PROGRESS',
    },
    include: { participants: true },
  });

  if (!room) {
    return res.status(404).json({ error: 'Room not found or not in progress' });
  }

  // End Twilio room
  if (room.twilioSid) {
    try {
      await twilioClient.video.v1.rooms(room.twilioSid).update({ status: 'completed' });
    } catch (e) {
      // Room may already be ended
    }
  }

  // Calculate duration
  const duration = room.startedAt
    ? Math.round((Date.now() - room.startedAt.getTime()) / 60000)
    : 0;

  await prisma.videoRoom.update({
    where: { id },
    data: {
      status: 'COMPLETED',
      endedAt: new Date(),
      actualDuration: duration,
    },
  });

  // Update participant statuses
  await prisma.videoParticipant.updateMany({
    where: { roomId: id, status: 'CONNECTED' },
    data: { status: 'LEFT', leftAt: new Date() },
  });

  // Notify all participants
  await redis.publish(`video:${id}:ended`, JSON.stringify({ endedBy: req.user!.id }));

  res.json({ success: true, duration });
}));

// Leave room
router.post('/rooms/:id/leave', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  await prisma.videoParticipant.updateMany({
    where: {
      roomId: id,
      OR: [
        { userId: req.user!.id },
        { email: req.user!.email },
      ],
    },
    data: { status: 'LEFT', leftAt: new Date() },
  });

  // Notify others
  await redis.publish(`video:${id}:participant-left`, JSON.stringify({
    userId: req.user!.id,
  }));

  res.json({ success: true });
}));

// ============================================================================
// RECORDINGS
// ============================================================================

// List recordings
router.get('/recordings', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { roomId, limit = '20', offset = '0' } = req.query;

  const where: any = {
    room: {
      OR: [
        { hostId: req.user!.id },
        { participants: { some: { userId: req.user!.id } } },
      ],
    },
    status: 'COMPLETED',
  };

  if (roomId) where.roomId = roomId;

  const [recordings, total] = await Promise.all([
    prisma.videoRecording.findMany({
      where,
      include: {
        room: { select: { id: true, name: true, type: true } },
        startedBy: { select: { firstName: true, lastName: true } },
      },
      orderBy: { startedAt: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    }),
    prisma.videoRecording.count({ where }),
  ]);

  res.json({
    recordings,
    total,
    limit: parseInt(limit as string),
    offset: parseInt(offset as string),
  });
}));

// Get recording download URL
router.get('/recordings/:id/download', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const recording = await prisma.videoRecording.findFirst({
    where: {
      id,
      room: {
        OR: [
          { hostId: req.user!.id },
          { participants: { some: { userId: req.user!.id } } },
        ],
      },
    },
  });

  if (!recording) {
    return res.status(404).json({ error: 'Recording not found' });
  }

  if (!recording.s3Key) {
    return res.status(400).json({ error: 'Recording not yet processed' });
  }

  // Generate presigned URL
  const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');
  const { S3Client, GetObjectCommand } = await import('@aws-sdk/client-s3');

  const s3 = new S3Client({ region: process.env.AWS_REGION });
  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: recording.s3Key,
    }),
    { expiresIn: 3600 }
  );

  res.json({ url });
}));

// Delete recording
router.delete('/recordings/:id', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const recording = await prisma.videoRecording.findFirst({
    where: {
      id,
      room: { hostId: req.user!.id },
    },
  });

  if (!recording) {
    return res.status(404).json({ error: 'Recording not found' });
  }

  // Delete from S3
  if (recording.s3Key) {
    const { S3Client, DeleteObjectCommand } = await import('@aws-sdk/client-s3');
    const s3 = new S3Client({ region: process.env.AWS_REGION });
    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: recording.s3Key,
    }));
  }

  await prisma.videoRecording.delete({ where: { id } });

  res.json({ success: true, message: 'Recording deleted' });
}));

// ============================================================================
// WEBHOOKS
// ============================================================================

// Twilio room status webhook
router.post('/webhook/room-status', asyncHandler(async (req: Request, res: Response) => {
  const { RoomSid, RoomStatus, StatusCallbackEvent } = req.body;

  const room = await prisma.videoRoom.findFirst({
    where: { twilioSid: RoomSid },
  });

  if (!room) {
    return res.status(200).send('OK');
  }

  switch (StatusCallbackEvent) {
    case 'room-created':
      // Room is ready
      break;

    case 'room-ended':
      await prisma.videoRoom.update({
        where: { id: room.id },
        data: { status: 'COMPLETED', endedAt: new Date() },
      });
      break;

    case 'participant-connected': {
      const { ParticipantIdentity } = req.body;
      await prisma.videoParticipant.updateMany({
        where: { roomId: room.id, OR: [{ userId: ParticipantIdentity }, { email: ParticipantIdentity }] },
        data: { status: 'CONNECTED', joinedAt: new Date() },
      });
      break;
    }

    case 'participant-disconnected': {
      const { ParticipantIdentity: leftIdentity } = req.body;
      await prisma.videoParticipant.updateMany({
        where: { roomId: room.id, OR: [{ userId: leftIdentity }, { email: leftIdentity }] },
        data: { status: 'LEFT', leftAt: new Date() },
      });
      break;
    }

    case 'recording-started':
      break;

    case 'recording-completed': {
      const { RecordingSid } = req.body;
      // Get recording from Twilio and upload to S3
      const twilioRecording = await twilioClient.video.v1
        .recordings(RecordingSid)
        .fetch();

      // Download recording
      const response = await fetch(twilioRecording.links.media);
      const buffer = Buffer.from(await response.arrayBuffer());

      // Upload to S3
      const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
      const s3 = new S3Client({ region: process.env.AWS_REGION });
      const key = `recordings/${room.id}/${RecordingSid}.mkv`;

      await s3.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: 'video/x-matroska',
      }));

      await prisma.videoRecording.updateMany({
        where: { twilioSid: RecordingSid },
        data: {
          status: 'COMPLETED',
          s3Key: key,
          duration: twilioRecording.duration,
          size: buffer.length,
        },
      });
      break;
    }
  }

  res.status(200).send('OK');
}));

// ============================================================================
// RECURRING MEETINGS
// ============================================================================

// Schedule recurring meeting
router.post('/rooms/recurring', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = ScheduleRecurringSchema.parse(req.body);

  // Create recurring series
  const series = await prisma.videoRoomSeries.create({
    data: {
      name: data.name,
      type: data.type,
      pattern: data.pattern,
      hostId: req.user!.id,
      settings: data.settings || {},
      duration: data.duration,
    },
  });

  // Generate occurrences
  const occurrences = generateOccurrences(
    new Date(data.startDate),
    data.pattern,
    data.occurrences || 10,
    data.endDate ? new Date(data.endDate) : undefined
  );

  // Create rooms for each occurrence
  for (const date of occurrences) {
    const roomUniqueName = `dharma-${series.id}-${date.getTime()}`;

    const room = await prisma.videoRoom.create({
      data: {
        seriesId: series.id,
        uniqueName: roomUniqueName,
        name: data.name,
        type: data.type,
        hostId: req.user!.id,
        scheduledAt: date,
        duration: data.duration,
        settings: data.settings || {},
        status: 'SCHEDULED',
      },
    });

    // Add participants
    if (data.participants.length) {
      await prisma.videoParticipant.createMany({
        data: data.participants.map(p => ({
          roomId: room.id,
          email: p.email,
          name: p.name,
          role: p.role,
          status: 'INVITED',
        })),
      });
    }
  }

  res.status(201).json({
    series,
    occurrencesCreated: occurrences.length,
  });
}));

// Cancel recurring series
router.post('/rooms/recurring/:seriesId/cancel', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { seriesId } = req.params;
  const { cancelFuture = true } = req.body;

  const series = await prisma.videoRoomSeries.findFirst({
    where: { id: seriesId, hostId: req.user!.id },
  });

  if (!series) {
    return res.status(404).json({ error: 'Series not found' });
  }

  if (cancelFuture) {
    // Cancel all future rooms
    await prisma.videoRoom.updateMany({
      where: {
        seriesId,
        status: 'SCHEDULED',
        scheduledAt: { gte: new Date() },
      },
      data: { status: 'CANCELLED' },
    });
  }

  await prisma.videoRoomSeries.update({
    where: { id: seriesId },
    data: { isCancelled: true },
  });

  res.json({ success: true });
}));

// ============================================================================
// ANALYTICS
// ============================================================================

// Get video call analytics
router.get('/analytics', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { period = '30' } = req.query;
  const since = new Date(Date.now() - parseInt(period as string) * 24 * 60 * 60 * 1000);

  const where = {
    hostId: req.user!.id,
    createdAt: { gte: since },
  };

  const [total, byStatus, byType, avgDuration, totalParticipants] = await Promise.all([
    prisma.videoRoom.count({ where }),
    prisma.videoRoom.groupBy({
      by: ['status'],
      where,
      _count: true,
    }),
    prisma.videoRoom.groupBy({
      by: ['type'],
      where,
      _count: true,
    }),
    prisma.videoRoom.aggregate({
      where: { ...where, status: 'COMPLETED' },
      _avg: { actualDuration: true },
    }),
    prisma.videoParticipant.count({
      where: { room: where },
    }),
  ]);

  res.json({
    total,
    completed: byStatus.find(s => s.status === 'COMPLETED')?._count || 0,
    cancelled: byStatus.find(s => s.status === 'CANCELLED')?._count || 0,
    byType: byType.reduce((acc, t) => ({ ...acc, [t.type]: t._count }), {}),
    averageDuration: Math.round(avgDuration._avg.actualDuration || 0),
    totalParticipants,
    period: parseInt(period as string),
  });
}));

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateAccessToken(identity: string, roomName: string, isHost: boolean): string {
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_API_KEY!,
    process.env.TWILIO_API_SECRET!,
    { identity }
  );

  const videoGrant = new VideoGrant({
    room: roomName,
  });

  token.addGrant(videoGrant);

  // Add chat grant if enabled
  const chatGrant = new ChatGrant({
    serviceSid: process.env.TWILIO_CHAT_SERVICE_SID,
  });
  token.addGrant(chatGrant);

  return token.toJwt();
}

function generateOccurrences(
  startDate: Date,
  pattern: string,
  count: number,
  endDate?: Date
): Date[] {
  const occurrences: Date[] = [];
  let currentDate = new Date(startDate);

  while (occurrences.length < count && (!endDate || currentDate <= endDate)) {
    occurrences.push(new Date(currentDate));

    switch (pattern) {
      case 'DAILY':
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case 'WEEKLY':
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case 'BIWEEKLY':
        currentDate.setDate(currentDate.getDate() + 14);
        break;
      case 'MONTHLY':
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
    }
  }

  return occurrences;
}

export default router;
