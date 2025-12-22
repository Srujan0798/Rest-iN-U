'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PropertyCard, PropertyCardSkeleton } from '../../../components/PropertyComponents';

export default function AgentProfilePage() {
    const params = useParams();
    const agentId = params?.id as string;

    const [agent, setAgent] = useState<any>(null);
    const [listings, setListings] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('listings');

    useEffect(() => {
        if (!agentId) return;

        Promise.all([
            fetch(`http://localhost:4000/api/v1/agents/${agentId}`).then(r => r.json()),
            fetch(`http://localhost:4000/api/v1/agents/${agentId}/reviews`).then(r => r.json()),
        ]).then(([agentRes, reviewsRes]) => {
            setAgent(agentRes.data);
            setListings(agentRes.data?.listings || []);
            setReviews(reviewsRes.data || []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [agentId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!agent) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">👤</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Agent Not Found</h2>
                    <Link href="/agents" className="text-amber-600 hover:underline">Browse Agents</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-6">
                        {/* Avatar */}
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-5xl text-white font-bold border-4 border-white/30">
                            {agent.user?.firstName?.[0] || 'A'}
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-white">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold">
                                    {agent.user?.firstName} {agent.user?.lastName}
                                </h1>
                                {agent.verified && (
                                    <span className="px-2 py-0.5 bg-blue-500 rounded text-xs">✓ Verified</span>
                                )}
                            </div>
                            <p className="text-white/80 mb-2">{agent.brokerage}</p>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <span className="text-amber-200">{'★'.repeat(Math.round(agent.rating || 0))}</span>
                                    <span className="text-sm opacity-80">({agent.reviewCount} reviews)</span>
                                </div>
                                <span className="text-sm opacity-80">
                                    {agent.yearsExperience} years experience
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Card */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="font-semibold mb-4">Contact</h3>
                            <div className="space-y-3 text-sm">
                                <a href={`mailto:${agent.user?.email}`} className="flex items-center gap-2 text-gray-600 hover:text-amber-600">
                                    <span>📧</span> {agent.user?.email}
                                </a>
                                {agent.user?.phone && (
                                    <a href={`tel:${agent.user.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-amber-600">
                                        <span>📱</span> {agent.user.phone}
                                    </a>
                                )}
                            </div>
                            <button className="w-full mt-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition">
                                Message Agent
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="font-semibold mb-4">Stats</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Listings</span>
                                    <span className="font-semibold">{listings.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Transactions</span>
                                    <span className="font-semibold">{agent.transactionCount || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Ethics Score</span>
                                    <span className="font-semibold text-amber-600">{agent.ethicsScore || 0}/100</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Response Time</span>
                                    <span className="font-semibold">&lt; 2 hours</span>
                                </div>
                            </div>
                        </div>

                        {/* Specialties */}
                        {agent.specialties?.length > 0 && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="font-semibold mb-4">Specialties</h3>
                                <div className="flex flex-wrap gap-2">
                                    {agent.specialties.map((s: string) => (
                                        <span key={s} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Languages */}
                        {agent.languages?.length > 0 && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="font-semibold mb-4">Languages</h3>
                                <p className="text-gray-600">{agent.languages.join(', ')}</p>
                            </div>
                        )}
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Bio */}
                        {agent.bio && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="font-semibold mb-4">About</h3>
                                <p className="text-gray-600">{agent.bio}</p>
                            </div>
                        )}

                        {/* Tabs */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="flex border-b">
                                <button
                                    onClick={() => setActiveTab('listings')}
                                    className={`flex-1 py-3 text-center font-medium ${activeTab === 'listings' ? 'text-amber-600 border-b-2 border-amber-500 bg-amber-50' : 'text-gray-500'
                                        }`}
                                >
                                    Listings ({listings.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('reviews')}
                                    className={`flex-1 py-3 text-center font-medium ${activeTab === 'reviews' ? 'text-amber-600 border-b-2 border-amber-500 bg-amber-50' : 'text-gray-500'
                                        }`}
                                >
                                    Reviews ({reviews.length})
                                </button>
                            </div>

                            <div className="p-6">
                                {activeTab === 'listings' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {listings.length === 0 ? (
                                            <p className="text-gray-500 col-span-2 text-center py-8">No active listings</p>
                                        ) : (
                                            listings.map((property: any) => (
                                                <Link key={property.id} href={`/property/${property.id}`} className="block">
                                                    <div className="border rounded-lg p-4 hover:shadow-md transition">
                                                        <div className="font-medium text-gray-900">{property.title}</div>
                                                        <div className="text-sm text-gray-500">{property.city}, {property.state}</div>
                                                        <div className="text-amber-600 font-semibold mt-2">
                                                            ${(property.price / 1000).toFixed(0)}K
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))
                                        )}
                                    </div>
                                )}

                                {activeTab === 'reviews' && (
                                    <div className="space-y-4">
                                        {reviews.length === 0 ? (
                                            <p className="text-gray-500 text-center py-8">No reviews yet</p>
                                        ) : (
                                            reviews.map((review: any, i: number) => (
                                                <div key={i} className="border-b pb-4 last:border-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-amber-500">{'★'.repeat(review.rating)}</span>
                                                        <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-gray-600">{review.comment}</p>
                                                    <p className="text-sm text-gray-400 mt-1">- {review.reviewer?.firstName || 'Anonymous'}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
