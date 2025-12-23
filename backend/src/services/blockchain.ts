// Blockchain Service for Property Records
import { ethers } from 'ethers';
import { config } from '../config';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import { BlockchainRecordType } from '@prisma/client';

// Simplified ABI for property registry contract
const PROPERTY_REGISTRY_ABI = [
    'function registerProperty(string propertyId, bytes32 dataHash) external returns (uint256)',
    'function getPropertyRecord(string propertyId) external view returns (uint256 timestamp, bytes32 dataHash, address registrant)',
    'function transferOwnership(string propertyId, address newOwner) external',
    'function verifyProperty(string propertyId, bytes32 dataHash) external view returns (bool)',
    'event PropertyRegistered(string indexed propertyId, bytes32 dataHash, uint256 timestamp)',
    'event OwnershipTransferred(string indexed propertyId, address indexed previousOwner, address indexed newOwner)',
];

interface BlockchainRecordResult {
    propertyId: string;
    transactionHash: string;
    blockNumber: number;
    timestamp: Date;
    dataHash: string;
}

export class BlockchainService {
    private provider: ethers.JsonRpcProvider | null = null;
    private wallet: ethers.Wallet | null = null;
    private contract: ethers.Contract | null = null;

    constructor() {
        this.initialize();
    }

    private initialize() {
        if (!config.blockchain?.polygonRpcUrl) {
            logger.warn('Blockchain: No RPC URL configured, using mock mode');
            return;
        }

        try {
            this.provider = new ethers.JsonRpcProvider(config.blockchain.polygonRpcUrl);

            if (config.blockchain.deployerPrivateKey) {
                this.wallet = new ethers.Wallet(config.blockchain.deployerPrivateKey, this.provider);
            }

            if (config.blockchain.propertyRegistryContract && this.wallet) {
                this.contract = new ethers.Contract(
                    config.blockchain.propertyRegistryContract,
                    PROPERTY_REGISTRY_ABI,
                    this.wallet
                );
            }

            logger.info('Blockchain service initialized');
        } catch (error) {
            logger.error('Failed to initialize blockchain service:', error);
        }
    }


    /**
     * Generate a hash of property data for blockchain storage
     */
    generatePropertyHash(property: any): string {
        const dataString = JSON.stringify({
            id: property.id,
            address: property.streetAddress,
            city: property.city,
            state: property.state,
            price: property.price?.toString(),
            owner: property.owner,
            timestamp: new Date().toISOString(),
        });
        return ethers.keccak256(ethers.toUtf8Bytes(dataString));
    }

    /**
     * Register a property on the blockchain
     */
    async registerProperty(propertyId: string, propertyData: any): Promise<BlockchainRecordResult | null> {
        const dataHash = this.generatePropertyHash(propertyData);

        // If no real blockchain, create mock record
        if (!this.contract) {
            const mockRecord = await this.createMockRecord(propertyId, dataHash, 'OWNERSHIP_TRANSFER');
            return mockRecord;
        }

        try {
            const tx = await this.contract.registerProperty(propertyId, dataHash);
            const receipt = await tx.wait();

            await prisma.blockchainRecord.create({
                data: {
                    propertyId,
                    transactionHash: receipt.hash,
                    blockNumber: BigInt(receipt.blockNumber),
                    chainId: 137, // Polygon
                    recordType: 'OWNERSHIP_TRANSFER',
                    data: {
                        dataHash,
                        gasUsed: receipt.gasUsed?.toString(),
                        contractAddress: config.blockchain.propertyRegistryContract,
                        action: 'REGISTRATION',
                    },
                    verified: true,
                },
            });

            logger.info(`Property ${propertyId} registered on blockchain: ${receipt.hash}`);

            return {
                propertyId,
                transactionHash: receipt.hash,
                blockNumber: receipt.blockNumber,
                timestamp: new Date(),
                dataHash,
            };
        } catch (error) {
            logger.error(`Failed to register property ${propertyId}:`, error);
            throw error;
        }
    }

