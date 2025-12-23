'use client';
import { useState } from 'react';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';

const mockListings = [
    { id: '1', address: '123 Main St, New York, NY', price: 485000, status: 'ACTIVE', beds: 3, baths: 2, views: 234, inquiries: 12, daysOnMarket: 15, photo: 'https://picsum.photos/100/80?random=1' },
    { id: '2', address: '456 Park Ave, Brooklyn, NY', price: 725000, status: 'ACTIVE', beds: 4, baths: 3, views: 456, inquiries: 23, daysOnMarket: 8, photo: 'https://picsum.photos/100/80?random=2' },
    { id: '3', address: '789 Broadway, Manhattan, NY', price: 550000, status: 'PENDING', beds: 2, baths: 2, views: 678, inquiries: 34, daysOnMarket: 45, photo: 'https://picsum.photos/100/80?random=3' },
    { id: '4', address: '321 5th Ave, New York, NY', price: 1200000, status: 'ACTIVE', beds: 5, baths: 4, views: 123, inquiries: 5, daysOnMarket: 3, photo: 'https://picsum.photos/100/80?random=4' },
    { id: '5', address: '555 Ocean Dr, Boston, MA', price: 680000, status: 'SOLD', beds: 4, baths: 3, views: 890, inquiries: 45, daysOnMarket: 30, photo: 'https://picsum.photos/100/80?random=5' },
];

const statusColors: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    SOLD: 'bg-gray-200 text-gray-700',
};

export default function ListingsManager() {
    const [listings] = useState(mockListings);

    return (
        <div className="bg-white rounded-xl shadow-md p-5">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">My Listings</h3>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    Add New Listing
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Property</th>
                            <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">Price</th>
                            <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Status</th>
                            <th className="text-center py-3 px-2 text-sm font-medium text-gray-600">Beds/Baths</th>
                            <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">Views</th>
                            <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">Inquiries</th>
                            <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">Days</th>
                            <th className="py-3 px-2 text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listings.map((listing) => (
                            <tr key={listing.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-2">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={listing.photo}
                                            alt=""
                                            className="w-14 h-10 object-cover rounded"
                                        />
                                        <span className="text-sm text-gray-900">{listing.address}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-2 text-right font-semibold text-gray-900">
                                    ${listing.price.toLocaleString()}
                                </td>
                                <td className="py-3 px-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[listing.status]}`}>
                                        {listing.status}
                                    </span>
                                </td>
                                <td className="py-3 px-2 text-center text-sm text-gray-700">
                                    {listing.beds}/{listing.baths}
                                </td>
                                <td className="py-3 px-2 text-right text-sm text-gray-700">{listing.views}</td>
                                <td className="py-3 px-2 text-right text-sm text-gray-700">{listing.inquiries}</td>
                                <td className="py-3 px-2 text-right text-sm text-gray-700">{listing.daysOnMarket}</td>
                                <td className="py-3 px-2">
                                    <div className="flex gap-1">
                                        <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                                            <Eye className="w-4 h-4 text-gray-500" />
                                        </button>
                                        <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                                            <Edit className="w-4 h-4 text-gray-500" />
                                        </button>
                                        <button className="p-1.5 hover:bg-red-50 rounded transition-colors">
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

