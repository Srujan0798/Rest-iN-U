'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PropertyCard, PropertyCardSkeleton } from '../../components/PropertyComponents';
import { usePropertySearch } from '../../lib/hooks';

export default function SearchPage() {
    const { results, loading, error, search, naturalSearch } = usePropertySearch();
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState({
        propertyTypes: [] as string[],
        priceRange: { min: undefined as number | undefined, max: undefined as number | undefined },
        beds: { min: undefined as number | undefined, max: undefined as number | undefined },
        baths: { min: undefined as number | undefined },
        vastuScore: { min: 70 as number | undefined },
        sortBy: 'newest',
    });
    const [showFilters, setShowFilters] = useState(false);

    // Initial search on load
    useEffect(() => {
        search({ ...filters, includeAnalysis: true });
    }, []);

    const handleNaturalSearch = () => {
        if (query.trim()) {
            naturalSearch(query);
        }
    };

    const handleFilterSearch = () => {
        search({ ...filters, includeAnalysis: true });
        setShowFilters(false);
    };

    const propertyTypes = [
        { value: 'HOUSE', label: 'House' },
        { value: 'CONDO', label: 'Condo' },
        { value: 'TOWNHOUSE', label: 'Townhouse' },
        { value: 'APARTMENT', label: 'Apartment' },
        { value: 'VILLA', label: 'Villa' },
        { value: 'LAND', label: 'Land' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Search Section */}
            <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 py-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Find Your Dharma Home 🏠
                    </h1>
                    <p className="text-white/80 mb-8">
                        Properties aligned with ancient wisdom and modern living
                    </p>

                    {/* Natural Language Search */}
                    <div className="relative max-w-2xl mx-auto">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleNaturalSearch()}
                            placeholder="Try: '3 bed house under 500k with pool and good vastu'..."
                            className="w-full px-6 py-4 rounded-2xl shadow-xl text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-white/30"
                        />
                        <button
                            onClick={handleNaturalSearch}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-medium hover:from-amber-700 hover:to-orange-700 transition"
                        >
                            Search ✨
                        </button>
                    </div>

                    {/* Quick filters */}
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                        <button
                            onClick={() => search({ vastuScore: { min: 80 }, includeAnalysis: true })}
                            className="px-4 py-1.5 bg-white/20 text-white rounded-full text-sm hover:bg-white/30 transition"
                        >
                            🪷 High Vastu Score
                        </button>
                        <button
                            onClick={() => search({ climateRisk: { max: 30 }, includeAnalysis: true })}
                            className="px-4 py-1.5 bg-white/20 text-white rounded-full text-sm hover:bg-white/30 transition"
                        >
                            🌍 Low Climate Risk
                        </button>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-4 py-1.5 bg-white/20 text-white rounded-full text-sm hover:bg-white/30 transition"
                        >
                            ⚙️ All Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="bg-white border-b border-gray-200 py-6">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {/* Property Type */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                                <div className="flex flex-wrap gap-2">
                                    {propertyTypes.map((type) => (
                                        <button
                                            key={type.value}
                                            onClick={() => {
                                                const types = filters.propertyTypes.includes(type.value)
                                                    ? filters.propertyTypes.filter(t => t !== type.value)
                                                    : [...filters.propertyTypes, type.value];
                                                setFilters({ ...filters, propertyTypes: types });
                                            }}
                                            className={`px-3 py-1.5 rounded-lg text-sm border transition ${filters.propertyTypes.includes(type.value)
                                                ? 'bg-amber-500 text-white border-amber-500'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-amber-400'
                                                }`}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                                <select
                                    value={filters.priceRange.min || ''}
                                    onChange={(e) => setFilters({
                                        ...filters,
                                        priceRange: { ...filters.priceRange, min: e.target.value ? Number(e.target.value) : undefined }
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">No Min</option>
                                    <option value="100000">$100K</option>
                                    <option value="250000">$250K</option>
                                    <option value="500000">$500K</option>
                                    <option value="750000">$750K</option>
                                    <option value="1000000">$1M</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                                <select
                                    value={filters.priceRange.max || ''}
                                    onChange={(e) => setFilters({
                                        ...filters,
                                        priceRange: { ...filters.priceRange, max: e.target.value ? Number(e.target.value) : undefined }
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">No Max</option>
                                    <option value="500000">$500K</option>
                                    <option value="750000">$750K</option>
                                    <option value="1000000">$1M</option>
                                    <option value="2000000">$2M</option>
                                    <option value="5000000">$5M</option>
                                </select>
                            </div>

                            {/* Beds */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                                <select
                                    value={filters.beds.min || ''}
                                    onChange={(e) => setFilters({
                                        ...filters,
                                        beds: { ...filters.beds, min: e.target.value ? Number(e.target.value) : undefined }
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Any</option>
                                    <option value="1">1+</option>
                                    <option value="2">2+</option>
                                    <option value="3">3+</option>
                                    <option value="4">4+</option>
                                    <option value="5">5+</option>
                                </select>
                            </div>

                            {/* Vastu Score */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">🪷 Min Vastu</label>
                                <select
                                    value={filters.vastuScore.min || ''}
                                    onChange={(e) => setFilters({
                                        ...filters,
                                        vastuScore: { min: e.target.value ? Number(e.target.value) : undefined }
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Any</option>
                                    <option value="60">60+</option>
                                    <option value="70">70+</option>
                                    <option value="80">80+</option>
                                    <option value="90">90+</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => {
                                    setFilters({
                                        propertyTypes: [],
                                        priceRange: {},
                                        beds: {},
                                        baths: {},
                                        vastuScore: { min: undefined },
                                        sortBy: 'newest',
                                    });
                                }}
                                className="px-4 py-2 text-gray-600 hover:text-gray-900"
                            >
                                Reset
                            </button>
                            <button
                                onClick={handleFilterSearch}
                                className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-600"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Results */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Results header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {loading ? 'Searching...' : results?.properties?.length ? `${results.pagination?.total || results.properties.length} Properties Found` : 'No Results'}
                        </h2>
                        {results?.parsedQuery && (
                            <p className="text-sm text-gray-500">
                                Understood: {Object.entries(results.parsedQuery).filter(([k, v]) => v).map(([k, v]) => `${k}: ${v}`).join(', ')}
                            </p>
                        )}
                    </div>
                    <select
                        value={filters.sortBy}
                        onChange={(e) => {
                            setFilters({ ...filters, sortBy: e.target.value });
                            search({ ...filters, sortBy: e.target.value, includeAnalysis: true });
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
                    >
                        <option value="newest">Newest</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="vastu_score">Best Vastu Score</option>
                        <option value="climate_safe">Lowest Climate Risk</option>
                    </select>
                </div>

                {/* Error state */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Property grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)
                    ) : results?.properties?.length ? (
                        results.properties.map((property: any) => (
                            <Link key={property.id} href={`/property/${property.id}`}>
                                <PropertyCard property={property} />
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16">
                            <div className="text-6xl mb-4">🏠</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No properties found</h3>
                            <p className="text-gray-500">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {results?.pagination && results.pagination.pages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: Math.min(5, results.pagination.pages) }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => search({ ...filters, page: i + 1, includeAnalysis: true })}
                                className={`w-10 h-10 rounded-lg font-medium ${results.pagination.page === i + 1
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:border-amber-400'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
