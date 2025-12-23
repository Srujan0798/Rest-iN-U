'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function BlockchainPage() {
    const searchParams = useSearchParams();
    const propertyId = searchParams?.get('property');

    const [verification, setVerification] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [certificate, setCertificate] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchId, setSearchId] = useState(propertyId || '');

    const loadBlockchainData = async (id: string) => {
        if (!id) return;
        setLoading(true);

        try {
            const [verifyRes, historyRes, certRes] = await Promise.all([
                fetch(`http://localhost:4000/api/v1/blockchain/verify/${id}`).then(r => r.json()),
                fetch(`http://localhost:4000/api/v1/blockchain/history/${id}`).then(r => r.json()),
                fetch(`http://localhost:4000/api/v1/blockchain/certificate/${id}`).then(r => r.json()).catch(() => null),
            ]);

            setVerification(verifyRes.data);
            setHistory(historyRes.data?.records || []);
            setCertificate(certRes?.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (propertyId) {
            loadBlockchainData(propertyId);
        } else {
            setLoading(false);
        }
    }, [propertyId]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchId) loadBlockchainData(searchId);
    };

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Hero */}
            <div className="bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 py-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur mb-6">
                        <span className="text-5xl">🔗</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        Blockchain Verification
                    </h1>
                    <p className="text-white/70 max-w-xl mx-auto mb-8">
                        Verify property authenticity with immutable on-chain records on Polygon
                    </p>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="max-w-lg mx-auto">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                placeholder="Enter Property ID..."
                                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-white/90 transition"
                            >
                                Verify
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto" />
                        <p className="text-gray-400 mt-4">Verifying blockchain records...</p>
                    </div>
                ) : !verification ? (
                    <div className="text-center py-12 text-gray-400">
                        <div className="text-6xl mb-4">🔍</div>
                        <p>Enter a property ID to verify its blockchain records</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Verification Status */}
                        <div className={`rounded-2xl p-8 ${verification.verified
                                ? 'bg-gradient-to-br from-green-900/50 to-emerald-900/50 border border-green-500/30'
                                : 'bg-gradient-to-br from-red-900/50 to-orange-900/50 border border-red-500/30'
                            }`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl ${verification.verified ? 'bg-green-500/20' : 'bg-red-500/20'
                                    }`}>
                                    {verification.verified ? '✅' : '❌'}
                                </div>
                                <div>
                                    <h2 className={`text-2xl font-bold ${verification.verified ? 'text-green-400' : 'text-red-400'}`}>
                                        {verification.verified ? 'Blockchain Verified' : 'Not Verified'}
                                    </h2>
                                    <p className="text-gray-400">
                                        {verification.verified
                                            ? 'This property has been registered on the blockchain'
                                            : 'No blockchain record found for this property'}
                                    </p>
                                </div>
                            </div>

                            {verification.verified && verification.record && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                    <div className="bg-black/20 rounded-lg p-4">
                                        <div className="text-gray-500 text-xs mb-1">Network</div>
                                        <div className="text-white font-mono">{verification.record.network}</div>
                                    </div>
                                    <div className="bg-black/20 rounded-lg p-4">
                                        <div className="text-gray-500 text-xs mb-1">Block</div>
                                        <div className="text-white font-mono">#{verification.record.blockNumber}</div>
                                    </div>
                                    <div className="bg-black/20 rounded-lg p-4 col-span-2">
                                        <div className="text-gray-500 text-xs mb-1">Transaction Hash</div>
                                        <div className="text-cyan-400 font-mono text-sm truncate">
                                            {verification.record.transactionHash}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {verification.verified && !verification.integrity && (
                                <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                                    <div className="flex items-center gap-2 text-yellow-400">
                                        <span>⚠️</span>
                                        <span className="font-medium">Data Integrity Warning</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mt-1">
                                        The property data has been modified since the original blockchain registration.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Certificate */}
                        {certificate && (
                            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-white">Verification Certificate</h3>
                                    <div className="text-cyan-400 font-mono">{certificate.certificateId}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <div className="text-gray-500 text-sm mb-1">Property</div>
                                        <div className="text-white">{certificate.property?.address}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 text-sm mb-1">Type</div>
                                        <div className="text-white">{certificate.property?.type}</div>
                                    </div>
                                    {certificate.agent && (
                                        <>
                                            <div>
                                                <div className="text-gray-500 text-sm mb-1">Listing Agent</div>
                                                <div className="text-white">{certificate.agent.name}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500 text-sm mb-1">License</div>
                                                <div className="text-white font-mono">{certificate.agent.license}</div>
                                            </div>
                                        </>
                                    )}
                                    <div>
                                        <div className="text-gray-500 text-sm mb-1">Registered</div>
                                        <div className="text-white">
                                            {new Date(certificate.blockchain?.registeredAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 text-sm mb-1">Total Records</div>
                                        <div className="text-white">{certificate.totalRecords}</div>
                                    </div>
                                </div>

                                <button className="mt-6 w-full py-3 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition">
                                    Download Certificate PDF
                                </button>
                            </div>
                        )}

                        {/* Transaction History */}
                        {history.length > 0 && (
                            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                                <h3 className="text-xl font-bold text-white mb-6">Transaction History</h3>
                                <div className="space-y-4">
                                    {history.map((record, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-lg">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${record.type === 'REGISTRATION' ? 'bg-green-500/20 text-green-400' :
                                                    record.type === 'TRANSFER' ? 'bg-blue-500/20 text-blue-400' :
                                                        'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                {record.type === 'REGISTRATION' ? '📝' :
                                                    record.type === 'TRANSFER' ? '🔄' : '📌'}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-white font-medium">{record.type}</div>
                                                <div className="text-gray-500 text-sm font-mono truncate">
                                                    {record.transactionHash}
                                                </div>
                                            </div>
                                            <div className="text-right text-sm">
                                                <div className="text-gray-400">Block #{record.blockNumber}</div>
                                                <div className="text-gray-500">
                                                    {new Date(record.timestamp).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Back Link */}
                        {propertyId && (
                            <div className="text-center">
                                <Link href={`/property/${propertyId}`} className="text-cyan-400 hover:underline">
                                    ← Back to Property
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

