'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Bed, Bath, Square, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface Recommendation {
    property_id: string;
    score: number;
    explanation: string;
    source: string;
}

interface Property {
    id: string;
    title: string;
    price: number;
    location: string;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    imageUrl: string;
}

interface RecommendedPropertiesProps {
    limit?: number;
    userId?: string;
}

export function RecommendedProperties({ limit = 10, userId }: RecommendedPropertiesProps) {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecommendations();
    }, [userId, limit]);

    const fetchRecommendations = async () => {
        try {
            // Fetch recommendations from AI/ML backend
            const response = await fetch('/api/ai-ml/recommendations/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId || 'current-user',
                    limit,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setRecommendations(data.data.recommendations);

                // Fetch property details for each recommendation
                const propertyIds = data.data.recommendations.map((r: Recommendation) => r.property_id);
                await fetchPropertyDetails(propertyIds);
            }
        } catch (error) {
            console.error('Failed to fetch recommendations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPropertyDetails = async (propertyIds: string[]) => {
        try {
            const response = await fetch('/api/properties/batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: propertyIds }),
            });

            const data = await response.json();
            setProperties(data.properties || []);
        } catch (error) {
            console.error('Failed to fetch property details:', error);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <div className="h-48 bg-muted" />
                        <CardHeader>
                            <div className="h-6 bg-muted rounded" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="h-4 bg-muted rounded" />
                                <div className="h-4 bg-muted rounded w-2/3" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (recommendations.length === 0) {
        return (
            <Card>
                <CardContent className="p-12 text-center">
                    <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Recommendations Yet</h3>
                    <p className="text-muted-foreground">
                        Start browsing properties to get personalized recommendations
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((rec) => {
                    const property = properties.find((p) => p.id === rec.property_id);

                    if (!property) return null;

                    return (
                        <Card key={rec.property_id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-48 bg-muted">
                                {property.imageUrl && (
                                    <img
                                        src={property.imageUrl}
                                        alt={property.title}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                                <div className="absolute top-3 right-3 bg-primary px-3 py-1 rounded-full text-white text-sm font-semibold">
                                    {Math.round(rec.score * 100)}% Match
                                </div>
                            </div>

                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                                        <p className="text-2xl font-bold text-primary mt-1">
                                            ₹{property.price.toLocaleString()}
                                        </p>
                                    </div>
                                    <Button variant="ghost" size="sm" style={{ padding: '0.5rem' }}>
                                        <Heart className="h-5 w-5" />
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {property.location}
                                </div>

                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center">
                                        <Bed className="h-4 w-4 mr-1" />
                                        {property.bedrooms} Beds
                                    </div>
                                    <div className="flex items-center">
                                        <Bath className="h-4 w-4 mr-1" />
                                        {property.bathrooms} Baths
                                    </div>
                                    <div className="flex items-center">
                                        <Square className="h-4 w-4 mr-1" />
                                        {property.squareFeet} sqft
                                    </div>
                                </div>

                                <div className="pt-2 border-t">
                                    <p className="text-xs text-muted-foreground italic">
                                        {rec.explanation}
                                    </p>
                                </div>
                            </CardContent>

                            <CardFooter>
                                <Link href={`/property/${property.id}`} className="w-full">
                                    <Button className="w-full">View Details</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
