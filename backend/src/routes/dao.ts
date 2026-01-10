// DAO Governance Routes - Stub implementation
import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { asyncHandler, NotFoundError, BadRequestError } from '../middleware/errorHandler';

const router = Router();

/**
 * Get all DAO proposals
 */
router.get('/proposals', asyncHandler(async (req: Request, res: Response) => {
    const { status, page = '1', limit = '20' } = req.query;

    const where: any = {};
    if (status) where.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [proposals, total] = await Promise.all([
        prisma.dAOProposal.findMany({
            where,
            skip,
            take: Number(limit),
            orderBy: { createdAt: 'desc' },
        }),
        prisma.dAOProposal.count({ where }),
    ]);

    res.json({
        success: true,
        data: {
            proposals: proposals.map((p: any) => ({
                ...p,
                timeRemaining: p.endTime ? Math.max(0, new Date(p.endTime).getTime() - Date.now()) : 0,
            })),
            pagination: { page: Number(page), limit: Number(limit), total },
        },
    });
}));

/**
 * Get proposal details
 */
router.get('/proposals/:id', asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const proposal = await prisma.dAOProposal.findUnique({
        where: { id },
        include: {
            votes: { take: 50 },
        },
    });

    if (!proposal) {
        throw new NotFoundError('Proposal not found');
    }

    const votes = proposal.votes as any[];
    const forVotes = votes.filter((v: any) => v.vote === 'FOR').reduce((sum: number, v: any) => sum + (v.votePower || 1), 0);
    const againstVotes = votes.filter((v: any) => v.vote === 'AGAINST').reduce((sum: number, v: any) => sum + (v.votePower || 1), 0);
    const totalVotes = forVotes + againstVotes;

    res.json({
        success: true,
        data: {
            ...proposal,
            voteSummary: {
                for: forVotes,
                against: againstVotes,
                total: totalVotes,
                forPercent: totalVotes > 0 ? Math.round((forVotes / totalVotes) * 100) : 0,
                againstPercent: totalVotes > 0 ? Math.round((againstVotes / totalVotes) * 100) : 0,
            },
            timeRemaining: proposal.endTime ? Math.max(0, new Date(proposal.endTime).getTime() - Date.now()) : 0,
        },
    });
}));

/**
 * Vote on a proposal
 */
router.post('/proposals/:id/vote', authenticate, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { vote } = req.body;

    if (!['FOR', 'AGAINST', 'ABSTAIN'].includes(vote)) {
        throw new BadRequestError('Vote must be FOR, AGAINST, or ABSTAIN');
    }

    const proposal = await prisma.dAOProposal.findUnique({ where: { id } });
    if (!proposal) {
        throw new NotFoundError('Proposal not found');
    }

    if (proposal.status !== 'ACTIVE') {
        throw new BadRequestError('Voting is not active');
    }

    // Check if already voted
    const existingVote = await prisma.dAOVote.findUnique({
        where: { proposalId_userId: { proposalId: id, userId: req.user!.id } },
    });

    if (existingVote) {
        throw new BadRequestError('Already voted');
    }

    const daoVote = await prisma.dAOVote.create({
        data: {
            proposalId: id,
            userId: req.user!.id,
            vote,
            votePower: 1,
        },
    });

    res.json({ success: true, data: daoVote });
}));

/**
 * Get voting power
 */
router.get('/my-voting-power', authenticate, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const tokenBalance = await prisma.tokenBalance.findUnique({
        where: { userId: req.user!.id },
    });

    res.json({
        success: true,
        data: {
            votingPower: tokenBalance?.balance || 1,
            tokens: tokenBalance?.balance || 0,
        },
    });
}));

/**
 * Get DAO stats
 */
router.get('/stats', asyncHandler(async (req: Request, res: Response) => {
    const [totalProposals, activeProposals, totalVotes] = await Promise.all([
        prisma.dAOProposal.count(),
        prisma.dAOProposal.count({ where: { status: 'ACTIVE' } }),
        prisma.dAOVote.count(),
    ]);

    res.json({
        success: true,
        data: {
            totalProposals,
            activeProposals,
            totalVotes,
        },
    });
}));

export default router;
