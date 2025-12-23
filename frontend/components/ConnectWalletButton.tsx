'use client';

import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Wallet, LogOut, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

interface ConnectWalletButtonProps {
    variant?: 'primary' | 'secondary' | 'outline';
    showAddress?: boolean;
    className?: string;
}

export default function ConnectWalletButton({
    variant = 'primary',
    showAddress = true,
    className = ''
}: ConnectWalletButtonProps) {
    const { address, chainId, isConnected, isConnecting, error, connect, disconnect, switchToPolygon } = useWeb3();

    const POLYGON_CHAIN_ID = 137;
    const isWrongNetwork = isConnected && chainId !== POLYGON_CHAIN_ID;

    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    const baseStyles = 'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200';
    const variantStyles = {
        primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl',
        secondary: 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30',
        outline: 'border border-gray-600 hover:border-indigo-500 text-gray-300 hover:text-white',
    };

    if (error) {
        return (
            <div className={`${baseStyles} bg-red-500/20 text-red-400 border border-red-500/30 ${className}`}>
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
            </div>
        );
    }

    if (isWrongNetwork) {
        return (
            <button
                onClick={switchToPolygon}
                className={`${baseStyles} bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 ${className}`}
            >
                <AlertCircle className="w-4 h-4" />
                <span>Switch to Polygon</span>
            </button>
        );
    }

    if (isConnected && address) {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                {showAddress && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-xl">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm font-medium">{formatAddress(address)}</span>
                        <a
                            href={`https://polygonscan.com/address/${address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-indigo-400 transition-colors"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>
                )}
                <button
                    onClick={disconnect}
                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all"
                    title="Disconnect wallet"
                >
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={connect}
            disabled={isConnecting}
            className={`${baseStyles} ${variantStyles[variant]} ${className} ${isConnecting ? 'opacity-70 cursor-wait' : ''}`}
        >
            <Wallet className="w-4 h-4" />
            <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
        </button>
    );
}

