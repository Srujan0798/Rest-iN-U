'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../../lib/api';

export default function DAOPage() {
    const [proposals, setProposals] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [votingPower, setVotingPower] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('ACTIVE');
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        Promise.all([
            api.request<any>('/dao/proposals?status=' + activeFilter).catch(() => ({ data: { proposals: [] } })),
            api.request<any>('/dao/stats').catch(() => ({ data: null })),
        ]).then(([proposalsRes, statsRes]) => {
            setProposals(proposalsRes.data?.proposals || []);
            setStats(statsRes.data);
            setLoading(false);
        }).catch(() => setLoading(false));

        // Get voting power if authenticated
        if (localStorage.getItem('restinu_token')) {
            api.request<any>('/dao/my-voting-power')
                .then(res => setVotingPower(res.data))
                .catch(() => { });
        }
    }, [activeFilter]);

    const formatTimeRemaining = (ms: number) => {
        if (ms <= 0) return 'Ended';
        const days = Math.floor(ms / (1000 * 60 * 60 * 24));
        const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (days > 0) return `${days}d ${hours}h left`;
        return `${hours}h left`;
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            PLATFORM_FEE: 'bg-blue-100 text-blue-700',
            NEW_FEATURE: 'bg-purple-100 text-purple-700',
            COMMUNITY: 'bg-green-100 text-green-700',
            PARTNERSHIP: 'bg-amber-100 text-amber-700',
            GOVERNANCE: 'bg-red-100 text-red-700',
            OTHER: 'bg-gray-100 text-gray-700',
        };
        return colors[category] || colors.OTHER;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl">
                            🏛️
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">REST-iN-U DAO</h1>
                            <p className="text-white/70">Community-governed real estate platform</p>
                        </div>
                    </div>

                    {/* Stats */}
                    {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                                <div className="text-3xl font-bold text-white">{stats.totalProposals}</div>
                                <div className="text-white/60 text-sm">Total Proposals</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                                <div className="text-3xl font-bold text-white">{stats.activeProposals}</div>
                                <div className="text-white/60 text-sm">Active Now</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                                <div className="text-3xl font-bold text-white">{stats.uniqueVoters}</div>
                                <div className="text-white/60 text-sm">Unique Voters</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                                <div className="text-3xl font-bold text-white">{stats.participationRate}%</div>
                                <div className="text-white/60 text-sm">Participation</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Voting Power Card */}
                        {votingPower ? (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="font-semibold text-gray-700 mb-4">Your Voting Power</h3>
                                <div className="text-4xl font-bold text-indigo-600 mb-2">{votingPower.votingPower}</div>
                                <div className="text-sm text-gray-500 space-y-1">
                                    <div className="flex justify-between">
                                        <span>From Karma:</span>
                                        <span className="font-medium">{votingPower.breakdown?.fromKarma || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>From Tokens:</span>
                                        <span className="font-medium">{votingPower.breakdown?.fromTokens || 0}</span>
                                    </div>
                                </div>
                                <div className="border-t mt-4 pt-4 text-sm">
                                    <div className="flex justify-between text-gray-500">
                                        <span>Proposals Created</span>
                                        <span>{votingPower.proposalsCreated}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span>Votes Cast</span>
                                        <span>{votingPower.votescast}</span>
                                    </div>
                                </div>
                                {votingPower.canPropose && (
                                    <button
                                        onClick={() => setShowCreateModal(true)}
                                        className="w-full mt-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                                    >
                                        Create Proposal
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-md p-6 text-center">
                                <div className="text-3xl mb-2">🔐</div>
                                <p className="text-gray-500 text-sm mb-4">Sign in to view your voting power and participate</p>
                                <Link href="/login" className="text-indigo-600 hover:underline font-medium">
                                    Sign In →
                                </Link>
                            </div>
                        )}

                        {/* Filters */}
                        <div className="bg-white rounded-xl shadow-md p-4">
                            <h3 className="font-semibold text-gray-700 mb-3">Filter</h3>
                            <div className="space-y-2">
                                {['ACTIVE', 'PASSED', 'REJECTED', 'PENDING'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setActiveFilter(status)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${activeFilter === status
                                            ? 'bg-indigo-100 text-indigo-700 font-medium'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Proposals List */}
                    <div className="lg:col-span-3 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {activeFilter} Proposals
                            </h2>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto" />
                            </div>
                        ) : proposals.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl shadow-md">
                                <div className="text-5xl mb-4">📝</div>
                                <h3 className="text-lg font-semibold text-gray-700">No {activeFilter.toLowerCase()} proposals</h3>
                                <p className="text-gray-500">Be the first to create one!</p>
                            </div>
                        ) : (
                            proposals.map((proposal) => (
                                <div key={proposal.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(proposal.category)}`}>
                                                        {proposal.category}
                                                    </span>
                                                    <span className="text-gray-400 text-sm">
                                                        by {proposal.proposer?.firstName} {proposal.proposer?.lastName}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{proposal.title}</h3>
                                                <p className="text-gray-500 text-sm line-clamp-2">{proposal.description}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className={`text-sm font-medium ${proposal.timeRemaining > 0 ? 'text-green-600' : 'text-gray-400'
                                                    }`}>
                                                    {formatTimeRemaining(proposal.timeRemaining)}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {proposal.votesCount || 0} votes
                                                </div>
                                            </div>
                                        </div>

                                        {/* Vote Progress Bar */}
                                        <div className="mt-4">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>For</span>
                                                <span>Against</span>
                                            </div>
                                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden flex">
                                                <div className="h-full bg-green-500" style={{ width: '65%' }} />
                                                <div className="h-full bg-red-500" style={{ width: '35%' }} />
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-4">
                                            <Link
                                                href={`/dao/${proposal.id}`}
                                                className="flex-1 py-2 border border-gray-300 rounded-lg text-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                                            >
                                                View Details
                                            </Link>
                                            {votingPower && proposal.status === 'ACTIVE' && (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            api.request(`/dao/proposals/${proposal.id}/vote`, { method: 'POST', body: { support: true } })
                                                                .then(() => alert('Voted For!'))
                                                                .catch(err => alert(err.message));
                                                        }}
                                                        className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600"
                                                    >
                                                        👍 For
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            api.request(`/dao/proposals/${proposal.id}/vote`, { method: 'POST', body: { support: false } })
                                                                .then(() => alert('Voted Against!'))
                                                                .catch(err => alert(err.message));
                                                        }}
                                                        className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
                                                    >
                                                        👎 Against
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Create Proposal Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-4">Create Proposal</h2>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="Proposal title" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select className="w-full px-4 py-2 border rounded-lg">
                                        <option>NEW_FEATURE</option>
                                        <option>PLATFORM_FEE</option>
                                        <option>COMMUNITY</option>
                                        <option>PARTNERSHIP</option>
                                        <option>GOVERNANCE</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea rows={5} className="w-full px-4 py-2 border rounded-lg" placeholder="Detailed description..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Voting Period (days)</label>
                                    <input type="number" defaultValue={7} min={3} max={30} className="w-full px-4 py-2 border rounded-lg" />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-2 border rounded-lg">
                                        Cancel
                                    </button>
                                    <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-medium">
                                        Submit Proposal
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

