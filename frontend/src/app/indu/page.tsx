// @F1-Web: INDU Mode Industrial Properties Page
"use client";

import { useState } from "react";
import { SearchBar } from "@/components/estate/SearchBar";
import { PropertyGrid } from "@/components/estate/PropertyGrid";
import { usePropertySearch } from "@/hooks/usePropertySearch";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { Factory, Package, Truck, Building2 } from "lucide-react";

export default function InduPage() {
  const [filters, setFilters] = useState<any>({
    city: "",
    minPrice: "",
    maxPrice: "",
    propertyType: "WAREHOUSE", // Default to industrial properties
    minBedrooms: "",
    page: "1",
  });

  const { properties, isLoading, error, pagination } = usePropertySearch({
    ...filters,
    category: "industrial", // Add industrial category filter
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* INDU Mode Header */}
      <header className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-3 mb-2">
            <Factory className="w-8 h-8" />
            <h1 className="text-4xl font-bold">🏭 INDU Mode</h1>
          </div>
          <p className="text-amber-100">
            Industrial & Commercial Property Solutions
          </p>

          {/* Industrial Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/20 backdrop-blur rounded-lg p-3 text-center">
              <Package className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm">Warehouses</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-3 text-center">
              <Building2 className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm">Industrial Land</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-3 text-center">
              <Truck className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm">Logistics Hubs</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-3 text-center">
              <Factory className="w-6 h-6 mx-auto mb-1" />
              <div className="text-sm">Manufacturing</div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <div className="container mx-auto px-4 py-8">
        <SearchBar filters={filters} onFiltersChange={setFilters} />

        {/* Results */}
        <div className="mt-8">
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
              <p className="mt-4 text-gray-600">
                Searching industrial properties...
              </p>
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
              <Factory className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No industrial properties found. Try different filters.
              </p>
            </div>
          )}

          {!isLoading && !error && properties.length > 0 && (
            <>
              {/* Industrial Property Type Filter */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {[
                    "WAREHOUSE",
                    "INDUSTRIAL_LAND",
                    "FACTORY",
                    "LOGISTICS",
                    "OFFICE_SPACE",
                  ].map((type) => (
                    <button
                      key={type}
                      onClick={() =>
                        setFilters({ ...filters, propertyType: type })
                      }
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        filters.propertyType === type
                          ? "bg-amber-600 text-white"
                          : "bg-white text-gray-700 hover:bg-amber-50 border border-gray-300"
                      }`}
                    >
                      {type.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              <PropertyGrid properties={properties} basePath="/indu" />

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => setFilters({ ...filters, page: String(page) })}
                      className={`px-4 py-2 rounded-lg ${
                        page === pagination.page
                          ? "bg-amber-600 text-white"
                          : "bg-white text-gray-700 hover:bg-amber-50"
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

      {/* Theme Switcher */}
      <ThemeSwitcher />
    </div>
  );
}
