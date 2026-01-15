"use client";

import { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Navigation,
  ZoomIn,
  ZoomOut,
  Layers,
  Grid,
} from "lucide-react";

interface Property {
  id: string;
  title: string;
  price: number;
  city: string;
  state: string;
  lat: number;
  lng: number;
  image?: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  vastuScore?: number;
  climateRisk?: "low" | "medium" | "high";
}

interface MapViewProps {
  properties: Property[];
  onPropertySelect?: (property: Property) => void;
  className?: string;
}

export function MapView({
  properties,
  onPropertySelect,
  className = "",
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [mapStyle, setMapStyle] = useState<"street" | "satellite" | "terrain">(
    "street",
  );
  const [zoom, setZoom] = useState(12);

  // Mock map functionality (in real implementation, this would integrate with Mapbox or Google Maps)
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
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-red-500";
      default:
        return "bg-blue-500";
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
        return "📍";
    }
  };

  // Simulate map bounds (in real implementation, this would calculate from property coordinates)
  const getMapBounds = () => {
    if (properties.length === 0)
      return { centerLat: 12.9716, centerLng: 77.5946 };

    const avgLat =
      properties.reduce((sum, p) => sum + p.lat, 0) / properties.length;
    const avgLng =
      properties.reduce((sum, p) => sum + p.lng, 0) / properties.length;

    return { centerLat: avgLat, centerLng: avgLng };
  };

  const mapBounds = getMapBounds();

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    onPropertySelect?.(property);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 1, 20));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 1, 1));
  };

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("User location:", position.coords);
          // In real implementation, center map on user location
        },
        (error) => {
          console.error("Error getting location:", error);
        },
      );
    }
  };

  return (
    <div
      className={`relative bg-gray-100 rounded-2xl overflow-hidden ${className}`}
    >
      {/* Map Container */}
      <div
        ref={mapRef}
        className="relative h-full min-h-[500px] bg-gradient-to-br from-green-50 to-blue-50"
        style={{
          backgroundImage:
            mapStyle === "satellite"
              ? `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='%238B7355'/%3E%3C/svg%3E")`
              : mapStyle === "terrain"
                ? `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='%23E8F5E8'/%3E%3C/svg%3E")`
                : "",
        }}
      >
        {/* Grid overlay for street view */}
        {mapStyle === "street" && (
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 grid-rows-8 h-full">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="border border-gray-400"></div>
              ))}
            </div>
          </div>
        )}

        {/* Property Markers */}
        {properties.map((property, index) => (
          <div
            key={property.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{
              left: `${20 + ((index * 15) % 60)}%`,
              top: `${20 + ((index * 12) % 60)}%`,
              zIndex: selectedProperty?.id === property.id ? 20 : 10,
            }}
            onClick={() => handlePropertyClick(property)}
          >
            {/* Marker */}
            <div className="relative">
              <div
                className={`w-8 h-8 rounded-full ${getClimateRiskColor(property.climateRisk)} shadow-lg flex items-center justify-center text-white text-xs font-bold group-hover:scale-110 transition-transform`}
              >
                {getClimateRiskIcon(property.climateRisk)}
              </div>

              {/* Price label */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white px-2 py-1 rounded shadow-lg text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {formatPrice(property.price)}
              </div>
            </div>

            {/* Selected indicator */}
            {selectedProperty?.id === property.id && (
              <div className="absolute inset-0 w-12 h-12 -top-2 -left-2 rounded-full border-4 border-blue-500 animate-ping"></div>
            )}
          </div>
        ))}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={handleZoomIn}
              className="p-3 hover:bg-gray-50 transition-colors border-b"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-3 hover:bg-gray-50 transition-colors border-b"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleLocateUser}
              className="p-3 hover:bg-gray-50 transition-colors"
              title="My location"
            >
              <Navigation className="w-4 h-4" />
            </button>
          </div>

          {/* Map Style Selector */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => setMapStyle("street")}
              className={`p-3 hover:bg-gray-50 transition-colors flex items-center space-x-2 w-full ${
                mapStyle === "street" ? "bg-blue-50 text-blue-600" : ""
              }`}
            >
              <Grid className="w-4 h-4" />
              <span className="text-sm">Street</span>
            </button>
            <button
              onClick={() => setMapStyle("satellite")}
              className={`p-3 hover:bg-gray-50 transition-colors flex items-center space-x-2 w-full border-t ${
                mapStyle === "satellite" ? "bg-blue-50 text-blue-600" : ""
              }`}
            >
              <Layers className="w-4 h-4" />
              <span className="text-sm">Satellite</span>
            </button>
            <button
              onClick={() => setMapStyle("terrain")}
              className={`p-3 hover:bg-gray-50 transition-colors flex items-center space-x-2 w-full border-t ${
                mapStyle === "terrain" ? "bg-blue-50 text-blue-600" : ""
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Terrain</span>
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4">
          <h4 className="font-semibold text-sm mb-2">Climate Risk</h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs">Low Risk</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-xs">Medium Risk</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs">High Risk</span>
            </div>
          </div>
        </div>

        {/* Property Info Popup */}
        {selectedProperty && (
          <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-xl p-4 max-w-sm">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-sm">
                {selectedProperty.title}
              </h3>
              <button
                onClick={() => setSelectedProperty(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="text-xs text-gray-600 mb-2">
              {selectedProperty.city}, {selectedProperty.state}
            </div>

            <div className="text-lg font-bold text-blue-600 mb-2">
              {formatPrice(selectedProperty.price)}
            </div>

            <div className="flex items-center space-x-3 text-xs text-gray-600 mb-3">
              <span>{selectedProperty.bedrooms} beds</span>
              <span>{selectedProperty.bathrooms} baths</span>
              <span>{selectedProperty.sqft.toLocaleString()} sqft</span>
            </div>

            {selectedProperty.vastuScore && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Vastu Score:</span>
                <span className="text-xs font-semibold text-blue-600">
                  {selectedProperty.vastuScore}/10
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
