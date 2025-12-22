'use client';

import React, { useState, } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function ReferralPage() {
    const { user, isAuthenticated } = useAuth();
    const [copied, setCopied] = useState(false);

    const referralData = {
        code: 'DHARMA-ABC12-XYZ9',
        totalReferrals: 7,
        totalKarma: 450,
        totalTokens: 85,
        referralsByEvent: {
            SIGNUP: 5,
            FIRST_INQUIRY: 2,
            FIRST_PURCHASE: 0,
        },
        recentReferrals: [
            { firstName: 'Priya', eventType: 'SIGNUP', karma: 100, tokens: 10, date: '2024-12-20' },
            { firstName: 'Rahul', eventType: 'FIRST_INQUIRY', karma: 50, tokens: 5, date: '2024-12-19' },
            { firstName: 'Anita', eventType: 'SIGNUP', karma: 100, tokens: 10, date: '2024-12-18' },
        ],
    };

    const leaderboard = [
        { rank: 1, name: 'Arjun K.', referrals: 45, karma: 4500, avatar: null },
        { rank: 2, name: 'Meera S.', referrals: 38, karma: 3800, avatar: null },
        { rank: 3, name: 'Vikram P.', referrals: 32, karma: 3200, avatar: null },
        { rank: 4, name: 'Deepa R.', referrals: 28, karma: 2800, avatar: null },
        { rank: 5, name: 'Suresh M.', referrals: 25, karma: 2500, avatar: null },
    ];

    const rewards = [
        { event: 'Friend Signs Up', referrerKarma: 100, referredKarma: 50, tokens: 10 },
        { event: 'First Inquiry', referrerKarma: 50, referredKarma: 25, tokens: 5 },
        { event: 'First Purchase', referrerKarma: 500, referredKarma: 100, tokens: 100 },
        { event: 'Agent Signs Up', referrerKarma: 200, referredKarma: 100, tokens: 25 },
    ];

    const copyCode = () => {
        navigator.clipboard.writeText(referralData.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareUrl = `https://dharmarealty.com/signup?ref=${referralData.code}`;

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-6xl mb-4">👥</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign in to access referrals</h2>
                    <Link href="/login?redirect=/referrals" className="text-amber-600 hover:underline">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="text-6xl mb-4">🤝</div>
                    <h1 className="text-4xl font-bold text-white mb-2">Refer & Earn</h1>
                    <p className="text-white/80">Share Dharma Realty and earn karma points & tokens!</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8 -mt-8">
                {/* Referral Code */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <h2 className="text-xl font-semibold text-center mb-6">Your Referral Code</h2>
                    <div className="flex items-center justify-center gap-4">
                        <div className="px-8 py-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl font-mono text-2xl font-bold text-purple-700">
                            {referralData.code}
                        </div>
                        <button
                            onClick={copyCode}
                            className={`px-6 py-4 rounded-xl font-semibold transition ${copied
                                    ? 'bg-green-500 text-white'
                                    : 'bg-purple-500 text-white hover:bg-purple-600'
                                }`}
                        >
                            {copied ? '✓ Copied!' : 'Copy'}
                        </button>
                    </div>

                    <div className="flex justify-center gap-4 mt-6">
                        <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2">
                            <span>📘</span> Share on Facebook
                        </button>
                        <button className="px-6 py-3 bg-sky-400 text-white rounded-lg hover:bg-sky-500 transition flex items-center gap-2">
                            <span>🐦</span> Share on Twitter
                        </button>
                        <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2">
                            <span>💬</span> WhatsApp
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-md p-6 text-center">
                        <div className="text-4xl font-bold text-purple-600">{referralData.totalReferrals}</div>
                        <div className="text-gray-500">Total Referrals</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-md p-6 text-center">
                        <div className="text-4xl font-bold text-amber-500">{referralData.totalKarma}</div>
                        <div className="text-gray-500">Karma Earned</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-md p-6 text-center">
                        <div className="text-4xl font-bold text-green-500">{referralData.totalTokens}</div>
                        <div className="text-gray-500">Tokens Earned</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Referrals */}
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-6">Recent Referrals</h2>
                        <div className="space-y-4">
                            {referralData.recentReferrals.map((ref, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                                            {ref.firstName[0]}
                                        </div>
                                        <div>
                                            <div className="font-medium">{ref.firstName}</div>
                                            <div className="text-sm text-gray-500">{ref.eventType.replace(/_/g, ' ')}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-amber-500 font-bold">+{ref.karma} 🌟</div>
                                        <div className="text-green-500 text-sm">+{ref.tokens} 🪙</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Leaderboard */}
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-6">🏆 Top Referrers</h2>
                        <div className="space-y-3">
                            {leaderboard.map((leader, i) => (
                                <div key={i} className={`flex items-center gap-4 p-3 rounded-xl ${i < 3 ? 'bg-gradient-to-r from-amber-50 to-orange-50' : 'bg-gray-50'
                                    }`}>
                                    <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${i === 0 ? 'bg-yellow-400 text-white' :
                                            i === 1 ? 'bg-gray-300 text-gray-700' :
                                                i === 2 ? 'bg-amber-600 text-white' :
                                                    'bg-gray-200 text-gray-600'
                                        }`}>
                                        {leader.rank}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium">{leader.name}</div>
                                        <div className="text-sm text-gray-500">{leader.referrals} referrals</div>
                                    </div>
                                    <div className="text-amber-500 font-bold">{leader.karma} 🌟</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Rewards Table */}
                <div className="bg-white rounded-2xl shadow-md p-6 mt-8">
                    <h2 className="text-xl font-semibold mb-6">Reward Structure</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b">
                                    <th className="pb-3 text-gray-500">Event</th>
                                    <th className="pb-3 text-gray-500">Your Karma</th>
                                    <th className="pb-3 text-gray-500">Friend's Karma</th>
                                    <th className="pb-3 text-gray-500">Your Tokens</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rewards.map((r, i) => (
                                    <tr key={i} className="border-b last:border-0">
                                        <td className="py-4 font-medium">{r.event}</td>
                                        <td className="py-4 text-amber-500">+{r.referrerKarma} 🌟</td>
                                        <td className="py-4 text-amber-400">+{r.referredKarma} 🌟</td>
                                        <td className="py-4 text-green-500">+{r.tokens} 🪙</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
