'use client';

import React from 'react';

interface PuranicData {
    directionalDeity?: string;
    vaastuPurusha?: string;
    elementBalance?: {
        earth: number;
        water: number;
        fire: number;
        air: number;
        space: number;
    };
    sacredGeometry?: string;
    spiritualSignificance?: string;
    panchBhuta?: {
        element: string;
        direction: string;
        quality: string;
        score: number;
    }[];
    recommendations?: string[];
    mantras?: {
        name: string;
        purpose: string;
        sanskrit: string;
    }[];
    overallHarmony?: number;
}

interface Props {
    analysis: PuranicData;
}

export function PuranicAnalysis({ analysis }: Props) {
    if (!analysis) {
        return (
            <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-3">📜</div>
                <p>Puranic analysis not available for this property</p>
            </div>
        );
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 bg-green-50';
        if (score >= 60) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold">Puranic Analysis</h3>
                    <p className="text-gray-500">Ancient Vedic Wisdom</p>
                </div>
                {analysis.overallHarmony !== undefined && (
                    <div className={`text-4xl font-bold ${analysis.overallHarmony >= 80 ? 'text-green-600' : analysis.overallHarmony >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {analysis.overallHarmony}%
                    </div>
                )}
            </div>

            {/* Directional Deity & Vastu Purusha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.directionalDeity && (
                    <div className="bg-amber-50 rounded-lg p-4">
                        <h4 className="font-semibold text-amber-800 mb-2">🙏 Directional Deity</h4>
                        <p className="text-amber-700">{analysis.directionalDeity}</p>
                    </div>
                )}
                {analysis.vaastuPurusha && (
                    <div className="bg-purple-50 rounded-lg p-4">
                        <h4 className="font-semibold text-purple-800 mb-2">🕉️ Vaastu Purusha</h4>
                        <p className="text-purple-700">{analysis.vaastuPurusha}</p>
                    </div>
                )}
            </div>

            {/* Panch Bhuta (Five Elements) */}
            {analysis.panchBhuta && analysis.panchBhuta.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-3">🌍 Panch Bhuta (Five Elements)</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {analysis.panchBhuta.map((element, i) => (
                            <div key={i} className={`p-3 rounded-lg text-center ${getScoreColor(element.score)}`}>
                                <div className="text-2xl mb-1">
                                    {element.element === 'Earth' ? '🌍' :
                                        element.element === 'Water' ? '💧' :
                                            element.element === 'Fire' ? '🔥' :
                                                element.element === 'Air' ? '💨' : '✨'}
                                </div>
                                <div className="font-medium text-sm">{element.element}</div>
                                <div className="text-xs opacity-75">{element.direction}</div>
                                <div className="font-bold">{element.score}%</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Element Balance */}
            {analysis.elementBalance && (
                <div className="bg-teal-50 rounded-lg p-4">
                    <h4 className="font-semibold text-teal-800 mb-3">⚖️ Element Balance</h4>
                    <div className="space-y-2">
                        {Object.entries(analysis.elementBalance).map(([element, value]) => (
                            <div key={element} className="flex items-center gap-3">
                                <span className="w-16 text-sm capitalize">{element}</span>
                                <div className="flex-1 bg-white rounded-full h-3 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${element === 'earth' ? 'bg-amber-500' :
                                                element === 'water' ? 'bg-blue-500' :
                                                    element === 'fire' ? 'bg-red-500' :
                                                        element === 'air' ? 'bg-cyan-500' : 'bg-purple-500'
                                            }`}
                                        style={{ width: `${value}%` }}
                                    />
                                </div>
                                <span className="text-sm font-medium w-12">{value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Sacred Geometry */}
            {analysis.sacredGeometry && (
                <div className="bg-indigo-50 rounded-lg p-4">
                    <h4 className="font-semibold text-indigo-800 mb-2">📐 Sacred Geometry</h4>
                    <p className="text-indigo-700">{analysis.sacredGeometry}</p>
                </div>
            )}

            {/* Mantras */}
            {analysis.mantras && analysis.mantras.length > 0 && (
                <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-800 mb-3">🙏 Recommended Mantras</h4>
                    <div className="space-y-3">
                        {analysis.mantras.map((mantra, i) => (
                            <div key={i} className="bg-white rounded-lg p-3">
                                <div className="font-medium text-orange-800">{mantra.name}</div>
                                <div className="text-sm text-gray-500">{mantra.purpose}</div>
                                <div className="text-orange-600 font-sanskrit mt-1 italic">{mantra.sanskrit}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
                <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-3">💡 Recommendations</h4>
                    <ul className="space-y-2">
                        {analysis.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2 text-green-700">
                                <span className="text-green-500 mt-1">✓</span>
                                <span>{rec}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

