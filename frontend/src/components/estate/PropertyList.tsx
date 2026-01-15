"use client";

import Link from "next/link";
import Image from "next/image";

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

interface PropertyListProps {
  properties: Property[];
}

export function PropertyList({ properties }: PropertyListProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getClimateRiskColor = (risk?: string) => {
    switch (risk) {
      case "low":
        return "text-green-600 bg-green-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "high":
        return "text-red-600 bg-red-50";
      default:
        return "";
    }
  };

  const getClimateRiskIcon = (risk?: string) => {
    switch (risk) {
      case "low":
        return "🟢";
      case "medium":
        return "🟡";
      case "high":
        return "🔴";
      default:
        return "";
    }
  };

  if (properties.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <p className="text-gray-500">
          No properties found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {properties.map((property) => (
        <Link
          key={property.id}
          href={`/estate/property/${property.id}`}
          className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-200 group"
        >
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Property Image */}
              <div className="flex-shrink-0">
                <div className="relative w-full md:w-64 h-48 bg-gray-100 rounded-lg overflow-hidden">
                  {property.image ? (
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                      <div className="text-center">
                        <svg
                          className="w-12 h-12 text-blue-300 mx-auto mb-2"
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
                        <p className="text-blue-400 text-sm">No Image</p>
                      </div>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 right-3 flex flex-col space-y-2">
                    {property.vastuScore && (
                      <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Vastu {property.vastuScore}/10
                      </div>
                    )}
                    {property.climateRisk && (
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getClimateRiskColor(property.climateRisk)}`}
                      >
                        {getClimateRiskIcon(property.climateRisk)}{" "}
                        {property.climateRisk} risk
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {property.title}
                  </h3>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatPrice(property.price)}
                    </div>
                    {property.propertyType && (
                      <div className="text-sm text-gray-500">
                        {property.propertyType}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-gray-600 mb-4 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {property.city}, {property.state}
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-600 border-t border-gray-100 pt-4">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
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
                    {property.bedrooms}{" "}
                    {property.bedrooms === 1 ? "Bed" : "Beds"}
                  </div>

                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {property.bathrooms}{" "}
                    {property.bathrooms === 1 ? "Bath" : "Baths"}
                  </div>

                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                      />
                    </svg>
                    {property.sqft.toLocaleString()} sqft
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
