'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Property marker interface
interface PropertyMarker {
  id: string;
  position: { lat: number; lng: number };
  title: string;
  price: number;
  priceType: 'sale' | 'rent';
  propertyType: string;
  bedrooms?: number;
  image?: string;
  vastuScore?: number;
  isSelected?: boolean;
}

// Map configuration
interface MapConfig {
  center: { lat: number; lng: number };
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
  mapTypeId?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  styles?: google.maps.MapTypeStyle[];
}

// Component props
interface MapViewProps {
  markers?: PropertyMarker[];
  config?: Partial<MapConfig>;
  onMarkerClick?: (marker: PropertyMarker) => void;
  onMapClick?: (position: { lat: number; lng: number }) => void;
  onBoundsChange?: (bounds: { ne: { lat: number; lng: number }; sw: { lat: number; lng: number } }) => void;
  showClustering?: boolean;
  showDrawingTools?: boolean;
  showPropertyCards?: boolean;
  selectedMarkerId?: string;
  height?: string;
  className?: string;
}

// Default map configuration (centered on Mumbai)
const defaultConfig: MapConfig = {
  center: { lat: 19.0760, lng: 72.8777 },
  zoom: 12,
  minZoom: 4,
  maxZoom: 20,
  mapTypeId: 'roadmap',
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

// Format price for display
const formatPrice = (price: number, type: 'sale' | 'rent'): string => {
  if (type === 'rent') {
    return `â‚¹${(price / 1000).toFixed(0)}K/mo`;
  }
  if (price >= 10000000) {
    return `â‚¹${(price / 10000000).toFixed(1)}Cr`;
  }
  if (price >= 100000) {
    return `â‚¹${(price / 100000).toFixed(0)}L`;
  }
  return `â‚¹${price.toLocaleString('en-IN')}`;
};

// Property info card component
const PropertyInfoCard = ({
  marker,
  onClose,
  onViewDetails,
}: {
  marker: PropertyMarker;
  onClose: () => void;
  onViewDetails: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
    >
      {/* Image */}
      <div className="relative h-32">
        {marker.image ? (
          <img
            src={marker.image}
            alt={marker.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
            <svg className="w-12 h-12 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
        )}
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Price tag */}
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-bold rounded">
          {formatPrice(marker.price, marker.priceType)}
        </div>
        
        {/* Vastu score */}
        {marker.vastuScore && (
          <div className={`absolute bottom-2 right-2 px-2 py-1 text-xs font-medium rounded ${
            marker.vastuScore >= 80 ? 'bg-green-500 text-white' :
            marker.vastuScore >= 60 ? 'bg-yellow-500 text-white' :
            'bg-red-500 text-white'
          }`}>
            Vastu {marker.vastuScore}%
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{marker.title}</h3>
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
          <span className="capitalize">{marker.propertyType}</span>
          {marker.bedrooms && (
            <>
              <span>â€¢</span>
              <span>{marker.bedrooms} BHK</span>
            </>
          )}
        </div>
        
        <button
          onClick={onViewDetails}
          className="w-full mt-3 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-medium rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all"
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
};

// Custom marker component (for when not using Google Maps directly)
const CustomMarker = ({
  marker,
  isSelected,
  onClick,
  onViewDetails,
  onClose,
}: {
  marker: PropertyMarker;
  isSelected: boolean;
  onClick: () => void;
  onViewDetails: () => void;
  onClose: () => void;
}) => {
  return (
    <div className="relative">
      {/* Marker pin */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`relative flex items-center justify-center ${
          isSelected ? 'z-40' : 'z-10'
        }`}
      >
        <div className={`px-2 py-1 rounded-full font-bold text-xs shadow-lg transition-all ${
          isSelected
            ? 'bg-orange-500 text-white scale-110'
            : 'bg-white text-gray-900 hover:bg-orange-50'
        }`}>
          {formatPrice(marker.price, marker.priceType)}
        </div>
        {/* Pin tail */}
        <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
          isSelected ? 'border-t-orange-500' : 'border-t-white'
        }`} />
      </motion.button>
      
      {/* Info card */}
      <AnimatePresence>
        {isSelected && (
          <PropertyInfoCard
            marker={marker}
            onClose={onClose}
            onViewDetails={onViewDetails}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Map controls component
const MapControls = ({
  onZoomIn,
  onZoomOut,
  onRecenter,
  onToggleMapType,
  onToggleFullscreen,
  mapType,
  isFullscreen,
}: {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRecenter: () => void;
  onToggleMapType: () => void;
  onToggleFullscreen: () => void;
  mapType: string;
  isFullscreen: boolean;
}) => {
  return (
    <div className="absolute right-4 top-4 flex flex-col gap-2">
      {/* Zoom controls */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <button
          onClick={onZoomIn}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors border-b border-gray-200"
          title="Zoom in"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button
          onClick={onZoomOut}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
          title="Zoom out"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
      </div>
      
      {/* Other controls */}
      <button
        onClick={onRecenter}
        className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
        title="Recenter map"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
      
      <button
        onClick={onToggleMapType}
        className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
        title={mapType === 'roadmap' ? 'Satellite view' : 'Map view'}
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      </button>
      
      <button
        onClick={onToggleFullscreen}
        className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
        title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
      >
        {isFullscreen ? (
          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        )}
      </button>
    </div>
  );
};

// Drawing tools component
const DrawingTools = ({
  onDrawPolygon,
  onDrawCircle,
  onClearDrawing,
  isDrawing,
  hasDrawing,
}: {
  onDrawPolygon: () => void;
  onDrawCircle: () => void;
  onClearDrawing: () => void;
  isDrawing: boolean;
  hasDrawing: boolean;
}) => {
  return (
    <div className="absolute left-4 top-4 flex flex-col gap-2">
      <div className="bg-white rounded-lg shadow-lg p-2">
        <p className="text-xs text-gray-500 mb-2 px-1">Draw to search</p>
        <div className="flex gap-1">
          <button
            onClick={onDrawPolygon}
            className={`p-2 rounded transition-colors ${
              isDrawing ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100 text-gray-700'
            }`}
            title="Draw polygon"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
            </svg>
          </button>
          <button
            onClick={onDrawCircle}
            className={`p-2 rounded transition-colors ${
              isDrawing ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100 text-gray-700'
            }`}
            title="Draw circle"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="9" strokeWidth={2} />
            </svg>
          </button>
          {hasDrawing && (
            <button
              onClick={onClearDrawing}
              className="p-2 rounded hover:bg-red-50 text-red-500 transition-colors"
              title="Clear drawing"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Legend component
const MapLegend = () => {
  return (
    <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
      <p className="text-xs font-medium text-gray-700 mb-2">Vastu Score</p>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-xs text-gray-600">80-100% (Excellent)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-xs text-gray-600">60-79% (Good)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-xs text-gray-600">0-59% (Needs Work)</span>
        </div>
      </div>
    </div>
  );
};

// Main MapView component
export default function MapView({
  markers = [],
  config = {},
  onMarkerClick,
  onMapClick,
  onBoundsChange,
  showClustering = true,
  showDrawingTools = false,
  showPropertyCards = true,
  selectedMarkerId,
  height = '500px',
  className = '',
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(selectedMarkerId || null);
  const [mapType, setMapType] = useState<string>(config.mapTypeId || 'roadmap');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const mergedConfig = { ...defaultConfig, ...config };
  
  // Initialize map (placeholder - would use Google Maps API in production)
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Update selected marker when prop changes
  useEffect(() => {
    setSelectedMarker(selectedMarkerId || null);
  }, [selectedMarkerId]);
  
  // Handle marker click
  const handleMarkerClick = useCallback((marker: PropertyMarker) => {
    setSelectedMarker(marker.id);
    onMarkerClick?.(marker);
  }, [onMarkerClick]);
  
  // Handle view details
  const handleViewDetails = useCallback((marker: PropertyMarker) => {
    // Navigate to property page
    window.location.href = `/property/${marker.id}`;
  }, []);
  
  // Map control handlers
  const handleZoomIn = useCallback(() => {
    if (mapInstance) {
      const currentZoom = mapInstance.getZoom() || mergedConfig.zoom;
      mapInstance.setZoom(Math.min(currentZoom + 1, mergedConfig.maxZoom || 20));
    }
  }, [mapInstance, mergedConfig]);
  
  const handleZoomOut = useCallback(() => {
    if (mapInstance) {
      const currentZoom = mapInstance.getZoom() || mergedConfig.zoom;
      mapInstance.setZoom(Math.max(currentZoom - 1, mergedConfig.minZoom || 4));
    }
  }, [mapInstance, mergedConfig]);
  
  const handleRecenter = useCallback(() => {
    if (mapInstance) {
      mapInstance.setCenter(mergedConfig.center);
      mapInstance.setZoom(mergedConfig.zoom);
    }
  }, [mapInstance, mergedConfig]);
  
  const handleToggleMapType = useCallback(() => {
    const newType = mapType === 'roadmap' ? 'satellite' : 'roadmap';
    setMapType(newType);
    if (mapInstance) {
      mapInstance.setMapTypeId(newType);
    }
  }, [mapInstance, mapType]);
  
  const handleToggleFullscreen = useCallback(() => {
    if (!mapRef.current) return;
    
    if (!isFullscreen) {
      if (mapRef.current.requestFullscreen) {
        mapRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);
  
  // Drawing handlers
  const handleDrawPolygon = useCallback(() => {
    setIsDrawing(!isDrawing);
  }, [isDrawing]);
  
  const handleDrawCircle = useCallback(() => {
    setIsDrawing(!isDrawing);
  }, [isDrawing]);
  
  const handleClearDrawing = useCallback(() => {
    setHasDrawing(false);
    setIsDrawing(false);
  }, []);
  
  // Loading state
  if (isLoading) {
    return (
      <div 
        className={`relative bg-gray-100 rounded-xl overflow-hidden ${className}`}
        style={{ height }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div 
        className={`relative bg-gray-100 rounded-xl overflow-hidden ${className}`}
        style={{ height }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={mapRef}
      className={`relative bg-gray-200 rounded-xl overflow-hidden ${className}`}
      style={{ height }}
    >
      {/* Map placeholder - would be replaced with actual Google Maps in production */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
        {/* Grid pattern to simulate map */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `
            linear-gradient(to right, #d1d5db 1px, transparent 1px),
            linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }} />
        
        {/* Markers */}
        <div className="absolute inset-0">
          {markers.map((marker, index) => {
            // Calculate position based on lat/lng (simplified for demo)
            const x = ((marker.position.lng - mergedConfig.center.lng + 0.5) / 1) * 100;
            const y = ((mergedConfig.center.lat - marker.position.lat + 0.5) / 1) * 100;
            
            return (
              <div
                key={marker.id}
                className="absolute transform -translate-x-1/2 -translate-y-full"
                style={{
                  left: `${Math.min(Math.max(x, 10), 90)}%`,
                  top: `${Math.min(Math.max(y, 15), 85)}%`,
                }}
              >
                <CustomMarker
                  marker={marker}
                  isSelected={selectedMarker === marker.id}
                  onClick={() => handleMarkerClick(marker)}
                  onViewDetails={() => handleViewDetails(marker)}
                  onClose={() => setSelectedMarker(null)}
                />
              </div>
            );
          })}
        </div>
        
        {/* No markers message */}
        {markers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-gray-600">No properties in this area</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your search filters</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Map controls */}
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onRecenter={handleRecenter}
        onToggleMapType={handleToggleMapType}
        onToggleFullscreen={handleToggleFullscreen}
        mapType={mapType}
        isFullscreen={isFullscreen}
      />
      
      {/* Drawing tools */}
      {showDrawingTools && (
        <DrawingTools
          onDrawPolygon={handleDrawPolygon}
          onDrawCircle={handleDrawCircle}
          onClearDrawing={handleClearDrawing}
          isDrawing={isDrawing}
          hasDrawing={hasDrawing}
        />
      )}
      
      {/* Legend */}
      <MapLegend />
      
      {/* Property count badge */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-full px-4 py-2 shadow-lg">
        <span className="text-sm font-medium text-gray-700">
          {markers.length} {markers.length === 1 ? 'property' : 'properties'} found
        </span>
      </div>
    </div>
  );
}

// Export types
export type { PropertyMarker, MapConfig, MapViewProps };
