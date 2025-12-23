'use client';
import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

interface Property {
    property_id: string;
    address: any;
    price: number;
    bedrooms: number;
    bathrooms: number;
    coordinates?: { lat: number; lng: number } | null;
    primary_photo?: string | null;
}

interface MapViewProps {
    properties: Property[];
    center?: { lat: number; lng: number };
    zoom?: number;
    onPropertyClick?: (propertyId: string) => void;
}

export default function MapView({ properties, center = { lat: 40.7128, lng: -74.006 }, zoom = 12, onPropertyClick }: MapViewProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        // Check if Google Maps is available
        if (typeof window !== 'undefined' && (window as any).google?.maps) {
            initMap();
        } else {
            // Load Google Maps script
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
            script.async = true;
            script.onload = () => initMap();
            document.head.appendChild(script);
        }
    }, []);

    const initMap = () => {
        if (!mapRef.current) return;

        const map = new (window as any).google.maps.Map(mapRef.current, {
            center,
            zoom,
            styles: [
                { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
            ],
        });

        // Add markers for properties
        properties.forEach((property) => {
            if (property.coordinates?.lat && property.coordinates?.lng) {
                const marker = new (window as any).google.maps.Marker({
                    position: { lat: property.coordinates.lat, lng: property.coordinates.lng },
                    map,
                    title: typeof property.address === 'string' ? property.address : property.address?.street,
                    icon: {
                        path: (window as any).google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: '#1976d2',
                        fillOpacity: 1,
                        strokeColor: '#fff',
                        strokeWeight: 2,
                    },
                });

                marker.addListener('click', () => {
                    setSelectedProperty(property);
                });
            }
        });

        setMapLoaded(true);
    };

    // Fallback UI when Google Maps API key is not configured
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        return (
            <div className="w-full h-full min-h-[400px] bg-gray-200 rounded-lg flex flex-col items-center justify-center p-4">
                <h3 className="text-lg text-gray-600 font-medium mb-2">Map View</h3>
                <p className="text-sm text-gray-500 text-center max-w-xs mb-4">
                    Configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable interactive maps with property markers
                </p>
                <div className="bg-white rounded-lg p-4 max-w-sm w-full">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Properties in view:</p>
                    {properties.slice(0, 5).map((p) => (
                        <p key={p.property_id} className="text-sm text-gray-500">
                            • {typeof p.address === 'string' ? p.address : `${p.address?.street}, ${p.address?.city}`} - ${p.price.toLocaleString()}
                        </p>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full min-h-[400px]">
            <div ref={mapRef} className="w-full h-full min-h-[400px] rounded-lg" />

            {selectedProperty && (
                <div className="absolute bottom-4 left-4 right-4 max-w-xs bg-white rounded-lg shadow-lg p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-lg font-semibold text-gray-900">
                                ${selectedProperty.price.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                                {typeof selectedProperty.address === 'string'
                                    ? selectedProperty.address
                                    : `${selectedProperty.address?.street}, ${selectedProperty.address?.city}`}
                            </p>
                            <p className="text-sm text-gray-700">
                                {selectedProperty.bedrooms} beds • {selectedProperty.bathrooms} baths
                            </p>
                        </div>
                        <button
                            onClick={() => setSelectedProperty(null)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                            <X className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

