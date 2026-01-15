'use client';

import { Bed, Bath, Ruler, Heart, MapPin, Shield, Leaf } from 'lucide-react';
import Link from 'next/link';

export interface EstatePropertyCardProps {
    property: {
        id: string;
        title?: string;
        streetAddress?: string;
        city: string;
        state: string;
        zipCode?: string;
        price: number;
        bedrooms?: number;
        bathrooms?: number;
        squareFeet?: number;
        propertyType: string;
        status?: string;
        photos?: { url: string; isPrimary?: boolean }[];
        vastuAnalysis?: { overallScore: number; grade?: string }[];
        climateAnalysis?: { overallRiskScore: number; riskGrade?: string };
    };
    isFavorited?: boolean;
    onFavoriteClick?: () => void;
}

export default function PropertyCard({ property, isFavorited, onFavoriteClick }: EstatePropertyCardProps) {
    const primaryPhoto = property.photos?.find(p => p.isPrimary)?.url
        || property.photos?.[0]?.url
        || `https://picsum.photos/seed/${property.id}/400/300`;

    const address = property.streetAddress
        ? `${property.streetAddress}, ${property.city}, ${property.state}`
        : `${property.city}, ${property.state}`;

    const vastuScore = property.vastuAnalysis?.[0]?.overallScore;
    const climateRisk = property.climateAnalysis?.overallRiskScore;

    const formatPrice = (price: number) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
        return `₹${price.toLocaleString('en-IN')}`;
    };

    return (
        <div className="group relative bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={primaryPhoto}
                    alt={property.title || address}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Status Badge */}
                {property.status && property.status !== 'ACTIVE' && (
                    <span className={`absolute top-3 left-3 px-2 py-1 text-xs font-semibold rounded-md ${
                        property.status === 'PENDING' ? 'bg-yellow-500 text-white' :
                        property.status === 'SOLD' ? 'bg-red-500 text-white' :
                        'bg-gray-500 text-white'
                    }`}>
                        {property.status}
                    </span>
                )}

                {/* Property Type Badge */}
                <span className="absolute top-3 right-12 px-2 py-1 bg-blue-600/90 text-white text-xs font-medium rounded-md">
                    {property.propertyType}
                </span>

                {/* Favorite Button */}
                {onFavoriteClick && (
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFavoriteClick(); }}
                        className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
                        aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                    </button>
                )}

                {/* Score Badges */}
                <div className="absolute bottom-3 left-3 flex gap-2">
                    {vastuScore !== undefined && (
                        <span className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                            vastuScore >= 80 ? 'bg-green-500/90 text-white' :
                            vastuScore >= 60 ? 'bg-yellow-500/90 text-white' :
                            'bg-red-500/90 text-white'
                        }`}>
                            <Shield className="w-3 h-3" />
                            Vastu {vastuScore}
                        </span>
                    )}
                    {climateRisk !== undefined && (
                        <span className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                            climateRisk <= 30 ? 'bg-green-500/90 text-white' :
                            climateRisk <= 60 ? 'bg-yellow-500/90 text-white' :
                            'bg-red-500/90 text-white'
                        }`}>
                            <Leaf className="w-3 h-3" />
                            Risk {climateRisk}
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <Link href={`/property/${property.id}`} className="block p-4">
                {/* Price */}
                <p className="text-xl font-bold text-blue-600">
                    {formatPrice(property.price)}
                </p>

                {/* Title/Address */}
                <h3 className="text-sm font-medium text-gray-900 mt-1 truncate">
                    {property.title || 'Property for Sale'}
                </h3>
                <p className="flex items-center gap-1 text-sm text-gray-500 truncate mt-0.5">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    {address}
                </p>

                {/* Features */}
                <div className="flex gap-4 mt-3 text-sm text-gray-600">
                    {property.bedrooms !== undefined && (
                        <span className="flex items-center gap-1">
                            <Bed className="w-4 h-4 text-gray-400" />
                            {property.bedrooms} Beds
                        </span>
                    )}
                    {property.bathrooms !== undefined && (
                        <span className="flex items-center gap-1">
                            <Bath className="w-4 h-4 text-gray-400" />
                            {property.bathrooms} Baths
                        </span>
                    )}
                    {property.squareFeet && (
                        <span className="flex items-center gap-1">
                            <Ruler className="w-4 h-4 text-gray-400" />
                            {property.squareFeet.toLocaleString()} sqft
                        </span>
                    )}
                </div>
            </Link>
        </div>
    );
}

// Skeleton loader
export function PropertyCardSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-card overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200" />
            <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
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
