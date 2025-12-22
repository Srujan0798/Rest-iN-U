'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function NumerologyPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [compatibilityResult, setCompatibilityResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    propertyAddress: '',
  });

  const handleLifePath = async () => {
    if (!formData.dateOfBirth) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/v1/astrology/life-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateOfBirth: formData.dateOfBirth }),
      });
      const data = await response.json();
      setResult(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompatibility = async () => {
    if (!formData.dateOfBirth || !formData.propertyAddress) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/v1/astrology/property-compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setCompatibilityResult(data.data);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-800">
      {/* Header */}
      <div className="py-12 px-4 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur mb-6">
          <span className="text-5xl">🔢</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">Numerology & Life Path</h1>
        <p className="text-white/70 max-w-lg mx-auto">
          Discover your Life Path Number and find properties aligned with your cosmic blueprint
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-12">
        {/* Input Form */}
        <div className="bg-white/10 backdrop-blur rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Your Birth Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white"
              />
            </div>

            <button
              onClick={handleLifePath}
              disabled={loading || !formData.dateOfBirth}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition disabled:opacity-50"
            >
              {loading ? 'Calculating...' : 'Calculate Life Path Number'}
            </button>
          </div>
        </div>

        {/* Life Path Result */}
        {result && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="text-8xl font-bold text-indigo-600 mb-4">{result.lifePathNumber}</div>
              <div className="text-2xl font-bold text-gray-700">Your Life Path Number</div>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {result.traits?.map((trait: string, i: number) => (
                  <span key={i} className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Best Properties */}
            <div className="bg-white rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-6">🏠 Best Property Types For You</h3>
              <div className="space-y-3">
                {result.bestProperties?.map((prop: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl">
                    <span className="text-indigo-500">✓</span>
                    <span className="text-gray-700">{prop}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lucky Numbers & Colors */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6">
                <h3 className="font-semibold mb-4">🔢 Lucky Numbers</h3>
                <div className="flex flex-wrap gap-2">
                  {result.luckyNumbers?.map((num: number, i: number) => (
                    <span key={i} className="w-10 h-10 flex items-center justify-center bg-indigo-100 text-indigo-700 rounded-full font-bold">
                      {num}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6">
                <h3 className="font-semibold mb-4">🎨 Lucky Colors</h3>
                <div className="flex flex-wrap gap-2">
                  {result.luckyColors?.map((color: string, i: number) => (
                    <span key={i} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Property Compatibility */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-white mb-6">🔗 Check Property Compatibility</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Property Address</label>
                  <input
                    type="text"
                    value={formData.propertyAddress}
                    onChange={e => setFormData({ ...formData, propertyAddress: e.target.value })}
                    placeholder="e.g., 123 Main Street"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30"
                  />
                </div>
                <button
                  onClick={handleCompatibility}
                  disabled={loading || !formData.propertyAddress}
                  className="w-full py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition disabled:opacity-50"
                >
                  Check Compatibility
                </button>
              </div>
            </div>

            {/* Compatibility Result */}
            {compatibilityResult && (
              <div className="bg-white rounded-2xl p-8">
                <h3 className="text-xl font-semibold mb-6">Numerological Compatibility</h3>

                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                  <div className="p-4 bg-indigo-50 rounded-xl">
                    <div className="text-3xl font-bold text-indigo-600">{compatibilityResult.userLifePath}</div>
                    <div className="text-sm text-gray-500">Your Number</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <div className="text-3xl font-bold text-purple-600">{compatibilityResult.propertyNumber}</div>
                    <div className="text-sm text-gray-500">Property Number</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className={`text-3xl font-bold ${getScoreColor(compatibilityResult.compatibilityScore)}`}>
                      {compatibilityResult.compatibilityScore}%
                    </div>
                    <div className="text-sm text-gray-500">Compatibility</div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="font-medium text-gray-900 mb-2">{compatibilityResult.compatibilityRating}</div>
                  <p className="text-gray-600">{compatibilityResult.explanation}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
