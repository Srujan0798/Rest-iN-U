"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Brain, Heart, BedDouble, Bath, Maximize2, MapPin, Home } from "lucide-react";

interface PropertyCardProps {
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
  onAnalyzeClick?: (id: string) => void;
  onFavoriteClick?: (id: string, isFavorite: boolean) => void;
  isFavorite?: boolean;
  basePath?: string;
}

// Format price in Indian format (Lakhs/Crores)
function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} L`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

// Get property type display label
function getPropertyTypeLabel(type?: string): string {
  const labels: Record<string, string> = {
    HOUSE: "House",
    CONDO: "Condo",
    APARTMENT: "Apartment",
    VILLA: "Villa",
    PENTHOUSE: "Penthouse",
    TOWNHOUSE: "Townhouse",
    FARMHOUSE: "Farmhouse",
    PLOT: "Plot",
    COMMERCIAL: "Commercial",
  };
  return type ? labels[type] || type : "";
}

// Get Vastu grade from score
function getVastuGrade(score: number): { grade: string; color: string } {
  if (score >= 90) return { grade: "A+", color: "bg-emerald-500" };
  if (score >= 80) return { grade: "A", color: "bg-green-500" };
  if (score >= 70) return { grade: "B+", color: "bg-lime-500" };
  if (score >= 60) return { grade: "B", color: "bg-yellow-500" };
  if (score >= 50) return { grade: "C", color: "bg-orange-500" };
  return { grade: "D", color: "bg-red-500" };
}

export function PropertyCard({
  id,
  title,
  price,
  city,
  state,
  bedrooms,
  bathrooms,
  sqft,
  propertyType,
  image,
  vastuScore,
  climateRisk,
  onAnalyzeClick,
  onFavoriteClick,
  isFavorite: initialFavorite = false,
  basePath = "/estate/property",
}: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [imageError, setImageError] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = !isFavorite;
    setIsFavorite(newState);
    onFavoriteClick?.(id, newState);
  };

  const vastuGrade = vastuScore ? getVastuGrade(vastuScore) : null;

  return (
    <Link href={`${basePath}/${id}`} className="block">
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 group h-full flex flex-col">
        {/* Property Image */}
        <div className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
          {image && !imageError ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Home className="w-16 h-16 text-blue-200" />
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Top badges row */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            {/* Climate Risk Badge */}
            {climateRisk && (
              <div
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm ${
                  climateRisk === "low"
                    ? "bg-green-500/90 text-white"
                    : climateRisk === "medium"
                      ? "bg-yellow-500/90 text-white"
                      : "bg-red-500/90 text-white"
                }`}
              >
                {climateRisk === "low" ? "Low Risk" : climateRisk === "medium" ? "Med Risk" : "High Risk"}
              </div>
            )}

            {/* Favorite Button */}
            <button
              onClick={handleFavoriteClick}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                isFavorite
                  ? "bg-red-500 text-white shadow-lg"
                  : "bg-white/80 text-gray-600 hover:bg-white hover:text-red-500"
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Bottom badges row */}
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
            {/* Property Type Badge */}
            {propertyType && (
              <div className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/90 text-gray-700 backdrop-blur-sm">
                {getPropertyTypeLabel(propertyType)}
              </div>
            )}

            {/* Vastu Score Badge */}
            {vastuGrade && (
              <div className={`px-2.5 py-1 rounded-lg text-xs font-bold text-white ${vastuGrade.color}`}>
                Vastu {vastuGrade.grade}
              </div>
            )}
          </div>
        </div>

        {/* Property Details */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Price */}
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {formatPrice(price)}
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-gray-900 line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>

          {/* Location */}
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
            {city}, {state}
          </div>

          {/* Specs */}
          <div className="flex items-center justify-between text-sm text-gray-600 border-t border-gray-100 pt-3 mt-auto">
            <div className="flex items-center space-x-4">
              <div className="flex items-center" title={`${bedrooms} Bedroom${bedrooms !== 1 ? "s" : ""}`}>
                <BedDouble className="w-4 h-4 mr-1.5 text-gray-400" />
                <span className="font-medium">{bedrooms}</span>
              </div>

              <div className="flex items-center" title={`${bathrooms} Bathroom${bathrooms !== 1 ? "s" : ""}`}>
                <Bath className="w-4 h-4 mr-1.5 text-gray-400" />
                <span className="font-medium">{bathrooms}</span>
              </div>

              <div className="flex items-center" title={`${sqft.toLocaleString()} sq ft`}>
                <Maximize2 className="w-4 h-4 mr-1.5 text-gray-400" />
                <span className="font-medium">{sqft > 0 ? sqft.toLocaleString() : "-"}</span>
              </div>
            </div>

            {/* AI Analysis Button */}
            {onAnalyzeClick && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAnalyzeClick(id);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-medium rounded-lg transition-all shadow-sm hover:shadow-md"
              >
                <Brain className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Analyze</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
