// Socket.IO Handler Initialization
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from './config';
import { logger } from './utils/logger';

interface AuthenticatedSocket extends Socket {
    userId?: string;
    userType?: string;
}

export const initializeSocketHandlers = (io: SocketIOServer) => {
    // Authentication middleware for Socket.IO
    io.use((socket: AuthenticatedSocket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error('Authentication required'));
        }

        try {
            const decoded = jwt.verify(token, config.jwt.secret) as any;
            socket.userId = decoded.userId;
            socket.userType = decoded.userType;
            next();
        } catch (error) {
            next(new Error('Invalid token'));
        }
    });

    io.on('connection', (socket: AuthenticatedSocket) => {
        logger.info(`Socket connected: ${socket.id} (User: ${socket.userId})`);

        // Join user's room for personalized notifications
        if (socket.userId) {
            socket.join(`user:${socket.userId}`);
        }

        // Property viewing - for real-time viewer count
        socket.on('property:view', (propertyId: string) => {
            socket.join(`property:${propertyId}`);
            io.to(`property:${propertyId}`).emit('property:viewers', {
                propertyId,
                count: io.sockets.adapter.rooms.get(`property:${propertyId}`)?.size || 0,
            });
        });

        socket.on('property:leave', (propertyId: string) => {
            socket.leave(`property:${propertyId}`);
            io.to(`property:${propertyId}`).emit('property:viewers', {
                propertyId,
                count: io.sockets.adapter.rooms.get(`property:${propertyId}`)?.size || 0,
            });
        });

        // Chat / Messages
        socket.on('message:send', async (data: { recipientId: string; content: string }) => {
            io.to(`user:${data.recipientId}`).emit('message:new', {
                senderId: socket.userId,
                content: data.content,
                timestamp: new Date().toISOString(),
            });
        });

        socket.on('message:typing', (data: { recipientId: string }) => {
            io.to(`user:${data.recipientId}`).emit('message:typing', {
                senderId: socket.userId,
            });
        });

        // Disconnect
        socket.on('disconnect', () => {
            logger.info(`Socket disconnected: ${socket.id}`);
        });
    });

    return io;
};

// Helper to emit events from routes
export const emitToUser = (io: SocketIOServer, userId: string, event: string, data: any) => {
    io.to(`user:${userId}`).emit(event, data);
};

export const emitToProperty = (io: SocketIOServer, propertyId: string, event: string, data: any) => {
    io.to(`property:${propertyId}`).emit(event, data);
};
