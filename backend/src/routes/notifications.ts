// Notifications API Routes
import { Router, Request, Response } from 'express';
import { notificationService, NotificationType } from '../services/notifications';
import { authenticate } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get user notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { limit, unreadOnly } = req.query;

        const notifications = await notificationService.getNotifications(userId, {
            limit: limit ? parseInt(limit as string) : 50,
            unreadOnly: unreadOnly === 'true',
        });

        const unreadCount = await notificationService.getUnreadCount(userId);

        res.json({
            success: true,
            data: {
                notifications,
                unreadCount,
            },
        });
    } catch (error) {
        logger.error('Get notifications error:', error);
        res.status(500).json({ success: false, error: 'Failed to get notifications' });
    }
});

/**
 * @swagger
 * /notifications/{id}/read:
 *   put:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 */
router.put('/:id/read', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { id } = req.params;

        await notificationService.markRead(id, userId);

        res.json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
        logger.error('Mark read error:', error);
        res.status(500).json({ success: false, error: 'Failed to mark notification' });
    }
});

/**
 * @swagger
 * /notifications/read-all:
 *   put:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 */
router.put('/read-all', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        await notificationService.markAllRead(userId);

        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        logger.error('Mark all read error:', error);
        res.status(500).json({ success: false, error: 'Failed to mark all' });
    }
});

/**
 * @swagger
 * /notifications/unread-count:
 *   get:
 *     summary: Get unread notification count
 *     tags: [Notifications]
 */
router.get('/unread-count', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const count = await notificationService.getUnreadCount(userId);

        res.json({ success: true, data: { count } });
    } catch (error) {
        logger.error('Unread count error:', error);
        res.status(500).json({ success: false, error: 'Failed to get count' });
    }
});

export default router;
