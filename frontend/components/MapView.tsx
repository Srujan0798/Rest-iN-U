'use client';
import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

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
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    minHeight: 400,
                    bgcolor: 'grey.200',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    Map View
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ maxWidth: 300 }}>
                    Configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable interactive maps with property markers
                </Typography>
                <Box sx={{ mt: 2, p: 2, bgcolor: 'white', borderRadius: 1, maxWidth: 400 }}>
                    <Typography variant="body2" fontWeight={600}>Properties in view:</Typography>
                    {properties.slice(0, 5).map((p) => (
                        <Typography key={p.property_id} variant="body2" color="text.secondary">
                            • {typeof p.address === 'string' ? p.address : `${p.address?.street}, ${p.address?.city}`} - ${p.price.toLocaleString()}
                        </Typography>
                    ))}
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ position: 'relative', width: '100%', height: '100%', minHeight: 400 }}>
            <Box ref={mapRef} sx={{ width: '100%', height: '100%', minHeight: 400, borderRadius: 2 }} />

            {selectedProperty && (
                <Card sx={{ position: 'absolute', bottom: 16, left: 16, right: 16, maxWidth: 300 }}>
                    <CardContent sx={{ pb: '12px !important' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                                <Typography variant="h6" fontWeight={600}>${selectedProperty.price.toLocaleString()}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {typeof selectedProperty.address === 'string'
                                        ? selectedProperty.address
                                        : `${selectedProperty.address?.street}, ${selectedProperty.address?.city}`}
                                </Typography>
                                <Typography variant="body2">
                                    {selectedProperty.bedrooms} beds • {selectedProperty.bathrooms} baths
                                </Typography>
                            </Box>
                            <IconButton size="small" onClick={() => setSelectedProperty(null)}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}
