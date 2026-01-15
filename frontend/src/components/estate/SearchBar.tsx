"use client";

import { useState } from "react";
import { Search, Filter, MapPin } from "lucide-react";

interface SearchBarProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
}

export function SearchBar({ filters, onFiltersChange }: SearchBarProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || "");

  const handleInputChange = (field: string, value: string) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const handleSearch = () => {
    onFiltersChange({ ...filters, searchQuery, page: 1 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      city: "",
      minPrice: "",
      maxPrice: "",
      propertyType: "",
      minBedrooms: "",
      searchQuery: "",
      page: 1,
    };
    setSearchQuery("");
    onFiltersChange(clearedFilters);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {/* Main Search Bar */}
      <div className="relative">
        <div className="relative flex items-center bg-white border border-blue-200 rounded-xl shadow-sm focus-within:shadow-md transition-shadow">
          <div className="pl-4 pr-2">
            <MapPin className="w-5 h-5 text-blue-500" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search by location, property name..."
            className="flex-1 py-4 px-2 text-gray-900 placeholder-gray-500 focus:outline-none"
          />

          <div className="flex items-center space-x-2 pr-2">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Filter className="w-5 h-5" />
            </button>

            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mr-2"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="bg-white border border-blue-100 rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-700">
              Advanced Filters
            </h3>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={filters.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="e.g., Bangalore"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Price (₹)
              </label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleInputChange("minPrice", e.target.value)}
                placeholder="5000000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price (₹)
              </label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleInputChange("maxPrice", e.target.value)}
                placeholder="10000000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <select
                value={filters.propertyType}
                onChange={(e) =>
                  handleInputChange("propertyType", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="HOUSE">House</option>
                <option value="CONDO">Condo</option>
                <option value="APARTMENT">Apartment</option>
                <option value="VILLA">Villa</option>
              </select>
            </div>

            {/* Min Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Bedrooms
              </label>
              <select
                value={filters.minBedrooms}
                onChange={(e) =>
                  handleInputChange("minBedrooms", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            {/* Apply Filters Button */}
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
