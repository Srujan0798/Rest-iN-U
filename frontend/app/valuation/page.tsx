'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ValuationPage() {
    const searchParams = useSearchParams();
    const propertyId = searchParams?.get('property');

    const [valuation, setValuation] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        streetAddress: '',
        city: '',
        state: 'CA',
        zipCode: '',
        propertyType: 'HOUSE',
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 2000,
        yearBuilt: 2000,
        features: [] as string[],
        vastuCompliant: false,
    });

    useEffect(() => {
        if (propertyId) {
            setLoading(true);
            fetch(`http://localhost:4000/api/v1/valuation/property/${propertyId}`)
                .then(r => r.json())
                .then(res => {
                    setValuation(res.data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [propertyId]);

    const handleEstimate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:4000/api/v1/valuation/estimate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            setValuation(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const featureOptions = [
        'Pool', 'Solar Panels', 'Smart Home', 'Updated Kitchen',
        'Hardwood Floors', 'Central AC', 'Fireplace', 'Garage',
        'Garden', 'View', 'New Roof', 'ADU'
    ];

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 py-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur mb-6">
                        <span className="text-5xl">💰</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        AI Property Valuation
                    </h1>
                    <p className="text-white/70 max-w-xl mx-auto">
                        Powered by machine learning with Vastu score adjustments
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-6">Property Details</h2>
                        <form onSubmit={handleEstimate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input
                                    type="text"
                                    value={formData.streetAddress}
                                    onChange={e => setFormData({ ...formData, streetAddress: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="123 Main St"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                    <select
                                        value={formData.state}
                                        onChange={e => setFormData({ ...formData, state: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg bg-white"
                                    >
                                        <option>CA</option>
                                        <option>NY</option>
                                        <option>TX</option>
                                        <option>FL</option>
                                        <option>WA</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP</label>
                                    <input
                                        type="text"
                                        value={formData.zipCode}
                                        onChange={e => setFormData({ ...formData, zipCode: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                                    <select
                                        value={formData.propertyType}
                                        onChange={e => setFormData({ ...formData, propertyType: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg bg-white"
                                    >
                                        <option value="HOUSE">House</option>
                                        <option value="CONDO">Condo</option>
                                        <option value="TOWNHOUSE">Townhouse</option>
                                        <option value="VILLA">Villa</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Year Built</label>
                                    <input
                                        type="number"
                                        value={formData.yearBuilt}
                                        onChange={e => setFormData({ ...formData, yearBuilt: Number(e.target.value) })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Beds</label>
                                    <input
                                        type="number"
                                        value={formData.bedrooms}
                                        onChange={e => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Baths</label>
                                    <input
                                        type="number"
                                        step="0.5"
                                        value={formData.bathrooms}
                                        onChange={e => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sq Ft</label>
                                    <input
                                        type="number"
                                        value={formData.squareFeet}
                                        onChange={e => setFormData({ ...formData, squareFeet: Number(e.target.value) })}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                                <div className="flex flex-wrap gap-2">
                                    {featureOptions.map(f => (
                                        <button
                                            key={f}
                                            type="button"
                                            onClick={() => {
                                                const features = formData.features.includes(f)
                                                    ? formData.features.filter(x => x !== f)
                                                    : [...formData.features, f];
                                                setFormData({ ...formData, features });
                                            }}
                                            className={`px-3 py-1.5 rounded-full text-sm transition ${formData.features.includes(f)
                                                    ? 'bg-emerald-500 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <label className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.vastuCompliant}
                                    onChange={e => setFormData({ ...formData, vastuCompliant: e.target.checked })}
                                    className="w-5 h-5 text-amber-500 rounded"
                                />
                                <div>
                                    <div className="font-medium text-amber-800">🪷 Vastu Compliant</div>
                                    <div className="text-sm text-amber-600">Adds 5-15% to estimated value</div>
                                </div>
                            </label>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition disabled:opacity-50"
                            >
                                {loading ? 'Calculating...' : 'Get AI Estimate'}
                            </button>
                        </form>
                    </div>

                    {/* Results */}
                    <div className="space-y-6">
                        {valuation ? (
                            <>
                                {/* Main Value */}
                                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-8 text-white">
                                    <div className="text-sm opacity-80 mb-2">Estimated Value</div>
                                    <div className="text-5xl font-bold mb-2">
                                        {formatPrice(valuation.estimatedValue || valuation.estimate)}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm opacity-80">
                                        <span>Low: {formatPrice(valuation.lowEstimate || valuation.range?.low)}</span>
                                        <span>•</span>
                                        <span>High: {formatPrice(valuation.highEstimate || valuation.range?.high)}</span>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2">
                                        <div className="px-3 py-1 bg-white/20 rounded-full text-sm">
                                            {valuation.confidenceLevel || valuation.confidence}% Confidence
                                        </div>
                                    </div>
                                </div>

                                {/* Breakdown */}
                                {valuation.adjustments && (
                                    <div className="bg-white rounded-xl shadow-md p-6">
                                        <h3 className="font-semibold mb-4">Value Adjustments</h3>
                                        <div className="space-y-3">
                                            {Object.entries(valuation.adjustments).map(([key, value]: [string, any]) => (
                                                <div key={key} className="flex justify-between items-center">
                                                    <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                                    <span className={`font-medium ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {value >= 0 ? '+' : ''}{formatPrice(value as number)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Market Trends */}
                                {valuation.marketTrends && (
                                    <div className="bg-white rounded-xl shadow-md p-6">
                                        <h3 className="font-semibold mb-4">📈 Market Trends</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                                <div className="text-2xl font-bold text-green-600">
                                                    {valuation.marketTrends.appreciation || '+5.2'}%
                                                </div>
                                                <div className="text-sm text-gray-500">YoY Appreciation</div>
                                            </div>
                                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                                <div className="text-2xl font-bold text-blue-600">
                                                    {valuation.marketTrends.daysOnMarket || 28}
                                                </div>
                                                <div className="text-sm text-gray-500">Avg Days on Market</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Comparables */}
                                {valuation.comparables && (
                                    <div className="bg-white rounded-xl shadow-md p-6">
                                        <h3 className="font-semibold mb-4">🏘️ Comparable Sales</h3>
                                        <div className="text-sm text-gray-500">
                                            Based on {valuation.comparablesUsed || valuation.comparables.length} recent sales
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-white rounded-xl shadow-md p-8 text-center">
                                <div className="text-6xl mb-4">💰</div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    Enter Property Details
                                </h3>
                                <p className="text-gray-500">
                                    Our AI will analyze market data, comparables, and Vastu factors
                                    to estimate your property's value
                                </p>
                            </div>
                        )}

                        {/* Back Link */}
                        {propertyId && (
                            <div className="text-center">
                                <Link href={`/property/${propertyId}`} className="text-emerald-600 hover:underline">
                                    ← Back to Property
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
