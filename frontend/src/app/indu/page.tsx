// @F1-Web: INDU Mode - Vastu & Traditional Properties Page
"use client";

import { useState } from "react";
import { SearchBar } from "@/components/estate/SearchBar";
import { PropertyGrid } from "@/components/estate/PropertyGrid";
import { usePropertySearch } from "@/hooks/usePropertySearch";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { Compass, Sun, Moon, Sparkles } from "lucide-react";
import { DebatePanel } from "@/components/agents/DebatePanel";

export default function InduPage() {
  const [filters, setFilters] = useState({
    city: "",
    minPrice: "",
    maxPrice: "",
    propertyType: "HOUSE",
    minBedrooms: "",
    vastuCompliant: true, // Default true for INDU mode
  });

  const { properties, isLoading, error, pagination } = usePropertySearch({
    ...filters,
    mode: "INDU", // Pass mode to backend to trigger Vastu-specific logic
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-rose-50 font-serif">
      {/* INDU Mode Header */}
      <header className="bg-gradient-to-r from-orange-600 to-rose-600 text-white py-12 shadow-lg">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Compass className="w-10 h-10 animate-spin-slow" />
            <h1 className="text-5xl font-bold tracking-wide">INDU MODE</h1>
          </div>
          <p className="text-orange-100 text-lg max-w-2xl mx-auto">
            Discover homes aligned with Vastu Shastra, Jyotish, and Ancient Wisdom.
            Where cosmic energy meets modern living.
          </p>

          {/* Vastu Features */}
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <Sun className="w-6 h-6 mx-auto mb-2 text-yellow-300" />
              <span className="text-sm font-medium">Solar Orientation</span>
            </div>
            <div className="text-center">
              <Sparkles className="w-6 h-6 mx-auto mb-2 text-purple-300" />
              <span className="text-sm font-medium">Energy Mapping</span>
            </div>
            <div className="text-center">
              <Moon className="w-6 h-6 mx-auto mb-2 text-blue-300" />
              <span className="text-sm font-medium">Lunar Phases</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">

        {/* Search Bar with Vastu Filters */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 -mt-16 mb-12 border border-orange-100">
           <SearchBar filters={filters} onFiltersChange={setFilters} />
           <div className="mt-4 flex gap-4 text-sm text-gray-600 justify-center">
             <label className="flex items-center gap-2 cursor-pointer">
               <input
                 type="checkbox"
                 checked={filters.vastuCompliant}
                 onChange={(e) => setFilters({...filters, vastuCompliant: e.target.checked})}
                 className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
               />
               <span>Only Vastu Compliant (Score 80+)</span>
             </label>
           </div>
        </div>

        {/* Agent Swarm Demo (Debate Panel) */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-orange-200 flex-1"></div>
            <h2 className="text-2xl font-bold text-orange-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-orange-500" />
              Live Agent Analysis (Demo)
            </h2>
            <div className="h-px bg-orange-200 flex-1"></div>
          </div>
          {/* We show the DebatePanel here as a demo for the "INDU" experience */}
          <DebatePanel propertyId="demo-property-1" />
        </div>

        {/* Results */}
        <div className="mt-8">
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
              <p className="mt-4 text-gray-600">
                Consulting the Vastu Shastras...
              </p>
            </div>
          )}

          {!isLoading && !error && properties.length > 0 && (
             <PropertyGrid properties={properties} />
          )}

           {!isLoading && !error && properties.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No properties found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Theme Switcher */}
      <ThemeSwitcher />
    </div>
  );
}
