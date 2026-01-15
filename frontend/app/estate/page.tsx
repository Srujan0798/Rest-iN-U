"use client";

import { useEffect } from "react";
import { Building2, Shield, Leaf, TrendingUp } from "lucide-react";
import SearchForm, { SearchFilters } from "../../components/estate/SearchForm";
import PropertyGrid, { Pagination } from "../../components/estate/PropertyGrid";
import {
  useEstateSearch,
  useEstateFavorites,
} from "../../components/estate/useEstateSearch";
import { useTheme } from "../../src/contexts/ThemeContext";

export default function EstatePage() {
  const { setTheme } = useTheme();
  const { results, loading, error, search } = useEstateSearch();
  const { favoritedIds, toggleFavorite } = useEstateFavorites();

  // Set ESTATE theme on mount
  useEffect(() => {
    setTheme("estate");
  }, [setTheme]);

  // Initial search on mount (client-side only)
  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        search({
          city: "",
          propertyType: "",
        });
      }, 100); // Small delay to ensure component is mounted
      return () => clearTimeout(timer);
    }
  }, [search]);

  const handleSearch = (filters: SearchFilters) => {
    search(filters, 1);
  };

  const handlePageChange = (page: number) => {
    // Re-search with same filters but different page
    search(
      {
        city: "",
        propertyType: "",
      },
      page,
    );
    // Scroll to top of results
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Building2 className="w-8 h-8" />
              <span className="text-xl font-bold tracking-wide">ESTATE</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Find Your Perfect Property
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Discover properties with Vastu analysis, climate risk scores, and
              comprehensive market insights
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto">
            <SearchForm onSearch={handleSearch} loading={loading} />
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-blue-100">
              <Shield className="w-5 h-5" />
              <span>Vastu Verified</span>
            </div>
            <div className="flex items-center gap-2 text-blue-100">
              <Leaf className="w-5 h-5" />
              <span>Climate Risk Analysis</span>
            </div>
            <div className="flex items-center gap-2 text-blue-100">
              <TrendingUp className="w-5 h-5" />
              <span>Market Insights</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Search Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Property Grid */}
        <PropertyGrid
          properties={results?.properties || []}
          loading={loading}
          onFavorite={toggleFavorite}
          favoritedIds={favoritedIds}
        />

        {/* Pagination */}
        {results?.pagination && results.pagination.totalPages > 1 && (
          <Pagination
            currentPage={results.pagination.page}
            totalPages={results.pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Features Section */}
      <div className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Why Choose REST-iN-U ESTATE
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Vastu Analysis
              </h3>
              <p className="text-gray-600 text-sm">
                Every property comes with detailed Vastu Shastra analysis for
                optimal energy flow and harmony
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Climate Intelligence
              </h3>
              <p className="text-gray-600 text-sm">
                Comprehensive climate risk assessment including flood, fire, and
                environmental factors
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Market Insights
              </h3>
              <p className="text-gray-600 text-sm">
                AI-powered valuations and market trends to help you make
                informed decisions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
