// @F1-Web: PropertyGrid Component - ESTATE Mode Results Grid
"use client";

import { PropertyCard } from "./PropertyCard";
import { Loader2, Home, Search, RefreshCw, LayoutGrid, List, SortAsc, SortDesc } from "lucide-react";

interface Property {
  id: string;
  title: string;
  price: number;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  propertyType?: string;
  image?: string;
  vastuScore?: number;
  climateRisk?: "low" | "medium" | "high";
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PropertyGridProps {
  properties: Property[];
  loading?: boolean;
  error?: Error | null;
  pagination?: Pagination | null;
  onAnalyzeClick?: (id: string) => void;
  onFavoriteClick?: (id: string, isFavorite: boolean) => void;
  onPageChange?: (page: number) => void;
  onRetry?: () => void;
  viewMode?: "grid" | "list";
  sortBy?: string;
  onSortChange?: (sort: string) => void;
}

// Loading skeleton for property cards
function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-52 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="flex gap-4 pt-3 border-t border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-12" />
          <div className="h-4 bg-gray-200 rounded w-12" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export function PropertyGrid({
  properties,
  loading,
  error,
  pagination,
  onAnalyzeClick,
  onFavoriteClick,
  onPageChange,
  onRetry,
  viewMode = "grid",
  sortBy,
  onSortChange,
}: PropertyGridProps) {
  // Loading state with skeleton
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Results header skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
          <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Failed to load properties
        </h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          {error.message || "Something went wrong. Please try again."}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        )}
      </div>
    );
  }

  // Empty state
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center">
          <Home className="w-12 h-12 text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No properties found
        </h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          We couldn't find any properties matching your criteria. Try adjusting your filters or search in a different location.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
            <Search className="w-4 h-4 mr-2" />
            Modify Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-900">
            {pagination?.total || properties.length} Properties
          </span>
          {pagination && pagination.totalPages > 1 && (
            <span className="text-sm text-gray-500">
              (Page {pagination.page} of {pagination.totalPages})
            </span>
          )}
        </div>

        {/* Sort & View Controls */}
        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          {onSortChange && (
            <select
              value={sortBy || "relevance"}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="relevance">Most Relevant</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="vastuScore">Best Vastu Score</option>
              <option value="climateRisk">Lowest Climate Risk</option>
            </select>
          )}
        </div>
      </div>

      {/* Property Grid */}
      <div className={
        viewMode === "list"
          ? "space-y-4"
          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      }>
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            id={property.id}
            title={property.title}
            price={property.price}
            city={property.city}
            state={property.state}
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            sqft={property.sqft}
            propertyType={property.propertyType}
            image={property.image}
            vastuScore={property.vastuScore}
            climateRisk={property.climateRisk}
            onAnalyzeClick={onAnalyzeClick}
            onFavoriteClick={onFavoriteClick}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum: number;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                    pagination.page === pageNum
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
