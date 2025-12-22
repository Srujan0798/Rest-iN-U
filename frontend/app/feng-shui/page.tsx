'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function FengShuiPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [formData, setFormData] = useState({
        facing: 'SOUTH',
        yearBuilt: 2020,
    });

    const directions = ['NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTHEAST', 'NORTHWEST', 'SOUTHEAST', 'SOUTHWEST'];

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:4000/api/v1/fengshui/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            setResult(data.data);
            setStep(2);
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

    const getElementColor = (element: string) => {
        const colors: Record<string, string> = {
            Wood: 'bg-green-500', Fire: 'bg-red-500', Earth: 'bg-yellow-600',
            Metal: 'bg-gray-400', Water: 'bg-blue-500',
        };
        return colors[element] || 'bg-gray-500';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-rose-800 to-orange-700">
            {/* Header */}
            <div className="py-12 px-4 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur mb-6">
                    <span className="text-5xl">☯️</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-3">Feng Shui Analysis</h1>
                <p className="text-white/70 max-w-lg mx-auto">
                    Ancient Chinese art of harmonizing with surroundings for prosperity and wellbeing
                </p>
            </div>

            <div className="max-w-4xl mx-auto px-4 pb-12">
                {step === 1 && (
                    <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
                        <h2 className="text-xl font-semibold text-white mb-6">Property Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-white/70 text-sm mb-2">Property Facing Direction</label>
                                <select
                                    value={formData.facing}
                                    onChange={e => setFormData({ ...formData, facing: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
                                >
                                    {directions.map(d => <option key={d} value={d} className="text-gray-900">{d}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-white/70 text-sm mb-2">Year Built</label>
                                <input
                                    type="number"
                                    value={formData.yearBuilt}
                                    onChange={e => setFormData({ ...formData, yearBuilt: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="w-full mt-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-orange-600 transition disabled:opacity-50"
                        >
                            {loading ? 'Analyzing Chi Flow...' : 'Analyze Feng Shui ☯️'}
                        </button>
                    </div>
                )}

                {step === 2 && result && (
                    <div className="space-y-6">
                        {/* Overall Score */}
                        <div className="bg-white rounded-2xl p-8 text-center">
                            <div className={`text-6xl font-bold ${getScoreColor(result.overallScore)}`}>
                                {result.overallScore}
                            </div>
                            <div className="text-2xl font-bold text-gray-700 mt-2">Overall Feng Shui Score</div>
                            <div className="mt-2 text-gray-500">Grade: {result.grade}</div>
                        </div>

                        {/* Bagua Analysis */}
                        <div className="bg-white rounded-2xl p-8">
                            <h3 className="text-xl font-semibold mb-6">🗺️ Bagua Map Analysis</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {result.baguaAnalysis?.map((area: any, i: number) => (
                                    <div key={i} className={`p-4 rounded-xl ${area.score >= 70 ? 'bg-green-50' : area.score >= 50 ? 'bg-yellow-50' : 'bg-red-50'}`}>
                                        <div className="text-2xl font-bold text-gray-900">{area.score}</div>
                                        <div className="font-medium text-gray-700">{area.area}</div>
                                        <div className="text-sm text-gray-500">{area.element}</div>
                                        <div className="flex gap-1 mt-2">
                                            {area.colors.map((c: string) => (
                                                <span key={c} className="text-xs px-2 py-0.5 bg-gray-200 rounded">{c}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Five Elements */}
                        <div className="bg-white rounded-2xl p-8">
                            <h3 className="text-xl font-semibold mb-6">🔥 Five Elements Balance</h3>
                            <div className="space-y-4">
                                {['wood', 'fire', 'earth', 'metal', 'water'].map(element => (
                                    <div key={element} className="flex items-center gap-4">
                                        <div className="w-20 capitalize text-gray-700 font-medium">{element}</div>
                                        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${getElementColor(element.charAt(0).toUpperCase() + element.slice(1))} transition-all`}
                                                style={{ width: `${result.fiveElements?.[element] || 50}%` }}
                                            />
                                        </div>
                                        <div className="w-12 text-right text-gray-600">
                                            {result.fiveElements?.[element] || 50}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                                <div className="font-medium text-amber-800">Balance Status</div>
                                <div className="text-amber-700">{result.fiveElements?.balance || 'Analyzing...'}</div>
                            </div>
                        </div>

                        {/* Chi Flow */}
                        <div className="bg-white rounded-2xl p-8">
                            <h3 className="text-xl font-semibold mb-6">🌊 Chi Flow Analysis</h3>
                            <div className="text-4xl font-bold text-center mb-4">
                                <span className={getScoreColor(result.chiFlow?.score || 70)}>
                                    {result.chiFlow?.score || 70}
                                </span>
                                <span className="text-gray-400 text-lg ml-2">/ 100</span>
                            </div>
                            {result.chiFlow?.blockedAreas?.length > 0 && (
                                <div className="mt-4">
                                    <div className="text-sm font-medium text-red-600 mb-2">Blocked Areas:</div>
                                    <ul className="space-y-1">
                                        {result.chiFlow.blockedAreas.map((area: string, i: number) => (
                                            <li key={i} className="text-gray-600">• {area}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Recommendations */}
                        <div className="bg-white rounded-2xl p-8">
                            <h3 className="text-xl font-semibold mb-6">💡 Recommendations</h3>
                            <div className="space-y-4">
                                {result.recommendations?.map((rec: any, i: number) => (
                                    <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                                        <div className={`px-2 py-1 text-xs font-bold rounded ${rec.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                                                rec.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                            }`}>
                                            {rec.priority}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">{rec.category}</div>
                                            <div className="text-gray-600 text-sm">{rec.description}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="text-center pt-4">
                            <button onClick={() => { setStep(1); setResult(null); }} className="text-white/70 hover:text-white">
                                ← Analyze Another Property
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
