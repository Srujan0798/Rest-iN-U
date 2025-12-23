'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, Trash2, Search, MapPin, Home, DollarSign, Compass, Clock, Plus, ArrowLeft } from 'lucide-react';

interface SavedSearch {
    id: string;
    name: string;
    query: string;
    filters: {
        location?: string;
        minPrice?: number;
        maxPrice?: number;
        minBeds?: number;
        minVastuScore?: number;
        propertyType?: string;
    };
    newListings: number;
    lastUpdated: string;
    notifications: boolean;
}

const mockSearches: SavedSearch[] = [
    {
        id: '1', name: 'Beverly Hills Vastu Homes', query: 'Beverly Hills',
        filters: { location: 'Beverly Hills, CA', minPrice: 2000000, minVastuScore: 80, propertyType: 'House' },
        newListings: 5, lastUpdated: '2 hours ago', notifications: true
    },
    {
        id: '2', name: 'Austin Family Homes', query: 'Austin TX 4 bed',
        filters: { location: 'Austin, TX', minBeds: 4, maxPrice: 800000 },
        newListings: 12, lastUpdated: '1 day ago', notifications: true
    },
    {
        id: '3', name: 'Meditation Friendly Sedona', query: 'Sedona spiritual',
        filters: { location: 'Sedona, AZ', minVastuScore: 90 },
        newListings: 2, lastUpdated: '3 days ago', notifications: false
    },
];

export default function SavedSearchesPage() {
    const [searches, setSearches] = useState<SavedSearch[]>(mockSearches);

    const toggleNotifications = (id: string) => {
        setSearches(prev => prev.map(s => s.id === id ? { ...s, notifications: !s.notifications } : s));
    };

    const deleteSearch = (id: string) => {
        setSearches(prev => prev.filter(s => s.id !== id));
    };

    const formatPrice = (n: number) => n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : `$${(n / 1000).toFixed(0)}K`;

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></Link>
                        <h1 className="text-xl font-bold text-gray-900">Saved Searches</h1>
                    </div>
                    <Link href="/search" className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium">
                        <Plus className="w-4 h-4" /> New Search
                    </Link>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                {searches.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl">
                        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved searches</h3>
                        <p className="text-gray-500 mb-4">Save your searches to get notified about new listings!</p>
                        <Link href="/search" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600">
                            <Search className="w-4 h-4" /> Start Searching
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {searches.map(search => (
                            <div key={search.id} className="bg-white rounded-2xl shadow-sm p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                            {search.name}
                                            {search.newListings > 0 && (
                                                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                                                    {search.newListings} new
                                                </span>
                                            )}
                                        </h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                            <Clock className="w-3.5 h-3.5" />Updated {search.lastUpdated}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => toggleNotifications(search.id)}
                                            className={`p-2 rounded-lg ${search.notifications ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'}`}>
                                            <Bell className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => deleteSearch(search.id)} className="p-2 bg-gray-100 hover:bg-red-100 hover:text-red-600 rounded-lg text-gray-400">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {search.filters.location && (
                                        <span className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                                            <MapPin className="w-3 h-3" />{search.filters.location}
                                        </span>
                                    )}
                                    {(search.filters.minPrice || search.filters.maxPrice) && (
                                        <span className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                                            <DollarSign className="w-3 h-3" />
                                            {search.filters.minPrice && formatPrice(search.filters.minPrice)}
                                            {search.filters.minPrice && search.filters.maxPrice && ' - '}
                                            {search.filters.maxPrice && formatPrice(search.filters.maxPrice)}
                                        </span>
                                    )}
                                    {search.filters.minBeds && (
                                        <span className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                                            <Home className="w-3 h-3" />{search.filters.minBeds}+ beds
                                        </span>
                                    )}
                                    {search.filters.minVastuScore && (
                                        <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 rounded-full text-xs text-amber-700">
                                            <Compass className="w-3 h-3" />Vastu {search.filters.minVastuScore}+
                                        </span>
                                    )}
                                </div>
                                <Link href={`/search?q=${encodeURIComponent(search.query)}`}
                                    className="inline-flex items-center gap-2 mt-4 text-sm text-amber-600 hover:text-amber-700 font-medium">
                                    View {search.newListings > 0 ? `${search.newListings} new ` : ''}listings →
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
