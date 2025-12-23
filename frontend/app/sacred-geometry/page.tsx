'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SacredGeometryPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    plotWidth: 50,
    plotLength: 80,
    rooms: [
      { width: 12, length: 15 },
      { width: 10, length: 16 },
      { width: 14, length: 22 },
    ],
    features: [] as string[],
  });

  const PHI = 1.618;

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/v1/sacred-geometry/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plotDimensions: { width: formData.plotWidth, length: formData.plotLength },
          roomDimensions: formData.rooms,
          architecturalFeatures: formData.features,
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const architecturalFeatures = ['dome', 'pyramid', 'spiral', 'arch', 'curves', 'columns'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900">
      {/* Header */}
      <div className="py-12 px-4 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur mb-6">
          <span className="text-5xl">🔯</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">Sacred Geometry Analysis</h1>
        <p className="text-white/70 max-w-lg mx-auto">
          Discover the divine proportions hidden in your property's architecture
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-12">
        {!result ? (
          <div className="space-y-6">
            {/* Plot Dimensions */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
              <h2 className="text-xl font-semibold text-white mb-6">Plot Dimensions</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Width (feet)</label>
                  <input
                    type="number"
                    value={formData.plotWidth}
                    onChange={e => setFormData({ ...formData, plotWidth: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Length (feet)</label>
                  <input
                    type="number"
                    value={formData.plotLength}
                    onChange={e => setFormData({ ...formData, plotLength: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
                  />
                </div>
              </div>
              <div className="mt-4 p-4 bg-white/5 rounded-lg">
                <div className="text-white/70 text-sm">Current Ratio: <strong className="text-white">{(formData.plotLength / formData.plotWidth).toFixed(3)}</strong></div>
                <div className="text-white/70 text-sm">Golden Ratio (φ): <strong className="text-amber-400">{PHI.toFixed(3)}</strong></div>
                <div className="text-white/70 text-sm mt-1">
                  Deviation: <strong className={Math.abs(formData.plotLength / formData.plotWidth - PHI) < 0.2 ? 'text-green-400' : 'text-yellow-400'}>
                    {(Math.abs(formData.plotLength / formData.plotWidth - PHI) / PHI * 100).toFixed(1)}%
                  </strong>
                </div>
              </div>
            </div>

            {/* Architectural Features */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
              <h2 className="text-xl font-semibold text-white mb-6">Architectural Features</h2>
              <div className="flex flex-wrap gap-3">
                {architecturalFeatures.map(feature => (
                  <button
                    key={feature}
                    onClick={() => toggleFeature(feature)}
                    className={`px-4 py-2 rounded-full capitalize transition ${formData.features.includes(feature)
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-violet-600 transition disabled:opacity-50"
            >
              {loading ? 'Analyzing Divine Proportions...' : 'Analyze Sacred Geometry 🔯'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🔯</div>
              <div className={`text-6xl font-bold ${getScoreColor(result.overallScore)}`}>
                {result.overallScore}
              </div>
              <div className="text-2xl font-bold text-gray-700 mt-2">Sacred Geometry Score</div>
              <div className="mt-2 text-gray-500">Grade: {result.grade}</div>
            </div>

            {/* Golden Ratio */}
            <div className="bg-white rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-6">φ Golden Ratio Analysis</h3>
              <div className="text-4xl font-bold text-center mb-4">
                <span className={getScoreColor(result.goldenRatio?.score || 70)}>
                  {result.goldenRatio?.score || 70}
                </span>
                <span className="text-gray-400 text-lg ml-2">/ 100</span>
              </div>

              {result.goldenRatio?.details?.length > 0 && (
                <div className="mt-4 space-y-3">
                  {result.goldenRatio.details.map((d: any, i: number) => (
                    <div key={i} className={`p-4 rounded-lg ${d.isHarmonious ? 'bg-green-50' : 'bg-yellow-50'}`}>
                      <div className="flex justify-between">
                        <span className="font-medium">{d.room || d.element}</span>
                        <span className={d.isHarmonious ? 'text-green-600' : 'text-yellow-600'}>
                          {d.isHarmonious ? '✓ Harmonious' : '○ Can improve'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Ratio: {d.ratio} (Target: {d.goldenRatio}) • Deviation: {d.deviation}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Fibonacci */}
            <div className="bg-white rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-6">🌀 Fibonacci Elements</h3>
              <div className="text-4xl font-bold text-center mb-4">
                <span className={getScoreColor(result.fibonacci?.score || 70)}>
                  {result.fibonacci?.score || 70}
                </span>
                <span className="text-gray-400 text-lg ml-2">/ 100</span>
              </div>
              <div className="text-center text-gray-500">
                Fibonacci Sequence: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89...
              </div>
            </div>

            {/* Yantras */}
            <div className="bg-white rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-6">🕉️ Recommended Yantras</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.yantras?.recommended?.map((yantra: any, i: number) => (
                  <div key={i} className="p-4 bg-purple-50 rounded-xl">
                    <div className="font-bold text-purple-900">{yantra.name}</div>
                    <div className="text-sm text-purple-700 mt-1">{yantra.purpose}</div>
                    <div className="text-xs text-purple-500 mt-2">📍 {yantra.placement}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center pt-4">
              <button onClick={() => setResult(null)} className="text-white/70 hover:text-white">
                ← Analyze Another Property
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

