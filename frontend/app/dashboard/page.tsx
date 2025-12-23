'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function DashboardPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [favorites, setFavorites] = useState<any[]>([]);

    useEffect(() => {
        if (!isAuthenticated) return;

        Promise.all([
            api.request<any>('/properties/favorites').catch(() => ({ data: [] })),
            api.request<any>('/dao/my-voting-power').catch(() => ({ data: { votingPower: 0, karma: 0 } })),
        ]).then(([favRes, votingRes]) => {
            setFavorites(favRes.data?.slice(0, 3) || []);
            setStats({
                favorites: favRes.data?.length || 0,
                votingPower: votingRes?.data?.votingPower || 0,
                karma: votingRes?.data?.karma || 0,
            });
        });
    }, [isAuthenticated]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔐</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign in Required</h2>
                    <p className="text-gray-500 mb-6">Please sign in to access your dashboard</p>
                    <Link href="/login?redirect=/dashboard" className="px-6 py-3 bg-amber-500 text-white rounded-lg font-semibold">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    const quickActions = [
        { icon: '🔍', title: 'Search Properties', link: '/search', color: 'bg-blue-500' },
        { icon: '🪷', title: 'Vastu Analysis', link: '/vastu-analysis', color: 'bg-purple-500' },
        { icon: '💰', title: 'Get Valuation', link: '/valuation', color: 'bg-green-500' },
        { icon: '📅', title: 'Find Muhurat', link: '/muhurat', color: 'bg-amber-500' },
        { icon: '🏛️', title: 'DAO Voting', link: '/dao', color: 'bg-indigo-500' },
        { icon: '👤', title: 'Find Agent', link: '/agents', color: 'bg-pink-500' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-4xl text-white font-bold">
                            {user?.firstName?.[0] || '?'}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                Namaste, {user?.firstName} 🙏
                            </h1>
                            <p className="text-white/70">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-8 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="text-3xl font-bold text-gray-900">{stats?.favorites || 0}</div>
                        <div className="text-gray-500 text-sm">Saved Properties</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="text-3xl font-bold text-amber-600">{stats?.karma || 0}</div>
                        <div className="text-gray-500 text-sm">Karma Points</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="text-3xl font-bold text-indigo-600">{stats?.votingPower || 0}</div>
                        <div className="text-gray-500 text-sm">Voting Power</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="text-3xl font-bold text-green-600">0</div>
                        <div className="text-gray-500 text-sm">Inquiries Sent</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-3 gap-3">
                                {quickActions.map((action, i) => (
                                    <Link
                                        key={i}
                                        href={action.link}
                                        className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition group"
                                    >
                                        <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center text-2xl group-hover:scale-110 transition`}>
                                            {action.icon}
                                        </div>
                                        <span className="text-sm text-gray-600 text-center">{action.title}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Saved Properties */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Saved Properties</h2>
                                <Link href="/favorites" className="text-amber-600 text-sm hover:underline">
                                    View All →
                                </Link>
                            </div>
                            {favorites.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="text-4xl mb-2">🏠</div>
                                    <p>No saved properties yet</p>
                                    <Link href="/search" className="text-amber-600 hover:underline text-sm">
                                        Start browsing
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {favorites.map((prop: any) => (
                                        <Link
                                            key={prop.id}
                                            href={`/property/${prop.id}`}
                                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50"
                                        >
                                            <div className="w-16 h-16 rounded-lg bg-gray-200" />
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-gray-900 truncate">{prop.title}</div>
                                                <div className="text-sm text-gray-500">{prop.city}, {prop.state}</div>
                                            </div>
                                            <div className="text-amber-600 font-semibold">
                                                ${(prop.price / 1000).toFixed(0)}K
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Your Profile</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Account Type</span>
                                    <span className="font-medium">{user?.userType || 'BUYER'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Member Since</span>
                                    <span className="font-medium">Dec 2024</span>
                                </div>
                            </div>
                            <Link
                                href="/settings"
                                className="mt-4 block w-full py-2 border border-gray-300 rounded-lg text-center text-sm hover:bg-gray-50"
                            >
                                Edit Profile
                            </Link>
                        </div>

                        {/* Vedic Insights */}
                        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
                            <h3 className="font-semibold mb-3">🌟 Vedic Insights</h3>
                            <p className="text-sm text-white/80 mb-4">
                                Add your birth details to unlock personalized Vastu recommendations
                            </p>
                            <Link
                                href="/settings#vedic"
                                className="block w-full py-2 bg-white/20 rounded-lg text-center text-sm hover:bg-white/30 transition"
                            >
                                Complete Profile
                            </Link>
                        </div>

                        {/* DAO CTA */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="font-semibold text-gray-900 mb-2">🏛️ DAO Governance</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Participate in platform decisions
                            </p>
                            <Link
                                href="/dao"
                                className="block w-full py-2 bg-indigo-500 text-white rounded-lg text-center text-sm hover:bg-indigo-600 transition"
                            >
                                View Proposals
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

