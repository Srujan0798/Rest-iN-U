import Link from "next/link";
import Image from "next/image";
import { Brain } from "lucide-react";

interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  image?: string;
  vastuScore?: number;
  climateRisk?: "low" | "medium" | "high";
  onAnalyzeClick?: (id: string) => void;
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
  image,
  vastuScore,
  climateRisk,
  onAnalyzeClick,
}: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link href={`/estate/property/${id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-blue-100 hover:border-blue-200 group">
        {/* Property Image */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
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
          )}

          {/* Vastu Score Badge */}
          {vastuScore && (
            <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Vastu {vastuScore}/10
            </div>
          )}

          {/* Climate Risk Badge */}
          {climateRisk && (
            <div
              className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold ${
                climateRisk === "low"
                  ? "bg-green-100 text-green-800"
                  : climateRisk === "medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {climateRisk === "low"
                ? "🟢 Low Risk"
                : climateRisk === "medium"
                  ? "🟡 Med Risk"
                  : "🔴 High Risk"}
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {title}
            </h3>
          </div>

          <div className="text-2xl font-bold text-blue-600 mb-3">
            {formatPrice(price)}
          </div>

          <div className="text-sm text-gray-600 mb-3">
            {city}, {state}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-3">
            <div className="flex items-center space-x-3">
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
                {bedrooms} {bedrooms === 1 ? "Bed" : "Beds"}
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
                {bathrooms} {bathrooms === 1 ? "Bath" : "Baths"}
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
                {sqft.toLocaleString()} sqft
              </div>
            </div>

            {onAnalyzeClick && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAnalyzeClick(id);
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
              >
                <Brain className="w-3 h-3" />
                AI Analysis
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
