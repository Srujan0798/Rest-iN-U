// DAO Governance Routes
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { asyncHandler, NotFoundError, BadRequestError } from '../middleware/errorHandler';

const router = Router();

const proposalSchema = z.object({
    title: z.string().min(10).max(200),
    description: z.string().min(50).max(5000),
    category: z.enum(['PLATFORM_FEE', 'NEW_FEATURE', 'COMMUNITY', 'PARTNERSHIP', 'GOVERNANCE', 'OTHER']),
    executionData: z.object({}).passthrough().optional(),
    votingPeriodDays: z.number().int().min(3).max(30).default(7),
});

/**
 * @swagger
 * /dao/proposals:
 *   get:
 *     summary: Get all DAO proposals
 *     tags: [DAO]
 */
router.get('/proposals', asyncHandler(async (req: Request, res: Response) => {
    const { status, category, page = '1', limit = '20' } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;

    const skip = (Number(page) - 1) * Number(limit);

    const [proposals, total] = await Promise.all([
        prisma.dAOProposal.findMany({
            where,
            skip,
            take: Number(limit),
            orderBy: { createdAt: 'desc' },
            include: {
                proposer: {
                    select: { firstName: true, lastName: true, profilePhotoUrl: true },
                },
                _count: { select: { votes: true } },
            },
        }),
        prisma.dAOProposal.count({ where }),
    ]);

    res.json({
        success: true,
        data: {
            proposals: proposals.map(p => ({
                ...p,
                votesCount: p._count.votes,
                timeRemaining: p.votingEnds ? Math.max(0, p.votingEnds.getTime() - Date.now()) : 0,
            })),
            pagination: { page: Number(page), limit: Number(limit), total },
        },
    });
}));

/**
 * @swagger
 * /dao/proposals/{id}:
 *   get:
 *     summary: Get proposal details
 *     tags: [DAO]
 */
router.get('/proposals/:id', asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const proposal = await prisma.dAOProposal.findUnique({
        where: { id },
        include: {
            proposer: {
                select: { firstName: true, lastName: true, profilePhotoUrl: true },
            },
            votes: {
                take: 50,
                orderBy: { votingPower: 'desc' },
                include: {
                    voter: {
                        select: { firstName: true, lastName: true },
                    },
                },
            },
        },
    });

    if (!proposal) {
        throw new NotFoundError('Proposal not found');
    }

    // Calculate vote totals
    const forVotes = proposal.votes.filter(v => v.vote === 'FOR').reduce((sum, v) => sum + v.votingPower, 0);
    const againstVotes = proposal.votes.filter(v => v.vote === 'AGAINST').reduce((sum, v) => sum + v.votingPower, 0);
    const abstainVotes = proposal.votes.filter(v => v.vote === 'ABSTAIN').reduce((sum, v) => sum + v.votingPower, 0);
    const totalVotes = forVotes + againstVotes + abstainVotes;

    res.json({
        success: true,
        data: {
            ...proposal,
            voteSummary: {
                for: forVotes,
                against: againstVotes,
                abstain: abstainVotes,
                total: totalVotes,
                forPercent: totalVotes > 0 ? Math.round((forVotes / totalVotes) * 100) : 0,
                againstPercent: totalVotes > 0 ? Math.round((againstVotes / totalVotes) * 100) : 0,
                quorumReached: totalVotes >= (proposal.quorumRequired || 1000),
            },
            timeRemaining: proposal.votingEnds ? Math.max(0, proposal.votingEnds.getTime() - Date.now()) : 0,
        },
    });
}));

/**
 * @swagger
 * /dao/proposals:
 *   post:
 *     summary: Create a new proposal
 *     tags: [DAO]
 *     security:
 *       - bearerAuth: []
 */
router.post('/proposals', authenticate, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const data = proposalSchema.parse(req.body);

    // Check user has enough karma/tokens to propose
    const userKarma = await prisma.karmicScore.findUnique({
        where: { userId: req.user!.id },
    });

    if (!userKarma || userKarma.overallScore < 100) {
        throw new BadRequestError('Minimum 100 karma required to create proposals');
    }

    const votingEnds = new Date(Date.now() + data.votingPeriodDays * 24 * 60 * 60 * 1000);

    const proposal = await prisma.dAOProposal.create({
        data: {
            proposerId: req.user!.id,
            title: data.title,
            description: data.description,
            category: data.category,
            executionData: data.executionData,
            status: 'ACTIVE',
            votingEnds,
            quorumRequired: 1000, // 1000 voting power needed
        },
    });

    res.status(201).json({
        success: true,
        data: proposal,
    });
}));

