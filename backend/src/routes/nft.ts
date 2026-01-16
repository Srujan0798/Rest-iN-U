// NFT Marketplace Routes
import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * @swagger
 * /nft/listings:
 *   get:
 *     summary: Get all property listings that are tokenized
 *     tags: [NFT]
 */
router.get('/listings', asyncHandler(async (req: Request, res: Response) => {
    // Fetch properties that have a blockchain record, implying they are tokenized.
    // Ideally we would check for a "tokenId" field if it existed, but we can infer from BlockchainRecord
    // or assume all properties with a valid listing on the blockchain are returned.

    // Strategy: Find all properties that have a "OWNERSHIP_TRANSFER" or "REGISTRATION" record verified on blockchain.
    // Or simpler: properties that have 'blockchainRecord' entries.

    // Since we don't have a direct 'tokenId' on Property, we'll join with BlockchainRecord.
    // However, for simplicity and performance, we can just fetch all properties and filter those
    // that have been registered. A better approach for production would be a 'isTokenized' flag on Property.

    // Let's try to find properties where there is at least one blockchain record.
    const properties = await prisma.property.findMany({
        where: {
             // status: 'ACTIVE', // Optional: only active listings
             // We want properties that have blockchain records.
             // Prisma doesn't support relation filtering on non-relation fields easily without schema relation.
             // But let's check if Property has a relation to BlockchainRecord?
             // No, schema.prisma doesn't show a relation field `blockchainRecords` on `Property`.
             // But `BlockchainRecord` has `propertyId`.
             // We can fetch blockchain records and then fetch properties.
        },
        include: {
             photos: {
                 where: { isPrimary: true },
                 take: 1
             }
        }
    });

    // Fetch all property IDs that have blockchain records
    const tokenizedPropertyIds = await prisma.blockchainRecord.findMany({
        select: { propertyId: true },
        distinct: ['propertyId']
    });

    const tokenizedIds = new Set(tokenizedPropertyIds.map(r => r.propertyId));

    const listings = properties
        .filter(p => tokenizedIds.has(p.id))
        .map(p => ({
            id: p.id,
            title: p.title,
            price: p.price,
            address: `${p.streetAddress}, ${p.city}, ${p.state}`,
            image: p.photos[0]?.url || '/placeholder-house.jpg',
            // Mock token ID for now since it's not in DB. In real world, we'd query contract or store it.
            tokenId: parseInt(p.id.substring(0, 8), 16) % 10000,
            contractAddress: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || '0x...',
            currency: 'USD', // Base currency
            ethPrice: (p.price / 3000).toFixed(4), // Mock conversion
            maticPrice: (p.price / 0.8).toFixed(2), // Mock conversion
        }));

    res.json({
        success: true,
        data: listings
    });
}));

export default router;
