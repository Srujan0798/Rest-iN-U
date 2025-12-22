'use client';

import React from 'react';

interface JyotishAnalysis {
    nakshatraName?: string;
    nakshatraLord?: string;
    moonSign?: string;
    sunSign?: string;
    lagnaSign?: string;
    auspiciousTimings?: {
        date: string;
        time: string;
        quality: string;
    }[];
    planetaryPositions?: {
        planet: string;
        sign: string;
        house: number;
    }[];
    doshas?: string[];
    yogas?: string[];
    overallAuspiciousness?: number;
}

interface Props {
    analysis: JyotishAnalysis;
}

export function JyotishChart({ analysis }: Props) {
    if (!analysis) {
        return (
            <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-3">✨</div>
                <p>Jyotish analysis not available for this property</p>
            </div>
        );
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold">Jyotish Shastra Analysis</h3>
                    <p className="text-gray-500">Vedic Astrology Insights</p>
                </div>
                {analysis.overallAuspiciousness !== undefined && (
                    <div className={`text-4xl font-bold ${getScoreColor(analysis.overallAuspiciousness)}`}>
                        {analysis.overallAuspiciousness}%
                    </div>
                )}
            </div>

            {/* Nakshatra Info */}
            <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-3">🌟 Nakshatra Details</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {analysis.nakshatraName && (
                        <div>
                            <div className="text-sm text-purple-600">Nakshatra</div>
                            <div className="font-medium">{analysis.nakshatraName}</div>
                        </div>
                    )}
                    {analysis.nakshatraLord && (
                        <div>
                            <div className="text-sm text-purple-600">Lord</div>
                            <div className="font-medium">{analysis.nakshatraLord}</div>
                        </div>
                    )}
                    {analysis.moonSign && (
                        <div>
                            <div className="text-sm text-purple-600">Moon Sign (Rashi)</div>
                            <div className="font-medium">{analysis.moonSign}</div>
                        </div>
                    )}
                    {analysis.sunSign && (
                        <div>
                            <div className="text-sm text-purple-600">Sun Sign</div>
                            <div className="font-medium">{analysis.sunSign}</div>
                        </div>
                    )}
                    {analysis.lagnaSign && (
                        <div>
                            <div className="text-sm text-purple-600">Lagna (Ascendant)</div>
                            <div className="font-medium">{analysis.lagnaSign}</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Auspicious Timings */}
            {analysis.auspiciousTimings && analysis.auspiciousTimings.length > 0 && (
                <div className="bg-amber-50 rounded-lg p-4">
                    <h4 className="font-semibold text-amber-800 mb-3">📅 Auspicious Timings</h4>
                    <div className="space-y-2">
                        {analysis.auspiciousTimings.slice(0, 5).map((timing, i) => (
                            <div key={i} className="flex items-center justify-between bg-white rounded-lg p-3">
                                <div>
                                    <div className="font-medium">{timing.date}</div>
                                    <div className="text-sm text-gray-500">{timing.time}</div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm ${timing.quality === 'Excellent' ? 'bg-green-100 text-green-700' :
                                        timing.quality === 'Good' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-gray-100 text-gray-700'
                                    }`}>
                                    {timing.quality}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Yogas */}
            {analysis.yogas && analysis.yogas.length > 0 && (
                <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-3">✨ Beneficial Yogas</h4>
                    <div className="flex flex-wrap gap-2">
                        {analysis.yogas.map((yoga, i) => (
                            <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                {yoga}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Doshas */}
            {analysis.doshas && analysis.doshas.length > 0 && (
                <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-3">⚠️ Doshas to Consider</h4>
                    <ul className="space-y-1 text-red-700 text-sm">
                        {analysis.doshas.map((dosha, i) => (
                            <li key={i}>• {dosha}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
