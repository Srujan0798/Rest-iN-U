'use client';
import { useState } from 'react';
import { Home, MapPin, DollarSign, TrendingUp, Info } from 'lucide-react';

export default function SellPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        address: '',
        propertyType: '',
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1500,
        yearBuilt: 2000,
        condition: 'GOOD',
    });
    const [estimate, setEstimate] = useState<number | null>(null);

    const handleGetEstimate = () => {
        // Mock valuation calculation
        const basePrice = formData.squareFeet * 250;
        const bedroomBonus = formData.bedrooms * 20000;
        const bathroomBonus = formData.bathrooms * 15000;
        const conditionMultiplier = formData.condition === 'EXCELLENT' ? 1.1 : formData.condition === 'GOOD' ? 1 : 0.85;
        const ageDeduction = Math.max(0, (2024 - formData.yearBuilt) * 500);

        const calculatedEstimate = Math.round((basePrice + bedroomBonus + bathroomBonus - ageDeduction) * conditionMultiplier);
        setEstimate(calculatedEstimate);
        setStep(2);
    };

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* Hero */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Sell Your Home</h1>
                    <p className="text-lg text-gray-600">
                        Get a free home valuation and connect with top agents
                    </p>
                </div>

                <div className="grid md:grid-cols-5 gap-6">
                    <div className="md:col-span-3">
                        {step === 1 ? (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-1 flex items-center gap-2">
                                    <Home className="w-6 h-6" />
                                    Property Details
                                </h2>
                                <p className="text-gray-500 mb-6">Tell us about your home to get an instant estimate</p>

                                <div className="relative mb-6">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Property Address"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                                    <select
                                        value={formData.propertyType}
                                        onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    >
                                        <option value="">Property Type</option>
                                        <option value="HOUSE">Single Family Home</option>
                                        <option value="CONDO">Condo</option>
                                        <option value="TOWNHOUSE">Townhouse</option>
                                        <option value="MULTI_FAMILY">Multi-Family</option>
                                    </select>
                                    <select
                                        value={formData.condition}
                                        onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    >
                                        <option value="EXCELLENT">Excellent</option>
                                        <option value="GOOD">Good</option>
                                        <option value="FAIR">Fair</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm text-gray-700 mb-2">Bedrooms: {formData.bedrooms}</label>
                                    <input
                                        type="range"
                                        value={formData.bedrooms}
                                        onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                                        min={1}
                                        max={6}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm text-gray-700 mb-2">Bathrooms: {formData.bathrooms}</label>
                                    <input
                                        type="range"
                                        value={formData.bathrooms}
                                        onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                                        min={1}
                                        max={5}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm text-gray-700 mb-2">Square Feet: {formData.squareFeet.toLocaleString()}</label>
                                    <input
                                        type="range"
                                        value={formData.squareFeet}
                                        onChange={(e) => setFormData({ ...formData, squareFeet: Number(e.target.value) })}
                                        min={500}
                                        max={5000}
                                        step={100}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                </div>

                                <input
                                    type="number"
                                    placeholder="Year Built"
                                    value={formData.yearBuilt}
                                    onChange={(e) => setFormData({ ...formData, yearBuilt: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none mb-6"
                                />

                                <button
                                    onClick={handleGetEstimate}
                                    className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Get Free Estimate
                                </button>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <TrendingUp className="w-6 h-6 text-green-600" />
                                    Your Home Estimate
                                </h2>

                                <div className="bg-green-50 rounded-xl py-8 px-4 text-center mb-6">
                                    <p className="text-4xl font-bold text-green-600">${estimate?.toLocaleString()}</p>
                                    <p className="text-gray-600 mt-1">Estimated Value</p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Range: ${Math.round((estimate || 0) * 0.95).toLocaleString()} - ${Math.round((estimate || 0) * 1.05).toLocaleString()}
                                    </p>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-blue-800">
                                        This is an automated estimate. Connect with an agent for a more accurate valuation.
                                    </p>
                                </div>

                                <h3 className="font-semibold text-gray-900 mb-3">Next Steps</h3>
                                <button className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors mb-3">
                                    Connect with a Local Agent
                                </button>
                                <button
                                    onClick={() => setStep(1)}
                                    className="w-full border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    Update Details
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-md p-5">
                            <h3 className="font-semibold text-gray-900 mb-4">Why Sell with Us?</h3>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <DollarSign className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-900">No Hidden Fees</p>
                                        <p className="text-sm text-gray-500">Transparent pricing</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-900">Market Insights</p>
                                        <p className="text-sm text-gray-500">Data-driven pricing</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Home className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-900">Expert Agents</p>
                                        <p className="text-sm text-gray-500">Top-rated professionals</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-5">
                            <h3 className="font-semibold text-gray-900 mb-2">Have Questions?</h3>
                            <p className="text-gray-500 text-sm mb-4">
                                Our team is here to help you every step of the way
                            </p>
                            <button className="w-full border border-gray-300 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-100 transition-colors">
                                Talk to an Expert
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
