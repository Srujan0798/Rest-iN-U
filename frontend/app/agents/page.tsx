'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AgentsPage() {
    const [agents, setAgents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        specialty: '',
        city: '',
        minRating: 0,
        verified: false,
    });

    useEffect(() => {
        const params = new URLSearchParams();
        if (filters.specialty) params.set('specialty', filters.specialty);
        if (filters.city) params.set('city', filters.city);
        if (filters.minRating) params.set('minRating', filters.minRating.toString());
        if (filters.verified) params.set('verified', 'true');

        fetch(`http://localhost:4000/api/v1/agents?${params}`)
            .then(r => r.json())
            .then(res => {
                setAgents(res.data?.agents || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [filters]);

    const specialties = [
        'Luxury Homes', 'Vastu-Compliant', 'Investment', 'First-Time Buyers',
        'Commercial', 'Land', 'Eco-Friendly', 'Historic Properties'
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 py-16 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Find Your Perfect Agent 👤
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto">
                        Connect with Vastu-certified agents who understand the harmony between
                        ancient wisdom and modern real estate
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border-b sticky top-0 z-20 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex flex-wrap gap-4 items-center">
                        <select
                            value={filters.specialty}
                            onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
                            className="px-4 py-2 border rounded-lg bg-white"
                        >
                            <option value="">All Specialties</option>
                            {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>

                        <input
                            type="text"
                            placeholder="City..."
                            value={filters.city}
                            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                            className="px-4 py-2 border rounded-lg"
                        />

                        <select
                            value={filters.minRating}
                            onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
                            className="px-4 py-2 border rounded-lg bg-white"
                        >
                            <option value={0}>Any Rating</option>
                            <option value={4}>4+ Stars</option>
                            <option value={4.5}>4.5+ Stars</option>
                        </select>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.verified}
                                onChange={(e) => setFilters({ ...filters, verified: e.target.checked })}
                                className="w-4 h-4 text-amber-500 rounded"
                            />
                            <span className="text-sm text-gray-700">Verified Only</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Agents Grid */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-200 rounded-full" />
                                    <div className="flex-1">
                                        <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
                                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : agents.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">👤</div>
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">No agents found</h2>
                        <p className="text-gray-500">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {agents.map(agent => (
                            <Link
                                key={agent.id}
                                href={`/agent/${agent.id}`}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden group"
                            >
                                <div className="p-6">
                                    <div className="flex items-start gap-4">
                                        {/* Avatar */}
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold">
                                                {agent.user?.firstName?.[0] || 'A'}
                                            </div>
                                            {agent.verified && (
                                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                                                    ✓
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-gray-900 truncate">
                                                    {agent.user?.firstName} {agent.user?.lastName}
                                                </h3>
                                                {agent.subscriptionTier === 'ENLIGHTENED' && (
                                                    <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                                                        ✨ Elite
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 truncate">{agent.brokerage}</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className="text-amber-500">{'★'.repeat(Math.round(agent.rating || 0))}</span>
                                                <span className="text-gray-400">{'★'.repeat(5 - Math.round(agent.rating || 0))}</span>
                                                <span className="text-sm text-gray-500 ml-1">({agent.reviewCount})</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                                        <div className="bg-gray-50 rounded-lg py-2">
                                            <div className="font-semibold text-gray-900">{agent.yearsExperience || 0}</div>
                                            <div className="text-xs text-gray-500">Years</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg py-2">
                                            <div className="font-semibold text-gray-900">{agent._count?.listings || 0}</div>
                                            <div className="text-xs text-gray-500">Listings</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg py-2">
                                            <div className="font-semibold text-amber-600">{agent.ethicsScore || 0}</div>
                                            <div className="text-xs text-gray-500">Ethics</div>
                                        </div>
                                    </div>

                                    {/* Specialties */}
                                    {agent.specialties?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-4">
                                            {agent.specialties.slice(0, 3).map((s: string) => (
                                                <span key={s} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Languages */}
                                    {agent.languages?.length > 0 && (
                                        <div className="mt-3 text-sm text-gray-500">
                                            🗣️ {agent.languages.join(', ')}
                                        </div>
                                    )}
                                </div>

                                {/* CTA */}
                                <div className="px-6 py-3 bg-gray-50 border-t group-hover:bg-amber-50 transition">
                                    <span className="text-amber-600 font-medium text-sm">
                                        View Profile →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 py-12 px-4 mt-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Are You a Vastu-Certified Agent?
                    </h2>
                    <p className="text-white/80 mb-6">
                        Join the Dharma Realty network and connect with clients seeking
                        properties aligned with ancient wisdom
                    </p>
                    <Link
                        href="/register?type=agent"
                        className="inline-block px-8 py-3 bg-white text-amber-600 rounded-xl font-semibold hover:bg-amber-50 transition shadow-lg"
                    >
                        Join as Agent
                    </Link>
                </div>
            </div>
        </div>
    );
}
