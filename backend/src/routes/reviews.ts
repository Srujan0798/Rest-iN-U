// Reviews API Routes
import { Router, Request, Response } from 'express';
import { reviewService } from '../services/reviews';
import { authenticate, optionalAuth } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();

/**
 * @swagger
 * /reviews/property/{propertyId}:
 *   get:
 *     summary: Get reviews for a property
 *     tags: [Reviews]
 */
router.get('/property/:propertyId', async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;
        const { page, limit } = req.query;

        const reviews = await reviewService.getPropertyReviews(propertyId, {
            page: page ? parseInt(page as string) : 1,
            limit: limit ? parseInt(limit as string) : 10,
        });

        res.json({ success: true, data: reviews });
    } catch (error) {
        logger.error('Get property reviews error:', error);
        res.status(500).json({ success: false, error: 'Failed to get reviews' });
    }
});

/**
 * @swagger
 * /reviews/agent/{agentId}:
 *   get:
 *     summary: Get reviews for an agent
 *     tags: [Reviews]
 */
router.get('/agent/:agentId', async (req: Request, res: Response) => {
    try {
        const { agentId } = req.params;
        const { page, limit } = req.query;

        const reviews = await reviewService.getAgentReviews(agentId, {
            page: page ? parseInt(page as string) : 1,
            limit: limit ? parseInt(limit as string) : 10,
        });

        res.json({ success: true, data: reviews });
    } catch (error) {
        logger.error('Get agent reviews error:', error);
        res.status(500).json({ success: false, error: 'Failed to get reviews' });
    }
});

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { propertyId, agentId, rating, title, content, categories } = req.body;

        if (!rating || !title || !content) {
            return res.status(400).json({ success: false, error: 'Rating, title, and content are required' });
        }

        const review = await reviewService.createReview({
            propertyId,
            agentId,
            userId,
            rating,
            title,
            content,
            categories,
        });

        res.status(201).json({ success: true, data: review });
    } catch (error: any) {
        logger.error('Create review error:', error);
        res.status(400).json({ success: false, error: error.message || 'Failed to create review' });
    }
});

/**
 * @swagger
 * /reviews/{id}/helpful:
 *   post:
 *     summary: Mark review as helpful
 *     tags: [Reviews]
 */
router.post('/:id/helpful', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { id } = req.params;

        const result = await reviewService.markHelpful(id, userId);

        res.json({ success: true, data: result });
    } catch (error) {
        logger.error('Mark helpful error:', error);
        res.status(500).json({ success: false, error: 'Failed to mark helpful' });
    }
});

/**
 * @swagger
 * /reviews/user/mine:
 *   get:
 *     summary: Get current user's reviews
 *     tags: [Reviews]
 */
router.get('/user/mine', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const reviews = await reviewService.getUserReviews(userId);

        res.json({ success: true, data: reviews });
    } catch (error) {
        logger.error('Get user reviews error:', error);
        res.status(500).json({ success: false, error: 'Failed to get reviews' });
    }
});

export default router;

