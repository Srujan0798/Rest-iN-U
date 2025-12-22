'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function LandEnergyPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [formData, setFormData] = useState({
        latitude: 37.7749,
        longitude: -122.4194,
        historicalUse: [] as string[],
        ancientTrees: 0,
        waterSources: false,
    });

    const historicalUses = ['forest', 'farm', 'temple', 'monastery', 'garden', 'cemetery', 'hospital', 'unknown'];

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:4000/api/v1/land-energy/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            setResult(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const toggleUse = (use: string) => {
        setFormData(prev => ({
            ...prev,
            historicalUse: prev.historicalUse.includes(use)
                ? prev.historicalUse.filter(u => u !== use)
                : [...prev.historicalUse, use],
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-700">
            {/* Header */}
            <div className="py-12 px-4 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur mb-6">
                    <span className="text-5xl">🌍</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-3">Land Energy Analysis</h1>
                <p className="text-white/70 max-w-lg mx-auto">
                    Bhumi Shuddhi - Ancient analysis of land energy, ley lines, and cosmic alignment
                </p>
            </div>

            <div className="max-w-4xl mx-auto px-4 pb-12">
                {!result ? (
                    <div className="space-y-6">
                        {/* Location */}
                        <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
                            <h2 className="text-xl font-semibold text-white mb-6">Location Coordinates</h2>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Latitude</label>
                                    <input
                                        type="number"
                                        step="0.0001"
                                        value={formData.latitude}
                                        onChange={e => setFormData({ ...formData, latitude: Number(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Longitude</label>
                                    <input
                                        type="number"
                                        step="0.0001"
                                        value={formData.longitude}
                                        onChange={e => setFormData({ ...formData, longitude: Number(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Historical Use */}
                        <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
                            <h2 className="text-xl font-semibold text-white mb-6">Known Historical Use</h2>
                            <div className="flex flex-wrap gap-3">
                                {historicalUses.map(use => (
                                    <button
                                        key={use}
                                        onClick={() => toggleUse(use)}
                                        className={`px-4 py-2 rounded-full capitalize transition ${formData.historicalUse.includes(use)
                                                ? 'bg-green-500 text-white'
                                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                                            }`}
                                    >
                                        {use}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
                            <h2 className="text-xl font-semibold text-white mb-6">Land Features</h2>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Ancient Trees Present</label>
                                    <input
                                        type="number"
                                        value={formData.ancientTrees}
                                        onChange={e => setFormData({ ...formData, ancientTrees: Number(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
                                        min={0}
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Natural Water Sources</label>
                                    <button
                                        onClick={() => setFormData({ ...formData, waterSources: !formData.waterSources })}
                                        className={`w-full px-4 py-3 rounded-lg transition ${formData.waterSources ? 'bg-green-500 text-white' : 'bg-white/10 text-white/70'
                                            }`}
                                    >
                                        {formData.waterSources ? '✓ Yes, present' : 'No'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition disabled:opacity-50"
                        >
                            {loading ? 'Analyzing Land Energy...' : 'Analyze Bhumi Energy 🌍'}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Overall Score */}
                        <div className="bg-white rounded-2xl p-8 text-center">
                            <div className="text-6xl mb-4">🌍</div>
                            <div className={`text-6xl font-bold ${getScoreColor(result.overallScore)}`}>
                                {result.overallScore}
                            </div>
                            <div className="text-2xl font-bold text-gray-700 mt-2">Land Energy Score</div>
                            <div className="mt-2 text-gray-500">Grade: {result.grade}</div>
                        </div>

                        {/* Historical Energy */}
                        <div className="bg-white rounded-2xl p-8">
                            <h3 className="text-xl font-semibold mb-6">📜 Historical Energy</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="text-center">
                                    <div className={`text-4xl font-bold ${getScoreColor(result.historical?.score || 70)}`}>
                                        {result.historical?.score || 70}
                                    </div>
                                    <div className="text-gray-500 text-sm mt-1">Historical Score</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Energy Impact</div>
                                    <div className="text-gray-800 font-medium">{result.historical?.impact || 'Neutral'}</div>
                                </div>
                            </div>
                            {result.historical?.purification?.length > 0 && (
                                <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                                    <div className="font-medium text-amber-800 mb-2">Recommended Purification:</div>
                                    <ul className="text-sm text-amber-700 space-y-1">
                                        {result.historical.purification.map((p: string, i: number) => (
                                            <li key={i}>• {p}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Geological */}
                        <div className="bg-white rounded-2xl p-8">
                            <h3 className="text-xl font-semibold mb-6">🗻 Geological Features</h3>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <div className="text-2xl font-bold text-blue-600">{result.geological?.leyLine}</div>
                                    <div className="text-xs text-gray-500">To Ley Line</div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {result.geological?.vortex ? '✓' : '✗'}
                                    </div>
                                    <div className="text-xs text-gray-500">Energy Vortex</div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <div className={`text-2xl font-bold ${getScoreColor(result.geological?.score || 70)}`}>
                                        {result.geological?.score}
                                    </div>
                                    <div className="text-xs text-gray-500">Geo Score</div>
                                </div>
                            </div>
                        </div>

                        {/* Natural Elements */}
                        <div className="bg-white rounded-2xl p-8">
                            <h3 className="text-xl font-semibold mb-6">🌳 Natural Elements</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-blue-50 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-blue-600">{result.water?.score}</div>
                                    <div className="text-xs text-blue-700">💧 Water</div>
                                </div>
                                <div className="p-4 bg-amber-50 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-amber-600">{result.soil?.score}</div>
                                    <div className="text-xs text-amber-700">🌾 Soil</div>
                                </div>
                                <div className="p-4 bg-green-50 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-green-600">{result.trees?.score}</div>
                                    <div className="text-xs text-green-700">🌳 Trees</div>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-purple-600">{result.cosmicAlignment?.score}</div>
                                    <div className="text-xs text-purple-700">✨ Cosmic</div>
                                </div>
                            </div>
                        </div>

                        {/* Purification Rituals */}
                        {result.purificationRituals?.length > 0 && (
                            <div className="bg-white rounded-2xl p-8">
                                <h3 className="text-xl font-semibold mb-6">🔥 Purification Rituals</h3>
                                <div className="space-y-4">
                                    {result.purificationRituals.map((ritual: any, i: number) => (
                                        <div key={i} className="p-4 bg-orange-50 rounded-xl">
                                            <div className="font-bold text-orange-900">{ritual.name}</div>
                                            <div className="text-sm text-orange-700 mt-1">{ritual.description}</div>
                                            <div className="flex gap-4 mt-2 text-xs text-orange-600">
                                                <span>⏱️ {ritual.duration}</span>
                                                <span>📅 {ritual.timing}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="text-center pt-4">
                            <button onClick={() => setResult(null)} className="text-white/70 hover:text-white">
                                ← Analyze Another Location
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
