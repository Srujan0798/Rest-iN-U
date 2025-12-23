'use client';

import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { X, Award, CheckCircle, Loader2, Download, Share2, Shield, ExternalLink } from 'lucide-react';

interface VastuCertificateModalProps {
    isOpen: boolean;
    onClose: () => void;
    property: {
        id: string;
        title: string;
        vastuScore: number;
        vastuGrade: string;
        entranceDirection?: string;
    };
    certificate?: {
        tokenId: number;
        issuedAt: Date;
        txHash: string;
        analysisHash: string;
    };
}

export default function VastuCertificateModal({ isOpen, onClose, property, certificate }: VastuCertificateModalProps) {
    const { address, isConnected } = useWeb3();
    const [isGenerating, setIsGenerating] = useState(false);

    const gradeColors: Record<string, string> = {
        'A+': 'from-green-500 to-emerald-600',
        'A': 'from-green-400 to-green-600',
        'B+': 'from-lime-400 to-green-500',
        'B': 'from-yellow-400 to-amber-500',
        'C': 'from-orange-400 to-orange-600',
        'D': 'from-red-400 to-red-600',
        'F': 'from-red-600 to-red-800',
    };

    const handleDownload = () => {
        // In production, generate PDF certificate
        console.log('Downloading certificate...');
    };

    const handleShare = () => {
        navigator.share?.({
            title: `Vastu Certificate - ${property.title}`,
            text: `This property has a Vastu score of ${property.vastuScore} (Grade ${property.vastuGrade})`,
            url: window.location.href,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="relative w-full max-w-md mx-4 bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
                {/* Certificate Header */}
                <div className="relative h-32 bg-gradient-to-br from-indigo-600 to-purple-700 overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M30 0L60 30 30 60 0 30z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
                    </div>
                    <div className="absolute top-4 right-4">
                        <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end gap-4">
                        <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${gradeColors[property.vastuGrade] || gradeColors['B']} flex items-center justify-center shadow-lg`}>
                            <span className="text-3xl font-bold text-white">{property.vastuGrade}</span>
                        </div>
                        <div className="pb-1">
                            <h2 className="text-xl font-bold text-white">Vastu Certificate</h2>
                            <p className="text-white/80 text-sm">On-Chain Verification</p>
                        </div>
                    </div>
                </div>

                {/* Certificate Content */}
                <div className="p-5 space-y-4">
                    {/* Property Info */}
                    <div className="text-center pb-4 border-b border-gray-800">
                        <h3 className="text-lg font-semibold text-white">{property.title}</h3>
                        <div className="flex items-center justify-center gap-4 mt-2">
                            <div>
                                <p className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">{property.vastuScore}</p>
                                <p className="text-xs text-gray-400">Vastu Score</p>
                            </div>
                            {property.entranceDirection && (
                                <div>
                                    <p className="text-lg font-semibold text-white">{property.entranceDirection}</p>
                                    <p className="text-xs text-gray-400">Entrance</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Blockchain Verification */}
                    {certificate ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-green-400">
                                <Shield className="w-5 h-5" />
                                <span className="font-medium">Verified on Polygon</span>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Token ID</span>
                                    <span className="text-white font-mono">#{certificate.tokenId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Issued</span>
                                    <span className="text-white">{certificate.issuedAt.toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Analysis Hash</span>
                                    <span className="text-white font-mono text-xs">{certificate.analysisHash.slice(0, 10)}...</span>
                                </div>
                            </div>

                            <a
                                href={`https://polygonscan.com/tx/${certificate.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-indigo-400 text-sm transition-colors"
                            >
                                View Transaction <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-gray-400 text-sm mb-3">This certificate has not been minted on-chain yet.</p>
                            {!isConnected && <p className="text-amber-400 text-xs">Connect wallet to mint certificate</p>}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={handleDownload}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-white transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Download
                        </button>
                        <button
                            onClick={handleShare}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-white transition-colors"
                        >
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-4 bg-gray-800/50 border-t border-gray-800">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Award className="w-4 h-4" />
                        <span>Certified by REST-iN-U Vastu Analysis System</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

