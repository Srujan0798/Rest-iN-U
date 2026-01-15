// @F1-Web: Map Component with Mapbox Integration
"use client";

import { useState, useEffect, useRef } from "react";

interface Property {
  id: string;
  title: string;
  price: number;
  city: string;
  state: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface MapComponentProps {
  properties?: Property[];
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  height?: string;
  showControls?: boolean;
}

export function MapComponent({
  properties = [],
  center = { lat: 12.9716, lng: 77.5946 }, // Bangalore
  zoom = 12,
  height = "400px",
  showControls = true,
}: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real implementation, you would load Mapbox GL JS
    // For this demo, we'll create a placeholder map visualization

    if (!mapContainerRef.current) return;

    const loadMap = async () => {
      try {
        // Mock map loading
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Create a simple visualization
        const container = mapContainerRef.current;
        if (container) {
          container.innerHTML = `
                        <div class="relative w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden">
                            <div class="absolute inset-0 bg-white/50 backdrop-blur-sm">
                                <div class="flex items-center justify-center h-full">
                                    <div class="text-center">
                                        <div class="text-6xl mb-4">🗺️</div>
                                        <div class="text-lg font-medium text-gray-700 mb-2">Map View</div>
                                        <div class="text-sm text-gray-500 mb-4">${properties.length} properties in this area</div>
                                        <div class="text-xs text-gray-400">Mapbox integration requires API key</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Mock property markers -->
                            ${properties
                              .map((property, index) => {
                                const x = 20 + ((index * 25) % 60);
                                const y = 20 + Math.floor(index / 3) * 25;
                                return `
                                    <div class="absolute" style="left: ${x}%; top: ${y}%; transform: translate(-50%, -50%);">
                                        <div class="relative group">
                                            <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg cursor-pointer hover:bg-blue-700 transition-colors">
                                                ₹
                                            </div>
                                            <div class="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                ${property.title}
                                            </div>
                                        </div>
                                    </div>
                                `;
                              })
                              .join("")}
                        </div>
                    `;
        }

        setMapLoaded(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load map");
      }
    };

    loadMap();

    return () => {
      // Cleanup map resources
      if (mapRef.current) {
        // map.remove(); // In real implementation
      }
    };
  }, [properties]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600">Error loading map: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Map Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Property Map</h3>
            <p className="text-blue-100 text-sm">Interactive location view</p>
          </div>
          {showControls && (
            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm transition-colors"
                title="Reset view"
              >
                🔄
              </button>
              <button
                className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm transition-colors"
                title="Toggle fullscreen"
              >
                ⛶
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div
        ref={mapContainerRef}
        className="relative"
        style={{ height: height }}
      >
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend */}
      {mapLoaded && properties.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
          <h4 className="font-medium text-sm mb-2">Property Range</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Under ₹50L</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>₹50L - ₹1Cr</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Above ₹1Cr</span>
            </div>
          </div>
        </div>
      )}

      {/* Property List Toggle */}
      {showControls && properties.length > 0 && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2">
          <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            📋 List View
          </button>
        </div>
      )}
    </div>
  );
}
