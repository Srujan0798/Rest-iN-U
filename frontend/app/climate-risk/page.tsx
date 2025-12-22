'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ClimateRiskPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: 'CA',
        zip: '',
    });

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:4000/api/v1/climate/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    streetAddress: address.street,
                    city: address.city,
                    state: address.state,
                    zipCode: address.zip,
                }),
            });
            const data = await response.json();
            setResult(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (score: number) => {
        if (score <= 25) return { bg: 'bg-green-500', text: 'text-green-600', label: 'Low' };
        if (score <= 50) return { bg: 'bg-yellow-500', text: 'text-yellow-600', label: 'Moderate' };
        if (score <= 75) return { bg: 'bg-orange-500', text: 'text-orange-600', label: 'High' };
        return { bg: 'bg-red-500', text: 'text-red-600', label: 'Critical' };
    };

    const risks = result ? [
        { icon: '🌊', label: 'Flood Risk', current: result.floodRiskCurrent, future: result.floodRisk2050 },
        { icon: '🔥', label: 'Wildfire', current: result.wildfireRisk, future: result.wildfireRisk2050 },
        { icon: '🌀', label: 'Hurricane', current: result.hurricaneRisk, future: result.hurricaneRisk2050 },
        { icon: '🌍', label: 'Seismic', current: result.seismicRisk, future: result.seismicRisk },
        { icon: '🌡️', label: 'Heat Wave', current: result.heatRisk, future: result.heatRisk2050 },
        { icon: '☀️', label: 'Drought', current: result.droughtRisk, future: result.droughtRisk2050 },
    ] : [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700">
            {/* Header */}
            <div className="py-12 px-4 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur mb-6">
                    <span className="text-5xl">🌍</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-3">Climate Risk Analysis</h1>
                <p className="text-white/70 max-w-lg mx-auto">
                    100-year climate projections for flood, fire, and storm risks
                </p>
            </div>

            <div className="max-w-4xl mx-auto px-4 pb-12">
                {!result ? (
                    <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
                        <h2 className="text-xl font-semibold text-white mb-6">Enter Property Address</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-white/70 text-sm mb-1">Street Address</label>
                                <input
                                    type="text"
                                    value={address.street}
                                    onChange={e => setAddress({ ...address, street: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30"
                                    placeholder="123 Main Street"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-white/70 text-sm mb-1">City</label>
                                    <input
                                        type="text"
                                        value={address.city}
                                        onChange={e => setAddress({ ...address, city: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/70 text-sm mb-1">State</label>
                                    <select
                                        value={address.state}
                                        onChange={e => setAddress({ ...address, state: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
                                    >
                                        {['CA', 'NY', 'TX', 'FL', 'WA', 'AZ'].map(s => (
                                            <option key={s} value={s} className="text-gray-900">{s}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-white/70 text-sm mb-1">ZIP Code</label>
                                    <input
                                        type="text"
                                        value={address.zip}
                                        onChange={e => setAddress({ ...address, zip: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleAnalyze}
                                disabled={loading || !address.city}
                                className="w-full mt-4 py-4 bg-white text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition disabled:opacity-50"
                            >
                                {loading ? 'Analyzing Climate Data...' : 'Analyze Climate Risk'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Overall Score */}
                        <div className="bg-white rounded-2xl p-8 text-center">
                            <div className={`text-6xl font-bold ${getRiskColor(result.overallRiskScore).text}`}>
                                {result.overallRiskScore}
                            </div>
                            <div className="text-2xl font-bold text-gray-700 mt-2">Overall Risk Score</div>
                            <div className={`inline-block mt-4 px-6 py-2 rounded-full text-white font-semibold ${getRiskColor(result.overallRiskScore).bg}`}>
                                {getRiskColor(result.overallRiskScore).label} Risk
                            </div>
                        </div>

                        {/* Risk Breakdown */}
                        <div className="bg-white rounded-2xl p-8">
                            <h3 className="text-xl font-semibold mb-6">Risk Breakdown</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {risks.map((risk, i) => (
                                    <div key={i} className="p-4 bg-gray-50 rounded-xl">
                                        <div className="text-3xl mb-2">{risk.icon}</div>
                                        <div className="text-sm text-gray-500 mb-1">{risk.label}</div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xl font-bold ${getRiskColor(risk.current).text}`}>{risk.current}%</span>
                                            {risk.future !== undefined && risk.future !== risk.current && (
                                                <span className="text-sm text-gray-400">→ {risk.future}% by 2050</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Insurance Projections */}
                        {result.insuranceCurrent && (
                            <div className="bg-white rounded-2xl p-8">
                                <h3 className="text-xl font-semibold mb-6">💰 Insurance Projections</h3>
                                <div className="grid grid-cols-3 gap-6 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">${result.insuranceCurrent?.toLocaleString()}</div>
                                        <div className="text-sm text-gray-500">Current Annual</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-yellow-600">${result.insurance2030?.toLocaleString()}</div>
                                        <div className="text-sm text-gray-500">2030 Projected</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-red-600">${result.insurance2050?.toLocaleString()}</div>
                                        <div className="text-sm text-gray-500">2050 Projected</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Recommendations */}
                        {result.recommendations?.length > 0 && (
                            <div className="bg-white rounded-2xl p-8">
                                <h3 className="text-xl font-semibold mb-6">📋 Recommendations</h3>
                                <ul className="space-y-3">
                                    {result.recommendations.map((rec: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="text-teal-500 mt-1">✓</span>
                                            <span className="text-gray-600">{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="text-center pt-4">
                            <button onClick={() => setResult(null)} className="text-white/70 hover:text-white">
                                ← Analyze Another Address
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
