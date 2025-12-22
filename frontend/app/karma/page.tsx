'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function KarmaPage() {
    const { user, isAuthenticated } = useAuth();
    const [karmaData, setKarmaData] = useState({
        totalKarma: 250,
        level: 'Dharmic Seeker',
        nextLevel: 500,
        recentActions: [
            { action: 'Completed profile', karma: 50, date: '2024-12-20' },
            { action: 'First property view', karma: 10, date: '2024-12-20' },
            { action: 'Referred a friend', karma: 100, date: '2024-12-19' },
            { action: 'Left a review', karma: 25, date: '2024-12-18' },
            { action: 'Verified email', karma: 25, date: '2024-12-17' },
            { action: 'Connected wallet', karma: 40, date: '2024-12-16' },
        ],
        breakdown: {
            profile: 115,
            engagement: 35,
            referrals: 100,
            community: 0,
        },
    });

    const karmaLevels = [
        { name: 'Karma Beginner', min: 0, icon: '🌱' },
        { name: 'Dharmic Seeker', min: 100, icon: '🪷' },
        { name: 'Enlightened Explorer', min: 500, icon: '✨' },
        { name: 'Wisdom Keeper', min: 1000, icon: '🕉️' },
        { name: 'Guru', min: 5000, icon: '👑' },
    ];

    const getCurrentLevel = (karma: number) => {
        for (let i = karmaLevels.length - 1; i >= 0; i--) {
            if (karma >= karmaLevels[i].min) return karmaLevels[i];
        }
        return karmaLevels[0];
    };

    const getNextLevel = (karma: number) => {
        for (const level of karmaLevels) {
            if (karma < level.min) return level;
        }
        return null;
    };

    const currentLevel = getCurrentLevel(karmaData.totalKarma);
    const nextLevel = getNextLevel(karmaData.totalKarma);
    const progress = nextLevel ? ((karmaData.totalKarma - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100 : 100;

    const earnMoreWays = [
        { action: 'Complete Vastu verification', karma: 100, icon: '🪷' },
        { action: 'Vote on DAO proposal', karma: 50, icon: '🏛️' },
        { action: 'Submit property review', karma: 25, icon: '⭐' },
        { action: 'Schedule property tour', karma: 15, icon: '📅' },
        { action: 'Share property on social', karma: 10, icon: '📤' },
        { action: 'Refer a friend', karma: 100, icon: '👥' },
    ];

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-6xl mb-4">🌟</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign in to view your karma</h2>
                    <Link href="/login?redirect=/karma" className="text-amber-600 hover:underline">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="text-8xl mb-4">{currentLevel.icon}</div>
                    <h1 className="text-4xl font-bold text-white mb-2">{karmaData.totalKarma} Karma</h1>
                    <p className="text-white/80 text-xl">{currentLevel.name}</p>

                    {nextLevel && (
                        <div className="mt-6 max-w-md mx-auto">
                            <div className="flex justify-between text-white/70 text-sm mb-2">
                                <span>{currentLevel.name}</span>
                                <span>{nextLevel.name}</span>
                            </div>
                            <div className="h-3 bg-white/30 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-white/70 text-sm mt-2">
                                {nextLevel.min - karmaData.totalKarma} karma to next level
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8 -mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Karma Breakdown */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-6">Karma Breakdown</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-amber-50 rounded-xl">
                                    <div className="text-2xl font-bold text-amber-600">{karmaData.breakdown.profile}</div>
                                    <div className="text-sm text-gray-500">Profile</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-xl">
                                    <div className="text-2xl font-bold text-green-600">{karmaData.breakdown.engagement}</div>
                                    <div className="text-sm text-gray-500">Engagement</div>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-xl">
                                    <div className="text-2xl font-bold text-blue-600">{karmaData.breakdown.referrals}</div>
                                    <div className="text-sm text-gray-500">Referrals</div>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-xl">
                                    <div className="text-2xl font-bold text-purple-600">{karmaData.breakdown.community}</div>
                                    <div className="text-sm text-gray-500">Community</div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Actions */}
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-6">Recent Karma History</h2>
                            <div className="space-y-3">
                                {karmaData.recentActions.map((action, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                        <div>
                                            <div className="font-medium text-gray-800">{action.action}</div>
                                            <div className="text-sm text-gray-500">{action.date}</div>
                                        </div>
                                        <div className="text-green-600 font-bold">+{action.karma}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Earn More */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-6">Earn More Karma</h2>
                            <div className="space-y-3">
                                {earnMoreWays.map((way, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-amber-50 transition cursor-pointer">
                                        <span className="text-2xl">{way.icon}</span>
                                        <div className="flex-1">
                                            <div className="text-sm text-gray-700">{way.action}</div>
                                        </div>
                                        <span className="text-amber-600 font-bold text-sm">+{way.karma}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Levels */}
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-6">Karma Levels</h2>
                            <div className="space-y-3">
                                {karmaLevels.map((level, i) => (
                                    <div
                                        key={i}
                                        className={`flex items-center gap-3 p-3 rounded-xl ${level.name === currentLevel.name ? 'bg-amber-100 border border-amber-300' : 'bg-gray-50'
                                            }`}
                                    >
                                        <span className="text-2xl">{level.icon}</span>
                                        <div className="flex-1">
                                            <div className={`font-medium ${level.name === currentLevel.name ? 'text-amber-700' : 'text-gray-700'}`}>
                                                {level.name}
                                            </div>
                                            <div className="text-xs text-gray-500">{level.min}+ karma</div>
                                        </div>
                                        {level.name === currentLevel.name && (
                                            <span className="text-amber-600 text-xs">Current</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
