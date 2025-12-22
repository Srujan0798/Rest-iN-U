// Reviews and Ratings Service
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import { notificationService, NotificationType } from './notifications';

interface ReviewInput {
    propertyId?: string;
    agentId?: string;
    userId: string;
    rating: number;
    title: string;
    content: string;
    categories?: {
        communication?: number;
        expertise?: number;
        responsiveness?: number;
        accuracy?: number;
        vastu?: number;
    };
    isVerifiedPurchase?: boolean;
}

export class ReviewService {
    // Create a review
    async createReview(input: ReviewInput): Promise<any> {
        const { propertyId, agentId, userId, rating, title, content, categories, isVerifiedPurchase } = input;

        if (!propertyId && !agentId) {
            throw new Error('Either propertyId or agentId is required');
        }

        if (rating < 1 || rating > 5) {
            throw new Error('Rating must be between 1 and 5');
        }

        // Check for existing review
        const existing = await prisma.review.findFirst({
            where: {
                userId,
                ...(propertyId ? { propertyId } : { agentId }),
            },
        });

        if (existing) {
            throw new Error('You have already reviewed this item');
        }

        const review = await prisma.review.create({
            data: {
                propertyId,
                agentId,
                userId,
                rating,
                title,
                content,
                categories: categories || {},
                isVerifiedPurchase: isVerifiedPurchase || false,
                status: 'PENDING',
            },
            include: {
                user: { select: { firstName: true, lastName: true, profilePhotoUrl: true } },
            },
        });

        // Update average rating
        if (propertyId) {
            await this.updatePropertyRating(propertyId);
        }
        if (agentId) {
            await this.updateAgentRating(agentId);

            // Notify agent
            const agent = await prisma.agent.findUnique({ where: { id: agentId } });
            if (agent) {
                await notificationService.send({
                    userId: agent.userId,
                    type: NotificationType.KARMA_EARNED,
                    title: '⭐ New Review!',
                    message: `You received a ${rating}-star review: "${title}"`,
                    data: { reviewId: review.id },
                });
            }
        }

        logger.info(`Review created: ${review.id} - ${rating} stars`);
        return review;
    }

    // Update property average rating
    private async updatePropertyRating(propertyId: string): Promise<void> {
        const stats = await prisma.review.aggregate({
            where: { propertyId, status: 'APPROVED' },
            _avg: { rating: true },
            _count: { id: true },
        });

        await prisma.property.update({
            where: { id: propertyId },
            data: {
                averageRating: stats._avg.rating || 0,
                reviewCount: stats._count.id,
            },
        });
    }

    // Update agent average rating
    private async updateAgentRating(agentId: string): Promise<void> {
        const stats = await prisma.review.aggregate({
            where: { agentId, status: 'APPROVED' },
            _avg: { rating: true },
            _count: { id: true },
        });

        await prisma.agent.update({
            where: { id: agentId },
            data: {
                averageRating: stats._avg.rating || 0,
                reviewCount: stats._count.id,
            },
        });
    }

    // Get reviews for property
    async getPropertyReviews(propertyId: string, options: { limit?: number; page?: number } = {}): Promise<any> {
        const { limit = 10, page = 1 } = options;
        const skip = (page - 1) * limit;

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where: { propertyId, status: 'APPROVED' },
                include: {
                    user: { select: { firstName: true, lastName: true, profilePhotoUrl: true } },
                },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip,
            }),
            prisma.review.count({ where: { propertyId, status: 'APPROVED' } }),
        ]);

        const stats = await prisma.review.aggregate({
            where: { propertyId, status: 'APPROVED' },
            _avg: { rating: true },
        });

        // Rating distribution
        const distribution = await prisma.review.groupBy({
            by: ['rating'],
            where: { propertyId, status: 'APPROVED' },
            _count: { id: true },
        });

        const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        distribution.forEach(d => {
            ratingBreakdown[d.rating as keyof typeof ratingBreakdown] = d._count.id;
        });

        return {
            reviews,
            total,
            averageRating: stats._avg.rating || 0,
            ratingBreakdown,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    // Get reviews for agent
    async getAgentReviews(agentId: string, options: { limit?: number; page?: number } = {}): Promise<any> {
        const { limit = 10, page = 1 } = options;
        const skip = (page - 1) * limit;

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where: { agentId, status: 'APPROVED' },
                include: {
                    user: { select: { firstName: true, lastName: true, profilePhotoUrl: true } },
                    property: { select: { title: true } },
                },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip,
            }),
            prisma.review.count({ where: { agentId, status: 'APPROVED' } }),
        ]);

        const stats = await prisma.review.aggregate({
            where: { agentId, status: 'APPROVED' },
            _avg: { rating: true },
        });

        return {
            reviews,
            total,
            averageRating: stats._avg.rating || 0,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    // Mark review as helpful
    async markHelpful(reviewId: string, userId: string): Promise<any> {
        const existing = await prisma.reviewHelpful.findUnique({
            where: { reviewId_userId: { reviewId, userId } },
        });

        if (existing) {
            // Toggle off
            await prisma.reviewHelpful.delete({ where: { id: existing.id } });
            await prisma.review.update({
                where: { id: reviewId },
                data: { helpfulCount: { decrement: 1 } },
            });
            return { marked: false };
        }

        // Mark helpful
        await prisma.reviewHelpful.create({ data: { reviewId, userId } });
        await prisma.review.update({
            where: { id: reviewId },
            data: { helpfulCount: { increment: 1 } },
        });

        return { marked: true };
    }

    // Approve/reject review (admin)
    async moderateReview(reviewId: string, status: 'APPROVED' | 'REJECTED', reason?: string): Promise<any> {
        const review = await prisma.review.update({
            where: { id: reviewId },
            data: { status, moderationReason: reason, moderatedAt: new Date() },
        });

        // Update ratings if approved
        if (status === 'APPROVED') {
            if (review.propertyId) await this.updatePropertyRating(review.propertyId);
            if (review.agentId) await this.updateAgentRating(review.agentId);
        }

        return review;
    }

    // Get user's reviews
    async getUserReviews(userId: string): Promise<any[]> {
        return prisma.review.findMany({
            where: { userId },
            include: {
                property: { select: { title: true, id: true } },
                agent: { include: { user: { select: { firstName: true } } } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}

export const reviewService = new ReviewService();
