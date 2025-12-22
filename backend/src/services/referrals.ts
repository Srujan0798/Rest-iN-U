// Referral Service - Karma and Token Rewards
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import { notificationService, NotificationType } from './notifications';

interface ReferralReward {
    referrerKarma: number;
    referredKarma: number;
    referrerTokens: number;
    referredTokens: number;
}

const REFERRAL_REWARDS: Record<string, ReferralReward> = {
    SIGNUP: { referrerKarma: 100, referredKarma: 50, referrerTokens: 10, referredTokens: 5 },
    FIRST_INQUIRY: { referrerKarma: 50, referredKarma: 25, referrerTokens: 5, referredTokens: 0 },
    FIRST_PURCHASE: { referrerKarma: 500, referredKarma: 100, referrerTokens: 100, referredTokens: 25 },
    AGENT_SIGNUP: { referrerKarma: 200, referredKarma: 100, referrerTokens: 25, referredTokens: 10 },
};

export class ReferralService {
    // Generate unique referral code
    generateReferralCode(userId: string): string {
        const base = userId.substring(0, 8).toUpperCase();
        const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `DHARMA-${base}-${suffix}`;
    }

    // Create or get referral code for user
    async getOrCreateReferralCode(userId: string): Promise<string> {
        const existing = await prisma.referralCode.findFirst({
            where: { userId, active: true },
        });

        if (existing) return existing.code;

        const code = this.generateReferralCode(userId);
        await prisma.referralCode.create({
            data: { userId, code, active: true },
        });

        return code;
    }

    // Process referral when new user signs up
    async processReferral(referralCode: string, newUserId: string, eventType: string): Promise<any> {
        try {
            const codeRecord = await prisma.referralCode.findUnique({
                where: { code: referralCode },
                include: { user: true },
            });

            if (!codeRecord || !codeRecord.active) {
                logger.warn(`Invalid referral code: ${referralCode}`);
                return null;
            }

            if (codeRecord.userId === newUserId) {
                logger.warn(`User cannot refer themselves: ${newUserId}`);
                return null;
            }

            // Check if referral already exists for this event
            const existingReferral = await prisma.referral.findFirst({
                where: { referredId: newUserId, eventType },
            });

            if (existingReferral) {
                logger.info(`Referral already processed for ${newUserId} - ${eventType}`);
                return existingReferral;
            }

            const rewards = REFERRAL_REWARDS[eventType];
            if (!rewards) {
                logger.warn(`Unknown referral event type: ${eventType}`);
                return null;
            }

            // Create referral record
            const referral = await prisma.referral.create({
                data: {
                    referrerId: codeRecord.userId,
                    referredId: newUserId,
                    referralCode: referralCode,
                    eventType,
                    referrerKarma: rewards.referrerKarma,
                    referredKarma: rewards.referredKarma,
                    referrerTokens: rewards.referrerTokens,
                    referredTokens: rewards.referredTokens,
                    status: 'COMPLETED',
                },
            });

            // Award karma and tokens to referrer
            await this.awardKarma(codeRecord.userId, rewards.referrerKarma, `Referral: ${eventType}`);
            await this.awardTokens(codeRecord.userId, rewards.referrerTokens);

            // Award karma and tokens to referred user
            await this.awardKarma(newUserId, rewards.referredKarma, `Referred signup bonus`);
            await this.awardTokens(newUserId, rewards.referredTokens);

            // Send notifications
            await notificationService.send({
                userId: codeRecord.userId,
                type: NotificationType.KARMA_EARNED,
                title: '🎉 Referral Bonus!',
                message: `Your referral earned you ${rewards.referrerKarma} karma and ${rewards.referrerTokens} tokens!`,
                data: { referralId: referral.id, event: eventType },
            });

            // Increment usage count
            await prisma.referralCode.update({
                where: { id: codeRecord.id },
                data: { usageCount: { increment: 1 } },
            });

            logger.info(`Referral processed: ${codeRecord.userId} -> ${newUserId} (${eventType})`);
            return referral;
        } catch (error) {
            logger.error('Referral processing error:', error);
            throw error;
        }
    }

    // Award karma to user
    private async awardKarma(userId: string, amount: number, reason: string): Promise<void> {
        await prisma.karmicScore.create({
            data: {
                userId,
                action: reason,
                points: amount,
                category: 'REFERRAL',
            },
        });
    }

    // Award tokens to user
    private async awardTokens(userId: string, amount: number): Promise<void> {
        if (amount <= 0) return;

        await prisma.tokenBalance.upsert({
            where: { userId },
            update: { balance: { increment: amount } },
            create: { userId, balance: amount },
        });
    }

    // Get user's referral statistics
    async getReferralStats(userId: string): Promise<any> {
        const code = await this.getOrCreateReferralCode(userId);

        const referrals = await prisma.referral.findMany({
            where: { referrerId: userId },
            include: { referred: { select: { firstName: true, createdAt: true } } },
            orderBy: { createdAt: 'desc' },
        });

        const stats = {
            referralCode: code,
            totalReferrals: referrals.length,
            totalKarmaEarned: referrals.reduce((sum, r) => sum + r.referrerKarma, 0),
            totalTokensEarned: referrals.reduce((sum, r) => sum + r.referrerTokens, 0),
            referralsByEvent: {} as Record<string, number>,
            recentReferrals: referrals.slice(0, 10).map(r => ({
                firstName: r.referred.firstName,
                eventType: r.eventType,
                karma: r.referrerKarma,
                tokens: r.referrerTokens,
                date: r.createdAt,
            })),
        };

        referrals.forEach(r => {
            stats.referralsByEvent[r.eventType] = (stats.referralsByEvent[r.eventType] || 0) + 1;
        });

        return stats;
    }

    // Get leaderboard
    async getLeaderboard(limit: number = 10): Promise<any[]> {
        const leaders = await prisma.referral.groupBy({
            by: ['referrerId'],
            _count: { id: true },
            _sum: { referrerKarma: true, referrerTokens: true },
            orderBy: { _count: { id: 'desc' } },
            take: limit,
        });

        const userIds = leaders.map(l => l.referrerId);
        const users = await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, firstName: true, lastName: true, profilePhotoUrl: true },
        });

        return leaders.map((l, i) => {
            const user = users.find(u => u.id === l.referrerId);
            return {
                rank: i + 1,
                userId: l.referrerId,
                name: user ? `${user.firstName} ${user.lastName?.charAt(0) || ''}` : 'Anonymous',
                avatar: user?.profilePhotoUrl,
                referrals: l._count.id,
                karmaEarned: l._sum.referrerKarma || 0,
                tokensEarned: l._sum.referrerTokens || 0,
            };
        });
    }
}

export const referralService = new ReferralService();
