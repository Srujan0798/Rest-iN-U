// Vastu Score Display Component
'use client';

import React from 'react';

interface VastuScoreProps {
    score: number;
    grade: string;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export function VastuScore({ score, grade, size = 'md', showLabel = true }: VastuScoreProps) {
    const getColor = (score: number) => {
        if (score >= 80) return { bg: 'bg-emerald-500', ring: 'ring-emerald-200', text: 'text-emerald-600' };
        if (score >= 60) return { bg: 'bg-amber-500', ring: 'ring-amber-200', text: 'text-amber-600' };
        if (score >= 40) return { bg: 'bg-orange-500', ring: 'ring-orange-200', text: 'text-orange-600' };
        return { bg: 'bg-red-500', ring: 'ring-red-200', text: 'text-red-600' };
    };

    const sizes = {
        sm: { container: 'w-12 h-12', text: 'text-sm', label: 'text-xs' },
        md: { container: 'w-20 h-20', text: 'text-xl', label: 'text-sm' },
        lg: { container: 'w-28 h-28', text: 'text-3xl', label: 'text-base' },
    };

    const colors = getColor(score);
    const s = sizes[size];

    return (
        <div className="flex flex-col items-center gap-1">
            <div className={`${s.container} rounded-full ${colors.ring} ring-4 flex items-center justify-center relative`}>
                <div
                    className={`absolute inset-1 rounded-full ${colors.bg} opacity-20`}
                    style={{
                        background: `conic-gradient(${colors.bg.replace('bg-', '')} ${score * 3.6}deg, transparent 0deg)`,
                    }}
                />
                <div className="flex flex-col items-center z-10">
                    <span className={`font-bold ${s.text} ${colors.text}`}>{score}</span>
                    {size !== 'sm' && <span className={`${s.label} ${colors.text} font-medium`}>{grade}</span>}
                </div>
            </div>
            {showLabel && (
                <span className={`${s.label} text-gray-600 font-medium`}>Vastu Score</span>
            )}
        </div>
    );
}

// Climate Risk Badge
interface ClimateRiskBadgeProps {
    riskScore: number;
    riskGrade: string;
}

export function ClimateRiskBadge({ riskScore, riskGrade }: ClimateRiskBadgeProps) {
    const getColor = (score: number) => {
        if (score <= 30) return 'bg-green-100 text-green-800 border-green-200';
        if (score <= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        if (score <= 70) return 'bg-orange-100 text-orange-800 border-orange-200';
        return 'bg-red-100 text-red-800 border-red-200';
    };

    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getColor(riskScore)}`}>
            🌍 Climate Risk: {riskGrade}
        </span>
    );
}

// Property Card
interface PropertyCardProps {
    property: {
        id: string;
        title: string;
        city: string;
        state: string;
        price: number;
        bedrooms: number;
        bathrooms: number;
        squareFeet?: number;
        photos?: { url: string }[];
        vastuAnalysis?: { overallScore: number; grade: string };
        climateAnalysis?: { overallRiskScore: number; riskGrade: string };
    };
    onFavorite?: () => void;
    isFavorited?: boolean;
}

export function PropertyCard({ property, onFavorite, isFavorited }: PropertyCardProps) {
    const formatPrice = (price: number) => {
        if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
        if (price >= 1000) return `$${(price / 1000).toFixed(0)}K`;
        return `$${price}`;
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={property.photos?.[0]?.url || '/placeholder-property.jpg'}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {property.vastuAnalysis && (
                        <VastuScore
                            score={property.vastuAnalysis.overallScore}
                            grade={property.vastuAnalysis.grade}
                            size="sm"
                            showLabel={false}
                        />
                    )}
                </div>

                {/* Favorite button */}
                {onFavorite && (
                    <button
                        onClick={(e) => { e.preventDefault(); onFavorite(); }}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition"
                    >
                        <svg
                            className={`w-5 h-5 ${isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                )}

                {/* Price */}
                <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-bold shadow-lg">
                    {formatPrice(property.price)}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-lg line-clamp-1 mb-1">
                    {property.title}
                </h3>
                <p className="text-gray-500 text-sm mb-3">
                    {property.city}, {property.state}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {property.bedrooms} bed
                    </span>
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 5H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        {property.bathrooms} bath
                    </span>
                    {property.squareFeet && (
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                            {property.squareFeet.toLocaleString()} sqft
                        </span>
                    )}
                </div>

                {/* Climate badge */}
                {property.climateAnalysis && (
                    <div className="mt-3">
                        <ClimateRiskBadge
                            riskScore={property.climateAnalysis.overallRiskScore}
                            riskGrade={property.climateAnalysis.riskGrade}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

// Auspicious Date Card
interface AuspiciousDateProps {
    date: string;
    quality: string;
    eventType: string;
}

export function AuspiciousDateCard({ date, quality, eventType }: AuspiciousDateProps) {
    return (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-100">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xl">
                    📅
                </div>
                <div>
                    <p className="font-semibold text-gray-900">{date}</p>
                    <p className="text-sm text-purple-600">{quality}</p>
                    <p className="text-xs text-gray-500">{eventType}</p>
                </div>
            </div>
        </div>
    );
}

// Loading skeleton
export function PropertyCardSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200" />
            <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="flex gap-4">
                    <div className="h-4 bg-gray-200 rounded w-16" />
                    <div className="h-4 bg-gray-200 rounded w-16" />
                    <div className="h-4 bg-gray-200 rounded w-20" />
                </div>
            </div>
        </div>
    );
}

