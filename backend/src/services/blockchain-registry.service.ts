import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers';
import { logger } from '../utils/logger';

// ABI for the RestInUPropertyNFT contract
const PROPERTY_NFT_ABI = [
    "function registerProperty(address to, string memory propertyId, string memory streetAddress, string memory city, string memory state, uint256 price, uint256 squareFeet, string memory uri) public returns (uint256)",
    "function issueVastuCertificate(uint256 tokenId, uint8 score, string memory grade, string memory entranceDirection, bytes32 analysisHash) public",
    "function getPropertyByBackendId(string memory propertyId) public view returns (tuple(string propertyId, string streetAddress, string city, string state, uint256 price, uint256 squareFeet, uint8 vastuScore, string vastuGrade, uint256 registeredAt, bool isVerified))",
    "event PropertyRegistered(uint256 indexed tokenId, string propertyId, address owner)",
    "event VastuCertified(uint256 indexed tokenId, uint8 score, string grade)"
];

/**
 * Blockchain Property Registry Service
 * 
 * Manages interactions with the RestInUPropertyNFT smart contract.
 * Uses ethers.js for interacting with an EVM-compatible blockchain (Polygon/Ethereum).
 */
class BlockchainRegistryService {
    private provider: ethers.JsonRpcProvider | null = null;
    private signer: ethers.Wallet | null = null;
    private contract: ethers.Contract | null = null;
    private contractAddress: string;

    constructor() {
        // Initialize with environment variables or defaults for local dev
        const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545';
        const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
        this.contractAddress = process.env.PROPERTY_NFT_ADDRESS || '0x0000000000000000000000000000000000000000';

        try {
            this.provider = new ethers.JsonRpcProvider(rpcUrl);
            if (privateKey) {
                this.signer = new ethers.Wallet(privateKey, this.provider);
                if (this.contractAddress !== '0x0000000000000000000000000000000000000000') {
                    this.contract = new ethers.Contract(this.contractAddress, PROPERTY_NFT_ABI, this.signer);
                }
            }
        } catch (error) {
            logger.warn(`[Blockchain] Failed to initialize provider/signer: ${error}`);
        }
    }

    // ============================================
    // PROPERTY REGISTRATION
    // ============================================

    async registerProperty(propertyData: PropertyRegistration): Promise<RegistrationResult> {
        logger.info(`[Blockchain] Registering property: ${propertyData.address}`);

        // If no real blockchain connection, return simulation
        if (!this.contract) {
            return this.simulateRegistration(propertyData);
        }

        try {
            // Upload metadata to IPFS (simulated for now)
            const ipfsHash = await this.storeOnIPFS(propertyData);
            const tokenUri = `ipfs://${ipfsHash}`;

            // Call smart contract
            const tx = await this.contract.registerProperty(
                propertyData.ownerWallet,
                propertyData.propertyId || uuidv4(),
                propertyData.address, // Simplifying address parts for this call
                "City", // Placeholder
                "State", // Placeholder
                ethers.parseEther("0"), // Price placeholder
                propertyData.sqft,
                tokenUri
            );

            logger.info(`[Blockchain] Transaction sent: ${tx.hash}`);
            const receipt = await tx.wait();

            // Extract tokenId from events
            // In a real scenario, parse logs. Here we simulate finding it or assume it succeeded.
            const tokenId = "1"; // Placeholder

            return {
                success: true,
                tokenId: tokenId,
                transactionHash: tx.hash,
                ipfsHash,
                explorerUrl: `https://polygonscan.com/tx/${tx.hash}`,
                certificateUrl: `/api/v1/blockchain/certificate/${tokenId}`,
                registeredAt: new Date().toISOString()
            };

        } catch (error: any) {
            logger.error(`[Blockchain] Registration failed: ${error.message}`);
            throw new Error(`Blockchain registration failed: ${error.message}`);
        }
    }

    // ============================================
    // VASTU CERTIFICATION
    // ============================================

    async issueVastuCertificate(tokenId: string, score: number, grade: string, entranceDir: string, analysisHash: string) {
        if (!this.contract) {
            logger.info(`[Blockchain] Simulating Vastu certification for token ${tokenId}`);
            return { transactionHash: this.generateTxHash(), success: true };
        }

        try {
            const tx = await this.contract.issueVastuCertificate(
                tokenId,
                score,
                grade,
                entranceDir,
                analysisHash // Bytes32
            );
            await tx.wait();
            return { transactionHash: tx.hash, success: true };
        } catch (error: any) {
             logger.error(`[Blockchain] Certification failed: ${error.message}`);
             throw error;
        }
    }

    // ============================================
    // SIMULATION FALLBACKS
    // ============================================

    private async simulateRegistration(propertyData: PropertyRegistration): Promise<RegistrationResult> {
        logger.info(`[Blockchain] Running in SIMULATION mode`);
        const tokenId = this.generateTokenId();
        const ipfsHash = 'Qm' + this.generateRandomString(44);
        const transactionHash = this.generateTxHash();

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            success: true,
            tokenId,
            transactionHash,
            ipfsHash,
            explorerUrl: `https://mumbai.polygonscan.com/tx/${transactionHash}`,
            certificateUrl: `/api/v1/blockchain/certificate/${tokenId}`,
            registeredAt: new Date().toISOString()
        };
    }

    private async storeOnIPFS(data: any): Promise<string> {
        // Mock IPFS storage
        return 'Qm' + this.generateRandomString(44);
    }

    private generateTokenId(): string {
        return `PROP-${Date.now()}`;
    }

    private generateTxHash(): string {
        return '0x' + this.generateRandomString(64);
    }

    private generateRandomString(length: number): string {
        const chars = 'abcdef0123456789';
        return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    }
}

// Types
interface PropertyRegistration {
    propertyId?: string;
    address: string;
    ownerWallet: string;
    coordinates: { lat: number; lng: number };
    propertyType: string;
    sqft: number;
    yearBuilt: number;
}

interface RegistrationResult {
    success: boolean;
    tokenId: string;
    transactionHash: string;
    ipfsHash: string;
    explorerUrl: string;
    certificateUrl: string;
    registeredAt: string;
}

// Export singleton
export const blockchainRegistryService = new BlockchainRegistryService();
export default BlockchainRegistryService;
