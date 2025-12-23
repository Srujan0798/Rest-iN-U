'use client';

import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { X, Coins, AlertCircle, CheckCircle, Loader2, ExternalLink, TrendingUp, Users, Wallet } from 'lucide-react';

interface FractionalOwnershipModalProps {
    isOpen: boolean;
    onClose: () => void;
    property: {
        id: string;
        title: string;
        price: number;
        vastuScore: number;
        image?: string;
        totalShares?: number;
        availableShares?: number;
        pricePerShare?: number;
    };
}

export default function FractionalOwnershipModal({ isOpen, onClose, property }: FractionalOwnershipModalProps) {
    const { address, isConnected, connect, chainId } = useWeb3();
    const [shares, setShares] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const POLYGON_CHAIN_ID = 137;
    const totalShares = property.totalShares || 1000;
    const availableShares = property.availableShares || 750;
    const pricePerShare = property.pricePerShare || Math.round(property.price / totalShares);
    const totalCost = shares * pricePerShare;
    const ownershipPercent = ((shares / totalShares) * 100).toFixed(2);
    const investorCount = 47; // Mock data

    const handleBuyShares = async () => {
        if (!isConnected) {
            await connect();
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Mock transaction - in production, use ethers.js
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Simulate success
            setTxHash('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');
        } catch (err: any) {
            setError(err.message || 'Transaction failed');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="relative w-full max-w-lg mx-4 bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl border border-gray-700 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-lg">
                            <Coins className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Fractional Ownership</h2>
                            <p className="text-sm text-gray-400">Own a piece of {property.title}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-5">
                    {/* Property Summary */}
                    <div className="flex gap-4 p-4 bg-gray-800/50 rounded-xl">
                        {property.image && (
                            <img src={property.image} alt={property.title} className="w-20 h-20 object-cover rounded-lg" />
                        )}
                        <div className="flex-1">
                            <h3 className="font-semibold text-white">{property.title}</h3>
                            <p className="text-lg font-bold text-indigo-400">${(property.price / 1000000).toFixed(2)}M</p>
                            <div className="flex items-center gap-1 mt-1">
                                <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded">Vastu {property.vastuScore}</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-gray-800/50 rounded-xl text-center">
                            <TrendingUp className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                            <p className="text-xs text-gray-400">Share Price</p>
                            <p className="font-semibold text-white">${pricePerShare.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-gray-800/50 rounded-xl text-center">
                            <Coins className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                            <p className="text-xs text-gray-400">Available</p>
                            <p className="font-semibold text-white">{availableShares}/{totalShares}</p>
                        </div>
                        <div className="p-3 bg-gray-800/50 rounded-xl text-center">
                            <Users className="w-5 h-5 text-green-400 mx-auto mb-1" />
                            <p className="text-xs text-gray-400">Investors</p>
                            <p className="font-semibold text-white">{investorCount}</p>
                        </div>
                    </div>

                    {/* Share Selector */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-300">Number of Shares</label>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShares(Math.max(1, shares - 1))}
                                className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-bold"
                            >-</button>
                            <input
                                type="number"
                                value={shares}
                                onChange={(e) => setShares(Math.min(availableShares, Math.max(1, parseInt(e.target.value) || 1)))}
                                className="flex-1 h-10 bg-gray-800 border border-gray-700 rounded-lg text-center text-white font-semibold focus:border-indigo-500 outline-none"
                            />
                            <button
                                onClick={() => setShares(Math.min(availableShares, shares + 1))}
                                className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-bold"
                            >+</button>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Ownership: <span className="text-indigo-400 font-medium">{ownershipPercent}%</span></span>
                            <span className="text-gray-400">Cost: <span className="text-white font-medium">${totalCost.toLocaleString()}</span></span>
                        </div>
                    </div>

                    {/* Quick Select */}
                    <div className="flex gap-2">
                        {[1, 5, 10, 25].map(n => (
                            <button
                                key={n}
                                onClick={() => setShares(Math.min(availableShares, n))}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${shares === n ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    }`}
                            >{n} {n === 1 ? 'Share' : 'Shares'}</button>
                        ))}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Success */}
                    {txHash && (
                        <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400">
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Transaction Successful!</p>
                                <a
                                    href={`https://polygonscan.com/tx/${txHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs flex items-center gap-1 text-indigo-400 hover:underline"
                                >
                                    View on Polygonscan <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-800">
                    {chainId !== POLYGON_CHAIN_ID && isConnected ? (
                        <button className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Switch to Polygon Network
                        </button>
                    ) : (
                        <button
                            onClick={handleBuyShares}
                            disabled={isLoading || !!txHash}
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Processing...
                                </>
                            ) : txHash ? (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    Purchase Complete
                                </>
                            ) : !isConnected ? (
                                <>
                                    <Wallet className="w-4 h-4" />
                                    Connect Wallet to Buy
                                </>
                            ) : (
                                <>
                                    <Coins className="w-4 h-4" />
                                    Buy {shares} {shares === 1 ? 'Share' : 'Shares'} for ${totalCost.toLocaleString()}
                                </>
                            )}
                        </button>
                    )}
                    <p className="text-xs text-gray-500 text-center mt-3">
                        By purchasing, you agree to the investment terms. Shares are represented as ERC-1155 tokens on Polygon.
                    </p>
                </div>
            </div>
        </div>
    );
}

