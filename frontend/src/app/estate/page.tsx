// @F1-Web: ESTATE Mode Property Search Page
"use client";

import { useState } from "react";
import { SearchBar } from "../../../components/estate/SearchBar";
import { PropertyGrid } from "../../../components/estate/PropertyGrid";

import { usePropertySearch } from "../../../hooks/usePropertySearch";
import { ThemeSwitcher } from "../../../components/common/ThemeSwitcher";
import { DebatePanel } from "../../../components/agents/DebatePanel";
import { GlassBox } from "../../../components/common/GlassBox";
import { MapComponent } from "../../../components/common/MapComponent";

export default function EstatePage() {
  const [filters, setFilters] = useState({
    city: "",
    minPrice: "",
    maxPrice: "",
    propertyType: "",
    minBedrooms: "",
    page: 1,
  });

  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const { properties, isLoading, error, pagination } =
    usePropertySearch(filters);
  const [showDebatePanel, setShowDebatePanel] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null,
  );

  const handlePropertySelect = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setShowDebatePanel(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* ESTATE Mode Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">🏠 ESTATE Mode</h1>
              <p className="text-blue-100">
                Modern Property Search with AI Agent Analysis
              </p>
            </div>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Search Section */}
      <div className="container mx-auto px-4 py-8">
        <SearchBar filters={filters} onFiltersChange={setFilters} />

        {/* Results */}
        {/* View Toggle */}
        <div className="mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-blue-50"
              }`}
            >
              📋 List View
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === "map"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-blue-50"
              }`}
            >
              🗺️ Map View
            </button>
          </div>
        </div>

        {/* Glass Box Component */}
        <div className="mb-8">
          <GlassBox propertyId="demo" />
        </div>

        <div className="mt-8">
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Searching properties...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600">
                Error loading properties. Please try again.
              </p>
            </div>
          )}

          {!isLoading && !error && properties.length === 0 && (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <p className="text-gray-500 text-lg">
                No properties found. Try different filters.
              </p>
            </div>
          )}

          {!isLoading && !error && properties.length > 0 && (
            <>
              {viewMode === "list" ? (
                <PropertyGrid
                  properties={properties}
                  onAnalyzeClick={handlePropertySelect}
                />
              ) : (
                <MapComponent
                  properties={properties.map((p) => ({
                    ...p,
                    coordinates: {
                      lat: 12.9716 + Math.random() * 0.1,
                      lng: 77.5946 + Math.random() * 0.1,
                    },
                  }))}
                  height="500px"
                />
              )}

              {/* Pagination - only show in list view */}
              {viewMode === "list" &&
                pagination &&
                pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1,
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => setFilters({ ...filters, page })}
                        className={`px-4 py-2 rounded-lg ${
                          page === pagination.page
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-blue-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
            </>
          )}
        </div>
      </div>

      {/* Agent Debate Panel - Conditional */}
      {showDebatePanel && selectedPropertyId && (
        <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[80vh] overflow-hidden">
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setShowDebatePanel(false)}
              className="bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-full shadow-lg"
            >
              ×
            </button>
          </div>
          <DebatePanel propertyId={selectedPropertyId} />
        </div>
      )}
    </div>
  );
}
