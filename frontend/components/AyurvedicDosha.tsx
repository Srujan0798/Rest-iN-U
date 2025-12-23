'use client';

import React from 'react';

interface AyurvedicAnalysis {
    dominantDosha?: 'Vata' | 'Pitta' | 'Kapha' | 'Balanced';
    doshaBalance?: {
        vata: number;
        pitta: number;
        kapha: number;
    };
    propertyType?: string;
    suitableFor?: string[];
    notRecommendedFor?: string[];
    balancingElements?: {
        element: string;
        present: boolean;
        recommendation: string;
    }[];
    colorTherapy?: {
        color: string;
        room: string;
        benefit: string;
    }[];
    aromatherapy?: {
        scent: string;
        benefit: string;
    }[];
    overallWellnessScore?: number;
    recommendations?: string[];
}

interface Props {
    analysis: AyurvedicAnalysis;
}

export function AyurvedicDosha({ analysis }: Props) {
    if (!analysis) {
        return (
            <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-3">🌿</div>
                <p>Ayurvedic analysis not available for this property</p>
            </div>
        );
    }

    const getDoshaColor = (dosha: string) => {
        switch (dosha) {
            case 'Vata': return 'from-blue-400 to-cyan-500';
            case 'Pitta': return 'from-red-400 to-orange-500';
            case 'Kapha': return 'from-green-400 to-emerald-500';
            default: return 'from-purple-400 to-pink-500';
        }
    };

    const getDoshaIcon = (dosha: string) => {
        switch (dosha) {
            case 'Vata': return '💨';
            case 'Pitta': return '🔥';
            case 'Kapha': return '💧';
            default: return '☯️';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold">Ayurvedic Analysis</h3>
                    <p className="text-gray-500">Dosha Balance & Wellness</p>
                </div>
                {analysis.overallWellnessScore !== undefined && (
                    <div className={`text-4xl font-bold ${analysis.overallWellnessScore >= 80 ? 'text-green-600' :
                            analysis.overallWellnessScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                        {analysis.overallWellnessScore}%
                    </div>
                )}
            </div>

            {/* Dominant Dosha */}
            {analysis.dominantDosha && (
                <div className={`bg-gradient-to-r ${getDoshaColor(analysis.dominantDosha)} rounded-xl p-6 text-white`}>
                    <div className="flex items-center gap-4">
                        <div className="text-5xl">{getDoshaIcon(analysis.dominantDosha)}</div>
                        <div>
                            <div className="text-sm opacity-80">Dominant Dosha</div>
                            <div className="text-3xl font-bold">{analysis.dominantDosha}</div>
                            <div className="text-sm opacity-80 mt-1">
                                {analysis.dominantDosha === 'Vata' && 'Air & Space - Creative, energetic space'}
                                {analysis.dominantDosha === 'Pitta' && 'Fire & Water - Dynamic, transformative energy'}
                                {analysis.dominantDosha === 'Kapha' && 'Earth & Water - Stable, nurturing environment'}
                                {analysis.dominantDosha === 'Balanced' && 'Harmonious blend of all elements'}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Dosha Balance */}
            {analysis.doshaBalance && (
                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-4">⚖️ Dosha Balance</h4>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="w-16 text-sm">Vata</span>
                            <div className="flex-1 bg-white rounded-full h-4 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full"
                                    style={{ width: `${analysis.doshaBalance.vata}%` }}
                                />
                            </div>
                            <span className="text-sm font-medium w-12">{analysis.doshaBalance.vata}%</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-16 text-sm">Pitta</span>
                            <div className="flex-1 bg-white rounded-full h-4 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-red-400 to-orange-500 rounded-full"
                                    style={{ width: `${analysis.doshaBalance.pitta}%` }}
                                />
                            </div>
                            <span className="text-sm font-medium w-12">{analysis.doshaBalance.pitta}%</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-16 text-sm">Kapha</span>
                            <div className="flex-1 bg-white rounded-full h-4 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                                    style={{ width: `${analysis.doshaBalance.kapha}%` }}
                                />
                            </div>
                            <span className="text-sm font-medium w-12">{analysis.doshaBalance.kapha}%</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Suitable For */}
            {analysis.suitableFor && analysis.suitableFor.length > 0 && (
                <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-3">✅ Best Suited For</h4>
                    <div className="flex flex-wrap gap-2">
                        {analysis.suitableFor.map((item, i) => (
                            <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Not Recommended For */}
            {analysis.notRecommendedFor && analysis.notRecommendedFor.length > 0 && (
                <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-3">⚠️ May Not Suit</h4>
                    <div className="flex flex-wrap gap-2">
                        {analysis.notRecommendedFor.map((item, i) => (
                            <span key={i} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Color Therapy */}
            {analysis.colorTherapy && analysis.colorTherapy.length > 0 && (
                <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-800 mb-3">🎨 Color Therapy Recommendations</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {analysis.colorTherapy.map((color, i) => (
                            <div key={i} className="bg-white rounded-lg p-3 flex items-center gap-3">
                                <div
                                    className="w-8 h-8 rounded-full border-2 border-white shadow"
                                    style={{ backgroundColor: color.color.toLowerCase() }}
                                />
                                <div>
                                    <div className="font-medium text-sm">{color.room}</div>
                                    <div className="text-xs text-gray-500">{color.benefit}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Aromatherapy */}
            {analysis.aromatherapy && analysis.aromatherapy.length > 0 && (
                <div className="bg-amber-50 rounded-lg p-4">
                    <h4 className="font-semibold text-amber-800 mb-3">🌸 Aromatherapy</h4>
                    <div className="flex flex-wrap gap-2">
                        {analysis.aromatherapy.map((aroma, i) => (
                            <div key={i} className="bg-white rounded-lg p-2 px-3">
                                <span className="font-medium text-amber-700">{aroma.scent}</span>
                                <span className="text-gray-500 text-sm ml-2">- {aroma.benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
                <div className="bg-teal-50 rounded-lg p-4">
                    <h4 className="font-semibold text-teal-800 mb-3">💡 Wellness Recommendations</h4>
                    <ul className="space-y-2">
                        {analysis.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2 text-teal-700">
                                <span className="text-teal-500 mt-1">✓</span>
                                <span>{rec}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

