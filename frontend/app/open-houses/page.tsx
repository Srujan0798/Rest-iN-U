'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, Search } from 'lucide-react';

const mockOpenHouses = [
    {
        id: '1',
        date: '2025-12-21',
        startTime: '10:00 AM',
        endTime: '1:00 PM',
        property: { id: '1', address: '123 Main St, New York, NY', price: 485000, beds: 3, baths: 2, photo: 'https://picsum.photos/400/300?random=1' },
        agentName: 'Sarah Agent',
    },
    {
        id: '2',
        date: '2025-12-21',
        startTime: '2:00 PM',
        endTime: '5:00 PM',
        property: { id: '2', address: '456 Park Ave, Brooklyn, NY', price: 725000, beds: 4, baths: 3, photo: 'https://picsum.photos/400/300?random=2' },
        agentName: 'Mike Johnson',
    },
    {
        id: '3',
        date: '2025-12-22',
        startTime: '11:00 AM',
        endTime: '2:00 PM',
        property: { id: '3', address: '789 Broadway, Manhattan, NY', price: 550000, beds: 2, baths: 2, photo: 'https://picsum.photos/400/300?random=3' },
        agentName: 'Emily Davis',
    },
    {
        id: '4',
        date: '2025-12-22',
        startTime: '3:00 PM',
        endTime: '6:00 PM',
        property: { id: '4', address: '321 5th Ave, New York, NY', price: 1200000, beds: 5, baths: 4, photo: 'https://picsum.photos/400/300?random=4' },
        agentName: 'Sarah Agent',
    },
];

export default function OpenHousesPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    const filteredOpenHouses = mockOpenHouses.filter(oh => {
        if (search && !oh.property.address.toLowerCase().includes(search.toLowerCase())) return false;
        if (selectedDate && oh.date !== selectedDate) return false;
        return true;
    });

    // Group by date
    const groupedByDate = filteredOpenHouses.reduce((acc, oh) => {
        if (!acc[oh.date]) acc[oh.date] = [];
        acc[oh.date].push(oh);
        return acc;
    }, {} as Record<string, typeof mockOpenHouses>);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center gap-3 mb-6">
                    <Calendar className="w-10 h-10 text-blue-600" />
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Open Houses</h1>
                        <p className="text-gray-600">Find open houses near you this weekend</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by address or city..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-w-[280px]"
                        />
                    </div>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    {selectedDate && (
                        <button
                            onClick={() => setSelectedDate('')}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-100"
                        >
                            Clear Date
                        </button>
                    )}
                </div>

                {/* Open Houses by Date */}
                {Object.entries(groupedByDate).map(([date, openHouses]) => (
                    <div key={date} className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            {formatDate(date)}
                        </h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {openHouses.map((oh) => (
                                <div
                                    key={oh.id}
                                    onClick={() => router.push(`/property/${oh.property.id}`)}
                                    className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                                >
                                    <img src={oh.property.photo} alt={oh.property.address} className="w-full h-44 object-cover" />
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm font-semibold text-blue-600">
                                                {oh.startTime} - {oh.endTime}
                                            </span>
                                        </div>
                                        <p className="text-xl font-bold text-gray-900">${oh.property.price.toLocaleString()}</p>
                                        <div className="flex items-center gap-1 mb-2">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            <p className="text-sm text-gray-500 truncate">{oh.property.address}</p>
                                        </div>
                                        <p className="text-sm text-gray-700 mb-2">
                                            {oh.property.beds} beds • {oh.property.baths} baths
                                        </p>
                                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                            Hosted by {oh.agentName}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {Object.keys(groupedByDate).length === 0 && (
                    <div className="text-center py-16">
                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-600 mb-2">No open houses found</h3>
                        <p className="text-gray-500 mb-4">Try adjusting your search criteria</p>
                        <button
                            onClick={() => { setSearch(''); setSelectedDate(''); }}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

