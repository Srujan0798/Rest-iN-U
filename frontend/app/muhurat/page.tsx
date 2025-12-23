'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AuspiciousDateCard } from '../../components/PropertyComponents';

export default function MuhuratPage() {
  const searchParams = useSearchParams();
  const propertyId = searchParams?.get('property');

  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    eventType: 'PROPERTY_PURCHASE',
    dateOfBirth: '',
    birthTime: '',
    birthPlace: '',
  });

  const eventTypes = [
    { value: 'PROPERTY_PURCHASE', label: 'Property Purchase', icon: '🏠' },
    { value: 'GRIHAPRAVESH', label: 'Grihapravesh (Housewarming)', icon: '🪔' },
    { value: 'CONSTRUCTION_START', label: 'Construction Start', icon: '🏗️' },
    { value: 'RENOVATION', label: 'Renovation', icon: '🔨' },
    { value: 'SIGNING', label: 'Contract Signing', icon: '📝' },
  ];

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/v1/vastu/auspicious-timing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResults(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Hero */}
      <div className="py-16 px-4 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/10 backdrop-blur mb-6">
          <span className="text-6xl">📅</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Muhurat Calculator
        </h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto">
          Find auspicious dates for your property decisions based on Vedic astrology
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-white mb-6">Your Details</h2>
            <form onSubmit={handleCalculate} className="space-y-6">
              {/* Event Type */}
              <div>
                <label className="block text-white/70 text-sm mb-2">Event Type</label>
                <div className="grid grid-cols-1 gap-2">
                  {eventTypes.map(event => (
                    <button
                      key={event.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, eventType: event.value })}
                      className={`flex items-center gap-3 p-3 rounded-lg text-left transition ${formData.eventType === event.value
                          ? 'bg-amber-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                    >
                      <span className="text-2xl">{event.icon}</span>
                      <span>{event.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Birth Details */}
              <div className="space-y-4">
                <div className="text-white/70 text-sm flex items-center gap-2">
                  <span>🌟</span>
                  <span>Birth details for personalized muhurat (optional)</span>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-1">Birth Time</label>
                  <input
                    type="time"
                    value={formData.birthTime}
                    onChange={e => setFormData({ ...formData, birthTime: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-1">Birth Place</label>
                  <input
                    type="text"
                    value={formData.birthPlace}
                    onChange={e => setFormData({ ...formData, birthPlace: e.target.value })}
                    placeholder="City, Country"
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition disabled:opacity-50"
              >
                {loading ? 'Calculating...' : 'Find Auspicious Dates ✨'}
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {results ? (
              <>
                {/* Best Dates */}
                <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span>🌟</span> Best Auspicious Dates
                  </h3>
                  <div className="space-y-3">
                    {results.bestDates?.map((date: any, i: number) => (
                      <div key={i} className="bg-white rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {new Date(date.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </div>
                            <div className="text-sm text-gray-500">{date.tithi} • {date.nakshatra}</div>
                          </div>
                          <div className={`text-2xl ${date.quality === 'Excellent' ? 'text-green-500' :
                              date.quality === 'Good' ? 'text-blue-500' : 'text-gray-400'
                            }`}>
                            {date.quality === 'Excellent' ? '⭐⭐⭐' :
                              date.quality === 'Good' ? '⭐⭐' : '⭐'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Avoid Dates */}
                {results.avoidDates?.length > 0 && (
                  <div className="bg-red-500/10 backdrop-blur rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-red-300 mb-4 flex items-center gap-2">
                      <span>⚠️</span> Dates to Avoid
                    </h3>
                    <div className="space-y-2">
                      {results.avoidDates.slice(0, 5).map((date: any, i: number) => (
                        <div key={i} className="flex items-center justify-between text-red-200/80">
                          <span>{new Date(date.date).toLocaleDateString()}</span>
                          <span className="text-sm">{date.reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Considerations */}
                {results.considerations && (
                  <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">📜 Vedic Considerations</h3>
                    <div className="space-y-3 text-white/70">
                      {results.considerations.map((c: string, i: number) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-amber-400">•</span>
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white/10 backdrop-blur rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">🌙</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Calculate Your Muhurat
                </h3>
                <p className="text-white/60">
                  Enter your details to find the most auspicious dates for your
                  property transaction based on Vedic astrology
                </p>
                <div className="mt-6 text-white/40 text-sm">
                  <p>Our system considers:</p>
                  <p>Panchang • Nakshatra • Tithi • Yoga • Karana</p>
                </div>
              </div>
            )}

            {/* Back Link */}
            {propertyId && (
              <div className="text-center">
                <Link href={`/property/${propertyId}`} className="text-amber-400 hover:underline">
                  ← Back to Property
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

