'use client';

import React, { useState } from 'react';
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Spinner } from '@/components/ui';
import { Search, MapPin, Calendar, Clock, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface MatchFormData {
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  propertyDate: string;
}

interface MatchResult {
  score: number;
  summary: string;
  details: string[];
  userPlanets: { planet: string; sign: string }[];
  propertyPlanets: { planet: string; sign: string }[];
}

export default function AstrologyMatchPage() {
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<MatchFormData>();
  const [showConfetti, setShowConfetti] = useState(false); // Can implement confetti later

  const onSubmit = async (data: MatchFormData) => {
    setLoading(true);
    try {
      // Mock latitude/longitude for now since we don't have a geocoder hooked up yet
      // In a real app, 'placeOfBirth' would be geocoded
      const payload = {
        buyerBirthDetails: {
          dateOfBirth: data.dateOfBirth,
          timeOfBirth: data.timeOfBirth,
          placeOfBirth: {
            city: data.placeOfBirth,
            country: 'India', // Default
            latitude: 28.6139, // New Delhi mock
            longitude: 77.2090
          }
        },
        propertyDate: data.propertyDate // Using manual date input for now
      };

      const response = await axios.post('/api/v1/astrology/match', payload, {
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}` // Handle auth
          }
      });

      if (response.data.success) {
        setResult(response.data.data);
      }
    } catch (error) {
      console.error('Error calculating match:', error);
      // Fallback for demo if API fails or auth missing
      // Remove this in production
      setResult({
          score: 85,
          summary: "API Call Failed, showing Mock: The stars align perfectly! This property vibrates with your soul frequency.",
          details: ["Jupiter trines your Natal Sun.", "Moon is in a favorable house."],
          userPlanets: [{planet: 'Sun', sign: 'Leo'}, {planet: 'Moon', sign: 'Cancer'}],
          propertyPlanets: [{planet: 'Sun', sign: 'Aries'}, {planet: 'Jupiter', sign: 'Sagittarius'}]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-400 mb-4 flex items-center justify-center gap-3">
            <Sparkles className="text-yellow-400 w-8 h-8" />
            Cosmic Property Match
            <Sparkles className="text-yellow-400 w-8 h-8" />
          </h1>
          <p className="text-lg text-indigo-200">
            Discover if your destiny aligns with your dream home through the ancient wisdom of the stars.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="bg-white/10 backdrop-blur-md border-indigo-500/30 text-white">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-amber-400" />
                Your Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-indigo-300 uppercase tracking-wider">Birth Information</h3>

                  <Input
                    {...register('dateOfBirth', { required: true })}
                    type="date"
                    label="Date of Birth"
                    className="bg-white/20 border-indigo-400/50 text-white placeholder-indigo-300"
                  />

                  <Input
                    {...register('timeOfBirth', { required: true })}
                    type="time"
                    label="Time of Birth"
                    className="bg-white/20 border-indigo-400/50 text-white"
                  />

                  <Input
                    {...register('placeOfBirth', { required: true })}
                    placeholder="City, Country"
                    label="Place of Birth"
                    icon={<MapPin className="w-4 h-4 text-white" />}
                    className="bg-white/20 border-indigo-400/50 text-white placeholder-indigo-300"
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-indigo-500/30">
                  <h3 className="text-sm font-medium text-indigo-300 uppercase tracking-wider">Property Details</h3>
                   {/* In a real app, this would be a property selector */}
                  <Input
                    {...register('propertyDate', { required: true })}
                    type="date"
                    label="Construction/Foundation Date"
                    className="bg-white/20 border-indigo-400/50 text-white"
                  />
                </div>

                <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/20"
                    loading={loading}
                    disabled={loading}
                >
                    {loading ? 'Consulting the Stars...' : 'Calculate Cosmic Compatibility'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Display */}
          <div className="space-y-6">
            {!result && (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center text-indigo-300 border-2 border-dashed border-indigo-500/30 rounded-2xl bg-white/5">
                    <Sparkles className="w-16 h-16 mb-4 opacity-50" />
                    <p>Enter your birth details and property date to reveal your cosmic connection.</p>
                </div>
            )}

            {result && (
                <Card className="bg-gradient-to-br from-indigo-900 to-black border-amber-500/50 shadow-2xl overflow-hidden relative">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl"></div>

                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-amber-400 text-sm uppercase tracking-widest">Cosmic Compatibility Score</CardTitle>
                    </CardHeader>

                    <CardContent className="text-center pt-0">
                        <div className="relative inline-flex items-center justify-center my-6">
                            <svg className="w-40 h-40 transform -rotate-90">
                                <circle
                                    className="text-indigo-900"
                                    strokeWidth="10"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="70"
                                    cx="80"
                                    cy="80"
                                />
                                <circle
                                    className={`text-amber-500 transition-all duration-1000 ease-out`}
                                    strokeWidth="10"
                                    strokeDasharray={440}
                                    strokeDashoffset={440 - (440 * result.score) / 100}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="70"
                                    cx="80"
                                    cy="80"
                                />
                            </svg>
                            <span className="absolute text-5xl font-bold text-white">{result.score}%</span>
                        </div>

                        <h3 className="text-2xl font-serif text-white mb-4 italic">
                            "{result.summary}"
                        </h3>

                        <div className="bg-white/10 rounded-xl p-4 text-left space-y-2">
                            <p className="text-sm font-semibold text-indigo-200 mb-2">Astrological Insights:</p>
                            <ul className="space-y-2">
                                {result.details.map((detail, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-200">
                                        <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                                        {detail}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            )}

            {result && (
                <div className="grid grid-cols-2 gap-4">
                     <Card className="bg-white/10 border-none p-4">
                        <h4 className="text-indigo-200 text-xs uppercase font-bold mb-3">Your Planetary Alignment</h4>
                        <div className="space-y-1">
                            {result.userPlanets.slice(0,4).map((p, i) => (
                                <div key={i} className="flex justify-between text-sm text-white">
                                    <span>{p.planet}</span>
                                    <span className="text-amber-300">{p.sign}</span>
                                </div>
                            ))}
                        </div>
                     </Card>
                     <Card className="bg-white/10 border-none p-4">
                        <h4 className="text-indigo-200 text-xs uppercase font-bold mb-3">Property Energy</h4>
                        <div className="space-y-1">
                             {result.propertyPlanets.slice(0,4).map((p, i) => (
                                <div key={i} className="flex justify-between text-sm text-white">
                                    <span>{p.planet}</span>
                                    <span className="text-amber-300">{p.sign}</span>
                                </div>
                            ))}
                        </div>
                     </Card>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
