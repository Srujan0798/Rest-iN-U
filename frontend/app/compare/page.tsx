'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ComparePage() {
    const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
    const [comparison, setComparison] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Mock properties for selection
    const availableProperties = [
        { id: '1', title: 'Modern Vastu Villa', address: '123 Main St, San Jose', price: 1250000, image: null },
        { id: '2', title: 'Dharmic Heights Condo', address: '456 Oak Ave, Palo Alto', price: 950000, image: null },
        { id: '3', title: 'Sacred Grove Estate', address: '789 Pine Rd, Mountain View', price: 1850000, image: null },
        { id: '4', title: 'Harmony Townhouse', address: '321 Elm Blvd, Sunnyvale', price: 875000, image: null },
    ];

    // Mock comparison data
    const mockComparison = {
        properties: [
            { id: '1', title: 'Modern Vastu Villa', price: 1250000, bedrooms: 4, bathrooms: 3, squareFeet: 2800, vastuScore: 85, climateRisk: 25, yearBuilt: 2019 },
            { id: '2', title: 'Dharmic Heights Condo', price: 950000, bedrooms: 3, bathrooms: 2, squareFeet: 1850, vastuScore: 78, climateRisk: 15, yearBuilt: 2021 },
        ],
        metrics: {
            price: { property1: 1250000, property2: 950000, winner: '2', difference: 300000 },
            vastuScore: { property1: 85, property2: 78, winner: '1', difference: 7 },
            climateRisk: { property1: 25, property2: 15, winner: '2', difference: 10 },
            size: { property1: 2800, property2: 1850, winner: '1', difference: 950 },
        },
        summary: {
            bestValue: 'Dharmic Heights Condo',
            bestVastu: 'Modern Vastu Villa',
            lowestRisk: 'Dharmic Heights Condo',
            recommendation: 'Dharmic Heights Condo offers better value and lower climate risk. Modern Vastu Villa has superior Vastu compliance.',
        },
    };

    const toggleProperty = (id: string) => {
        setSelectedProperties(prev => {
            if (prev.includes(id)) {
                return prev.filter(p => p !== id);
            }
            if (prev.length >= 3) {
                return prev;
            }
            return [...prev, id];
        });
    };

    const handleCompare = () => {
        if (selectedProperties.length < 2) return;
        setLoading(true);
        setTimeout(() => {
            setComparison(mockComparison);
            setLoading(false);
        }, 1000);
    };

    const getWinnerBadge = (winnerId: string, propId: string) => {
        if (winnerId === propId) {
            return <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Best</span>;
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-2">Compare Properties</h1>
                    <p className="text-white/70">Select 2-3 properties to compare side by side</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {!comparison ? (
                    <>
                        {/* Property Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {availableProperties.map(prop => (
                                <div
                                    key={prop.id}
                                    onClick={() => toggleProperty(prop.id)}
                                    className={`relative p-4 rounded-xl cursor-pointer transition ${selectedProperties.includes(prop.id)
                                            ? 'bg-blue-50 border-2 border-blue-500 shadow-md'
                                            : 'bg-white border-2 border-gray-200 hover:border-blue-300'
                                        }`}
                                >
                                    {selectedProperties.includes(prop.id) && (
                                        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                            {selectedProperties.indexOf(prop.id) + 1}
                                        </div>
                                    )}
                                    <div className="h-24 bg-gray-200 rounded-lg mb-3 flex items-center justify-center text-3xl">
                                        🏠
                                    </div>
                                    <h3 className="font-semibold text-gray-800 truncate">{prop.title}</h3>
                                    <p className="text-sm text-gray-500 truncate">{prop.address}</p>
                                    <p className="text-lg font-bold text-blue-600 mt-2">${prop.price.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>

                        <div className="text-center">
                            <p className="text-gray-500 mb-4">
                                {selectedProperties.length === 0 && 'Select at least 2 properties to compare'}
                                {selectedProperties.length === 1 && 'Select 1 more property'}
                                {selectedProperties.length >= 2 && `${selectedProperties.length} properties selected`}
                            </p>
                            <button
                                onClick={handleCompare}
                                disabled={selectedProperties.length < 2 || loading}
                                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {loading ? 'Comparing...' : 'Compare Properties'}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Comparison Results */}
                        <button
                            onClick={() => { setComparison(null); setSelectedProperties([]); }}
                            className="mb-6 text-blue-600 hover:underline"
                        >
                            ← Select different properties
                        </button>

                        {/* Side by Side Cards */}
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            {comparison.properties.map((prop: any) => (
                                <div key={prop.id} className="bg-white rounded-2xl shadow-md p-6">
                                    <div className="h-32 bg-gray-200 rounded-xl mb-4 flex items-center justify-center text-5xl">
                                        🏠
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-1">{prop.title}</h3>
                                    <p className="text-2xl font-bold text-blue-600">${prop.price.toLocaleString()}</p>
                                    <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                                        <div className="p-2 bg-gray-50 rounded-lg">
                                            <div className="text-lg font-bold">{prop.bedrooms}</div>
                                            <div className="text-xs text-gray-500">Beds</div>
                                        </div>
                                        <div className="p-2 bg-gray-50 rounded-lg">
                                            <div className="text-lg font-bold">{prop.bathrooms}</div>
                                            <div className="text-xs text-gray-500">Baths</div>
                                        </div>
                                        <div className="p-2 bg-gray-50 rounded-lg">
                                            <div className="text-lg font-bold">{prop.squareFeet}</div>
                                            <div className="text-xs text-gray-500">Sq Ft</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Metrics Comparison */}
                        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
                            <h3 className="text-xl font-semibold mb-6">Detailed Comparison</h3>
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left pb-3 text-gray-500">Metric</th>
                                        {comparison.properties.map((p: any) => (
                                            <th key={p.id} className="text-center pb-3">{p.title}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b">
                                        <td className="py-4 text-gray-600">💰 Price</td>
                                        {comparison.properties.map((p: any) => (
                                            <td key={p.id} className="py-4 text-center font-semibold">
                                                ${p.price.toLocaleString()}
                                                {getWinnerBadge(comparison.metrics.price.winner, p.id)}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-4 text-gray-600">🪷 Vastu Score</td>
                                        {comparison.properties.map((p: any) => (
                                            <td key={p.id} className="py-4 text-center font-semibold">
                                                {p.vastuScore}
                                                {getWinnerBadge(comparison.metrics.vastuScore.winner, p.id)}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-4 text-gray-600">🌍 Climate Risk</td>
                                        {comparison.properties.map((p: any) => (
                                            <td key={p.id} className="py-4 text-center font-semibold">
                                                {p.climateRisk}%
                                                {getWinnerBadge(comparison.metrics.climateRisk.winner, p.id)}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="border-b">
                                        <td className="py-4 text-gray-600">📐 Size</td>
                                        {comparison.properties.map((p: any) => (
                                            <td key={p.id} className="py-4 text-center font-semibold">
                                                {p.squareFeet.toLocaleString()} sqft
                                                {getWinnerBadge(comparison.metrics.size.winner, p.id)}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className="py-4 text-gray-600">📅 Year Built</td>
                                        {comparison.properties.map((p: any) => (
                                            <td key={p.id} className="py-4 text-center font-semibold">{p.yearBuilt}</td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Summary */}
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-md p-8 text-white">
                            <h3 className="text-xl font-semibold mb-6">📊 Our Recommendation</h3>
                            <div className="grid grid-cols-3 gap-6 mb-6">
                                <div className="text-center">
                                    <div className="text-3xl mb-2">💎</div>
                                    <div className="text-white/70 text-sm">Best Value</div>
                                    <div className="font-bold">{comparison.summary.bestValue}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl mb-2">🪷</div>
                                    <div className="text-white/70 text-sm">Best Vastu</div>
                                    <div className="font-bold">{comparison.summary.bestVastu}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl mb-2">🛡️</div>
                                    <div className="text-white/70 text-sm">Lowest Risk</div>
                                    <div className="font-bold">{comparison.summary.lowestRisk}</div>
                                </div>
                            </div>
                            <p className="text-white/90 text-center">{comparison.summary.recommendation}</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
