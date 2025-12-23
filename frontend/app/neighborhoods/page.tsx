'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Search, Home, TrendingUp, GraduationCap } from 'lucide-react';

const neighborhoods = [
    { id: '1', name: 'Brooklyn Heights', city: 'Brooklyn', state: 'NY', medianPrice: 950000, listings: 145, rating: 9.2, photo: 'https://picsum.photos/400/250?random=40', tags: ['Walkable', 'Historic', 'Parks'] },
    { id: '2', name: 'Williamsburg', city: 'Brooklyn', state: 'NY', medianPrice: 825000, listings: 203, rating: 8.8, photo: 'https://picsum.photos/400/250?random=41', tags: ['Trendy', 'Nightlife', 'Arts'] },
    { id: '3', name: 'Upper East Side', city: 'Manhattan', state: 'NY', medianPrice: 1250000, listings: 178, rating: 9.0, photo: 'https://picsum.photos/400/250?random=42', tags: ['Upscale', 'Museums', 'Schools'] },
    { id: '4', name: 'Park Slope', city: 'Brooklyn', state: 'NY', medianPrice: 1100000, listings: 89, rating: 9.5, photo: 'https://picsum.photos/400/250?random=43', tags: ['Family', 'Parks', 'Brownstones'] },
    { id: '5', name: 'SoHo', city: 'Manhattan', state: 'NY', medianPrice: 2500000, listings: 67, rating: 8.5, photo: 'https://picsum.photos/400/250?random=44', tags: ['Shopping', 'Lofts', 'Dining'] },
    { id: '6', name: 'Astoria', city: 'Queens', state: 'NY', medianPrice: 650000, listings: 156, rating: 8.7, photo: 'https://picsum.photos/400/250?random=45', tags: ['Diverse', 'Food', 'Affordable'] },
    { id: '7', name: 'Chelsea', city: 'Manhattan', state: 'NY', medianPrice: 1800000, listings: 92, rating: 8.9, photo: 'https://picsum.photos/400/250?random=46', tags: ['Galleries', 'Highline', 'LGBTQ+'] },
    { id: '8', name: 'Tribeca', city: 'Manhattan', state: 'NY', medianPrice: 3200000, listings: 45, rating: 9.3, photo: 'https://picsum.photos/400/250?random=47', tags: ['Luxury', 'Celebrity', 'Lofts'] },
];

export default function NeighborhoodsPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');

    const filteredNeighborhoods = neighborhoods.filter(n =>
        n.name.toLowerCase().includes(search.toLowerCase()) ||
        n.city.toLowerCase().includes(search.toLowerCase()) ||
        n.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center gap-3 mb-4">
                    <MapPin className="w-10 h-10 text-blue-600" />
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Explore Neighborhoods</h1>
                        <p className="text-gray-600">Discover the perfect neighborhood for your lifestyle</p>
                    </div>
                </div>

                <div className="relative max-w-md mb-8">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search neighborhoods, cities, or features..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNeighborhoods.map((n) => (
                        <div
                            key={n.id}
                            onClick={() => router.push(`/search?neighborhood=${encodeURIComponent(n.name)}`)}
                            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                        >
                            <img src={n.photo} alt={n.name} className="w-full h-40 object-cover" />
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{n.name}</h3>
                                        <p className="text-sm text-gray-500">{n.city}, {n.state}</p>
                                    </div>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                        {n.rating}/10
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-green-600" />
                                        <div>
                                            <p className="text-xs text-gray-500">Median Price</p>
                                            <p className="text-sm font-semibold">${(n.medianPrice / 1000).toFixed(0)}K</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Home className="w-4 h-4 text-blue-600" />
                                        <div>
                                            <p className="text-xs text-gray-500">Listings</p>
                                            <p className="text-sm font-semibold">{n.listings}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1">
                                    {n.tags.map((tag) => (
                                        <span key={tag} className="px-2 py-0.5 border border-gray-300 rounded-full text-xs text-gray-600">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredNeighborhoods.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-gray-500">No neighborhoods match your search</p>
                    </div>
                )}
            </div>
        </div>
    );
}

