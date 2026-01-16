import React from 'react';
import Link from 'next/link';

interface PropertyCardProps {
    property: {
        id: string;
        title: string;
        streetAddress: string;
        city: string;
        state: string;
        price: number;
        bedrooms: number;
        bathrooms: number;
        squareFeet: number;
        photos?: { url: string }[];
        vastuAnalysis?: { overallScore: number };
    };
    featured?: boolean;
}

export default function PropertyCard({ property, featured = false }: PropertyCardProps) {
    return (
        <Link href={`/property/${property.id}`} className="group block h-full">
            <div className={`relative h-full bg-white rounded-2xl overflow-hidden transition-shadow ${featured ? 'shadow-lg hover:shadow-xl ring-2 ring-amber-500' : 'shadow-md hover:shadow-lg'}`}>
                {/* Image */}
                <div className="relative aspect-[4/3] bg-gray-200">
                    {property.photos?.[0]?.url ? (
                        <img
                            src={property.photos[0].url}
                            alt={property.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                            <span className="text-4xl">🏠</span>
                        </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                        {property.vastuAnalysis?.overallScore ? (
                            <span className={`${property.vastuAnalysis.overallScore >= 80 ? 'text-green-600' : property.vastuAnalysis.overallScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                                Vastu: {property.vastuAnalysis.overallScore}%
                            </span>
                        ) : (
                            <span className="text-gray-500">No Vastu Score</span>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
                            {property.title}
                        </h3>
                        <div className="text-lg font-bold text-gray-900">
                            ${(property.price / 1000).toFixed(0)}k
                        </div>
                    </div>

                    <p className="text-gray-500 text-sm mb-4 line-clamp-1">
                        {property.streetAddress}, {property.city}, {property.state}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <span>🛏️</span> {property.bedrooms} Beds
                        </div>
                        <div className="flex items-center gap-1">
                            <span>🛁</span> {property.bathrooms} Baths
                        </div>
                        <div className="flex items-center gap-1">
                            <span>📐</span> {property.squareFeet} sqft
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
