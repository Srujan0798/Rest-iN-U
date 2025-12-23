'use client';
import { TrendingUp, TrendingDown, Home, DollarSign } from 'lucide-react';

const marketStats = [
    { label: 'Median Home Price', value: '$485,000', change: '+5.2%', up: true },
    { label: 'Homes for Sale', value: '12,456', change: '-3.1%', up: false },
    { label: 'Days on Market', value: '28', change: '-12%', up: true },
    { label: 'Price per Sq Ft', value: '$285', change: '+8.4%', up: true },
];

const neighborhoodSpotlight = [
    { name: 'Brooklyn Heights', medianPrice: 950000, inventory: 145, trend: 'up', photo: 'https://picsum.photos/400/200?random=30' },
    { name: 'Williamsburg', medianPrice: 825000, inventory: 203, trend: 'up', photo: 'https://picsum.photos/400/200?random=31' },
    { name: 'Upper East Side', medianPrice: 1250000, inventory: 178, trend: 'down', photo: 'https://picsum.photos/400/200?random=32' },
    { name: 'Park Slope', medianPrice: 1100000, inventory: 89, trend: 'up', photo: 'https://picsum.photos/400/200?random=33' },
];

const recentSales = [
    { address: '123 Main St, Brooklyn', price: 525000, soldDate: 'Dec 15, 2025', daysOnMarket: 12 },
    { address: '456 Park Ave, Manhattan', price: 1250000, soldDate: 'Dec 14, 2025', daysOnMarket: 28 },
    { address: '789 Broadway, Queens', price: 425000, soldDate: 'Dec 13, 2025', daysOnMarket: 45 },
    { address: '321 5th Ave, Brooklyn', price: 675000, soldDate: 'Dec 12, 2025', daysOnMarket: 8 },
];

export default function MarketInsightsPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Market Insights</h1>
                <p className="text-gray-600 mb-8">
                    Real-time market data for New York Metro Area
                </p>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {marketStats.map((stat, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-md p-5 text-center">
                            <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-gray-500 mb-2">{stat.label}</p>
                            <div className="flex items-center justify-center gap-1">
                                {stat.up ? (
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                ) : (
                                    <TrendingDown className="w-4 h-4 text-red-600" />
                                )}
                                <span className={`text-sm ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                                    {stat.change} YoY
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Neighborhood Spotlight */}
                    <div className="md:col-span-2 bg-white rounded-xl shadow-md p-5">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Neighborhood Spotlight</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {neighborhoodSpotlight.map((n, i) => (
                                <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <img src={n.photo} alt={n.name} className="w-full h-28 object-cover" />
                                    <div className="p-3">
                                        <p className="font-semibold text-gray-900">{n.name}</p>
                                        <div className="flex justify-between mt-2">
                                            <div>
                                                <p className="text-xs text-gray-500">Median Price</p>
                                                <p className="font-semibold">${n.medianPrice.toLocaleString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">Inventory</p>
                                                <p className="font-semibold">{n.inventory} homes</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Sales */}
                    <div className="bg-white rounded-xl shadow-md p-5">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales</h2>
                        {recentSales.map((sale, i) => (
                            <div key={i} className={`py-3 ${i < recentSales.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                <p className="font-medium text-gray-900 truncate">{sale.address}</p>
                                <div className="flex justify-between mt-1">
                                    <span className="text-sm font-semibold text-green-600">
                                        ${sale.price.toLocaleString()}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {sale.daysOnMarket} days
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">{sale.soldDate}</p>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="md:col-span-3 bg-blue-600 rounded-xl shadow-md p-8 text-center text-white">
                        <h2 className="text-xl font-semibold mb-2">
                            Want personalized market insights?
                        </h2>
                        <p className="mb-6 opacity-90">
                            Get a custom report for your neighborhood and property type
                        </p>
                        <button className="bg-white text-blue-600 font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                            Get Free Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

