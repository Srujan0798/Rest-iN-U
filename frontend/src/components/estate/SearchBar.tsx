"use client";

import { useState, useCallback } from "react";
import { Search, Filter, MapPin, X, Home, IndianRupee, BedDouble, Bath, ChevronDown } from "lucide-react";

export interface SearchFilters {
  city: string;
  minPrice: string;
  maxPrice: string;
  propertyType: string;
  minBedrooms: string;
  minBathrooms?: string;
  searchQuery?: string;
  page: number | string;
}

interface SearchBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

// Popular Indian cities for quick selection
const POPULAR_CITIES = [
  "Bangalore",
  "Mumbai",
  "Delhi",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Goa",
];

// Price range presets (in INR)
const PRICE_PRESETS = [
  { label: "Under 50L", min: "", max: "5000000" },
  { label: "50L - 1Cr", min: "5000000", max: "10000000" },
  { label: "1Cr - 2Cr", min: "10000000", max: "20000000" },
  { label: "2Cr - 5Cr", min: "20000000", max: "50000000" },
  { label: "Above 5Cr", min: "50000000", max: "" },
];

// Property types from backend schema
const PROPERTY_TYPES = [
  { value: "", label: "All Types" },
  { value: "HOUSE", label: "House" },
  { value: "CONDO", label: "Condo" },
  { value: "APARTMENT", label: "Apartment" },
  { value: "VILLA", label: "Villa" },
  { value: "PENTHOUSE", label: "Penthouse" },
  { value: "TOWNHOUSE", label: "Townhouse" },
  { value: "FARMHOUSE", label: "Farmhouse" },
  { value: "PLOT", label: "Plot/Land" },
  { value: "COMMERCIAL", label: "Commercial" },
];

