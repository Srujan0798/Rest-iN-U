import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

interface AuthenticatedSocket extends Socket {
    userId?: string;
    userType?: string;
}

export function initializeSocketIO(httpServer: HTTPServer) {
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true,
        },
    });

    // Authentication middleware
    io.use(async (socket: AuthenticatedSocket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication required'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; userType: string };
            socket.userId = decoded.userId;
            socket.userType = decoded.userType;
            next();
        } catch (error) {
            next(new Error('Invalid token'));
        }
    });

    // Track online users
    const onlineUsers = new Map<string, string>(); // UserId -> SocketId

    io.on('connection', (socket: AuthenticatedSocket) => {
        console.log(`User connected: ${socket.userId}`);

        // Add to online users
        if (socket.userId) {
            onlineUsers.set(socket.userId, socket.id);
            io.emit('user_online', { userId: socket.userId });
        }

        // Join personal room for direct messages
        socket.join(`user:${socket.userId}`);

        // =====================================
        // MESSAGING EVENTS
        // =====================================

        // Send message
        socket.on('send_message', async (data: { receiverId: string; content: string; propertyId?: string }) => {
            try {
                // Save to database
                const message = await prisma.message.create({
                    data: {
                        senderId: socket.userId!,
                        receiverId: data.receiverId,
                        content: data.content,
                        propertyId: data.propertyId,
                    },
                    include: {
                        sender: {
                            select: { id: true, firstName: true, lastName: true, profilePhoto: true },
                        },
                    },
                });

                // Emit to sender for confirmation
                socket.emit('message_sent', { message });

                // Emit to receiver if online
                io.to(`user:${data.receiverId}`).emit('new_message', { message });

            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Mark messages as read
        socket.on('mark_read', async (data: { senderId: string }) => {
            try {
                await prisma.message.updateMany({
                    where: {
                        senderId: data.senderId,
                        receiverId: socket.userId,
                        read: false,
                    },
                    data: { read: true },
                });

                // Notify sender that messages were read
                io.to(`user:${data.senderId}`).emit('messages_read', {
                    readBy: socket.userId,
                });
            } catch (error) {
                console.error('Error marking read:', error);
            }
        });

        // Typing indicator
        socket.on('typing_start', (data: { receiverId: string }) => {
            io.to(`user:${data.receiverId}`).emit('user_typing', {
                userId: socket.userId,
                isTyping: true,
            });
        });

        socket.on('typing_stop', (data: { receiverId: string }) => {
            io.to(`user:${data.receiverId}`).emit('user_typing', {
                userId: socket.userId,
                isTyping: false,
            });
        });

        // =====================================
        // AGENT NOTIFICATION EVENTS
        // =====================================

        // New lead notification
        socket.on('new_lead', async (data: { agentId: string; leadId: string }) => {
            io.to(`user:${data.agentId}`).emit('lead_received', { leadId: data.leadId });
        });

        // =====================================
        // PROPERTY EVENTS
        // =====================================

        // Subscribe to property updates
        socket.on('watch_property', (data: { propertyId: string }) => {
            socket.join(`property:${data.propertyId}`);
        });

        // Unsubscribe from property
        socket.on('unwatch_property', (data: { propertyId: string }) => {
            socket.leave(`property:${data.propertyId}`);
        });

        // =====================================
        // DISCONNECT
        // =====================================

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.userId}`);
            if (socket.userId) {
                onlineUsers.delete(socket.userId);
                io.emit('user_offline', { userId: socket.userId });
            }
        });
    });

    // Helper function to emit to specific users
    const emitToUser = (userId: string, event: string, data: any) => {
        io.to(`user:${userId}`).emit(event, data);
    };

    // Helper function to emit property updates
    const emitPropertyUpdate = (propertyId: string, event: string, data: any) => {
        io.to(`property:${propertyId}`).emit(event, data);
    };

    return { io, emitToUser, emitPropertyUpdate };
}

export default initializeSocketIO;
