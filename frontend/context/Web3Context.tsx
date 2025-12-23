'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Contract ABIs (simplified)
const PROPERTY_NFT_ABI = [
    'function registerProperty(address to, string propertyId, string streetAddress, string city, string state, uint256 price, uint256 squareFeet, string uri) returns (uint256)',
    'function issueVastuCertificate(uint256 tokenId, uint8 score, string grade, string entranceDirection, bytes32 analysisHash)',
    'function getPropertyByBackendId(string propertyId) view returns (tuple(string propertyId, string streetAddress, string city, string state, uint256 price, uint256 squareFeet, uint8 vastuScore, string vastuGrade, uint256 registeredAt, bool isVerified))',
    'function hasValidVastuCertificate(uint256 tokenId) view returns (bool)',
    'function ownerOf(uint256 tokenId) view returns (address)',
    'function totalSupply() view returns (uint256)',
    'event PropertyRegistered(uint256 indexed tokenId, string propertyId, address owner)',
    'event VastuCertified(uint256 indexed tokenId, uint8 score, string grade)',
];

const FRACTIONAL_NFT_ABI = [
    'function fractionalizeProperty(string backendPropertyId, string name, uint256 totalShares, uint256 pricePerShare, uint8 vastuScore, address propertyManager) returns (uint256)',
    'function buyShares(uint256 propertyId, uint256 shares) payable',
    'function claimDividends(uint256 propertyId)',
    'function getSharePercentage(uint256 propertyId, address holder) view returns (uint256)',
    'function getInvestorCount(uint256 propertyId) view returns (uint256)',
    'function fractionalProperties(uint256 propertyId) view returns (tuple(string backendPropertyId, string name, uint256 totalShares, uint256 availableShares, uint256 pricePerShare, uint256 totalValue, uint8 vastuScore, bool isActive, uint256 createdAt, address propertyManager))',
    'event SharesPurchased(uint256 indexed propertyId, address indexed buyer, uint256 shares, uint256 paid)',
    'event DividendClaimed(uint256 indexed propertyId, address indexed holder, uint256 amount)',
];

// Contract addresses (to be set after deployment)
const CONTRACTS = {
    propertyNFT: process.env.NEXT_PUBLIC_PROPERTY_NFT_CONTRACT || '',
    fractionalNFT: process.env.NEXT_PUBLIC_FRACTIONAL_NFT_CONTRACT || '',
};

interface WalletState {
    address: string | null;
    chainId: number | null;
    isConnected: boolean;
    isConnecting: boolean;
    error: string | null;
}

interface Web3ContextType extends WalletState {
    connect: () => Promise<void>;
    disconnect: () => void;
    switchToPolygon: () => Promise<void>;
    getPropertyNFTContract: () => any;
    getFractionalNFTContract: () => any;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

const POLYGON_CHAIN_ID = 137;
const POLYGON_PARAMS = {
    chainId: '0x89',
    chainName: 'Polygon Mainnet',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com'],
};

export function Web3Provider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<WalletState>({
        address: null,
        chainId: null,
        isConnected: false,
        isConnecting: false,
        error: null,
    });

    // Check if wallet is already connected
    useEffect(() => {
        checkConnection();
        if (typeof window !== 'undefined' && window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);
        }
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            }
        };
    }, []);

    const checkConnection = async () => {
        if (typeof window === 'undefined' || !window.ethereum) return;
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                setState({
                    address: accounts[0],
                    chainId: parseInt(chainId, 16),
                    isConnected: true,
                    isConnecting: false,
                    error: null,
                });
            }
        } catch (error) {
            console.error('Error checking connection:', error);
        }
    };

    const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
            setState({ address: null, chainId: null, isConnected: false, isConnecting: false, error: null });
        } else {
            setState(prev => ({ ...prev, address: accounts[0] }));
        }
    };

    const handleChainChanged = (chainId: string) => {
        setState(prev => ({ ...prev, chainId: parseInt(chainId, 16) }));
    };

    const connect = async () => {
        if (typeof window === 'undefined' || !window.ethereum) {
            setState(prev => ({ ...prev, error: 'Please install MetaMask or another Web3 wallet' }));
            return;
        }

        setState(prev => ({ ...prev, isConnecting: true, error: null }));

        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });

            setState({
                address: accounts[0],
                chainId: parseInt(chainId, 16),
                isConnected: true,
                isConnecting: false,
                error: null,
            });
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                isConnecting: false,
                error: error.message || 'Failed to connect wallet',
            }));
        }
    };

    const disconnect = () => {
        setState({
            address: null,
            chainId: null,
            isConnected: false,
            isConnecting: false,
            error: null,
        });
    };

    const switchToPolygon = async () => {
        if (!window.ethereum) return;

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: POLYGON_PARAMS.chainId }],
            });
        } catch (error: any) {
            // Chain not added, add it
            if (error.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [POLYGON_PARAMS],
                });
            }
        }
    };

    const getPropertyNFTContract = () => {
        if (!window.ethereum || !CONTRACTS.propertyNFT) return null;
        // Note: In production, use ethers.js or viem
        return { address: CONTRACTS.propertyNFT, abi: PROPERTY_NFT_ABI };
    };

    const getFractionalNFTContract = () => {
        if (!window.ethereum || !CONTRACTS.fractionalNFT) return null;
        return { address: CONTRACTS.fractionalNFT, abi: FRACTIONAL_NFT_ABI };
    };

    return (
        <Web3Context.Provider value={{
            ...state,
            connect,
            disconnect,
            switchToPolygon,
            getPropertyNFTContract,
            getFractionalNFTContract,
        }}>
            {children}
        </Web3Context.Provider>
    );
}

export function useWeb3() {
    const context = useContext(Web3Context);
    if (context === undefined) {
        throw new Error('useWeb3 must be used within a Web3Provider');
    }
    return context;
}

// Type declaration for window.ethereum
declare global {
    interface Window {
        ethereum?: {
            request: (args: { method: string; params?: any[] }) => Promise<any>;
            on: (event: string, callback: (...args: any[]) => void) => void;
            removeListener: (event: string, callback: (...args: any[]) => void) => void;
        };
    }
}
