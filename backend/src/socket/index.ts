import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { redis } from '../utils/redis';

const prisma = new PrismaClient();

// interface AuthenticatedSocket extends Socket {
//   userId?: string;
//   userType?: string;
//   agentId?: string;
// }
type AuthenticatedSocket = any;

interface JWTPayload {
  userId: string;
  userType: string;
  agentId?: string;
}

// Room types
const ROOM_TYPES = {
  USER: 'user',
  PROPERTY: 'property',
  OPEN_HOUSE: 'openhouse',
  VIRTUAL_TOUR: 'tour',
  AUCTION: 'auction',
  AGENT_DASHBOARD: 'agent',
} as const;

export function initializeWebSocket(httpServer: HTTPServer): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingInterval: 25000,
    pingTimeout: 60000,
  });

  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        // Allow anonymous connections for public features
        socket.userId = `anon_${socket.id}`;
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
      socket.userId = decoded.userId;
      socket.userType = decoded.userType;
      socket.agentId = decoded.agentId;

      // Update user's online status
      await redis.setex(`user:${decoded.userId}:online`, 300, 'true');
      await redis.sadd('online_users', decoded.userId);

      next();
    } catch (err) {
      socket.userId = `anon_${socket.id}`;
      next();
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`Client connected: ${socket.id} (User: ${socket.userId})`);

    // Join user's personal room
    if (socket.userId && !socket.userId.startsWith('anon_')) {
      socket.join(`${ROOM_TYPES.USER}:${socket.userId}`);

      // Subscribe to Redis channels for this user
      subscribeToUserChannels(socket);
    }

    // ============================================
    // MESSAGING HANDLERS
    // ============================================

    socket.on('message:send', async (data: {
      recipientId: string;
      content: string;
      type?: string;
      propertyId?: string;
      attachments?: any[];
    }) => {
      if (!socket.userId || socket.userId.startsWith('anon_')) {
        socket.emit('error', { message: 'Authentication required' });
        return;
      }

      try {
        // Create message in database
        const message = await prisma.message.create({
          data: {
            senderId: socket.userId,
            recipientId: data.recipientId,
            content: data.content,
            type: data.type || 'TEXT',
            propertyId: data.propertyId,
            attachments: data.attachments,
          },
          include: {
            sender: {
              select: { id: true, firstName: true, lastName: true, avatarUrl: true },
            },
          },
        });

        // Send to recipient
        io.to(`${ROOM_TYPES.USER}:${data.recipientId}`).emit('message:new', message);

        // Confirm to sender
        socket.emit('message:sent', message);

        // Create notification
        await createMessageNotification(data.recipientId, socket.userId, data.content);
      } catch (err) {
        console.error('Message send error:', err);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('message:typing', (data: { recipientId: string; isTyping: boolean }) => {
      if (!socket.userId) return;

      io.to(`${ROOM_TYPES.USER}:${data.recipientId}`).emit('message:typing', {
        senderId: socket.userId,
        isTyping: data.isTyping,
      });
    });

    socket.on('message:read', async (data: { messageId: string }) => {
      if (!socket.userId) return;

      try {
        const message = await prisma.message.update({
          where: { id: data.messageId },
          data: { readAt: new Date() },
        });

        // Notify sender
        io.to(`${ROOM_TYPES.USER}:${message.senderId}`).emit('message:read', {
          messageId: data.messageId,
          readAt: message.readAt,
        });
      } catch (err) {
        console.error('Message read error:', err);
      }
    });

    // ============================================
    // PROPERTY UPDATES HANDLERS
    // ============================================

    socket.on('property:subscribe', (propertyId: string) => {
      socket.join(`${ROOM_TYPES.PROPERTY}:${propertyId}`);
      console.log(`${socket.userId} subscribed to property ${propertyId}`);
    });

    socket.on('property:unsubscribe', (propertyId: string) => {
      socket.leave(`${ROOM_TYPES.PROPERTY}:${propertyId}`);
    });

    // Broadcast property updates (called from webhooks/API)
    socket.on('property:update', async (data: { propertyId: string; update: any }) => {
      // Only allow authenticated agents/owners
      if (!socket.userId || socket.userId.startsWith('anon_')) return;

      const property = await prisma.property.findUnique({
        where: { id: data.propertyId },
      });

      if (property?.ownerId !== socket.userId && property?.agentId !== socket.userId) {
        return;
      }

      io.to(`${ROOM_TYPES.PROPERTY}:${data.propertyId}`).emit('property:updated', {
        propertyId: data.propertyId,
        ...data.update,
        timestamp: new Date(),
      });
    });

    // ============================================
    // OPEN HOUSE HANDLERS
    // ============================================

    socket.on('openhouse:join', async (data: { openHouseId: string; visitorInfo?: any }) => {
      socket.join(`${ROOM_TYPES.OPEN_HOUSE}:${data.openHouseId}`);

      // Track visitor
      const visitorKey = `openhouse:${data.openHouseId}:visitors`;
      await redis.sadd(visitorKey, socket.userId || socket.id);

      // Get current count
      const visitorCount = await redis.scard(visitorKey);

      // Broadcast to all in room
      io.to(`${ROOM_TYPES.OPEN_HOUSE}:${data.openHouseId}`).emit('openhouse:visitor_joined', {
        visitorCount,
        visitorId: socket.userId || socket.id,
      });

      // Log attendance if authenticated
      if (socket.userId && !socket.userId.startsWith('anon_')) {
        await prisma.openHouseAttendee.upsert({
          where: {
            openHouseId_visitorId: {
              openHouseId: data.openHouseId,
              visitorId: socket.userId,
            },
          },
          update: { lastSeenAt: new Date() },
          create: {
            openHouseId: data.openHouseId,
            visitorId: socket.userId,
            visitorInfo: data.visitorInfo,
          },
        });
      }
    });

    socket.on('openhouse:leave', async (openHouseId: string) => {
      socket.leave(`${ROOM_TYPES.OPEN_HOUSE}:${openHouseId}`);

      const visitorKey = `openhouse:${openHouseId}:visitors`;
      await redis.srem(visitorKey, socket.userId || socket.id);

      const visitorCount = await redis.scard(visitorKey);

      io.to(`${ROOM_TYPES.OPEN_HOUSE}:${openHouseId}`).emit('openhouse:visitor_left', {
        visitorCount,
      });
    });

    socket.on('openhouse:question', async (data: { openHouseId: string; question: string }) => {
      if (!socket.userId) return;

      const user = await prisma.user.findUnique({
        where: { id: socket.userId },
        select: { firstName: true, lastName: true },
      });

      io.to(`${ROOM_TYPES.OPEN_HOUSE}:${data.openHouseId}`).emit('openhouse:new_question', {
        questionId: `q_${Date.now()}`,
        question: data.question,
        askedBy: user ? `${user.firstName} ${user.lastName?.charAt(0)}.` : 'Anonymous',
        timestamp: new Date(),
      });
    });

    // ============================================
    // VIRTUAL TOUR HANDLERS
    // ============================================

    socket.on('tour:join', async (data: { tourId: string; propertyId: string }) => {
      socket.join(`${ROOM_TYPES.VIRTUAL_TOUR}:${data.tourId}`);

      const participantKey = `tour:${data.tourId}:participants`;
      await redis.sadd(participantKey, socket.userId || socket.id);

      const participants = await redis.smembers(participantKey);

      io.to(`${ROOM_TYPES.VIRTUAL_TOUR}:${data.tourId}`).emit('tour:participant_joined', {
        participantId: socket.userId || socket.id,
        participantCount: participants.length,
      });
    });

    socket.on('tour:leave', async (tourId: string) => {
      socket.leave(`${ROOM_TYPES.VIRTUAL_TOUR}:${tourId}`);

      const participantKey = `tour:${tourId}:participants`;
      await redis.srem(participantKey, socket.userId || socket.id);
    });

    // Sync tour position (for guided tours)
    socket.on('tour:position_update', (data: {
      tourId: string;
      position: { x: number; y: number; z: number };
      rotation: { x: number; y: number };
      room?: string;
    }) => {
      // Broadcast to other participants
      socket.to(`${ROOM_TYPES.VIRTUAL_TOUR}:${data.tourId}`).emit('tour:position_sync', {
        participantId: socket.userId || socket.id,
        ...data,
      });
    });

    // Tour annotations/comments
    socket.on('tour:annotation', async (data: {
      tourId: string;
      propertyId: string;
      position: { x: number; y: number; z: number };
      content: string;
      type: 'comment' | 'question' | 'highlight';
    }) => {
      if (!socket.userId) return;

      const annotation = await prisma.tourAnnotation.create({
        data: {
          tourId: data.tourId,
          propertyId: data.propertyId,
          userId: socket.userId,
          position: data.position,
          content: data.content,
          type: data.type,
        },
        include: {
          user: {
            select: { firstName: true, lastName: true },
          },
        },
      });

      io.to(`${ROOM_TYPES.VIRTUAL_TOUR}:${data.tourId}`).emit('tour:new_annotation', annotation);
    });

    // ============================================
    // AUCTION HANDLERS
    // ============================================

    socket.on('auction:join', async (auctionId: string) => {
      socket.join(`${ROOM_TYPES.AUCTION}:${auctionId}`);

      // Get current auction state
      const auctionState = await redis.get(`auction:${auctionId}:state`);

      if (auctionState) {
        socket.emit('auction:state', JSON.parse(auctionState));
      }

      // Track bidders
      if (socket.userId && !socket.userId.startsWith('anon_')) {
        await redis.sadd(`auction:${auctionId}:bidders`, socket.userId);
      }

      const bidderCount = await redis.scard(`auction:${auctionId}:bidders`);
      io.to(`${ROOM_TYPES.AUCTION}:${auctionId}`).emit('auction:bidder_count', { count: bidderCount });
    });

    socket.on('auction:bid', async (data: { auctionId: string; amount: number }) => {
      if (!socket.userId || socket.userId.startsWith('anon_')) {
        socket.emit('error', { message: 'Authentication required to bid' });
        return;
      }

      try {
        // Get current auction state
        const stateStr = await redis.get(`auction:${data.auctionId}:state`);
        const state = stateStr ? JSON.parse(stateStr) : null;

        if (!state || state.status !== 'ACTIVE') {
          socket.emit('auction:bid_rejected', { reason: 'Auction not active' });
          return;
        }

        // Validate bid
        const minBid = state.currentBid + state.minIncrement;
        if (data.amount < minBid) {
          socket.emit('auction:bid_rejected', { reason: `Minimum bid is $${minBid}` });
          return;
        }

        // Get bidder info
        const user = await prisma.user.findUnique({
          where: { id: socket.userId },
          select: { firstName: true, lastName: true },
        });

        // Record bid
        const bid = await prisma.auctionBid.create({
          data: {
            auctionId: data.auctionId,
            bidderId: socket.userId,
            amount: data.amount,
          },
        });

        // Update auction state
        const newState = {
          ...state,
          currentBid: data.amount,
          highestBidderId: socket.userId,
          bidCount: state.bidCount + 1,
          lastBidAt: new Date().toISOString(),
        };

        await redis.setex(`auction:${data.auctionId}:state`, 86400, JSON.stringify(newState));

        // Broadcast to all
        io.to(`${ROOM_TYPES.AUCTION}:${data.auctionId}`).emit('auction:new_bid', {
          bidId: bid.id,
          amount: data.amount,
          bidderName: user ? `${user.firstName} ${user.lastName?.charAt(0)}.` : 'Anonymous',
          timestamp: new Date(),
          bidCount: newState.bidCount,
        });

        // Confirm to bidder
        socket.emit('auction:bid_accepted', { bidId: bid.id, amount: data.amount });

        // Extend auction if bid in last 2 minutes
        const timeLeft = new Date(state.endsAt).getTime() - Date.now();
        if (timeLeft < 120000) { // 2 minutes
          const extendedEndsAt = new Date(Date.now() + 120000);
          newState.endsAt = extendedEndsAt.toISOString();
          await redis.setex(`auction:${data.auctionId}:state`, 86400, JSON.stringify(newState));

          io.to(`${ROOM_TYPES.AUCTION}:${data.auctionId}`).emit('auction:extended', {
            endsAt: extendedEndsAt,
            reason: 'Bid in final minutes',
          });
        }
      } catch (err) {
        console.error('Auction bid error:', err);
        socket.emit('error', { message: 'Failed to place bid' });
      }
    });

    socket.on('auction:leave', (auctionId: string) => {
      socket.leave(`${ROOM_TYPES.AUCTION}:${auctionId}`);
    });

    // ============================================
    // AGENT DASHBOARD HANDLERS
    // ============================================

    socket.on('agent:subscribe', async () => {
      if (!socket.agentId) {
        socket.emit('error', { message: 'Agent authentication required' });
        return;
      }

      socket.join(`${ROOM_TYPES.AGENT_DASHBOARD}:${socket.agentId}`);

      // Send initial dashboard data
      const dashboardData = await getAgentDashboardData(socket.agentId);
      socket.emit('agent:dashboard_data', dashboardData);
    });

    // ============================================
    // PRESENCE & STATUS
    // ============================================

    socket.on('presence:update', async (status: 'online' | 'away' | 'busy' | 'offline') => {
      if (!socket.userId || socket.userId.startsWith('anon_')) return;

      await redis.setex(`user:${socket.userId}:status`, 300, status);

      // Notify contacts (simplified - in production, get actual contacts)
      socket.broadcast.emit('presence:changed', {
        userId: socket.userId,
        status,
      });
    });

    socket.on('presence:check', async (userIds: string[]) => {
      const statuses: Record<string, string> = {};

      for (const userId of userIds) {
        const status = await redis.get(`user:${userId}:status`);
        statuses[userId] = status || 'offline';
      }

      socket.emit('presence:status', statuses);
    });

    // ============================================
    // DISCONNECT HANDLER
    // ============================================

    socket.on('disconnect', async () => {
      console.log(`Client disconnected: ${socket.id}`);

      if (socket.userId && !socket.userId.startsWith('anon_')) {
        // Update offline status
        await redis.del(`user:${socket.userId}:online`);
        await redis.srem('online_users', socket.userId);
        await redis.setex(`user:${socket.userId}:status`, 300, 'offline');

        // Clean up from any open houses/tours
        const openHouseKeys = await redis.keys('openhouse:*:visitors');
        for (const key of openHouseKeys) {
          await redis.srem(key, socket.userId);
        }

        const tourKeys = await redis.keys('tour:*:participants');
        for (const key of tourKeys) {
          await redis.srem(key, socket.userId);
        }
      }
    });
  });

  // Redis subscription for cross-server events
  setupRedisSubscriptions(io);

  return io;
}

