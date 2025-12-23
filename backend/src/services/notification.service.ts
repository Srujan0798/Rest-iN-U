import { v4 as uuidv4 } from 'uuid';

// Notification Service for Multi-Channel Notifications
class NotificationService {
    private notifications: Notification[] = [];

    // ============================================
    // SEND NOTIFICATIONS
    // ============================================

    async send(options: NotificationOptions): Promise<string> {
        const notificationId = uuidv4();

        const notification: Notification = {
            id: notificationId,
            userId: options.userId,
            type: options.type,
            title: options.title,
            message: options.message,
            data: options.data,
            channels: options.channels || ['in_app'],
            status: 'pending',
            createdAt: new Date()
        };

        // Send to each channel
        for (const channel of notification.channels) {
            try {
                await this.sendToChannel(channel, notification);
            } catch (error) {
                console.error(`Failed to send to ${channel}:`, error);
            }
        }

        notification.status = 'sent';
        notification.sentAt = new Date();
        this.notifications.push(notification);

        console.log(`[NOTIFICATION] Sent ${notification.type} to ${notification.userId}`);
        return notificationId;
    }

    private async sendToChannel(channel: NotificationChannel, notification: Notification): Promise<void> {
        switch (channel) {
            case 'in_app':
                await this.sendInApp(notification);
                break;
            case 'push':
                await this.sendPush(notification);
                break;
            case 'email':
                await this.sendEmail(notification);
                break;
            case 'sms':
                await this.sendSms(notification);
                break;
        }
    }

    // ============================================
    // CHANNEL IMPLEMENTATIONS
    // ============================================

    private async sendInApp(notification: Notification): Promise<void> {
        // Store in Redis for real-time delivery
        // Would use Redis pub/sub for WebSocket delivery
        console.log(`[IN_APP] ${notification.title}`);
    }

    private async sendPush(notification: Notification): Promise<void> {
        // Would use Firebase Cloud Messaging or similar
        console.log(`[PUSH] ${notification.title}`);
    }

    private async sendEmail(notification: Notification): Promise<void> {
        // Would use Email Service
        console.log(`[EMAIL] ${notification.title}`);
    }

    private async sendSms(notification: Notification): Promise<void> {
        // Would use Twilio or similar
        console.log(`[SMS] ${notification.message}`);
    }

    // ============================================
    // NOTIFICATION TYPES
    // ============================================

    async sendNewLeadNotification(agentId: string, lead: { name: string; propertyAddress: string }): Promise<string> {
        return this.send({
            userId: agentId,
            type: 'new_lead',
            title: 'New Lead! 🎯',
            message: `${lead.name} is interested in ${lead.propertyAddress}`,
            data: lead,
            channels: ['in_app', 'push', 'email']
        });
    }

    async sendShowingReminder(userId: string, showing: { propertyAddress: string; date: string; time: string }): Promise<string> {
        return this.send({
            userId,
            type: 'showing_reminder',
            title: 'Showing Reminder 📅',
            message: `Your showing at ${showing.propertyAddress} is tomorrow at ${showing.time}`,
            data: showing,
            channels: ['in_app', 'push']
        });
    }

    async sendPriceDropAlert(userId: string, property: { address: string; oldPrice: number; newPrice: number }): Promise<string> {
        const drop = property.oldPrice - property.newPrice;
        return this.send({
            userId,
            type: 'price_drop',
            title: 'Price Drop! 📉',
            message: `${property.address} just dropped $${drop.toLocaleString()}!`,
            data: property,
            channels: ['in_app', 'push', 'email']
        });
    }

    async sendNewMatchNotification(userId: string, searchName: string, matchCount: number): Promise<string> {
        return this.send({
            userId,
            type: 'new_matches',
            title: 'New Matches! 🏠',
            message: `${matchCount} new properties match your "${searchName}" search`,
            data: { searchName, matchCount },
            channels: ['in_app', 'push']
        });
    }

    async sendOfferStatusUpdate(userId: string, offer: { propertyAddress: string; status: string }): Promise<string> {
        return this.send({
            userId,
            type: 'offer_update',
            title: `Offer ${offer.status}`,
            message: `Your offer on ${offer.propertyAddress} has been ${offer.status.toLowerCase()}`,
            data: offer,
            channels: ['in_app', 'push', 'email']
        });
    }

    async sendTransactionMilestone(userId: string, transaction: { propertyAddress: string; milestone: string }): Promise<string> {
        return this.send({
            userId,
            type: 'transaction_milestone',
            title: 'Transaction Update ✅',
            message: `${transaction.milestone} completed for ${transaction.propertyAddress}`,
            data: transaction,
            channels: ['in_app', 'push', 'email']
        });
    }

