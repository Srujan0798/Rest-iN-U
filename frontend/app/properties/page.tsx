'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LayoutGrid, List as ListIcon, Search } from 'lucide-react';
import { PropertyCard, Property } from '../../components/properties/PropertyCard';
import { FilterSidebar } from '../../components/properties/FilterSidebar';
import { Button, Spinner } from '../../components/ui';

// Type definition for API response
interface PropertiesResponse {
  success: boolean;
  data: {
    properties: Property[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

function PropertiesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 0 });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Parse filters from URL
  const getFiltersFromUrl = () => {
    return {
      page: Number(searchParams.get('page')) || 1,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      minBedrooms: searchParams.get('minBedrooms') ? Number(searchParams.get('minBedrooms')) : undefined,
      minBathrooms: searchParams.get('minBathrooms') ? Number(searchParams.get('minBathrooms')) : undefined,
      minVastuScore: searchParams.get('minVastuScore') ? Number(searchParams.get('minVastuScore')) : undefined,
      city: searchParams.get('city') || undefined,
      propertyType: searchParams.get('propertyType') ? searchParams.get('propertyType')?.split(',') : undefined,
    };
  };

  const currentFilters = getFiltersFromUrl();

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();

        // Add all current filters to query params
        Object.entries(currentFilters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              queryParams.append(key, value.join(','));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });

        const res = await fetch(`/api/properties?${queryParams.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch properties');

        const data: PropertiesResponse = await res.json();
        setProperties(data.data.properties);
        setPagination(data.data.pagination);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams]);

  // Update URL when filters change
  const handleFilterChange = (newFilters: any) => {
    const params = new URLSearchParams();

    // Merge new filters with base params (reset page to 1 on filter change)
    const filtersToApply = { ...newFilters, page: 1 };

    Object.entries(filtersToApply).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          params.set(key, value.join(','));
        } else {
          params.set(key, value.toString());
        }
      }
    });

    router.push(`/properties?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/properties?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    router.push('/properties');
  };

  const toggleFavorite = (id: string) => {
    // Optimistic update
    setProperties(prev => prev.map(p =>
      p.id === id ? { ...p, isFavorited: !p.isFavorited } : p
    ));
    // TODO: Call API to toggle favorite
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Properties</h1>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              >
                Filters
              </Button>
              <div className="bg-gray-100 p-1 rounded-lg flex items-center">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-amber-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <LayoutGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-amber-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <ListIcon size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar (Desktop) */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-24">
              <FilterSidebar
                filters={currentFilters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
              />
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          {isMobileFiltersOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileFiltersOpen(false)} />
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 shadow-xl overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <button onClick={() => setIsMobileFiltersOpen(false)} className="text-gray-500">
                    <span className="sr-only">Close</span>
                    &times;
                  </button>
                </div>
                <FilterSidebar
                  filters={currentFilters}
                  onFilterChange={(f) => {
                    handleFilterChange(f);
                    setIsMobileFiltersOpen(false);
                  }}
                  onReset={handleResetFilters}
                />
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                <div className="text-gray-300 mb-4">
                  <Search size={64} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters to see more results.</p>
                <Button onClick={handleResetFilters}>Clear Filters</Button>
              </div>
            ) : (
              <>
                <div className={
                  viewMode === 'grid'
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                }>
                  {properties.map(property => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      className={viewMode === 'list' ? 'flex-row' : ''}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <Button
                      variant="secondary"
                      disabled={pagination.page === 1}
                      onClick={() => handlePageChange(pagination.page - 1)}
                    >
                      Previous
                    </Button>
                    <span className="text-gray-600 font-medium px-4">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="secondary"
                      disabled={pagination.page === pagination.totalPages}
                      onClick={() => handlePageChange(pagination.page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>}>
      <PropertiesPageContent />
    </Suspense>
  );
}
