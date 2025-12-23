'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bed, Bath, Ruler, PawPrint, Car } from 'lucide-react';

const mockRentals = [
    { id: '1', address: '100 East 42nd St, New York, NY', rent: 2800, beds: 1, baths: 1, sqft: 750, petFriendly: true, parking: true, available: 'Now', photo: 'https://picsum.photos/400/300?random=20' },
    { id: '2', address: '250 West 57th St, New York, NY', rent: 4200, beds: 2, baths: 2, sqft: 1100, petFriendly: false, parking: true, available: 'Jan 1', photo: 'https://picsum.photos/400/300?random=21' },
    { id: '3', address: '75 Park Place, Brooklyn, NY', rent: 2200, beds: 1, baths: 1, sqft: 650, petFriendly: true, parking: false, available: 'Now', photo: 'https://picsum.photos/400/300?random=22' },
    { id: '4', address: '180 Broadway, Manhattan, NY', rent: 5500, beds: 3, baths: 2, sqft: 1500, petFriendly: true, parking: true, available: 'Feb 1', photo: 'https://picsum.photos/400/300?random=23' },
    { id: '5', address: '500 Grand St, Brooklyn, NY', rent: 1900, beds: 0, baths: 1, sqft: 450, petFriendly: false, parking: false, available: 'Now', photo: 'https://picsum.photos/400/300?random=24' },
    { id: '6', address: '320 5th Ave, Manhattan, NY', rent: 6200, beds: 3, baths: 3, sqft: 1800, petFriendly: true, parking: true, available: 'Jan 15', photo: 'https://picsum.photos/400/300?random=25' },
];

export default function RentPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [maxRent, setMaxRent] = useState('');
    const [beds, setBeds] = useState('');
    const [petFriendly, setPetFriendly] = useState('');

    const filteredRentals = mockRentals.filter((r) => {
        if (search && !r.address.toLowerCase().includes(search.toLowerCase())) return false;
        if (maxRent && r.rent > parseInt(maxRent)) return false;
        if (beds && r.beds < parseInt(beds)) return false;
        if (petFriendly === 'yes' && !r.petFriendly) return false;
        return true;
    });

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Rentals</h1>
                <p className="text-gray-600 mb-6">Find apartments and homes for rent</p>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by location..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-w-[240px]"
                        />
                    </div>
                    <select
                        value={maxRent}
                        onChange={(e) => setMaxRent(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                        <option value="">Max Rent</option>
                        <option value="2000">$2,000</option>
                        <option value="3000">$3,000</option>
                        <option value="4000">$4,000</option>
                        <option value="5000">$5,000</option>
                    </select>
                    <select
                        value={beds}
                        onChange={(e) => setBeds(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                        <option value="">Bedrooms</option>
                        <option value="0">Studio</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                    </select>
                    <select
                        value={petFriendly}
                        onChange={(e) => setPetFriendly(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                        <option value="">Pet Friendly</option>
                        <option value="yes">Yes</option>
                    </select>
                </div>

                {/* Results */}
                <p className="text-sm text-gray-500 mb-4">{filteredRentals.length} rentals found</p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRentals.map((rental) => (
                        <div
                            key={rental.id}
                            onClick={() => router.push(`/property/${rental.id}`)}
                            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                        >
                            <img src={rental.photo} alt={rental.address} className="w-full h-44 object-cover" />
                            <div className="p-4">
                                <p className="text-xl font-bold text-blue-600">
                                    ${rental.rent.toLocaleString()}<span className="text-sm text-gray-500 font-normal">/mo</span>
                                </p>
                                <p className="text-sm text-gray-500 mb-3 truncate">{rental.address}</p>
                                <div className="flex gap-4 mb-3 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <Bed className="w-4 h-4 text-gray-400" />
                                        {rental.beds === 0 ? 'Studio' : `${rental.beds} bd`}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Bath className="w-4 h-4 text-gray-400" />
                                        {rental.baths} ba
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Ruler className="w-4 h-4 text-gray-400" />
                                        {rental.sqft} sqft
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${rental.available === 'Now' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {rental.available === 'Now' ? 'Available Now' : `Avail ${rental.available}`}
                                    </span>
                                    {rental.petFriendly && (
                                        <span className="border border-gray-300 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                            <PawPrint className="w-3 h-3" /> Pets
                                        </span>
                                    )}
                                    {rental.parking && (
                                        <span className="border border-gray-300 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                            <Car className="w-3 h-3" /> Parking
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredRentals.length === 0 && (
                    <div className="text-center py-16">
                        <h3 className="text-lg font-medium text-gray-600 mb-2">No rentals match your criteria</h3>
                        <button
                            onClick={() => { setSearch(''); setMaxRent(''); setBeds(''); setPetFriendly(''); }}
                            className="mt-4 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

