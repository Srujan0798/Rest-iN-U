// @F1-Web: PropertyGrid Component
"use client";

import { PropertyCard } from "./PropertyCard";
import { Loader2 } from "lucide-react";

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

interface PropertyGridProps {
  properties: Property[];
  loading?: boolean;
}

export function PropertyGrid({ properties, loading }: PropertyGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading properties...</span>
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-blue-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No properties found
        </h3>
        <p className="text-gray-500">
          Try adjusting your filters or search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          image={property.image}
          vastuScore={property.vastuScore}
          climateRisk={property.climateRisk}
        />
      ))}
    </div>
  );
}
