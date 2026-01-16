// @F1-Web: ESTATE Mode Property Search Page
// Connected to B1 Backend API for property search
"use client";

import { useState, useCallback } from "react";
import { SearchBar } from "@/components/estate/SearchBar";
import { PropertyGrid } from "@/components/estate/PropertyGrid";
import { usePropertySearch } from "@/hooks/usePropertySearch";
import { ThemeSwitcher } from "@/components/common/ThemeSwitcher";
import { DebatePanel } from "@/components/agents/DebatePanel";
import { GlassBox } from "@/components/common/GlassBox";
import { MapComponent } from "@/components/common/MapComponent";
import { LayoutGrid, Map, X, Sparkles, Building2, TrendingUp } from "lucide-react";

// Search filters interface
interface SearchFilters {
  city: string;
  minPrice: string;
  maxPrice: string;
  propertyType: string;
  minBedrooms: string;
  minBathrooms?: string;
  searchQuery?: string;
  page: number;
}

export default function EstatePage() {
  // Search filters state
  const [filters, setFilters] = useState<SearchFilters>({
    city: "",
    minPrice: "",
    maxPrice: "",
    propertyType: "",
    minBedrooms: "",
    minBathrooms: "",
    page: 1,
  });

  // View mode: grid or map
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  // Sort state
  const [sortBy, setSortBy] = useState<string>("relevance");

  // Fetch properties from B1 backend API
  const { properties, isLoading, error, pagination, refetch } = usePropertySearch({
    ...filters,
    sortBy: sortBy === "relevance" ? undefined : sortBy.split("-")[0],
    sortOrder: sortBy.includes("asc") ? "asc" : sortBy.includes("desc") ? "desc" : undefined,
  });

  // AI Analysis panel state
  const [showDebatePanel, setShowDebatePanel] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  // Handler for AI analysis
  const handleAnalyzeProperty = useCallback((propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setShowDebatePanel(true);
  }, []);

  // Handler for favorite toggle
  const handleFavoriteClick = useCallback((propertyId: string, isFavorite: boolean) => {
    // TODO: Connect to B1 favorite API
    console.log(`Property ${propertyId} favorite: ${isFavorite}`);
  }, []);

  // Handler for page change
  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  // Handler for sort change
  const handleSortChange = useCallback((sort: string) => {
    setSortBy(sort);
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* ESTATE Mode Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-10 h-10" />
                <h1 className="text-3xl md:text-4xl font-bold">ESTATE Mode</h1>
              </div>
              <p className="text-blue-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI-Powered Property Search with Vastu & Climate Analysis
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeSwitcher />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
              <div className="text-2xl font-bold">{pagination?.total || 0}</div>
              <div className="text-blue-200 text-sm">Properties Available</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
              <div className="text-2xl font-bold flex items-center gap-1">
                <TrendingUp className="w-5 h-5" />
                10+
              </div>
              <div className="text-blue-200 text-sm">Cities Covered</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
              <div className="text-2xl font-bold">AI</div>
              <div className="text-blue-200 text-sm">Agent Analysis</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
              <div className="text-2xl font-bold">100%</div>
              <div className="text-blue-200 text-sm">Vastu Verified</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <SearchBar filters={filters} onFiltersChange={setFilters} />

        {/* View Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "bg-white text-gray-700 hover:bg-blue-50 border border-gray-200"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Grid View
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                viewMode === "map"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "bg-white text-gray-700 hover:bg-blue-50 border border-gray-200"
              }`}
            >
              <Map className="w-4 h-4" />
              Map View
            </button>
          </div>
        </div>

        {/* GlassBox - AI Analysis Preview (optional) */}
        {selectedPropertyId && (
          <div className="mb-8">
            <GlassBox propertyId={selectedPropertyId} />
          </div>
        )}

        {/* Results Section */}
        <div className="mt-6">
          {viewMode === "grid" ? (
            <PropertyGrid
              properties={properties}
              loading={isLoading}
              error={error}
              pagination={pagination}
              onAnalyzeClick={handleAnalyzeProperty}
              onFavoriteClick={handleFavoriteClick}
              onPageChange={handlePageChange}
              onRetry={refetch}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              viewMode="grid"
            />
          ) : (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <MapComponent
                properties={properties.map((p) => ({
                  ...p,
                  coordinates: {
                    // Mock coordinates for demo - would come from backend
                    lat: 12.9716 + Math.random() * 0.1,
                    lng: 77.5946 + Math.random() * 0.1,
                  },
                }))}
                height="600px"
              />
            </div>
          )}
        </div>
      </div>

      {/* AI Agent Debate Panel - Slide-in Panel */}
      {showDebatePanel && selectedPropertyId && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-white shadow-2xl transform transition-transform duration-300">
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">AI Property Analysis</span>
            </div>
            <button
              onClick={() => setShowDebatePanel(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-64px)]">
            <DebatePanel propertyId={selectedPropertyId} />
          </div>
        </div>
      )}

      {/* Overlay when panel is open */}
      {showDebatePanel && (
        <div
          className="fixed inset-0 bg-black/30 z-40 sm:block hidden"
          onClick={() => setShowDebatePanel(false)}
        />
      )}
    </div>
  );
}