export function SearchBar({ filters, onFiltersChange }: SearchBarProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || "");
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const handleInputChange = useCallback((field: string, value: string) => {
    onFiltersChange({ ...filters, [field]: value, page: 1 });
  }, [filters, onFiltersChange]);

  const handleSearch = useCallback(() => {
    onFiltersChange({ ...filters, searchQuery, page: 1 });
  }, [filters, searchQuery, onFiltersChange]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  }, [handleSearch]);

  const clearFilters = useCallback(() => {
    const clearedFilters: SearchFilters = {
      city: "",
      minPrice: "",
      maxPrice: "",
      propertyType: "",
      minBedrooms: "",
      minBathrooms: "",
      searchQuery: "",
      page: 1,
    };
    setSearchQuery("");
    onFiltersChange(clearedFilters);
  }, [onFiltersChange]);

  const selectPricePreset = useCallback((preset: typeof PRICE_PRESETS[0]) => {
    onFiltersChange({
      ...filters,
      minPrice: preset.min,
      maxPrice: preset.max,
      page: 1,
    });
  }, [filters, onFiltersChange]);

  const hasActiveFilters = filters.city || filters.minPrice || filters.maxPrice ||
    filters.propertyType || filters.minBedrooms;

  // Format price for display
  const formatPriceDisplay = (value: string) => {
    if (!value) return "";
    const num = parseInt(value);
    if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
    return num.toLocaleString("en-IN");
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 mb-8">
      {/* Main Search Bar */}
      <div className="relative">
        <div className="relative flex items-center bg-white border-2 border-blue-200 rounded-2xl shadow-lg focus-within:shadow-xl focus-within:border-blue-400 transition-all">
          {/* Location Input with Dropdown */}
          <div className="relative flex-1 flex items-center border-r border-gray-200">
            <div className="pl-4 pr-2">
              <MapPin className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={filters.city}
                onChange={(e) => {
                  handleInputChange("city", e.target.value);
                  setShowCityDropdown(true);
                }}
                onFocus={() => setShowCityDropdown(true)}
                onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
                placeholder="City (e.g., Bangalore)"
                className="w-full py-4 px-2 text-gray-900 placeholder-gray-400 focus:outline-none rounded-l-2xl"
              />
              {/* City Dropdown */}
              {showCityDropdown && !filters.city && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                  <div className="p-2 text-xs text-gray-500 font-medium border-b">Popular Cities</div>
                  {POPULAR_CITIES.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onMouseDown={() => handleInputChange("city", city)}
                      className="w-full px-4 py-2 text-left hover:bg-blue-50 text-gray-700 text-sm"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Property Type Quick Select */}
          <div className="hidden md:flex items-center px-3 border-r border-gray-200">
            <Home className="w-4 h-4 text-gray-400 mr-2" />
            <select
              value={filters.propertyType}
              onChange={(e) => handleInputChange("propertyType", e.target.value)}
              className="py-4 pr-2 text-gray-700 focus:outline-none bg-transparent cursor-pointer text-sm"
            >
              {PROPERTY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Toggle & Search Button */}
          <div className="flex items-center space-x-2 px-3">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`p-2.5 rounded-xl transition-all ${
                showAdvancedFilters || hasActiveFilters
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              <Filter className="w-5 h-5" />
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full" />
              )}
            </button>

            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2 shadow-md hover:shadow-lg"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Price Filters */}
      <div className="flex flex-wrap gap-2 justify-center">
        {PRICE_PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => selectPricePreset(preset)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filters.minPrice === preset.min && filters.maxPrice === preset.max
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="bg-white border border-blue-100 rounded-2xl shadow-lg p-6 animate-in slide-in-from-top-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Filter className="w-5 h-5 mr-2 text-blue-600" />
              Advanced Filters
            </h3>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* City */}
            <div className="lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                City
              </label>
              <input
                type="text"
                value={filters.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="e.g., Bangalore"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <IndianRupee className="w-4 h-4 mr-1 text-gray-400" />
                Min Price
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleInputChange("minPrice", e.target.value)}
                  placeholder="5000000"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                {filters.minPrice && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                    {formatPriceDisplay(filters.minPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <IndianRupee className="w-4 h-4 mr-1 text-gray-400" />
                Max Price
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleInputChange("maxPrice", e.target.value)}
                  placeholder="10000000"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                {filters.maxPrice && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                    {formatPriceDisplay(filters.maxPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Home className="w-4 h-4 mr-1 text-gray-400" />
                Property Type
              </label>
              <select
                value={filters.propertyType}
                onChange={(e) => handleInputChange("propertyType", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              >
                {PROPERTY_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <BedDouble className="w-4 h-4 mr-1 text-gray-400" />
                Bedrooms
              </label>
              <select
                value={filters.minBedrooms}
                onChange={(e) => handleInputChange("minBedrooms", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            {/* Min Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Bath className="w-4 h-4 mr-1 text-gray-400" />
                Bathrooms
              </label>
              <select
                value={filters.minBathrooms || ""}
                onChange={(e) => handleInputChange("minBathrooms", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
          </div>

          {/* Apply Filters Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">Active filters:</span>
          {filters.city && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
              {filters.city}
              <button onClick={() => handleInputChange("city", "")} className="ml-1.5 hover:text-blue-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {filters.propertyType && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
              {PROPERTY_TYPES.find(t => t.value === filters.propertyType)?.label}
              <button onClick={() => handleInputChange("propertyType", "")} className="ml-1.5 hover:text-blue-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {(filters.minPrice || filters.maxPrice) && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
              {filters.minPrice ? formatPriceDisplay(filters.minPrice) : "0"} - {filters.maxPrice ? formatPriceDisplay(filters.maxPrice) : "Any"}
              <button onClick={() => { handleInputChange("minPrice", ""); handleInputChange("maxPrice", ""); }} className="ml-1.5 hover:text-blue-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {filters.minBedrooms && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
              {filters.minBedrooms}+ Beds
              <button onClick={() => handleInputChange("minBedrooms", "")} className="ml-1.5 hover:text-blue-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
