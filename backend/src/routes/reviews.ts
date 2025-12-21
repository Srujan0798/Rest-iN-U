import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// ============================================
// GET REVIEWS FOR PROPERTY
// ============================================
router.get('/property/:propertyId', async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;

        res.json({
            propertyId,
            averageRating: 4.5,
            totalReviews: 12,
            reviews: [
                {
                    id: 'rev_1',
                    author: 'John D.',
                    rating: 5,
                    date: '2024-01-15',
                    title: 'Beautiful home, great neighborhood',
                    content: 'The property exceeded our expectations. The updates are high quality and the neighborhood is very quiet and family-friendly.',
                    helpful: 8,
                    verified: true
                },
                {
                    id: 'rev_2',
                    author: 'Sarah M.',
                    rating: 4,
                    date: '2024-01-10',
                    title: 'Good value for the price',
                    content: 'Nice layout and good natural light. The backyard could use some work but overall a solid home.',
                    helpful: 5,
                    verified: true
                }
            ],
            ratingBreakdown: {
                5: 7,
                4: 3,
                3: 1,
                2: 1,
                1: 0
            }
        });
    } catch (error) {
        console.error('Reviews error:', error);
        res.status(500).json({ error: 'Failed to get reviews' });
    }
});

// ============================================
// GET REVIEWS FOR AGENT
// ============================================
router.get('/agent/:agentId', async (req: Request, res: Response) => {
    try {
        const { agentId } = req.params;

        res.json({
            agentId,
            averageRating: 4.9,
            totalReviews: 42,
            reviews: [
                {
                    id: 'rev_a1',
                    author: 'Mike T.',
                    rating: 5,
                    date: '2024-01-18',
                    title: 'Best agent we\'ve ever worked with',
                    content: 'Jane was incredibly responsive and knowledgeable. She helped us find our dream home in just 3 weeks!',
                    transactionType: 'buyer',
                    helpful: 12,
                    verified: true
                },
                {
                    id: 'rev_a2',
                    author: 'Lisa K.',
                    rating: 5,
                    date: '2024-01-12',
                    title: 'Sold our home above asking',
                    content: 'Professional, attentive, and got us 5% above asking price. Highly recommend!',
                    transactionType: 'seller',
                    helpful: 9,
                    verified: true
                }
            ],
            stats: {
                responseTime: '< 1 hour',
                closingRate: '98%',
                avgDaysToClose: 28
            }
        });
    } catch (error) {
        console.error('Agent reviews error:', error);
        res.status(500).json({ error: 'Failed to get reviews' });
    }
});

// ============================================
// SUBMIT REVIEW
// ============================================
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const data = z.object({
            targetType: z.enum(['property', 'agent', 'neighborhood']),
            targetId: z.string(),
            rating: z.number().min(1).max(5),
            title: z.string().min(5).max(100),
            content: z.string().min(20).max(1000),
            transactionType: z.enum(['buyer', 'seller', 'renter', 'visitor']).optional(),
            anonymous: z.boolean().default(false)
        }).parse(req.body);

        const reviewId = `rev_${Date.now()}`;

        res.status(201).json({
            reviewId,
            status: 'pending_moderation',
            message: 'Review submitted successfully. It will be visible after moderation.',
            ...data
        });
    } catch (error) {
        console.error('Submit review error:', error);
        res.status(500).json({ error: 'Failed to submit review' });
    }
});

// ============================================
// MARK REVIEW HELPFUL
// ============================================
router.post('/:reviewId/helpful', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { reviewId } = req.params;

        res.json({
            reviewId,
            message: 'Marked as helpful'
        });
    } catch (error) {
        console.error('Helpful error:', error);
        res.status(500).json({ error: 'Failed to mark helpful' });
    }
});

// ============================================
// REPORT REVIEW
// ============================================
router.post('/:reviewId/report', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { reviewId } = req.params;
        const { reason } = z.object({
            reason: z.enum(['spam', 'inappropriate', 'fake', 'other'])
        }).parse(req.body);

        res.json({
            message: 'Review reported for moderation',
            reviewId,
            reason
        });
    } catch (error) {
        console.error('Report error:', error);
        res.status(500).json({ error: 'Failed to report review' });
    }
});

// ============================================
// NEIGHBORHOOD REVIEWS
// ============================================
router.get('/neighborhood/:neighborhoodId', async (req: Request, res: Response) => {
    try {
        const { neighborhoodId } = req.params;

        res.json({
            neighborhoodId,
            averageRating: 4.3,
            totalReviews: 89,
            categories: {
                safety: 4.5,
                schools: 4.2,
                walkability: 3.8,
                restaurants: 4.4,
                nightlife: 3.5,
                familyFriendly: 4.6
            },
            recentReviews: [
                {
                    id: 'nrev_1',
                    author: 'Resident of 5 years',
                    rating: 5,
                    content: 'Love this neighborhood! Great community events and friendly neighbors.',
                    date: '2024-01-14'
                }
            ]
        });
    } catch (error) {
        console.error('Neighborhood reviews error:', error);
        res.status(500).json({ error: 'Failed to get reviews' });
    }
});

export default router;
