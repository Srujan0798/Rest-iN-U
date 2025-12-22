// Notification Service
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import { redisClient } from '../utils/redis';

export enum NotificationType {
    PROPERTY_ALERT = 'PROPERTY_ALERT',
    PRICE_DROP = 'PRICE_DROP',
    NEW_LISTING = 'NEW_LISTING',
    INQUIRY_RECEIVED = 'INQUIRY_RECEIVED',
    INQUIRY_RESPONSE = 'INQUIRY_RESPONSE',
    MUHURAT_REMINDER = 'MUHURAT_REMINDER',
    DAO_PROPOSAL = 'DAO_PROPOSAL',
    DAO_VOTE_ENDING = 'DAO_VOTE_ENDING',
    IOT_ALERT = 'IOT_ALERT',
    VASTU_UPDATE = 'VASTU_UPDATE',
    CLIMATE_UPDATE = 'CLIMATE_UPDATE',
    BLOCKCHAIN_CONFIRMED = 'BLOCKCHAIN_CONFIRMED',
    KARMA_EARNED = 'KARMA_EARNED',
    MESSAGE_RECEIVED = 'MESSAGE_RECEIVED',
}

interface NotificationPayload {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: any;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    channels?: ('IN_APP' | 'EMAIL' | 'SMS' | 'PUSH')[];
}

export class NotificationService {
    // Create and send notification
    async send(payload: NotificationPayload): Promise<any> {
        const { userId, type, title, message, data, priority = 'MEDIUM', channels = ['IN_APP'] } = payload;

        try {
            // Create in-app notification
            const notification = await prisma.notification.create({
                data: {
                    userId,
                    type,
                    title,
                    message,
                    data: data || {},
                    priority,
                    read: false,
                },
            });

            // Publish to Redis for real-time delivery
            await redisClient.publish(`notifications:${userId}`, JSON.stringify({
                id: notification.id,
                type,
                title,
                message,
                data,
                createdAt: notification.createdAt,
            }));

            // Handle other channels
            if (channels.includes('EMAIL')) {
                await this.sendEmail(userId, title, message, data);
            }

            if (channels.includes('PUSH')) {
                await this.sendPushNotification(userId, title, message, data);
            }

            logger.info(`Notification sent: ${type} to ${userId}`);
            return notification;
        } catch (error) {
            logger.error('Failed to send notification:', error);
            throw error;
        }
    }

    // Send bulk notifications
    async sendBulk(userIds: string[], basePayload: Omit<NotificationPayload, 'userId'>): Promise<void> {
        const promises = userIds.map(userId =>
            this.send({ ...basePayload, userId }).catch(err => {
                logger.error(`Failed to send notification to ${userId}:`, err);
            })
        );

        await Promise.all(promises);
    }

    // Get user notifications
    async getNotifications(userId: string, options: { limit?: number; unreadOnly?: boolean } = {}): Promise<any[]> {
        const { limit = 50, unreadOnly = false } = options;

        return prisma.notification.findMany({
            where: {
                userId,
                ...(unreadOnly ? { read: false } : {}),
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }

    // Mark notification as read
    async markRead(notificationId: string, userId: string): Promise<any> {
        return prisma.notification.updateMany({
            where: { id: notificationId, userId },
            data: { read: true, readAt: new Date() },
        });
    }

    // Mark all as read
    async markAllRead(userId: string): Promise<void> {
        await prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true, readAt: new Date() },
        });
    }

    // Get unread count
    async getUnreadCount(userId: string): Promise<number> {
        return prisma.notification.count({
            where: { userId, read: false },
        });
    }

    // Send property price drop alerts
    async sendPriceDropAlerts(propertyId: string, oldPrice: number, newPrice: number): Promise<void> {
        // Find users who favorited this property
        const favorites = await prisma.favorite.findMany({
            where: { propertyId },
            include: { user: true, property: true },
        });

        const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100);

        for (const favorite of favorites) {
            await this.send({
                userId: favorite.userId,
                type: NotificationType.PRICE_DROP,
                title: '💰 Price Drop Alert!',
                message: `Price dropped ${discount}% on ${favorite.property.title}`,
                data: { propertyId, oldPrice, newPrice, discount },
                priority: 'HIGH',
                channels: ['IN_APP', 'EMAIL'],
            });
        }
    }

    // Send muhurat reminder
    async sendMuhuratReminder(userId: string, eventType: string, date: Date): Promise<void> {
        await this.send({
            userId,
            type: NotificationType.MUHURAT_REMINDER,
            title: '📅 Auspicious Date Reminder',
            message: `Tomorrow is an auspicious day for ${eventType}!`,
            data: { eventType, date },
            priority: 'MEDIUM',
            channels: ['IN_APP', 'EMAIL'],
        });
    }

    // Send IoT alert
    async sendIoTAlert(propertyId: string, sensorType: string, reading: number, threshold: number): Promise<void> {
        const property = await prisma.property.findUnique({
            where: { id: propertyId },
            include: { listingAgent: { include: { user: true } } },
        });

        if (property?.listingAgent?.userId) {
            await this.send({
                userId: property.listingAgent.userId,
                type: NotificationType.IOT_ALERT,
                title: '⚠️ Sensor Alert',
                message: `${sensorType} reading (${reading}) exceeded threshold (${threshold})`,
                data: { propertyId, sensorType, reading, threshold },
                priority: 'URGENT',
                channels: ['IN_APP', 'PUSH', 'EMAIL'],
            });
        }
    }

    // Send DAO proposal notification
    async sendDAOProposalNotification(proposalId: string, title: string): Promise<void> {
        // Find all users with voting power
        const users = await prisma.tokenBalance.findMany({
            where: { balance: { gt: 0 } },
            include: { user: true },
        });

        await this.sendBulk(
            users.map(u => u.userId),
            {
                type: NotificationType.DAO_PROPOSAL,
                title: '🏛️ New DAO Proposal',
                message: `New proposal: ${title}. Cast your vote!`,
                data: { proposalId },
                priority: 'MEDIUM',
                channels: ['IN_APP', 'EMAIL'],
            }
        );
    }

    // Send karma earned notification
    async sendKarmaEarned(userId: string, amount: number, reason: string): Promise<void> {
        await this.send({
            userId,
            type: NotificationType.KARMA_EARNED,
            title: '🌟 Karma Points Earned!',
            message: `You earned ${amount} karma for ${reason}`,
            data: { amount, reason },
            priority: 'LOW',
            channels: ['IN_APP'],
        });
    }

    // Private: Send email (stub - would integrate with email service)
    private async sendEmail(userId: string, subject: string, body: string, data?: any): Promise<void> {
        // Integrate with email service (SendGrid, AWS SES, etc.)
        logger.info(`Email queued for ${userId}: ${subject}`);
    }

    // Private: Send push notification (stub - would integrate with FCM/APNs)
    private async sendPushNotification(userId: string, title: string, body: string, data?: any): Promise<void> {
        // Integrate with push service (Firebase, OneSignal, etc.)
        logger.info(`Push notification queued for ${userId}: ${title}`);
    }
}

export const notificationService = new NotificationService();
