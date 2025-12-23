'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function VastuAnalysisPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [formData, setFormData] = useState({
        facing: 'EAST',
        entranceDirection: 'NORTH',
        plotShape: 'RECTANGULAR',
        roomConfigurations: [
            { name: 'Kitchen', direction: 'SOUTHEAST' },
            { name: 'MasterBedroom', direction: 'SOUTHWEST' },
            { name: 'LivingRoom', direction: 'NORTH' },
            { name: 'Bathroom', direction: 'NORTHWEST' },
        ],
    });

    const directions = ['NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTHEAST', 'NORTHWEST', 'SOUTHEAST', 'SOUTHWEST'];
    const rooms = ['Kitchen', 'MasterBedroom', 'LivingRoom', 'Bathroom', 'PrayerRoom', 'Study', 'DiningRoom', 'GuestRoom'];
    const shapes = ['RECTANGULAR', 'SQUARE', 'L_SHAPED', 'U_SHAPED', 'IRREGULAR'];

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:4000/api/v1/vastu/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            setResult(data.data);
            setStep(3);
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

    const getScoreBg = (score: number) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
            {/* Header */}
            <div className="py-12 px-4 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur mb-6">
                    <span className="text-5xl">🪷</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-3">Vastu Analysis</h1>
                <p className="text-white/70 max-w-lg mx-auto">
                    Analyze your property according to 5,000 years of Vedic architectural wisdom
                </p>
            </div>

            {/* Steps */}
            <div className="max-w-4xl mx-auto px-4 pb-12">
                <div className="flex items-center justify-center gap-4 mb-8">
                    {[1, 2, 3].map(s => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${s <= step ? 'bg-amber-500 text-white' : 'bg-white/20 text-white/50'
                                }`}>
                                {s}
                            </div>
                            {s < 3 && <div className={`w-16 h-1 ${s < step ? 'bg-amber-500' : 'bg-white/20'}`} />}
                        </div>
                    ))}
                </div>

                {/* Step 1: Basic Info */}
                {step === 1 && (
                    <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
                        <h2 className="text-xl font-semibold text-white mb-6">Property Orientation</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-white/70 text-sm mb-2">Property Facing</label>
                                <select
                                    value={formData.facing}
                                    onChange={e => setFormData({ ...formData, facing: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
                                >
                                    {directions.map(d => <option key={d} value={d} className="text-gray-900">{d}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-white/70 text-sm mb-2">Main Entrance</label>
                                <select
                                    value={formData.entranceDirection}
                                    onChange={e => setFormData({ ...formData, entranceDirection: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
                                >
                                    {directions.map(d => <option key={d} value={d} className="text-gray-900">{d}</option>)}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-white/70 text-sm mb-2">Plot Shape</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {shapes.map(shape => (
                                        <button
                                            key={shape}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, plotShape: shape })}
                                            className={`py-3 rounded-lg text-sm transition ${formData.plotShape === shape
                                                    ? 'bg-amber-500 text-white'
                                                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                                                }`}
                                        >
                                            {shape.replace('_', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setStep(2)}
                            className="w-full mt-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition"
                        >
                            Continue →
                        </button>
                    </div>
                )}

                {/* Step 2: Room Configuration */}
                {step === 2 && (
                    <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
                        <h2 className="text-xl font-semibold text-white mb-6">Room Configurations</h2>

                        <div className="space-y-4">
                            {formData.roomConfigurations.map((room, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <select
                                        value={room.name}
                                        onChange={e => {
                                            const updated = [...formData.roomConfigurations];
                                            updated[i].name = e.target.value;
                                            setFormData({ ...formData, roomConfigurations: updated });
                                        }}
                                        className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
                                    >
                                        {rooms.map(r => <option key={r} value={r} className="text-gray-900">{r}</option>)}
                                    </select>
                                    <select
                                        value={room.direction}
                                        onChange={e => {
                                            const updated = [...formData.roomConfigurations];
                                            updated[i].direction = e.target.value;
                                            setFormData({ ...formData, roomConfigurations: updated });
                                        }}
                                        className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
                                    >
                                        {directions.map(d => <option key={d} value={d} className="text-gray-900">{d}</option>)}
                                    </select>
                                    <button
                                        onClick={() => {
                                            const updated = formData.roomConfigurations.filter((_, j) => j !== i);
                                            setFormData({ ...formData, roomConfigurations: updated });
                                        }}
                                        className="w-10 h-10 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}

                            <button
                                onClick={() => {
                                    setFormData({
                                        ...formData,
                                        roomConfigurations: [...formData.roomConfigurations, { name: 'Study', direction: 'EAST' }],
                                    });
                                }}
                                className="w-full py-3 border border-dashed border-white/30 text-white/60 rounded-lg hover:bg-white/10"
                            >
                                + Add Room
                            </button>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setStep(1)} className="flex-1 py-4 border border-white/30 text-white rounded-lg">
                                ← Back
                            </button>
                            <button
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold disabled:opacity-50"
                            >
                                {loading ? 'Analyzing...' : 'Analyze Vastu ✨'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Results */}
                {step === 3 && result && (
                    <div className="space-y-6">
                        {/* Score */}
                        <div className="bg-white rounded-2xl p-8 text-center">
                            <div className={`text-6xl font-bold ${getScoreColor(result.overallScore)}`}>
                                {result.overallScore}
                            </div>
                            <div className="text-2xl font-bold text-gray-700 mt-2">Overall Vastu Score</div>
                            <div className={`inline-block mt-4 px-6 py-2 rounded-full text-white font-semibold ${getScoreBg(result.overallScore)}`}>
                                Grade: {result.grade || 'B'}
                            </div>
                        </div>

                        {/* Direction Scores */}
                        <div className="bg-white rounded-2xl p-8">
                            <h3 className="text-xl font-semibold mb-6">Directional Analysis</h3>
                            <div className="grid grid-cols-3 gap-4">
                                {Object.entries(result.directionScores || {}).map(([dir, score]: [string, any]) => (
                                    <div key={dir} className="text-center p-4 bg-gray-50 rounded-xl">
                                        <div className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</div>
                                        <div className="text-sm text-gray-500 uppercase">{dir}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Remedies */}
                        {result.remedies?.length > 0 && (
                            <div className="bg-white rounded-2xl p-8">
                                <h3 className="text-xl font-semibold mb-6">🔧 Recommended Remedies</h3>
                                <div className="space-y-4">
                                    {result.remedies.map((remedy: any, i: number) => (
                                        <div key={i} className="flex gap-4 p-4 bg-amber-50 rounded-xl">
                                            <span className="text-2xl">✨</span>
                                            <div>
                                                <div className="font-medium text-gray-900">{remedy.type}</div>
                                                <div className="text-gray-600 text-sm">{remedy.description}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

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

