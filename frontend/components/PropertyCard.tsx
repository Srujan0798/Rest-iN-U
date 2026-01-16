'use client';
import { Bed, Bath, Ruler, Heart } from 'lucide-react';
import Image from 'next/image';

interface PropertyCardProps {
    property: {
        property_id: string;
        address: { street: string; city: string; state: string; zip: string } | string;
        price: number;
        bedrooms: number;
        bathrooms: number;
        square_feet: number | null;
        primary_photo: string | null;
        status?: string;
        days_on_market?: number;
    };
    isFavorited?: boolean;
    onFavoriteClick?: () => void;
    onClick?: () => void;
}

export default function PropertyCard({ property, isFavorited, onFavoriteClick, onClick }: PropertyCardProps) {
    const address = typeof property.address === 'string'
        ? property.address
        : `${property.address.street}, ${property.address.city}, ${property.address.state}`;

    return (
        <div className="property-card relative bg-white rounded-xl shadow-md overflow-hidden h-full group">
            <div onClick={onClick} className="cursor-pointer">
                <div className="relative h-48 w-full">
                    <Image
                        src={property.primary_photo || 'https://picsum.photos/400/300?random=1'}
                        alt={address}
                        fill
                        className="object-cover group-hover:opacity-95 transition-opacity"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88/7zfwAJdAP0A8n4gAAAAABJRU5ErkJggg=="
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {property.status === 'PENDING' && (
                        <span className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded z-10">
                            Pending
                        </span>
                    )}
                    {property.days_on_market && property.days_on_market <= 3 && (
                        <span className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded">
                            New
                        </span>
                    )}
                </div>
                <div className="p-4">
                    <p className="text-xl font-bold text-blue-600">
                        ${property.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{address}</p>
                    <div className="flex gap-4 mt-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                            <Bed className="w-4 h-4 text-gray-400" />
                            {property.bedrooms} beds
                        </span>
                        <span className="flex items-center gap-1">
                            <Bath className="w-4 h-4 text-gray-400" />
                            {property.bathrooms} baths
                        </span>
                        {property.square_feet && (
                            <span className="flex items-center gap-1">
                                <Ruler className="w-4 h-4 text-gray-400" />
                                {property.square_feet.toLocaleString()} sqft
                            </span>
                        )}
                    </div>
                </div>
            </div>
            {onFavoriteClick && (
                <button
                    onClick={(e) => { e.stopPropagation(); onFavoriteClick(); }}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                </button>
            )}
        </div>
    );
}