// Subscribe to user-specific Redis channels
async function subscribeToUserChannels(socket: AuthenticatedSocket) {
  if (!socket.userId) return;

  const subscriber = redis.duplicate();
  await subscriber.subscribe(
    `user:${socket.userId}:messages`,
    `user:${socket.userId}:notifications`
  );

  subscriber.on('message', (channel, message) => {
    try {
      const data = JSON.parse(message);

      if (channel.endsWith(':messages')) {
        socket.emit(`message:${data.type.toLowerCase()}`, data);
      } else if (channel.endsWith(':notifications')) {
        socket.emit('notification:new', data.notification);
      }
    } catch (err) {
      console.error('Redis message parse error:', err);
    }
  });

  socket.on('disconnect', () => {
    subscriber.unsubscribe();
    subscriber.quit();
  });
}

// Setup Redis subscriptions for cross-server events
function setupRedisSubscriptions(io: SocketIOServer) {
  const subscriber = redis.duplicate();

  subscriber.psubscribe('property:*:updates', 'property:*:alerts');

  subscriber.on('pmessage', (pattern, channel, message) => {
    try {
      const data = JSON.parse(message);
      const propertyId = channel.split(':')[1];

      if (pattern.includes('updates')) {
        io.to(`${ROOM_TYPES.PROPERTY}:${propertyId}`).emit('property:updated', data);
      } else if (pattern.includes('alerts')) {
        io.to(`${ROOM_TYPES.PROPERTY}:${propertyId}`).emit('property:alert', data);
      }
    } catch (err) {
      console.error('Redis pmessage error:', err);
    }
  });
}