    /**
     * Verify a property's blockchain record
     */
    async verifyProperty(propertyId: string): Promise<{
        verified: boolean;
        record: any | null;
        integrity: boolean;
    }> {
        const record = await prisma.blockchainRecord.findFirst({
            where: { propertyId, recordType: 'OWNERSHIP_TRANSFER' },
            orderBy: { createdAt: 'desc' },
        });

        if (!record) {
            return { verified: false, record: null, integrity: false };
        }

        // Get current property data and compare hash
        const property = await prisma.property.findUnique({
            where: { id: propertyId },
        });

        if (!property) {
            return { verified: true, record, integrity: false };
        }

        const currentHash = this.generatePropertyHash(property);
        const recordData = record.data as any;
        const storedHash = recordData?.dataHash;
        const integrity = storedHash ? currentHash === storedHash : false;

        return {
            verified: true,
            record: {
                transactionHash: record.transactionHash,
                blockNumber: Number(record.blockNumber),
                createdAt: record.createdAt,
                chainId: record.chainId,
            },
            integrity,
        };
    }

    /**
     * Record ownership transfer on blockchain
     */
    async recordTransfer(
        propertyId: string,
        fromWallet: string,
        toWallet: string,
        transactionDetails: any
    ): Promise<BlockchainRecordResult | null> {
        const dataHash = ethers.keccak256(
            ethers.toUtf8Bytes(JSON.stringify({
                propertyId,
                from: fromWallet,
                to: toWallet,
                price: transactionDetails.price,
                timestamp: new Date().toISOString(),
            }))
        );

        if (!this.contract) {
            return this.createMockRecord(propertyId, dataHash, 'OWNERSHIP_TRANSFER');
        }

        try {
            const tx = await this.contract.transferOwnership(propertyId, toWallet);
            const receipt = await tx.wait();

            await prisma.blockchainRecord.create({
                data: {
                    propertyId,
                    transactionHash: receipt.hash,
                    blockNumber: BigInt(receipt.blockNumber),
                    chainId: 137,
                    recordType: 'OWNERSHIP_TRANSFER',
                    data: {
                        dataHash,
                        from: fromWallet,
                        to: toWallet,
                        ...transactionDetails,
                        contractAddress: config.blockchain.propertyRegistryContract,
                    },
                    verified: true,
                },
            });

            return {
                propertyId,
                transactionHash: receipt.hash,
                blockNumber: receipt.blockNumber,
                timestamp: new Date(),
                dataHash,
            };
        } catch (error) {
            logger.error('Transfer recording failed:', error);
            throw error;
        }
    }

    /**
     * Get blockchain history for a property
     */
    async getPropertyHistory(propertyId: string) {
        const records = await prisma.blockchainRecord.findMany({
            where: { propertyId },
            orderBy: { createdAt: 'desc' },
        });

        return records.map(r => ({
            type: r.recordType,
            transactionHash: r.transactionHash,
            blockNumber: Number(r.blockNumber),
            createdAt: r.createdAt,
            chainId: r.chainId,
            verified: r.verified,
        }));
    }

    /**
     * Create fractional ownership tokens
     */
    async createFractionalShares(
        propertyId: string,
        totalShares: number,
        pricePerShare: number
    ) {
        // This would integrate with a real ERC-1155 or similar contract
        // For now, create database records

        const property = await prisma.property.findUnique({
            where: { id: propertyId },
        });

        if (!property) {
            throw new Error('Property not found');
        }

        // Create fractional shares record
        const shares = await prisma.fractionalShare.create({
            data: {
                propertyId,
                ownerAddress: '0x0000000000000000000000000000000000000000', // Initial holder
                sharePercentage: 100,
                purchasePrice: pricePerShare * totalShares,
                purchaseDate: new Date(),
                status: 'ACTIVE',
            },
        });

        // Record on blockchain
        await this.registerProperty(propertyId, {
            ...property,
            fractionalShares: totalShares,
            pricePerShare,
        });

        return shares;
    }

    private async createMockRecord(
        propertyId: string,
        dataHash: string,
        recordType: BlockchainRecordType
    ): Promise<BlockchainRecordResult> {
        const mockTxHash = `0x${Buffer.from(Math.random().toString()).toString('hex').slice(0, 64)}`;
        const mockBlockNumber = Math.floor(Math.random() * 1000000) + 50000000;

        await prisma.blockchainRecord.create({
            data: {
                propertyId,
                transactionHash: mockTxHash,
                blockNumber: BigInt(mockBlockNumber),
                chainId: 80001, // Polygon Mumbai testnet
                recordType,
                data: {
                    dataHash,
                    mock: true,
                },
                verified: true,
            },
        });

        return {
            propertyId,
            transactionHash: mockTxHash,
            blockNumber: mockBlockNumber,
            timestamp: new Date(),
            dataHash,
        };
    }
}

export const blockchainService = new BlockchainService();
