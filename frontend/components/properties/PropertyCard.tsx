import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, MapPin, Bed, Bath, Square, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, Badge, Button } from '../ui';

export interface Property {
  id: string;
  title: string;
  price: number;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet?: number;
  photos?: { url: string; thumbnailUrl?: string }[];
  vastuAnalysis?: { overallScore: number; grade?: string };
  isFavorited?: boolean;
  propertyType?: string;
}

interface PropertyCardProps {
  property: Property;
  className?: string;
  onToggleFavorite?: (id: string) => void;
}

export function PropertyCard({ property, className = '', onToggleFavorite }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = property.photos && property.photos.length > 0
    ? property.photos
    : [{ url: '/placeholder-property.jpg' }];

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Vastu score color mapping
  const getVastuColor = (score?: number) => {
    if (!score) return 'default';
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  return (
    <Link href={`/properties/${property.id}`} className={`block h-full ${className}`}>
      <Card
        className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl group"
        padding="none"
      >
        {/* Image Carousel */}
        <div
          className="relative aspect-[4/3] bg-gray-100 overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src={images[currentImageIndex].url}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Navigation Arrows */}
          {images.length > 1 && isHovered && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow-md transition-all text-gray-800"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow-md transition-all text-gray-800"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {property.propertyType && (
              <Badge variant="default" className="bg-white/90 shadow-sm backdrop-blur-sm">
                {property.propertyType.replace('_', ' ')}
              </Badge>
            )}
            {property.vastuAnalysis?.overallScore && (
              <Badge variant={getVastuColor(property.vastuAnalysis.overallScore)} className="shadow-sm backdrop-blur-sm">
                Vastu: {property.vastuAnalysis.overallScore}/100
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite?.(property.id);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm backdrop-blur-sm transition-all text-gray-600 hover:text-red-500"
          >
            <Heart size={18} fill={property.isFavorited ? "currentColor" : "none"} className={property.isFavorited ? "text-red-500" : ""} />
          </button>

          {/* Image dots */}
          {images.length > 1 && isHovered && (
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {images.slice(0, 5).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
              {property.title}
            </h3>
            <span className="text-lg font-bold text-amber-600">
              {formatPrice(property.price)}
            </span>
          </div>

          <div className="flex items-center text-gray-500 text-sm mb-4">
            <MapPin size={14} className="mr-1" />
            <span className="line-clamp-1">
              {property.streetAddress}, {property.city}, {property.state} {property.zipCode}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 py-3 border-t border-gray-100 mt-auto">
            <div className="flex items-center gap-1.5 text-gray-700">
              <Bed size={16} className="text-gray-400" />
              <span className="font-medium">{property.bedrooms}</span>
              <span className="text-xs text-gray-500">Beds</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-700">
              <Bath size={16} className="text-gray-400" />
              <span className="font-medium">{property.bathrooms}</span>
              <span className="text-xs text-gray-500">Baths</span>
            </div>
            {property.squareFeet && (
              <div className="flex items-center gap-1.5 text-gray-700">
                <Square size={16} className="text-gray-400" />
                <span className="font-medium">{property.squareFeet.toLocaleString()}</span>
                <span className="text-xs text-gray-500">Sq Ft</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
