// Blockchain API Routes
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { blockchainService } from '../services/blockchain';
import { authenticate, requireAgent, AuthenticatedRequest } from '../middleware/auth';
import { asyncHandler, NotFoundError, BadRequestError } from '../middleware/errorHandler';
import { prisma } from '../utils/prisma';

const router = Router();

/**
 * @swagger
 * /blockchain/register/{propertyId}:
 *   post:
 *     summary: Register a property on the blockchain
 *     tags: [Blockchain]
 *     security:
 *       - bearerAuth: []
 */
router.post('/register/:propertyId', authenticate, requireAgent, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { propertyId } = req.params;

    const property = await prisma.property.findUnique({
        where: { id: propertyId },
        include: { listingAgent: true },
    });

    if (!property) {
        throw new NotFoundError('Property not found');
    }

    // Verify ownership
    if (property.listingAgentId !== req.user?.agentId) {
        throw new BadRequestError('You can only register your own listings');
    }

    const record = await blockchainService.registerProperty(propertyId, property);

    res.json({
        success: true,
        data: {
            message: 'Property registered on blockchain',
            record,
        },
    });
}));

/**
 * @swagger
 * /blockchain/verify/{propertyId}:
 *   get:
 *     summary: Verify a property's blockchain record
 *     tags: [Blockchain]
 */
router.get('/verify/:propertyId', asyncHandler(async (req: Request, res: Response) => {
    const { propertyId } = req.params;

    const verification = await blockchainService.verifyProperty(propertyId);

    res.json({
        success: true,
        data: verification,
    });
}));

/**
 * @swagger
 * /blockchain/history/{propertyId}:
 *   get:
 *     summary: Get blockchain history for a property
 *     tags: [Blockchain]
 */
router.get('/history/:propertyId', asyncHandler(async (req: Request, res: Response) => {
    const { propertyId } = req.params;

    const history = await blockchainService.getPropertyHistory(propertyId);

    res.json({
        success: true,
        data: {
            propertyId,
            records: history,
        },
    });
}));

/**
 * @swagger
 * /blockchain/fractional/{propertyId}:
 *   post:
 *     summary: Create fractional ownership shares
 *     tags: [Blockchain]
 *     security:
 *       - bearerAuth: []
 */
router.post('/fractional/:propertyId', authenticate, requireAgent, asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { propertyId } = req.params;
    const { totalShares, pricePerShare } = req.body;

    if (!totalShares || !pricePerShare) {
        throw new BadRequestError('totalShares and pricePerShare are required');
    }

    const property = await prisma.property.findUnique({
        where: { id: propertyId },
    });

    if (!property) {
        throw new NotFoundError('Property not found');
    }

    if (property.listingAgentId !== req.user?.agentId) {
        throw new BadRequestError('You can only fractionalize your own listings');
    }

    const shares = await blockchainService.createFractionalShares(
        propertyId,
        totalShares,
        pricePerShare
    );

    res.json({
        success: true,
        data: {
            message: 'Fractional ownership created',
            shares,
        },
    });
}));

/**
 * @swagger
 * /blockchain/fractional/{propertyId}:
 *   get:
 *     summary: Get fractional ownership details
 *     tags: [Blockchain]
 */
router.get('/fractional/:propertyId', asyncHandler(async (req: Request, res: Response) => {
    const { propertyId } = req.params;

    const shares = await prisma.fractionalShare.findFirst({
        where: { propertyId },
        include: {
            property: {
                select: {
                    title: true,
                    streetAddress: true,
                    city: true,
                    price: true,
                    photos: { where: { isPrimary: true }, take: 1 },
                },
            },
        },
    });

    if (!shares) {
        throw new NotFoundError('No fractional ownership for this property');
    }

    res.json({
        success: true,
        data: {
            ...shares,
            percentAvailable: Math.round((shares.availableShares / shares.totalShares) * 100),
            totalValue: Number(shares.pricePerShare) * shares.totalShares,
        },
    });
}));

/**
 * @swagger
 * /blockchain/certificate/{propertyId}:
 *   get:
 *     summary: Get blockchain verification certificate data
 *     tags: [Blockchain]
 */
router.get('/certificate/:propertyId', asyncHandler(async (req: Request, res: Response) => {
    const { propertyId } = req.params;

    const [property, records] = await Promise.all([
        prisma.property.findUnique({
            where: { id: propertyId },
            include: {
                listingAgent: {
                    include: {
                        user: { select: { firstName: true, lastName: true } },
                    },
                },
            },
        }),
        prisma.blockchainRecord.findMany({
            where: { propertyId },
            orderBy: { timestamp: 'asc' },
        }),
    ]);

    if (!property || records.length === 0) {
        throw new NotFoundError('No blockchain certificate available');
    }

    const registrationRecord = records.find(r => r.eventType === 'REGISTRATION');

    res.json({
        success: true,
        data: {
            certificateId: `DRC-${propertyId.slice(0, 8).toUpperCase()}`,
            property: {
                address: `${property.streetAddress}, ${property.city}, ${property.state}`,
                type: property.propertyType,
            },
            blockchain: {
                network: registrationRecord?.network || 'polygon',
                transactionHash: registrationRecord?.transactionHash,
                blockNumber: registrationRecord?.blockNumber,
                registeredAt: registrationRecord?.timestamp,
            },
            agent: property.listingAgent ? {
                name: `${property.listingAgent.user.firstName} ${property.listingAgent.user.lastName}`,
                license: property.listingAgent.licenseNumber,
            } : null,
            totalRecords: records.length,
            verifiedAt: new Date(),
        },
    });
}));

export default router;

