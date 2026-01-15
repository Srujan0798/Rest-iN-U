'use client';

import { Grid, List } from 'lucide-react';
import { useState } from 'react';
import PropertyCard, { PropertyCardSkeleton, EstatePropertyCardProps } from './PropertyCard';

interface PropertyGridProps {
    properties: EstatePropertyCardProps['property'][];
    loading?: boolean;
    onFavorite?: (propertyId: string) => void;
    favoritedIds?: Set<string>;
}

export default function PropertyGrid({
    properties,
    loading,
    onFavorite,
    favoritedIds = new Set(),
}: PropertyGridProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    if (loading) {
        return (
            <div className={`grid gap-6 ${
                viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
            }`}>
                {Array.from({ length: 6 }).map((_, i) => (
                    <PropertyCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (!properties || properties.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No properties found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                    Try adjusting your search filters or expanding your search area to find more properties.
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* View Toggle */}
            <div className="flex justify-between items-center mb-4">
                <p className="text-gray-600">
                    <span className="font-semibold text-gray-900">{properties.length}</span> properties found
                </p>
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-colors ${
                            viewMode === 'grid'
                                ? 'bg-white shadow-sm text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        aria-label="Grid view"
                    >
                        <Grid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-colors ${
                            viewMode === 'list'
                                ? 'bg-white shadow-sm text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        aria-label="List view"
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Property Grid/List */}
            <div className={`grid gap-6 ${
                viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1 max-w-3xl'
            }`}>
                {properties.map((property) => (
                    <PropertyCard
                        key={property.id}
                        property={property}
                        isFavorited={favoritedIds.has(property.id)}
                        onFavoriteClick={onFavorite ? () => onFavorite(property.id) : undefined}
                    />
                ))}
            </div>
        </div>
    );
}

// Pagination Component
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
        const pages: (number | 'ellipsis')[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        // Always show first page
        pages.push(1);

        if (currentPage > 3) {
            pages.push('ellipsis');
        }

        // Show pages around current
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 2) {
            pages.push('ellipsis');
        }

        // Always show last page
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="flex justify-center items-center gap-2 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Previous
            </button>

            {getVisiblePages().map((page, index) => (
                page === 'ellipsis' ? (
                    <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                            currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
                        }`}
                    >
                        {page}
                    </button>
                )
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next
            </button>
        </div>
    );
}
