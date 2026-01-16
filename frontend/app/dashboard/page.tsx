'use client';

// Force dynamic rendering - this page requires auth context
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { api } from '@/lib/api';
import PropertyCard from '@/components/ui/PropertyCard';
import { Button, Card, CardHeader, CardTitle, CardContent, EmptyState } from '@/components/ui';

export default function DashboardPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [favorites, setFavorites] = useState<any[]>([]);
    const [savedSearches, setSavedSearches] = useState<any[]>([]);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchData = async () => {
            setLoadingData(true);
            try {
                const [favRes, savedRes, recRes, votingRes] = await Promise.all([
                    api.request<any>('/favorites').catch(() => ({ data: { favorites: [] } })),
                    api.request<any>('/saved-searches').catch(() => ({ data: { savedSearches: [] } })),
                    api.request<any>('/properties?limit=3').catch(() => ({ data: { properties: [] } })), // Fallback recommendations
                    api.request<any>('/dao/my-voting-power').catch(() => ({ data: { votingPower: 0, karma: 0 } })),
                ]);

                // Favorites comes wrapped in { favorites: [], pagination: {} }
                const favs = favRes.data?.favorites?.map((f: any) => f.property) || [];
                setFavorites(favs);

                setSavedSearches(savedRes.data?.savedSearches || []);
                setRecommendations(recRes.data?.properties || []);

                setStats({
                    favorites: favs.length,
                    savedSearches: savedRes.data?.savedSearches?.length || 0,
                    votingPower: votingRes?.data?.votingPower || 0,
                    karma: votingRes?.data?.karma || 0,
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoadingData(false);
            }
        };

        fetchData();
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
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 py-12 px-4 mb-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-4xl text-white font-bold border-2 border-white/50">
                            {user?.firstName?.[0] || '?'}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                Namaste, {user?.firstName} 🙏
                            </h1>
                            <p className="text-white/80">{user?.email}</p>
                            {user?.userType === 'AGENT' && (
                                <Link href="/agent/dashboard" className="inline-block mt-2 px-4 py-1 bg-white/20 text-white rounded-full text-sm font-medium hover:bg-white/30 transition">
                                    Switch to Agent Dashboard →
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 -mt-16">
                    <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition duration-300">
                        <div className="text-3xl font-bold text-gray-900">{stats?.favorites || 0}</div>
                        <div className="text-gray-500 text-sm font-medium">Saved Properties</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition duration-300">
                        <div className="text-3xl font-bold text-amber-600">{stats?.savedSearches || 0}</div>
                        <div className="text-gray-500 text-sm font-medium">Saved Searches</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition duration-300">
                        <div className="text-3xl font-bold text-indigo-600">{stats?.votingPower || 0}</div>
                        <div className="text-gray-500 text-sm font-medium">Voting Power</div>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition duration-300">
                        <div className="text-3xl font-bold text-green-600">{stats?.karma || 0}</div>
                        <div className="text-gray-500 text-sm font-medium">Karma Points</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                                {quickActions.map((action, i) => (
                                    <Link
                                        key={i}
                                        href={action.link}
                                        className="flex flex-col items-center gap-2 group"
                                    >
                                        <div className={`w-14 h-14 rounded-2xl ${action.color} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition duration-300 text-white`}>
                                            {action.icon}
                                        </div>
                                        <span className="text-xs font-medium text-gray-600 text-center group-hover:text-amber-600 transition">{action.title}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Recommended Properties */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">Recommended for You</h2>
                            </div>
                            {loadingData ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
                                    ))}
                                </div>
                            ) : recommendations.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {recommendations.map((prop) => (
                                        <PropertyCard key={prop.id} property={prop} />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon="🏠"
                                    title="No recommendations yet"
                                    description="Start browsing to get personalized suggestions."
                                    action={{ label: "Browse Properties", href: "/search" }}
                                />
                            )}
                        </section>

                        {/* My Favorites */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-gray-900">My Favorites</h2>
                                <Link href="/favorites" className="text-amber-600 font-medium hover:underline text-sm">
                                    View All →
                                </Link>
                            </div>
                            {loadingData ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
                                    ))}
                                </div>
                            ) : favorites.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {favorites.slice(0, 3).map((prop) => (
                                        <PropertyCard key={prop.id} property={prop} />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon="❤️"
                                    title="No favorites yet"
                                    description="Save properties you like to track them here."
                                />
                            )}
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Saved Searches */}
                        <Card>
                            <CardHeader className="px-0 pt-0 pb-4">
                                <CardTitle>Saved Searches</CardTitle>
                            </CardHeader>
                            <CardContent className="px-0 py-0 space-y-4">
                                {savedSearches.length > 0 ? (
                                    savedSearches.map((search: any) => (
                                        <div key={search.id} className="flex flex-col gap-1 p-3 rounded-lg hover:bg-gray-50 transition border border-gray-100">
                                            <div className="flex justify-between items-start">
                                                <span className="font-medium text-gray-900">{search.name}</span>
                                                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">{search.alertFrequency}</span>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {search.matchCount || 0} new matches
                                            </div>
                                            <Link href={`/search?saved=${search.id}`} className="text-xs text-amber-600 font-medium hover:underline mt-1">
                                                View Matches →
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-gray-500">
                                        <p className="text-sm">No saved searches.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Vedic Insights */}
                        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all duration-700 group-hover:bg-white/20"></div>
                            <h3 className="font-bold text-lg mb-2 relative z-10">🌟 Vedic Insights</h3>
                            <p className="text-sm text-white/80 mb-6 relative z-10">
                                Complete your profile to unlock personalized Vastu recommendations tailored to your birth chart.
                            </p>
                            <Link
                                href="/settings#vedic"
                                className="block w-full py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl text-center text-sm font-semibold transition relative z-10"
                            >
                                Complete Profile
                            </Link>
                        </div>

                        {/* DAO CTA */}
                        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-2">🏛️ DAO Governance</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                You have {stats?.votingPower || 0} voting power. Participate in platform decisions.
                            </p>
                            <Link
                                href="/dao"
                                className="block w-full py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-center text-sm font-semibold transition"
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