/**
 * @swagger
 * /dao/proposals/{id}/vote:
 *   post:
 *     summary: Vote on a proposal
 *     tags: [DAO]
 *     security:
 *       - bearerAuth: []
 */
router.post('/proposals/:id/vote', authenticate, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { vote, comment } = req.body;

    if (!['FOR', 'AGAINST', 'ABSTAIN'].includes(vote)) {
        throw new BadRequestError('Vote must be FOR, AGAINST, or ABSTAIN');
    }

    const proposal = await prisma.dAOProposal.findUnique({
        where: { id },
    });

    if (!proposal) {
        throw new NotFoundError('Proposal not found');
    }

    if (proposal.status !== 'ACTIVE') {
        throw new BadRequestError('Voting is not active for this proposal');
    }

    if (proposal.votingEnds && proposal.votingEnds < new Date()) {
        throw new BadRequestError('Voting period has ended');
    }

    // Check if already voted
    const existingVote = await prisma.dAOVote.findUnique({
        where: {
            proposalId_voterId: { proposalId: id, voterId: req.user!.id },
        },
    });

    if (existingVote) {
        throw new BadRequestError('You have already voted on this proposal');
    }

    // Calculate voting power based on karma and tokens
    const [karma, tokenBalance] = await Promise.all([
        prisma.karmicScore.findUnique({ where: { userId: req.user!.id } }),
        prisma.tokenBalance.findUnique({ where: { userId: req.user!.id } }),
    ]);

    const votingPower = Math.floor(
        (karma?.overallScore || 0) / 10 + (tokenBalance?.balance || 0) / 100
    );

    if (votingPower < 1) {
        throw new BadRequestError('Insufficient voting power');
    }

    const daoVote = await prisma.dAOVote.create({
        data: {
            proposalId: id,
            voterId: req.user!.id,
            vote,
            votingPower,
            comment,
        },
    });

    res.json({
        success: true,
        data: {
            vote: daoVote,
            votingPower,
        },
    });
}));

/**
 * @swagger
 * /dao/my-voting-power:
 *   get:
 *     summary: Get user's voting power
 *     tags: [DAO]
 *     security:
 *       - bearerAuth: []
 */
router.get('/my-voting-power', authenticate, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const [karma, tokenBalance, proposalCount, voteCount] = await Promise.all([
        prisma.karmicScore.findUnique({ where: { userId: req.user!.id } }),
        prisma.tokenBalance.findUnique({ where: { userId: req.user!.id } }),
        prisma.dAOProposal.count({ where: { proposerId: req.user!.id } }),
        prisma.dAOVote.count({ where: { voterId: req.user!.id } }),
    ]);

    const votingPower = Math.floor(
        (karma?.overallScore || 0) / 10 + (tokenBalance?.balance || 0) / 100
    );

    res.json({
        success: true,
        data: {
            votingPower,
            breakdown: {
                fromKarma: Math.floor((karma?.overallScore || 0) / 10),
                fromTokens: Math.floor((tokenBalance?.balance || 0) / 100),
            },
            karma: karma?.overallScore || 0,
            tokens: tokenBalance?.balance || 0,
            proposalsCreated: proposalCount,
            votescast: voteCount,
            canPropose: (karma?.overallScore || 0) >= 100,
        },
    });
}));

/**
 * @swagger
 * /dao/stats:
 *   get:
 *     summary: Get DAO statistics
 *     tags: [DAO]
 */
router.get('/stats', asyncHandler(async (req: Request, res: Response) => {
    const [
        totalProposals,
        activeProposals,
        passedProposals,
        totalVotes,
        uniqueVoters,
        totalTokensStaked,
    ] = await Promise.all([
        prisma.dAOProposal.count(),
        prisma.dAOProposal.count({ where: { status: 'ACTIVE' } }),
        prisma.dAOProposal.count({ where: { status: 'PASSED' } }),
        prisma.dAOVote.count(),
        prisma.dAOVote.groupBy({ by: ['voterId'] }).then(r => r.length),
        prisma.tokenBalance.aggregate({ _sum: { balance: true } }),
    ]);

    res.json({
        success: true,
        data: {
            totalProposals,
            activeProposals,
            passedProposals,
            totalVotes,
            uniqueVoters,
            totalTokensStaked: totalTokensStaked._sum.balance || 0,
            participationRate: totalProposals > 0
                ? Math.round((totalVotes / (totalProposals * uniqueVoters || 1)) * 100)
                : 0,
        },
    });
}));

export default router;