    async sendDocumentReady(userId: string, document: { name: string; type: string }): Promise<string> {
        return this.send({
            userId,
            type: 'document_ready',
            title: 'Document Ready 📄',
            message: `Your ${document.type} "${document.name}" is ready for review`,
            data: document,
            channels: ['in_app', 'email']
        });
    }

    async sendSignatureRequest(userId: string, document: { name: string; requestedBy: string }): Promise<string> {
        return this.send({
            userId,
            type: 'signature_required',
            title: 'Signature Required ✍️',
            message: `${document.requestedBy} is requesting your signature on "${document.name}"`,
            data: document,
            channels: ['in_app', 'push', 'email']
        });
    }

    async sendMessageReceived(userId: string, message: { senderName: string; preview: string }): Promise<string> {
        return this.send({
            userId,
            type: 'message_received',
            title: `Message from ${message.senderName}`,
            message: message.preview.substring(0, 100),
            data: message,
            channels: ['in_app', 'push']
        });
    }

    async sendSystemAlert(userId: string, alert: { title: string; message: string; severity: 'info' | 'warning' | 'error' }): Promise<string> {
        return this.send({
            userId,
            type: 'system_alert',
            title: alert.title,
            message: alert.message,
            data: alert,
            channels: ['in_app']
        });
    }

    // ============================================
    // NOTIFICATION MANAGEMENT
    // ============================================

    async getUserNotifications(userId: string, options: { unreadOnly?: boolean; limit?: number } = {}): Promise<Notification[]> {
        let userNotifications = this.notifications
            .filter(n => n.userId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        if (options.unreadOnly) {
            userNotifications = userNotifications.filter(n => !n.readAt);
        }

        if (options.limit) {
            userNotifications = userNotifications.slice(0, options.limit);
        }

        return userNotifications;
    }

    async markAsRead(notificationId: string): Promise<void> {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.readAt = new Date();
        }
    }

    async markAllAsRead(userId: string): Promise<void> {
        this.notifications
            .filter(n => n.userId === userId && !n.readAt)
            .forEach(n => n.readAt = new Date());
    }

    async getUnreadCount(userId: string): Promise<number> {
        return this.notifications.filter(n => n.userId === userId && !n.readAt).length;
    }

    async deleteNotification(notificationId: string): Promise<void> {
        const index = this.notifications.findIndex(n => n.id === notificationId);
        if (index > -1) {
            this.notifications.splice(index, 1);
        }
    }

    // ============================================
    // PREFERENCES
    // ============================================

    async updatePreferences(userId: string, preferences: NotificationPreferences): Promise<void> {
        // Would store in database
        console.log(`[PREFERENCES] Updated for ${userId}:`, preferences);
    }

    async getPreferences(userId: string): Promise<NotificationPreferences> {
        // Would fetch from database
        return {
            email: { enabled: true, frequency: 'instant' },
            push: { enabled: true },
            sms: { enabled: false },
            types: {
                new_lead: true,
                price_drop: true,
                new_matches: true,
                transaction_milestone: true,
                message_received: true
            }
        };
    }

    // ============================================
    // BATCH NOTIFICATIONS
    // ============================================

    async sendBatch(notifications: NotificationOptions[]): Promise<string[]> {
        const ids: string[] = [];
        for (const notification of notifications) {
            const id = await this.send(notification);
            ids.push(id);
        }
        return ids;
    }

    async scheduleNotification(notification: NotificationOptions, sendAt: Date): Promise<string> {
        const notificationId = uuidv4();
        const delay = sendAt.getTime() - Date.now();

        if (delay > 0) {
            setTimeout(async () => {
                await this.send(notification);
            }, delay);
        }

        return notificationId;
    }
}

// Types
type NotificationChannel = 'in_app' | 'push' | 'email' | 'sms';

interface NotificationOptions {
    userId: string;
    type: string;
    title: string;
    message: string;
    data?: Record<string, any>;
    channels?: NotificationChannel[];
}

interface Notification {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    data?: Record<string, any>;
    channels: NotificationChannel[];
    status: 'pending' | 'sent' | 'failed';
    createdAt: Date;
    sentAt?: Date;
    readAt?: Date;
}

interface NotificationPreferences {
    email: { enabled: boolean; frequency: 'instant' | 'daily' | 'weekly' };
    push: { enabled: boolean };
    sms: { enabled: boolean };
    types: Record<string, boolean>;
}

// Export singleton instance
export const notificationService = new NotificationService();
export default NotificationService;