// Helper to create message notification
async function createMessageNotification(recipientId: string, senderId: string, content: string) {
  const sender = await prisma.user.findUnique({
    where: { id: senderId },
    select: { firstName: true, lastName: true },
  });

  await prisma.notification.create({
    data: {
      userId: recipientId,
      type: 'MESSAGE',
      title: 'New Message',
      message: `${sender?.firstName || 'Someone'} sent you a message: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
      data: { senderId, preview: content.substring(0, 100) },
    },
  });
}

// Get agent dashboard real-time data
async function getAgentDashboardData(agentId: string) {
  const [
    activeListings,
    pendingLeads,
    todayShowings,
    unreadMessages,
    recentActivity,
  ] = await Promise.all([
    prisma.property.count({
      where: { agentId, status: 'ACTIVE' },
    }),
    prisma.lead.count({
      where: { agentId, status: { in: ['NEW', 'CONTACTED'] } },
    }),
    prisma.showing.count({
      where: {
        property: { agentId },
        scheduledAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
        status: 'SCHEDULED',
      },
    }),
    prisma.message.count({
      where: { recipientId: agentId, readAt: null },
    }),
    prisma.activity.findMany({
      where: { agentId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  return {
    stats: {
      activeListings,
      pendingLeads,
      todayShowings,
      unreadMessages,
    },
    recentActivity,
    lastUpdated: new Date(),
  };
}

// Export types for use in other modules
export type { AuthenticatedSocket };
