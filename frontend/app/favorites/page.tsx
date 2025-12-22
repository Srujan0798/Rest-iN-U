'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PropertyCard, PropertyCardSkeleton } from '../../components/PropertyComponents';
import { useAuth } from '../../context/AuthContext';

export default function FavoritesPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('dharma_token');
        fetch('http://localhost:4000/api/v1/properties/favorites', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => r.json())
            .then(res => {
                setFavorites(res.data || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [isAuthenticated]);

    const removeFavorite = async (propertyId: string) => {
        const token = localStorage.getItem('dharma_token');
        try {
            await fetch(`http://localhost:4000/api/v1/properties/${propertyId}/favorite`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            setFavorites(favorites.filter(f => f.id !== propertyId));
        } catch (e) {
            console.error(e);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-gradient-to-r from-rose-500 to-pink-500 py-12 px-4">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-3xl font-bold text-white">Saved Properties ❤️</h1>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <PropertyCardSkeleton key={i} />)}
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-6xl mb-4">❤️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign in to view favorites</h2>
                    <p className="text-gray-500 mb-6">Save properties you love and access them anytime</p>
                    <Link href="/login?redirect=/favorites" className="px-6 py-3 bg-amber-500 text-white rounded-lg font-semibold">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-white">Saved Properties ❤️</h1>
                    <p className="text-white/70">{favorites.length} properties saved</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {favorites.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🏠</div>
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">No saved properties yet</h2>
                        <p className="text-gray-500 mb-6">Start browsing and save properties you love</p>
                        <Link href="/search" className="px-6 py-3 bg-amber-500 text-white rounded-lg font-semibold">
                            Browse Properties
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map(property => (
                            <div key={property.id} className="relative group">
                                <PropertyCard
                                    property={{
                                        ...property,
                                        vastuScore: property.vastuAnalysis?.[0]?.overallScore,
                                        vastuGrade: property.vastuAnalysis?.[0]?.grade,
                                        climateRiskScore: property.climateAnalysis?.[0]?.overallRiskScore,
                                        climateGrade: property.climateAnalysis?.[0]?.riskGrade,
                                    }}
                                />
                                <button
                                    onClick={() => removeFavorite(property.id)}
                                    className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
