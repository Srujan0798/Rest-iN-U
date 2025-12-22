'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface BirthDetails {
  date: string;
  time: string;
  place: string;
  latitude: number;
  longitude: number;
}

interface PlanetaryPosition {
  planet: string;
  sign: string;
  house: number;
  degree: number;
  retrograde: boolean;
}

interface AstrologyProfile {
  rashi: string; // Moon Sign
  nakshatra: string;
  lagna: string; // Ascendant
  planetaryPositions: PlanetaryPosition[];
  currentDasha: {
    mahadasha: string;
    antardasha: string;
    startDate: string;
    endDate: string;
  };
  favorableDirections: string[];
  favorableColors: string[];
  favorableNumbers: number[];
  auspiciousDays: string[];
}

interface PropertyCompatibility {
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyAddress: string;
  compatibilityScore: number;
  vastuScore: number;
  astrologyFactors: Array<{
    factor: string;
    status: 'excellent' | 'good' | 'neutral' | 'caution';
    description: string;
  }>;
  recommendations: string[];
  muhurat: {
    bestDates: string[];
    avoidDates: string[];
  };
}

const mockProfile: AstrologyProfile = {
  rashi: 'Vrishabha (Taurus)',
  nakshatra: 'Rohini',
  lagna: 'Simha (Leo)',
  planetaryPositions: [
    { planet: 'Sun', sign: 'Aries', house: 9, degree: 15.4, retrograde: false },
    { planet: 'Moon', sign: 'Taurus', house: 10, degree: 8.2, retrograde: false },
    { planet: 'Mars', sign: 'Gemini', house: 11, degree: 22.7, retrograde: false },
    { planet: 'Mercury', sign: 'Aries', house: 9, degree: 5.1, retrograde: true },
    { planet: 'Jupiter', sign: 'Sagittarius', house: 5, degree: 18.9, retrograde: false },
    { planet: 'Venus', sign: 'Pisces', house: 8, degree: 27.3, retrograde: false },
    { planet: 'Saturn', sign: 'Capricorn', house: 6, degree: 11.6, retrograde: false },
    { planet: 'Rahu', sign: 'Cancer', house: 12, degree: 3.8, retrograde: true },
    { planet: 'Ketu', sign: 'Capricorn', house: 6, degree: 3.8, retrograde: true }
  ],
  currentDasha: {
    mahadasha: 'Jupiter',
    antardasha: 'Venus',
    startDate: '2024-03-15',
    endDate: '2026-11-15'
  },
  favorableDirections: ['East', 'North', 'Northeast'],
  favorableColors: ['White', 'Cream', 'Light Blue', 'Green'],
  favorableNumbers: [2, 6, 9],
  auspiciousDays: ['Friday', 'Monday', 'Wednesday']
};

const mockCompatibilities: PropertyCompatibility[] = [
  {
    propertyId: 'prop1',
    propertyTitle: 'Luxurious 4BHK Villa with Vastu',
    propertyImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400',
    propertyAddress: '123 Koramangala 4th Block, Bangalore',
    compatibilityScore: 92,
    vastuScore: 95,
    astrologyFactors: [
      { factor: 'Main Entrance Direction', status: 'excellent', description: 'East-facing entrance aligns perfectly with your favorable direction' },
      { factor: 'Master Bedroom Position', status: 'good', description: 'Southwest placement supports stability and grounding' },
      { factor: 'Kitchen Location', status: 'excellent', description: 'Southeast kitchen enhances prosperity and health' },
      { factor: 'Property Number', status: 'neutral', description: 'Building number 123 reduces to 6, which is favorable' }
    ],
    recommendations: [
      'Place a Tulsi plant in the Northeast corner',
      'Use light blue curtains in the living room',
      'Install a small water feature near the entrance'
    ],
    muhurat: {
      bestDates: ['2025-01-10', '2025-01-17', '2025-01-24'],
      avoidDates: ['2025-01-08', '2025-01-15', '2025-01-22']
    }
  },
  {
    propertyId: 'prop2',
    propertyTitle: 'Modern 3BHK Apartment',
    propertyImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
    propertyAddress: '456 HSR Layout, Bangalore',
    compatibilityScore: 78,
    vastuScore: 82,
    astrologyFactors: [
      { factor: 'Main Entrance Direction', status: 'good', description: 'North-facing entrance is favorable for you' },
      { factor: 'Master Bedroom Position', status: 'caution', description: 'Southeast bedroom may cause restlessness' },
      { factor: 'Kitchen Location', status: 'good', description: 'Kitchen placement is acceptable' },
      { factor: 'Floor Level', status: 'excellent', description: '6th floor aligns with your favorable number' }
    ],
    recommendations: [
      'Consider placing the bed with head towards South',
      'Use green plants in the bedroom for better sleep',
      'Avoid red colors in the bedroom'
    ],
    muhurat: {
      bestDates: ['2025-01-12', '2025-01-19'],
      avoidDates: ['2025-01-09', '2025-01-16']
    }
  }
];

export default function AstrologyPage() {
  const [loading, setLoading] = useState(true);
  const [birthDetails, setBirthDetails] = useState<BirthDetails | null>(null);
  const [profile, setProfile] = useState<AstrologyProfile | null>(null);
  const [compatibilities, setCompatibilities] = useState<PropertyCompatibility[]>([]);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'compatibility' | 'muhurat'>('profile');
  const [setupForm, setSetupForm] = useState({
    date: '',
    time: '',
    place: ''
  });

  useEffect(() => {
    setTimeout(() => {
      // Simulating user has already set up their profile
      setBirthDetails({
        date: '1990-04-15',
        time: '06:30',
        place: 'Mumbai, Maharashtra',
        latitude: 19.076,
        longitude: 72.8777
      });
      setProfile(mockProfile);
      setCompatibilities(mockCompatibilities);
      setLoading(false);
    }, 500);
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'neutral': return 'text-gray-600 bg-gray-100';
      case 'caution': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'good':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'caution':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleSetupSubmit = () => {
    // In real app, would calculate profile from birth details
    setBirthDetails({
      date: setupForm.date,
      time: setupForm.time,
      place: setupForm.place,
      latitude: 19.076,
      longitude: 72.8777
    });
    setProfile(mockProfile);
    setCompatibilities(mockCompatibilities);
    setShowSetupModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">ðŸ•‰ï¸</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Jyotish Compatibility</h1>
          <p className="text-gray-600 mb-6">
            Unlock personalized property recommendations based on ancient Vedic astrology. 
            Discover how different properties align with your cosmic blueprint.
          </p>
          <button
            onClick={() => setShowSetupModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-colors"
          >
            Set Up Your Profile
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-orange-500">ðŸ•‰ï¸</span>
            Jyotish Compatibility
          </h1>
          <p className="text-gray-600 mt-1">Property recommendations aligned with your Vedic astrology profile</p>
        </div>
        <button
          onClick={() => setShowSetupModal(true)}
          className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Update Birth Details
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'profile', label: 'Your Profile' },
          { id: 'compatibility', label: 'Property Match' },
          { id: 'muhurat', label: 'Auspicious Times' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'text-orange-600 border-orange-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && profile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Birth Details Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Birth Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-500">Date of Birth</div>
                <div className="font-medium text-gray-900">{birthDetails && formatDate(birthDetails.date)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Time of Birth</div>
                <div className="font-medium text-gray-900">{birthDetails?.time}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Place of Birth</div>
                <div className="font-medium text-gray-900">{birthDetails?.place}</div>
              </div>
            </div>
          </div>

          {/* Key Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6">
              <div className="text-sm text-orange-600 font-medium mb-1">Moon Sign (Rashi)</div>
              <div className="text-xl font-bold text-gray-900">{profile.rashi}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
              <div className="text-sm text-purple-600 font-medium mb-1">Birth Star (Nakshatra)</div>
              <div className="text-xl font-bold text-gray-900">{profile.nakshatra}</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
              <div className="text-sm text-blue-600 font-medium mb-1">Ascendant (Lagna)</div>
              <div className="text-xl font-bold text-gray-900">{profile.lagna}</div>
            </div>
          </div>

          {/* Current Dasha */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Planetary Period (Dasha)</h2>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white text-2xl">
                â™ƒ
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">
                  {profile.currentDasha.mahadasha} - {profile.currentDasha.antardasha}
                </div>
                <div className="text-gray-600">
                  {formatDate(profile.currentDasha.startDate)} to {formatDate(profile.currentDasha.endDate)}
                </div>
                <div className="mt-2 text-sm text-green-600">
                  Jupiter period is excellent for property acquisition and long-term investments
                </div>
              </div>
            </div>
          </div>

          {/* Favorable Factors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Favorable for Property</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-2">Directions</div>
                  <div className="flex flex-wrap gap-2">
                    {profile.favorableDirections.map((dir, i) => (
                      <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        {dir}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-2">Colors</div>
                  <div className="flex flex-wrap gap-2">
                    {profile.favorableColors.map((color, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-2">Numbers</div>
                  <div className="flex flex-wrap gap-2">
                    {profile.favorableNumbers.map((num, i) => (
                      <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {num}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Planetary Positions</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {profile.planetaryPositions.map((planet, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{planet.planet}</span>
                      {planet.retrograde && (
                        <span className="text-xs text-red-500">(R)</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {planet.sign} â€¢ House {planet.house} â€¢ {planet.degree.toFixed(1)}Â°
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Compatibility Tab */}
      {activeTab === 'compatibility' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {compatibilities.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No saved properties</h3>
              <p className="text-gray-600 mb-4">Save properties to see their astrological compatibility</p>
              <Link
                href="/search"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium"
              >
                Browse Properties
              </Link>
            </div>
          ) : (
            compatibilities.map((comp, index) => (
              <motion.div
                key={comp.propertyId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Property Image */}
                  <div className="relative w-full md:w-64 h-48 md:h-auto flex-shrink-0">
                    <img
                      src={comp.propertyImage}
                      alt={comp.propertyTitle}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <div className={`px-3 py-1 rounded-full text-sm font-bold bg-white/90 ${getScoreColor(comp.compatibilityScore)}`}>
                        {comp.compatibilityScore}% Match
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5">
                    <Link href={`/property/${comp.propertyId}`} className="hover:text-orange-600">
                      <h3 className="text-lg font-semibold text-gray-900">{comp.propertyTitle}</h3>
                    </Link>
                    <p className="text-gray-600 text-sm mt-1">{comp.propertyAddress}</p>

                    {/* Scores */}
                    <div className="flex gap-4 mt-4">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getScoreColor(comp.compatibilityScore)}`}>
                          {comp.compatibilityScore}%
                        </div>
                        <div className="text-xs text-gray-500">Astro Match</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getScoreColor(comp.vastuScore)}`}>
                          {comp.vastuScore}%
                        </div>
                        <div className="text-xs text-gray-500">Vastu Score</div>
                      </div>
                    </div>

                    {/* Factors */}
                    <div className="mt-4 space-y-2">
                      {comp.astrologyFactors.map((factor, i) => (
                        <div key={i} className="flex items-start gap-3">
                          {getStatusIcon(factor.status)}
                          <div>
                            <span className="font-medium text-gray-900">{factor.factor}:</span>
                            <span className="text-gray-600 ml-1">{factor.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Recommendations */}
                    {comp.recommendations.length > 0 && (
                      <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                        <div className="text-sm font-medium text-orange-800 mb-2">Recommendations:</div>
                        <ul className="text-sm text-orange-700 space-y-1">
                          {comp.recommendations.map((rec, i) => (
                            <li key={i}>â€¢ {rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-4 flex gap-2">
                      <Link
                        href={`/property/${comp.propertyId}`}
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-colors text-sm"
                      >
                        View Property
                      </Link>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
                        View Full Report
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      )}

      {/* Muhurat Tab */}
      {activeTab === 'muhurat' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Auspicious Times for Property Transactions</h2>
            <p className="text-gray-600 mb-6">
              Based on your birth chart and current planetary transits, here are the most favorable 
              times for property-related activities like signing agreements, possession, and griha pravesh.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-green-700 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Best Dates (January 2025)
                </h3>
                <div className="space-y-2">
                  {['Jan 10 (Friday)', 'Jan 17 (Friday)', 'Jan 24 (Friday)', 'Jan 27 (Monday)'].map((date, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-green-800">{date}</span>
                      <span className="text-xs text-green-600">Shubh Muhurat</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-red-700 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Dates to Avoid
                </h3>
                <div className="space-y-2">
                  {['Jan 8 (Wed) - Rahu Kaal', 'Jan 14 (Tue) - Amavasya', 'Jan 15 (Wed) - Makar Sankranti', 'Jan 22 (Wed) - Ekadashi'].map((date, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-red-800">{date}</span>
                      <span className="text-xs text-red-600">Avoid</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-6 text-white">
            <h3 className="font-semibold text-lg mb-2">Need a Personalized Muhurat?</h3>
            <p className="text-orange-100 mb-4">
              Get a detailed muhurat analysis for your specific property transaction with exact timings.
            </p>
            <button className="px-4 py-2 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors">
              Consult Jyotish Expert
            </button>
          </div>
        </motion.div>
      )}

      {/* Setup Modal */}
      <AnimatePresence>
        {showSetupModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSetupModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-md w-full p-6"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">ðŸ•‰ï¸</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Birth Details</h2>
                <p className="text-gray-600 text-sm mt-1">For accurate Jyotish calculations</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={setupForm.date}
                    onChange={(e) => setSetupForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time of Birth</label>
                  <input
                    type="time"
                    value={setupForm.time}
                    onChange={(e) => setSetupForm(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Accurate time helps in precise calculations</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Place of Birth</label>
                  <input
                    type="text"
                    value={setupForm.place}
                    onChange={(e) => setSetupForm(prev => ({ ...prev, place: e.target.value }))}
                    placeholder="City, State"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowSetupModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSetupSubmit}
                  disabled={!setupForm.date || !setupForm.time || !setupForm.place}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-colors disabled:opacity-50"
                >
                  Calculate Profile
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}










'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'BUYER' | 'SELLER' | 'AGENT' | 'ADMIN';
  createdAt: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  newListings: boolean;
  priceChanges: boolean;
  openHouses: boolean;
  savedSearchAlerts: boolean;
  offerUpdates: boolean;
  documentUpdates: boolean;
  showingReminders: boolean;
  marketReports: boolean;
  newsletter: boolean;
}

interface PrivacySettings {
  profileVisibility: 'PUBLIC' | 'PRIVATE' | 'AGENTS_ONLY';
  showContactInfo: boolean;
  showSearchHistory: boolean;
  allowDataAnalytics: boolean;
  shareWithPartners: boolean;
}

interface PreferenceSettings {
  language: string;
  currency: string;
  timezone: string;
  measurementUnit: 'SQFT' | 'SQMT';
  dateFormat: string;
  theme: 'LIGHT' | 'DARK' | 'SYSTEM';
  defaultView: 'LIST' | 'GRID' | 'MAP';
  resultsPerPage: number;
}

interface VastuPreferences {
  enabled: boolean;
  minScore: number;
  priorityFactors: string[];
  avoidFactors: string[];
}

interface AstrologyPreferences {
  enabled: boolean;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  considerMuhurat: boolean;
  considerDirections: boolean;
}

const mockUserProfile: UserProfile = {
  id: 'user-1',
  firstName: 'Rajesh',
  lastName: 'Kumar',
  email: 'rajesh.kumar@example.com',
  phone: '+91 98765 43210',
  avatar: '/avatars/user-1.jpg',
  role: 'BUYER',
  createdAt: '2024-01-15',
  emailVerified: true,
  phoneVerified: false,
  twoFactorEnabled: false,
};

const mockNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  smsNotifications: true,
  pushNotifications: true,
  newListings: true,
  priceChanges: true,
  openHouses: false,
  savedSearchAlerts: true,
  offerUpdates: true,
  documentUpdates: true,
  showingReminders: true,
  marketReports: false,
  newsletter: true,
};

const mockPrivacySettings: PrivacySettings = {
  profileVisibility: 'AGENTS_ONLY',
  showContactInfo: false,
  showSearchHistory: true,
  allowDataAnalytics: true,
  shareWithPartners: false,
};

const mockPreferenceSettings: PreferenceSettings = {
  language: 'en',
  currency: 'INR',
  timezone: 'Asia/Kolkata',
  measurementUnit: 'SQFT',
  dateFormat: 'DD/MM/YYYY',
  theme: 'LIGHT',
  defaultView: 'GRID',
  resultsPerPage: 20,
};

const mockVastuPreferences: VastuPreferences = {
  enabled: true,
  minScore: 70,
  priorityFactors: ['Main Entrance', 'Kitchen Placement', 'Master Bedroom'],
  avoidFactors: ['South-facing Entrance', 'Toilet in Northeast'],
};

const mockAstrologyPreferences: AstrologyPreferences = {
  enabled: true,
  birthDate: '1985-03-15',
  birthTime: '10:30',
  birthPlace: 'Mumbai, Maharashtra',
  considerMuhurat: true,
  considerDirections: true,
};

type SettingsTab = 'profile' | 'notifications' | 'privacy' | 'preferences' | 'dharma' | 'security';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [notifications, setNotifications] = useState<NotificationSettings>(mockNotificationSettings);
  const [privacy, setPrivacy] = useState<PrivacySettings>(mockPrivacySettings);
  const [preferences, setPreferences] = useState<PreferenceSettings>(mockPreferenceSettings);
  const [vastu, setVastu] = useState<VastuPreferences>(mockVastuPreferences);
  const [astrology, setAstrology] = useState<AstrologyPreferences>(mockAstrologyPreferences);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSuccessMessage('Settings saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const tabs: { id: SettingsTab; label: string; icon: JSX.Element }[] = [
    {
      id: 'profile',
      label: 'Profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
    {
      id: 'privacy',
      label: 'Privacy',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
    },
    {
      id: 'dharma',
      label: 'Dharma Settings',
      icon: <span className="text-lg">ðŸ•‰ï¸</span>,
    },
    {
      id: 'security',
      label: 'Security',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
  ];

  const Toggle = ({ enabled, onChange, label, description }: { enabled: boolean; onChange: (val: boolean) => void; label: string; description?: string }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-orange-500' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-56 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-orange-50 text-orange-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-2xl font-bold">
                      {profile.firstName[0]}{profile.lastName[0]}
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{profile.firstName} {profile.lastName}</p>
                    <p className="text-sm text-gray-500">Member since {new Date(profile.createdAt).toLocaleDateString()}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-orange-100 text-orange-600 text-sm rounded-full capitalize">
                      {profile.role.toLowerCase()}
                    </span>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      {profile.emailVerified && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      {!profile.phoneVerified && (
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 text-sm font-medium hover:text-orange-600">
                          Verify
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700 border-b pb-2">Notification Channels</h3>
                  <Toggle
                    enabled={notifications.emailNotifications}
                    onChange={(val) => setNotifications({ ...notifications, emailNotifications: val })}
                    label="Email Notifications"
                    description="Receive notifications via email"
                  />
                  <Toggle
                    enabled={notifications.smsNotifications}
                    onChange={(val) => setNotifications({ ...notifications, smsNotifications: val })}
                    label="SMS Notifications"
                    description="Receive notifications via text message"
                  />
                  <Toggle
                    enabled={notifications.pushNotifications}
                    onChange={(val) => setNotifications({ ...notifications, pushNotifications: val })}
                    label="Push Notifications"
                    description="Receive browser push notifications"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700 border-b pb-2">Property Alerts</h3>
                  <Toggle
                    enabled={notifications.newListings}
                    onChange={(val) => setNotifications({ ...notifications, newListings: val })}
                    label="New Listings"
                    description="Get notified when new properties match your criteria"
                  />
                  <Toggle
                    enabled={notifications.priceChanges}
                    onChange={(val) => setNotifications({ ...notifications, priceChanges: val })}
                    label="Price Changes"
                    description="Get notified when saved property prices change"
                  />
                  <Toggle
                    enabled={notifications.openHouses}
                    onChange={(val) => setNotifications({ ...notifications, openHouses: val })}
                    label="Open Houses"
                    description="Get notified about upcoming open houses"
                  />
                  <Toggle
                    enabled={notifications.savedSearchAlerts}
                    onChange={(val) => setNotifications({ ...notifications, savedSearchAlerts: val })}
                    label="Saved Search Alerts"
                    description="Receive alerts for your saved searches"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700 border-b pb-2">Transaction Updates</h3>
                  <Toggle
                    enabled={notifications.offerUpdates}
                    onChange={(val) => setNotifications({ ...notifications, offerUpdates: val })}
                    label="Offer Updates"
                    description="Get notified about offer status changes"
                  />
                  <Toggle
                    enabled={notifications.documentUpdates}
                    onChange={(val) => setNotifications({ ...notifications, documentUpdates: val })}
                    label="Document Updates"
                    description="Get notified when documents need attention"
                  />
                  <Toggle
                    enabled={notifications.showingReminders}
                    onChange={(val) => setNotifications({ ...notifications, showingReminders: val })}
                    label="Showing Reminders"
                    description="Receive reminders before scheduled showings"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700 border-b pb-2">Marketing</h3>
                  <Toggle
                    enabled={notifications.marketReports}
                    onChange={(val) => setNotifications({ ...notifications, marketReports: val })}
                    label="Market Reports"
                    description="Weekly market insights and trends"
                  />
                  <Toggle
                    enabled={notifications.newsletter}
                    onChange={(val) => setNotifications({ ...notifications, newsletter: val })}
                    label="Newsletter"
                    description="Monthly newsletter with tips and updates"
                  />
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Privacy Settings</h2>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700 border-b pb-2">Profile Visibility</h3>
                  <div className="space-y-3">
                    {['PUBLIC', 'AGENTS_ONLY', 'PRIVATE'].map((option) => (
                      <label key={option} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="visibility"
                          checked={privacy.profileVisibility === option}
                          onChange={() => setPrivacy({ ...privacy, profileVisibility: option as any })}
                          className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                        />
                        <div>
                          <p className="font-medium text-gray-900 capitalize">{option.toLowerCase().replace('_', ' ')}</p>
                          <p className="text-sm text-gray-500">
                            {option === 'PUBLIC' && 'Anyone can view your profile'}
                            {option === 'AGENTS_ONLY' && 'Only verified agents can view your profile'}
                            {option === 'PRIVATE' && 'Your profile is hidden from everyone'}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700 border-b pb-2">Data Sharing</h3>
                  <Toggle
                    enabled={privacy.showContactInfo}
                    onChange={(val) => setPrivacy({ ...privacy, showContactInfo: val })}
                    label="Show Contact Information"
                    description="Allow others to see your phone and email"
                  />
                  <Toggle
                    enabled={privacy.showSearchHistory}
                    onChange={(val) => setPrivacy({ ...privacy, showSearchHistory: val })}
                    label="Search History"
                    description="Use search history for personalized recommendations"
                  />
                  <Toggle
                    enabled={privacy.allowDataAnalytics}
                    onChange={(val) => setPrivacy({ ...privacy, allowDataAnalytics: val })}
                    label="Analytics"
                    description="Help improve our service with anonymous usage data"
                  />
                  <Toggle
                    enabled={privacy.shareWithPartners}
                    onChange={(val) => setPrivacy({ ...privacy, shareWithPartners: val })}
                    label="Partner Sharing"
                    description="Share data with trusted partners for offers"
                  />
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium text-gray-700 mb-4">Data Management</h3>
                  <div className="flex gap-4">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download My Data
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete My Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">App Preferences</h2>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={preferences.language}
                      onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="en">English</option>
                      <option value="hi">à¤¹à¤¿à¤‚à¤¦à¥€ (Hindi)</option>
                      <option value="mr">à¤®à¤°à¤¾à¤ à¥€ (Marathi)</option>
                      <option value="gu">àª—à«àªœàª°àª¾àª¤à«€ (Gujarati)</option>
                      <option value="ta">à®¤à®®à®¿à®´à¯ (Tamil)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select
                      value={preferences.currency}
                      onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="INR">â‚¹ INR (Indian Rupee)</option>
                      <option value="USD">$ USD (US Dollar)</option>
                      <option value="GBP">Â£ GBP (British Pound)</option>
                      <option value="EUR">â‚¬ EUR (Euro)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select
                      value={preferences.timezone}
                      onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="Asia/Kolkata">India Standard Time (IST)</option>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Measurement Unit</label>
                    <select
                      value={preferences.measurementUnit}
                      onChange={(e) => setPreferences({ ...preferences, measurementUnit: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="SQFT">Square Feet (sq ft)</option>
                      <option value="SQMT">Square Meters (sq m)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                    <select
                      value={preferences.dateFormat}
                      onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Results Per Page</label>
                    <select
                      value={preferences.resultsPerPage}
                      onChange={(e) => setPreferences({ ...preferences, resultsPerPage: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700 border-b pb-2">Display</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                    <div className="flex gap-4">
                      {['LIGHT', 'DARK', 'SYSTEM'].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => setPreferences({ ...preferences, theme: theme as any })}
                          className={`flex-1 p-4 border-2 rounded-lg text-center transition-colors ${
                            preferences.theme === theme
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="mb-2">
                            {theme === 'LIGHT' && (
                              <svg className="w-8 h-8 mx-auto text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                            )}
                            {theme === 'DARK' && (
                              <svg className="w-8 h-8 mx-auto text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                              </svg>
                            )}
                            {theme === 'SYSTEM' && (
                              <svg className="w-8 h-8 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            )}
                          </div>
                          <p className="font-medium text-gray-900 capitalize">{theme.toLowerCase()}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Default View</label>
                    <div className="flex gap-4">
                      {['LIST', 'GRID', 'MAP'].map((view) => (
                        <button
                          key={view}
                          onClick={() => setPreferences({ ...preferences, defaultView: view as any })}
                          className={`flex-1 p-3 border-2 rounded-lg text-center transition-colors ${
                            preferences.defaultView === view
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <p className="font-medium text-gray-900 capitalize">{view.toLowerCase()}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dharma Settings Tab */}
            {activeTab === 'dharma' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span>ðŸ•‰ï¸</span> Dharma Settings
                </h2>
                <p className="text-gray-600">Configure Vastu Shastra and Jyotish preferences for property recommendations</p>
                
                {/* Vastu Settings */}
                <div className="space-y-4 p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">Vastu Shastra Analysis</h3>
                    <Toggle
                      enabled={vastu.enabled}
                      onChange={(val) => setVastu({ ...vastu, enabled: val })}
                      label=""
                    />
                  </div>
                  
                  {vastu.enabled && (
                    <div className="space-y-4 pt-4 border-t border-orange-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Vastu Score: {vastu.minScore}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={vastu.minScore}
                          onChange={(e) => setVastu({ ...vastu, minScore: parseInt(e.target.value) })}
                          className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Priority Factors</label>
                        <div className="flex flex-wrap gap-2">
                          {vastu.priorityFactors.map((factor, index) => (
                            <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                              {factor}
                              <button onClick={() => setVastu({ ...vastu, priorityFactors: vastu.priorityFactors.filter((_, i) => i !== index) })}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Factors to Avoid</label>
                        <div className="flex flex-wrap gap-2">
                          {vastu.avoidFactors.map((factor, index) => (
                            <span key={index} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-1">
                              {factor}
                              <button onClick={() => setVastu({ ...vastu, avoidFactors: vastu.avoidFactors.filter((_, i) => i !== index) })}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Jyotish Settings */}
                <div className="space-y-4 p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">Jyotish (Vedic Astrology)</h3>
                    <Toggle
                      enabled={astrology.enabled}
                      onChange={(val) => setAstrology({ ...astrology, enabled: val })}
                      label=""
                    />
                  </div>
                  
                  {astrology.enabled && (
                    <div className="space-y-4 pt-4 border-t border-purple-200">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
                          <input
                            type="date"
                            value={astrology.birthDate}
                            onChange={(e) => setAstrology({ ...astrology, birthDate: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Birth Time</label>
                          <input
                            type="time"
                            value={astrology.birthTime}
                            onChange={(e) => setAstrology({ ...astrology, birthTime: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Birth Place</label>
                          <input
                            type="text"
                            value={astrology.birthPlace}
                            onChange={(e) => setAstrology({ ...astrology, birthPlace: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                      </div>
                      
                      <Toggle
                        enabled={astrology.considerMuhurat}
                        onChange={(val) => setAstrology({ ...astrology, considerMuhurat: val })}
                        label="Consider Muhurat"
                        description="Show auspicious dates for property transactions"
                      />
                      <Toggle
                        enabled={astrology.considerDirections}
                        onChange={(val) => setAstrology({ ...astrology, considerDirections: val })}
                        label="Consider Favorable Directions"
                        description="Factor in astrologically favorable directions"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700 border-b pb-2">Password</h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Password</p>
                      <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                    </div>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                      Change Password
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700 border-b pb-2">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">
                        {profile.twoFactorEnabled
                          ? 'Enabled - Your account is protected with 2FA'
                          : 'Not enabled - Add an extra layer of security'}
                      </p>
                    </div>
                    <button className={`px-4 py-2 rounded-lg ${
                      profile.twoFactorEnabled
                        ? 'border border-red-300 text-red-600 hover:bg-red-50'
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                    }`}>
                      {profile.twoFactorEnabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700 border-b pb-2">Connected Devices</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Chrome on Windows', location: 'Mumbai, India', lastActive: 'Active now', current: true },
                      { name: 'Safari on iPhone', location: 'Mumbai, India', lastActive: '2 hours ago', current: false },
                      { name: 'Chrome on MacBook', location: 'Pune, India', lastActive: '3 days ago', current: false },
                    ].map((device, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-gray-200 rounded-lg">
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 flex items-center gap-2">
                              {device.name}
                              {device.current && (
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                  This device
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-500">{device.location} â€¢ {device.lastActive}</p>
                          </div>
                        </div>
                        {!device.current && (
                          <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                            Sign out
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700 border-b pb-2">Login History</h3>
                  <div className="space-y-2">
                    {[
                      { time: 'Today, 10:30 AM', location: 'Mumbai, India', device: 'Chrome on Windows', success: true },
                      { time: 'Yesterday, 8:15 PM', location: 'Mumbai, India', device: 'Safari on iPhone', success: true },
                      { time: '2 days ago', location: 'Unknown Location', device: 'Unknown Device', success: false },
                    ].map((login, index) => (
                      <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                        login.success ? 'bg-gray-50' : 'bg-red-50'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${login.success ? 'bg-green-500' : 'bg-red-500'}`} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{login.time}</p>
                            <p className="text-xs text-gray-500">{login.device} â€¢ {login.location}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-medium ${login.success ? 'text-green-600' : 'text-red-600'}`}>
                          {login.success ? 'Successful' : 'Failed'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowPasswordModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600">
                  Update Password
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
                <p className="text-gray-600 mt-2">
                  This action cannot be undone. All your data, saved properties, and history will be permanently deleted.
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type "DELETE" to confirm
                </label>
                <input
                  type="text"
                  placeholder="DELETE"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Delete Account
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'MONTHLY' | 'YEARLY';
  features: string[];
  limits: {
    savedSearches: number;
    favoriteProperties: number;
    agentMessages: number;
    vastuAnalysis: number;
    astrologyReports: number;
  };
  popular?: boolean;
}

interface Subscription {
  id: string;
  planId: string;
  planName: string;
  status: 'ACTIVE' | 'CANCELLED' | 'PAST_DUE' | 'TRIAL';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEndsAt?: string;
}

interface Usage {
  savedSearches: { used: number; limit: number };
  favoriteProperties: { used: number; limit: number };
  agentMessages: { used: number; limit: number };
  vastuAnalysis: { used: number; limit: number };
  astrologyReports: { used: number; limit: number };
}

interface PaymentMethod {
  id: string;
  type: 'CARD' | 'UPI' | 'NETBANKING';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  upiId?: string;
  bankName?: string;
  isDefault: boolean;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'FAILED';
  description: string;
  pdfUrl: string;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started',
    price: 0,
    billingCycle: 'MONTHLY',
    features: [
      'Browse unlimited properties',
      'Basic property search',
      'Save up to 5 properties',
      '2 saved searches',
      'Email support',
    ],
    limits: {
      savedSearches: 2,
      favoriteProperties: 5,
      agentMessages: 10,
      vastuAnalysis: 1,
      astrologyReports: 0,
    },
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'For active home seekers',
    price: 499,
    billingCycle: 'MONTHLY',
    features: [
      'Everything in Free',
      'Save up to 25 properties',
      '10 saved searches with alerts',
      'Unlimited agent messaging',
      'Basic Vastu analysis',
      'Priority support',
    ],
    limits: {
      savedSearches: 10,
      favoriteProperties: 25,
      agentMessages: -1,
      vastuAnalysis: 10,
      astrologyReports: 2,
    },
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Complete dharmic property search',
    price: 999,
    billingCycle: 'MONTHLY',
    popular: true,
    features: [
      'Everything in Basic',
      'Unlimited saved properties',
      'Unlimited saved searches',
      'Advanced Vastu analysis',
      'Jyotish compatibility reports',
      'Muhurat recommendations',
      'Dedicated support',
      'Early access to new features',
    ],
    limits: {
      savedSearches: -1,
      favoriteProperties: -1,
      agentMessages: -1,
      vastuAnalysis: -1,
      astrologyReports: -1,
    },
  },
  {
    id: 'agent',
    name: 'Agent Pro',
    description: 'For real estate professionals',
    price: 2999,
    billingCycle: 'MONTHLY',
    features: [
      'Everything in Premium',
      'List unlimited properties',
      'Lead management tools',
      'Client CRM',
      'Analytics dashboard',
      'Blockchain verification',
      'White-label reports',
      'API access',
    ],
    limits: {
      savedSearches: -1,
      favoriteProperties: -1,
      agentMessages: -1,
      vastuAnalysis: -1,
      astrologyReports: -1,
    },
  },
];

const mockSubscription: Subscription = {
  id: 'sub-1',
  planId: 'basic',
  planName: 'Basic',
  status: 'ACTIVE',
  currentPeriodStart: '2024-11-15',
  currentPeriodEnd: '2024-12-15',
  cancelAtPeriodEnd: false,
};

const mockUsage: Usage = {
  savedSearches: { used: 6, limit: 10 },
  favoriteProperties: { used: 18, limit: 25 },
  agentMessages: { used: 45, limit: -1 },
  vastuAnalysis: { used: 3, limit: 10 },
  astrologyReports: { used: 1, limit: 2 },
};

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm-1',
    type: 'CARD',
    last4: '4242',
    brand: 'Visa',
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
  },
  {
    id: 'pm-2',
    type: 'UPI',
    upiId: 'rajesh@upi',
    isDefault: false,
  },
];

const mockInvoices: Invoice[] = [
  { id: 'inv-1', date: '2024-11-15', amount: 499, status: 'PAID', description: 'Basic Plan - November 2024', pdfUrl: '#' },
  { id: 'inv-2', date: '2024-10-15', amount: 499, status: 'PAID', description: 'Basic Plan - October 2024', pdfUrl: '#' },
  { id: 'inv-3', date: '2024-09-15', amount: 499, status: 'PAID', description: 'Basic Plan - September 2024', pdfUrl: '#' },
];

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription>(mockSubscription);
  const [usage, setUsage] = useState<Usage>(mockUsage);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleUpgrade = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowUpgradeModal(true);
  };

  const confirmUpgrade = () => {
    if (selectedPlan) {
      setSubscription({
        ...subscription,
        planId: selectedPlan.id,
        planName: selectedPlan.name,
      });
      setShowUpgradeModal(false);
      setSelectedPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const currentPlan = plans.find(p => p.id === subscription.planId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscription</h1>
        <p className="text-gray-600">Manage your plan, billing, and usage</p>
      </div>

      {/* Current Plan Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-6 text-white"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-orange-100 text-sm">Current Plan</p>
            <h2 className="text-3xl font-bold mt-1">{subscription.planName}</h2>
            <p className="text-orange-100 mt-2">
              {subscription.status === 'ACTIVE' && !subscription.cancelAtPeriodEnd && (
                <>Renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</>
              )}
              {subscription.cancelAtPeriodEnd && (
                <>Expires on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</>
              )}
              {subscription.status === 'TRIAL' && subscription.trialEndsAt && (
                <>Trial ends on {new Date(subscription.trialEndsAt).toLocaleDateString()}</>
              )}
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">{formatPrice(currentPlan?.price || 0)}</p>
            <p className="text-orange-100">per month</p>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setShowCancelModal(true)}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
          >
            {subscription.cancelAtPeriodEnd ? 'Reactivate' : 'Cancel Plan'}
          </button>
          {currentPlan?.id !== 'agent' && (
            <button
              onClick={() => handleUpgrade(plans.find(p => p.id === 'premium') || plans[2])}
              className="px-4 py-2 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors"
            >
              Upgrade Plan
            </button>
          )}
        </div>
      </motion.div>

      {/* Usage Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage This Period</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: 'Saved Searches', ...usage.savedSearches, icon: 'ðŸ”' },
            { label: 'Favorite Properties', ...usage.favoriteProperties, icon: 'â¤ï¸' },
            { label: 'Agent Messages', ...usage.agentMessages, icon: 'ðŸ’¬' },
            { label: 'Vastu Analysis', ...usage.vastuAnalysis, icon: 'ðŸ•‰ï¸' },
            { label: 'Astrology Reports', ...usage.astrologyReports, icon: 'â­' },
          ].map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 flex items-center gap-2">
                  <span>{item.icon}</span>
                  {item.label}
                </span>
                <span className="text-sm text-gray-500">
                  {item.used} / {item.limit === -1 ? 'âˆž' : item.limit}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    item.limit === -1 ? 'bg-green-500' : getUsageColor(getUsagePercentage(item.used, item.limit))
                  }`}
                  style={{ width: item.limit === -1 ? '100%' : `${getUsagePercentage(item.used, item.limit)}%` }}
                />
              </div>
              {item.limit !== -1 && getUsagePercentage(item.used, item.limit) >= 80 && (
                <p className="text-xs text-yellow-600">
                  {item.limit - item.used} remaining
                </p>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Available Plans */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Available Plans</h3>
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setBillingCycle('MONTHLY')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'MONTHLY' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('YEARLY')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'YEARLY' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
              }`}
            >
              Yearly
              <span className="ml-1 text-green-600 text-xs">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-xl border-2 p-6 transition-all ${
                plan.popular ? 'border-orange-500 shadow-lg' : 'border-gray-200'
              } ${subscription.planId === plan.id ? 'ring-2 ring-orange-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
                  Most Popular
                </div>
              )}
              {subscription.planId === plan.id && (
                <div className="absolute top-4 right-4">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
              <h4 className="text-lg font-semibold text-gray-900">{plan.name}</h4>
              <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(billingCycle === 'YEARLY' ? plan.price * 10 : plan.price)}
                </span>
                <span className="text-gray-500">/{billingCycle === 'YEARLY' ? 'year' : 'month'}</span>
              </div>
              <ul className="mt-4 space-y-2">
                {plan.features.slice(0, 5).map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
                {plan.features.length > 5 && (
                  <li className="text-sm text-orange-500 font-medium">
                    +{plan.features.length - 5} more features
                  </li>
                )}
              </ul>
              <button
                onClick={() => handleUpgrade(plan)}
                disabled={subscription.planId === plan.id}
                className={`w-full mt-6 py-2 rounded-lg font-medium transition-colors ${
                  subscription.planId === plan.id
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {subscription.planId === plan.id ? 'Current Plan' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Payment Methods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="px-4 py-2 text-orange-500 hover:text-orange-600 font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New
          </button>
        </div>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                method.isDefault ? 'border-orange-200 bg-orange-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                  {method.type === 'CARD' && (
                    <span className="text-sm font-bold text-gray-600">{method.brand}</span>
                  )}
                  {method.type === 'UPI' && <span className="text-lg">ðŸ“±</span>}
                  {method.type === 'NETBANKING' && <span className="text-lg">ðŸ¦</span>}
                </div>
                <div>
                  {method.type === 'CARD' && (
                    <>
                      <p className="font-medium text-gray-900">â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢ {method.last4}</p>
                      <p className="text-sm text-gray-500">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </p>
                    </>
                  )}
                  {method.type === 'UPI' && (
                    <p className="font-medium text-gray-900">{method.upiId}</p>
                  )}
                  {method.type === 'NETBANKING' && (
                    <p className="font-medium text-gray-900">{method.bankName}</p>
                  )}
                </div>
                {method.isDefault && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded">
                    Default
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!method.isDefault && (
                  <button className="text-sm text-gray-500 hover:text-gray-700">Set as default</button>
                )}
                <button className="text-sm text-red-500 hover:text-red-600">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Billing History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b last:border-0">
                  <td className="py-4 text-gray-900">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="py-4 text-gray-600">{invoice.description}</td>
                  <td className="py-4 font-medium text-gray-900">{formatPrice(invoice.amount)}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      invoice.status === 'PAID' ? 'bg-green-100 text-green-700' :
                      invoice.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <a
                      href={invoice.pdfUrl}
                      className="text-orange-500 hover:text-orange-600 flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowUpgradeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedPlan.price > (currentPlan?.price || 0) ? 'Upgrade' : 'Change'} to {selectedPlan.name}
              </h3>
              <p className="text-gray-600 mt-2">
                {selectedPlan.price > (currentPlan?.price || 0) ? (
                  <>You&apos;ll be charged the prorated difference immediately.</>
                ) : (
                  <>Your plan will change at the end of your current billing period.</>
                )}
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">New plan</span>
                  <span className="font-medium">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Price</span>
                  <span className="font-medium">{formatPrice(selectedPlan.price)}/month</span>
                </div>
                {selectedPlan.price > (currentPlan?.price || 0) && (
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="text-gray-600">Due today (prorated)</span>
                    <span className="font-bold text-orange-600">
                      {formatPrice(Math.round((selectedPlan.price - (currentPlan?.price || 0)) / 2))}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmUpgrade}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowCancelModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {subscription.cancelAtPeriodEnd ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-900">Reactivate Subscription</h3>
                  <p className="text-gray-600 mt-2">
                    Your subscription will continue and you won&apos;t lose access to any features.
                  </p>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowCancelModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setSubscription({ ...subscription, cancelAtPeriodEnd: false });
                        setShowCancelModal(false);
                      }}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600"
                    >
                      Reactivate
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-900">Cancel Subscription</h3>
                  <p className="text-gray-600 mt-2">
                    Your subscription will remain active until {new Date(subscription.currentPeriodEnd).toLocaleDateString()}.
                    After that, you&apos;ll lose access to premium features.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-yellow-800">
                      <strong>What you&apos;ll lose:</strong>
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-yellow-700">
                      <li>â€¢ Unlimited saved searches</li>
                      <li>â€¢ Advanced Vastu analysis</li>
                      <li>â€¢ Jyotish compatibility reports</li>
                      <li>â€¢ Priority support</li>
                    </ul>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowCancelModal(false)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600"
                    >
                      Keep Subscription
                    </button>
                    <button
                      onClick={() => {
                        setSubscription({ ...subscription, cancelAtPeriodEnd: true });
                        setShowCancelModal(false);
                      }}
                      className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                    >
                      Cancel Anyway
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Payment Method Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Payment Method</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {['Card', 'UPI', 'Netbanking'].map((type) => (
                    <button
                      key={type}
                      className="p-4 border-2 border-gray-200 rounded-lg text-center hover:border-orange-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
                    >
                      <span className="text-2xl">
                        {type === 'Card' ? 'ðŸ’³' : type === 'UPI' ? 'ðŸ“±' : 'ðŸ¦'}
                      </span>
                      <p className="text-sm font-medium mt-1">{type}</p>
                    </button>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500" />
                  <span className="text-sm text-gray-600">Set as default payment method</span>
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600"
                >
                  Add Card
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  type: 'BUYER' | 'SELLER' | 'BOTH';
  status: 'ACTIVE' | 'INACTIVE' | 'LEAD' | 'CLOSED';
  source: 'REFERRAL' | 'WEBSITE' | 'SOCIAL_MEDIA' | 'COLD_CALL' | 'OPEN_HOUSE' | 'OTHER';
  budget?: { min: number; max: number };
  preferredLocations?: string[];
  propertyType?: string[];
  notes?: string;
  assignedAt: string;
  lastContact: string;
  nextFollowUp?: string;
  tags: string[];
  properties: {
    interested: number;
    viewed: number;
    offers: number;
    closed: number;
  };
  transactions: {
    id: string;
    propertyTitle: string;
    status: 'PENDING' | 'ACTIVE' | 'CLOSED' | 'CANCELLED';
    amount: number;
    role: 'BUYER' | 'SELLER';
  }[];
}

interface ClientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  type: 'BUYER' | 'SELLER' | 'BOTH';
  source: string;
  budgetMin: string;
  budgetMax: string;
  preferredLocations: string;
  notes: string;
}

const mockClients: Client[] = [
  {
    id: 'client-1',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 11111',
    type: 'BUYER',
    status: 'ACTIVE',
    source: 'REFERRAL',
    budget: { min: 8000000, max: 12000000 },
    preferredLocations: ['Bandra', 'Juhu', 'Andheri West'],
    propertyType: ['Apartment', 'Penthouse'],
    notes: 'Looking for 3BHK with sea view. Prefers Vastu-compliant properties.',
    assignedAt: '2024-09-15',
    lastContact: '2024-11-28',
    nextFollowUp: '2024-12-05',
    tags: ['Premium', 'Vastu Required', 'Quick Decision'],
    properties: { interested: 8, viewed: 5, offers: 2, closed: 0 },
    transactions: [],
  },
  {
    id: 'client-2',
    firstName: 'Amit',
    lastName: 'Patel',
    email: 'amit.patel@example.com',
    phone: '+91 98765 22222',
    type: 'SELLER',
    status: 'ACTIVE',
    source: 'WEBSITE',
    notes: 'Selling 2 properties in Worli. Wants quick sale.',
    assignedAt: '2024-10-01',
    lastContact: '2024-11-30',
    nextFollowUp: '2024-12-02',
    tags: ['Motivated Seller', 'Multiple Properties'],
    properties: { interested: 0, viewed: 0, offers: 3, closed: 1 },
    transactions: [
      { id: 'txn-1', propertyTitle: 'Worli Sea Face Apartment', status: 'ACTIVE', amount: 45000000, role: 'SELLER' },
    ],
  },
  {
    id: 'client-3',
    firstName: 'Neha',
    lastName: 'Gupta',
    email: 'neha.gupta@example.com',
    phone: '+91 98765 33333',
    type: 'BOTH',
    status: 'ACTIVE',
    source: 'SOCIAL_MEDIA',
    budget: { min: 15000000, max: 25000000 },
    preferredLocations: ['Powai', 'Ghatkopar'],
    notes: 'Selling current home and upgrading. Interested in Jyotish-compatible properties.',
    assignedAt: '2024-08-20',
    lastContact: '2024-11-25',
    tags: ['Upgrade', 'Jyotish', 'Flexible Timeline'],
    properties: { interested: 12, viewed: 8, offers: 1, closed: 0 },
    transactions: [],
  },
  {
    id: 'client-4',
    firstName: 'Rajesh',
    lastName: 'Mehta',
    email: 'rajesh.mehta@example.com',
    phone: '+91 98765 44444',
    type: 'BUYER',
    status: 'LEAD',
    source: 'OPEN_HOUSE',
    budget: { min: 5000000, max: 8000000 },
    preferredLocations: ['Thane', 'Navi Mumbai'],
    assignedAt: '2024-11-20',
    lastContact: '2024-11-20',
    nextFollowUp: '2024-12-01',
    tags: ['First-Time Buyer', 'Loan Required'],
    properties: { interested: 3, viewed: 1, offers: 0, closed: 0 },
    transactions: [],
  },
  {
    id: 'client-5',
    firstName: 'Sunita',
    lastName: 'Rao',
    email: 'sunita.rao@example.com',
    phone: '+91 98765 55555',
    type: 'SELLER',
    status: 'CLOSED',
    source: 'REFERRAL',
    assignedAt: '2024-06-01',
    lastContact: '2024-10-15',
    tags: ['Completed', 'Referral Source'],
    properties: { interested: 0, viewed: 0, offers: 5, closed: 1 },
    transactions: [
      { id: 'txn-2', propertyTitle: 'Colaba Heritage Flat', status: 'CLOSED', amount: 85000000, role: 'SELLER' },
    ],
  },
];

export default function ClientsPage() {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [filteredClients, setFilteredClients] = useState<Client[]>(mockClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState<ClientFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    type: 'BUYER',
    source: 'WEBSITE',
    budgetMin: '',
    budgetMax: '',
    preferredLocations: '',
    notes: '',
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  useEffect(() => {
    let filtered = clients;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (client) =>
          client.firstName.toLowerCase().includes(query) ||
          client.lastName.toLowerCase().includes(query) ||
          client.email.toLowerCase().includes(query) ||
          client.phone.includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((client) => client.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((client) => client.type === typeFilter || client.type === 'BOTH');
    }

    setFilteredClients(filtered);
  }, [clients, searchQuery, statusFilter, typeFilter]);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `â‚¹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `â‚¹${(price / 100000).toFixed(1)}L`;
    }
    return `â‚¹${price.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-700';
      case 'LEAD': return 'bg-blue-100 text-blue-700';
      case 'INACTIVE': return 'bg-gray-100 text-gray-700';
      case 'CLOSED': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'BUYER': return 'bg-teal-100 text-teal-700';
      case 'SELLER': return 'bg-orange-100 text-orange-700';
      case 'BOTH': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const stats = {
    total: clients.length,
    active: clients.filter((c) => c.status === 'ACTIVE').length,
    leads: clients.filter((c) => c.status === 'LEAD').length,
    closed: clients.filter((c) => c.status === 'CLOSED').length,
  };

  const handleAddClient = () => {
    const client: Client = {
      id: `client-${Date.now()}`,
      firstName: newClient.firstName,
      lastName: newClient.lastName,
      email: newClient.email,
      phone: newClient.phone,
      type: newClient.type,
      status: 'LEAD',
      source: newClient.source as any,
      budget: newClient.budgetMin && newClient.budgetMax ? {
        min: parseInt(newClient.budgetMin),
        max: parseInt(newClient.budgetMax),
      } : undefined,
      preferredLocations: newClient.preferredLocations ? newClient.preferredLocations.split(',').map(s => s.trim()) : [],
      notes: newClient.notes,
      assignedAt: new Date().toISOString().split('T')[0],
      lastContact: new Date().toISOString().split('T')[0],
      tags: [],
      properties: { interested: 0, viewed: 0, offers: 0, closed: 0 },
      transactions: [],
    };
    setClients([client, ...clients]);
    setShowAddModal(false);
    setNewClient({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      type: 'BUYER',
      source: 'WEBSITE',
      budgetMin: '',
      budgetMax: '',
      preferredLocations: '',
      notes: '',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600">Manage your client relationships</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Client
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Clients', value: stats.total, icon: 'ðŸ‘¥', color: 'bg-blue-50 text-blue-600' },
          { label: 'Active', value: stats.active, icon: 'âœ…', color: 'bg-green-50 text-green-600' },
          { label: 'Leads', value: stats.leads, icon: 'ðŸŽ¯', color: 'bg-yellow-50 text-yellow-600' },
          { label: 'Closed Deals', value: stats.closed, icon: 'ðŸŽ‰', color: 'bg-purple-50 text-purple-600' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-xl ${stat.color}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
            <p className="text-sm mt-2 opacity-80">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="all">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="LEAD">Lead</option>
          <option value="INACTIVE">Inactive</option>
          <option value="CLOSED">Closed</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="all">All Types</option>
          <option value="BUYER">Buyers</option>
          <option value="SELLER">Sellers</option>
        </select>
      </div>

      {/* Clients List */}
      <div className="grid gap-4">
        {filteredClients.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-500">No clients found</p>
          </div>
        ) : (
          filteredClients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedClient(client);
                setShowClientModal(true);
              }}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                  {client.firstName[0]}{client.lastName[0]}
                </div>

                {/* Main Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {client.firstName} {client.lastName}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(client.type)}`}>
                      {client.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {client.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {client.phone}
                    </span>
                  </div>
                  {client.budget && (
                    <p className="text-sm text-gray-600 mt-2">
                      Budget: {formatPrice(client.budget.min)} - {formatPrice(client.budget.max)}
                    </p>
                  )}
                  {client.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {client.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-center">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{client.properties.viewed}</p>
                    <p className="text-xs text-gray-500">Viewed</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{client.properties.offers}</p>
                    <p className="text-xs text-gray-500">Offers</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-green-600">{client.properties.closed}</p>
                    <p className="text-xs text-gray-500">Closed</p>
                  </div>
                </div>

                {/* Follow-up */}
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-500">Last Contact</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(client.lastContact).toLocaleDateString()}
                  </p>
                  {client.nextFollowUp && (
                    <>
                      <p className="text-xs text-gray-500 mt-2">Next Follow-up</p>
                      <p className={`text-sm font-medium ${
                        new Date(client.nextFollowUp) < new Date() ? 'text-red-600' : 'text-orange-600'
                      }`}>
                        {new Date(client.nextFollowUp).toLocaleDateString()}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Client Detail Modal */}
      <AnimatePresence>
        {showClientModal && selectedClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowClientModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-xl font-bold">
                    {selectedClient.firstName[0]}{selectedClient.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedClient.firstName} {selectedClient.lastName}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(selectedClient.type)}`}>
                        {selectedClient.type}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedClient.status)}`}>
                        {selectedClient.status}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowClientModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Contact Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm text-gray-900">{selectedClient.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm text-gray-900">{selectedClient.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                {(selectedClient.budget || selectedClient.preferredLocations) && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Preferences</h3>
                    <div className="space-y-3">
                      {selectedClient.budget && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-sm">Budget:</span>
                          <span className="font-medium">{formatPrice(selectedClient.budget.min)} - {formatPrice(selectedClient.budget.max)}</span>
                        </div>
                      )}
                      {selectedClient.preferredLocations && selectedClient.preferredLocations.length > 0 && (
                        <div className="flex items-start gap-2">
                          <span className="text-gray-500 text-sm">Locations:</span>
                          <div className="flex flex-wrap gap-1">
                            {selectedClient.preferredLocations.map((loc, i) => (
                              <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-sm rounded-full">
                                {loc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedClient.notes && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
                    <p className="text-gray-600 bg-yellow-50 p-3 rounded-lg">{selectedClient.notes}</p>
                  </div>
                )}

                {/* Activity */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Activity</h3>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{selectedClient.properties.interested}</p>
                      <p className="text-xs text-gray-500">Interested</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{selectedClient.properties.viewed}</p>
                      <p className="text-xs text-gray-500">Viewed</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{selectedClient.properties.offers}</p>
                      <p className="text-xs text-gray-500">Offers</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{selectedClient.properties.closed}</p>
                      <p className="text-xs text-gray-500">Closed</p>
                    </div>
                  </div>
                </div>

                {/* Transactions */}
                {selectedClient.transactions.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Transactions</h3>
                    <div className="space-y-2">
                      {selectedClient.transactions.map((txn) => (
                        <div key={txn.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{txn.propertyTitle}</p>
                            <p className="text-sm text-gray-500">{txn.role} â€¢ {formatPrice(txn.amount)}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            txn.status === 'CLOSED' ? 'bg-green-100 text-green-700' :
                            txn.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {txn.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Message
                  </button>
                  <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call
                  </button>
                  <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Schedule
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Client Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">Add New Client</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      value={newClient.firstName}
                      onChange={(e) => setNewClient({ ...newClient, firstName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={newClient.lastName}
                      onChange={(e) => setNewClient({ ...newClient, lastName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client Type</label>
                    <select
                      value={newClient.type}
                      onChange={(e) => setNewClient({ ...newClient, type: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="BUYER">Buyer</option>
                      <option value="SELLER">Seller</option>
                      <option value="BOTH">Both</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                    <select
                      value={newClient.source}
                      onChange={(e) => setNewClient({ ...newClient, source: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="WEBSITE">Website</option>
                      <option value="REFERRAL">Referral</option>
                      <option value="SOCIAL_MEDIA">Social Media</option>
                      <option value="OPEN_HOUSE">Open House</option>
                      <option value="COLD_CALL">Cold Call</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget Min (â‚¹)</label>
                    <input
                      type="number"
                      value={newClient.budgetMin}
                      onChange={(e) => setNewClient({ ...newClient, budgetMin: e.target.value })}
                      placeholder="e.g., 5000000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget Max (â‚¹)</label>
                    <input
                      type="number"
                      value={newClient.budgetMax}
                      onChange={(e) => setNewClient({ ...newClient, budgetMax: e.target.value })}
                      placeholder="e.g., 10000000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Locations</label>
                  <input
                    type="text"
                    value={newClient.preferredLocations}
                    onChange={(e) => setNewClient({ ...newClient, preferredLocations: e.target.value })}
                    placeholder="e.g., Bandra, Juhu, Andheri (comma-separated)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={newClient.notes}
                    onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
              <div className="p-6 border-t flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddClient}
                  disabled={!newClient.firstName || !newClient.lastName || !newClient.email || !newClient.phone}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 disabled:opacity-50"
                >
                  Add Client
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OpenHouse {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  propertyImage: string;
  propertyPrice: number;
  date: string;
  startTime: string;
  endTime: string;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  registrations: number;
  attendees: number;
  maxCapacity: number;
  description?: string;
  refreshments: boolean;
  virtualTour: boolean;
  vastuExpert: boolean;
  registeredVisitors: {
    id: string;
    name: string;
    email: string;
    phone: string;
    registeredAt: string;
    attended: boolean;
    notes?: string;
  }[];
  feedback?: {
    averageRating: number;
    totalResponses: number;
    interested: number;
  };
}

interface OpenHouseFormData {
  propertyId: string;
  date: string;
  startTime: string;
  endTime: string;
  maxCapacity: string;
  description: string;
  refreshments: boolean;
  virtualTour: boolean;
  vastuExpert: boolean;
}

const mockOpenHouses: OpenHouse[] = [
  {
    id: 'oh-1',
    propertyId: 'prop-1',
    propertyTitle: 'Luxury Sea-Facing Penthouse',
    propertyAddress: 'Bandra West, Mumbai',
    propertyImage: '/properties/penthouse-1.jpg',
    propertyPrice: 85000000,
    date: '2024-12-08',
    startTime: '10:00',
    endTime: '14:00',
    status: 'UPCOMING',
    registrations: 24,
    attendees: 0,
    maxCapacity: 30,
    description: 'Join us for an exclusive viewing of this stunning sea-facing penthouse with panoramic views.',
    refreshments: true,
    virtualTour: true,
    vastuExpert: true,
    registeredVisitors: [
      { id: 'v-1', name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 98765 11111', registeredAt: '2024-12-01', attended: false },
      { id: 'v-2', name: 'Amit Patel', email: 'amit@example.com', phone: '+91 98765 22222', registeredAt: '2024-12-02', attended: false },
    ],
  },
  {
    id: 'oh-2',
    propertyId: 'prop-2',
    propertyTitle: 'Modern 3BHK Apartment',
    propertyAddress: 'Powai, Mumbai',
    propertyImage: '/properties/apartment-2.jpg',
    propertyPrice: 25000000,
    date: '2024-12-01',
    startTime: '11:00',
    endTime: '15:00',
    status: 'COMPLETED',
    registrations: 18,
    attendees: 14,
    maxCapacity: 25,
    refreshments: true,
    virtualTour: false,
    vastuExpert: false,
    registeredVisitors: [],
    feedback: {
      averageRating: 4.2,
      totalResponses: 12,
      interested: 5,
    },
  },
  {
    id: 'oh-3',
    propertyId: 'prop-3',
    propertyTitle: 'Heritage Bungalow',
    propertyAddress: 'Malabar Hill, Mumbai',
    propertyImage: '/properties/bungalow-1.jpg',
    propertyPrice: 150000000,
    date: '2024-12-15',
    startTime: '09:00',
    endTime: '13:00',
    status: 'UPCOMING',
    registrations: 8,
    attendees: 0,
    maxCapacity: 15,
    description: 'Exclusive by-appointment viewing of this rare heritage property with Vastu consultation.',
    refreshments: true,
    virtualTour: true,
    vastuExpert: true,
    registeredVisitors: [],
  },
  {
    id: 'oh-4',
    propertyId: 'prop-4',
    propertyTitle: 'Studio Apartment',
    propertyAddress: 'Andheri West, Mumbai',
    propertyImage: '/properties/studio-1.jpg',
    propertyPrice: 8500000,
    date: '2024-11-25',
    startTime: '14:00',
    endTime: '17:00',
    status: 'CANCELLED',
    registrations: 5,
    attendees: 0,
    maxCapacity: 20,
    refreshments: false,
    virtualTour: false,
    vastuExpert: false,
    registeredVisitors: [],
  },
];

const mockProperties = [
  { id: 'prop-1', title: 'Luxury Sea-Facing Penthouse', address: 'Bandra West, Mumbai' },
  { id: 'prop-2', title: 'Modern 3BHK Apartment', address: 'Powai, Mumbai' },
  { id: 'prop-3', title: 'Heritage Bungalow', address: 'Malabar Hill, Mumbai' },
  { id: 'prop-5', title: '2BHK Garden Apartment', address: 'Juhu, Mumbai' },
  { id: 'prop-6', title: 'Duplex Villa', address: 'Worli, Mumbai' },
];

export default function OpenHousesPage() {
  const [loading, setLoading] = useState(true);
  const [openHouses, setOpenHouses] = useState<OpenHouse[]>(mockOpenHouses);
  const [filteredOpenHouses, setFilteredOpenHouses] = useState<OpenHouse[]>(mockOpenHouses);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOpenHouse, setSelectedOpenHouse] = useState<OpenHouse | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
  const [newOpenHouse, setNewOpenHouse] = useState<OpenHouseFormData>({
    propertyId: '',
    date: '',
    startTime: '',
    endTime: '',
    maxCapacity: '20',
    description: '',
    refreshments: false,
    virtualTour: false,
    vastuExpert: false,
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  useEffect(() => {
    let filtered = openHouses;
    if (statusFilter !== 'all') {
      filtered = filtered.filter((oh) => oh.status === statusFilter);
    }
    setFilteredOpenHouses(filtered);
  }, [openHouses, statusFilter]);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `â‚¹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `â‚¹${(price / 100000).toFixed(1)}L`;
    }
    return `â‚¹${price.toLocaleString()}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UPCOMING': return 'bg-blue-100 text-blue-700';
      case 'ACTIVE': return 'bg-green-100 text-green-700';
      case 'COMPLETED': return 'bg-purple-100 text-purple-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const stats = {
    total: openHouses.length,
    upcoming: openHouses.filter((oh) => oh.status === 'UPCOMING').length,
    completed: openHouses.filter((oh) => oh.status === 'COMPLETED').length,
    totalRegistrations: openHouses.reduce((sum, oh) => sum + oh.registrations, 0),
  };

  const handleCreateOpenHouse = () => {
    const property = mockProperties.find(p => p.id === newOpenHouse.propertyId);
    if (!property) return;

    const oh: OpenHouse = {
      id: `oh-${Date.now()}`,
      propertyId: newOpenHouse.propertyId,
      propertyTitle: property.title,
      propertyAddress: property.address,
      propertyImage: '/properties/default.jpg',
      propertyPrice: 50000000,
      date: newOpenHouse.date,
      startTime: newOpenHouse.startTime,
      endTime: newOpenHouse.endTime,
      status: 'UPCOMING',
      registrations: 0,
      attendees: 0,
      maxCapacity: parseInt(newOpenHouse.maxCapacity),
      description: newOpenHouse.description,
      refreshments: newOpenHouse.refreshments,
      virtualTour: newOpenHouse.virtualTour,
      vastuExpert: newOpenHouse.vastuExpert,
      registeredVisitors: [],
    };

    setOpenHouses([oh, ...openHouses]);
    setShowCreateModal(false);
    setNewOpenHouse({
      propertyId: '',
      date: '',
      startTime: '',
      endTime: '',
      maxCapacity: '20',
      description: '',
      refreshments: false,
      virtualTour: false,
      vastuExpert: false,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Open Houses</h1>
          <p className="text-gray-600">Schedule and manage property open house events</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Schedule Open House
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: stats.total, icon: 'ðŸ ', color: 'bg-blue-50 text-blue-600' },
          { label: 'Upcoming', value: stats.upcoming, icon: 'ðŸ“…', color: 'bg-green-50 text-green-600' },
          { label: 'Completed', value: stats.completed, icon: 'âœ…', color: 'bg-purple-50 text-purple-600' },
          { label: 'Total Registrations', value: stats.totalRegistrations, icon: 'ðŸ‘¥', color: 'bg-orange-50 text-orange-600' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-xl ${stat.color}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
            <p className="text-sm mt-2 opacity-80">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {['all', 'UPCOMING', 'COMPLETED', 'CANCELLED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'grid' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'calendar' ? 'bg-white shadow text-gray-900' : 'text-gray-600'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpenHouses.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-200">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500">No open houses found</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Schedule Open House
              </button>
            </div>
          ) : (
            filteredOpenHouses.map((oh, index) => (
              <motion.div
                key={oh.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedOpenHouse(oh);
                  setShowDetailModal(true);
                }}
              >
                {/* Property Image */}
                <div className="relative h-40 bg-gradient-to-br from-orange-100 to-amber-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl opacity-30">ðŸ </span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(oh.status)}`}>
                      {oh.status}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-black/60 text-white rounded-full text-xs font-medium">
                      {formatPrice(oh.propertyPrice)}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">{oh.propertyTitle}</h3>
                  <p className="text-sm text-gray-500 mb-3">{oh.propertyAddress}</p>

                  {/* Date & Time */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(oh.date).toLocaleDateString()}</span>
                    <span>â€¢</span>
                    <span>{formatTime(oh.startTime)} - {formatTime(oh.endTime)}</span>
                  </div>

                  {/* Features */}
                  <div className="flex items-center gap-2 mb-3">
                    {oh.refreshments && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">â˜• Refreshments</span>
                    )}
                    {oh.virtualTour && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">ðŸŽ¥ Virtual Tour</span>
                    )}
                    {oh.vastuExpert && (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">ðŸ•‰ï¸ Vastu Expert</span>
                    )}
                  </div>

                  {/* Registration Stats */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>{oh.registrations} / {oh.maxCapacity}</span>
                    </div>
                    {oh.feedback && (
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-yellow-500">â˜…</span>
                        <span className="text-gray-600">{oh.feedback.averageRating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 mb-2">Calendar view coming soon</p>
            <p className="text-sm text-gray-400">Full calendar integration with drag-and-drop scheduling</p>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedOpenHouse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative h-48 bg-gradient-to-br from-orange-100 to-amber-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-8xl opacity-30">ðŸ </span>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute bottom-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOpenHouse.status)}`}>
                    {selectedOpenHouse.status}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Property Info */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedOpenHouse.propertyTitle}</h2>
                  <p className="text-gray-500">{selectedOpenHouse.propertyAddress}</p>
                  <p className="text-lg font-semibold text-orange-600 mt-1">
                    {formatPrice(selectedOpenHouse.propertyPrice)}
                  </p>
                </div>

                {/* Date & Time */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Event Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="font-medium">{formatDate(selectedOpenHouse.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Time</p>
                        <p className="font-medium">{formatTime(selectedOpenHouse.startTime)} - {formatTime(selectedOpenHouse.endTime)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedOpenHouse.description && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600">{selectedOpenHouse.description}</p>
                  </div>
                )}

                {/* Features */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedOpenHouse.refreshments && (
                      <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full flex items-center gap-2">
                        â˜• Refreshments Provided
                      </span>
                    )}
                    {selectedOpenHouse.virtualTour && (
                      <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full flex items-center gap-2">
                        ðŸŽ¥ Virtual Tour Available
                      </span>
                    )}
                    {selectedOpenHouse.vastuExpert && (
                      <span className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full flex items-center gap-2">
                        ðŸ•‰ï¸ Vastu Expert Present
                      </span>
                    )}
                  </div>
                </div>

                {/* Registration Stats */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Registrations</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Registered</span>
                        <span className="font-medium">{selectedOpenHouse.registrations} / {selectedOpenHouse.maxCapacity}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 rounded-full"
                          style={{ width: `${(selectedOpenHouse.registrations / selectedOpenHouse.maxCapacity) * 100}%` }}
                        />
                      </div>
                    </div>
                    {selectedOpenHouse.status === 'COMPLETED' && (
                      <div className="text-center px-4 py-2 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{selectedOpenHouse.attendees}</p>
                        <p className="text-xs text-purple-500">Attended</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Feedback (if completed) */}
                {selectedOpenHouse.feedback && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Feedback</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-2xl font-bold text-yellow-600">{selectedOpenHouse.feedback.averageRating.toFixed(1)}</span>
                          <span className="text-yellow-500">â˜…</span>
                        </div>
                        <p className="text-xs text-yellow-600">Avg Rating</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{selectedOpenHouse.feedback.totalResponses}</p>
                        <p className="text-xs text-blue-600">Responses</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{selectedOpenHouse.feedback.interested}</p>
                        <p className="text-xs text-green-600">Interested</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Registered Visitors */}
                {selectedOpenHouse.registeredVisitors.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Registered Visitors</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {selectedOpenHouse.registeredVisitors.map((visitor) => (
                        <div key={visitor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-medium">
                              {visitor.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{visitor.name}</p>
                              <p className="text-sm text-gray-500">{visitor.email}</p>
                            </div>
                          </div>
                          {selectedOpenHouse.status === 'COMPLETED' && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              visitor.attended ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {visitor.attended ? 'Attended' : 'No Show'}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  {selectedOpenHouse.status === 'UPCOMING' && (
                    <>
                      <button className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600">
                        Edit Event
                      </button>
                      <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                        Send Reminder
                      </button>
                      <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                        Cancel
                      </button>
                    </>
                  )}
                  {selectedOpenHouse.status === 'COMPLETED' && (
                    <button className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600">
                      View Full Report
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">Schedule Open House</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property *</label>
                  <select
                    value={newOpenHouse.propertyId}
                    onChange={(e) => setNewOpenHouse({ ...newOpenHouse, propertyId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select a property</option>
                    {mockProperties.map((prop) => (
                      <option key={prop.id} value={prop.id}>
                        {prop.title} - {prop.address}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    value={newOpenHouse.date}
                    onChange={(e) => setNewOpenHouse({ ...newOpenHouse, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                    <input
                      type="time"
                      value={newOpenHouse.startTime}
                      onChange={(e) => setNewOpenHouse({ ...newOpenHouse, startTime: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
                    <input
                      type="time"
                      value={newOpenHouse.endTime}
                      onChange={(e) => setNewOpenHouse({ ...newOpenHouse, endTime: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Capacity</label>
                  <input
                    type="number"
                    value={newOpenHouse.maxCapacity}
                    onChange={(e) => setNewOpenHouse({ ...newOpenHouse, maxCapacity: e.target.value })}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newOpenHouse.description}
                    onChange={(e) => setNewOpenHouse({ ...newOpenHouse, description: e.target.value })}
                    rows={3}
                    placeholder="Add details about the open house event..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Features</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newOpenHouse.refreshments}
                        onChange={(e) => setNewOpenHouse({ ...newOpenHouse, refreshments: e.target.checked })}
                        className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                      />
                      <span className="text-gray-700">â˜• Refreshments will be provided</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newOpenHouse.virtualTour}
                        onChange={(e) => setNewOpenHouse({ ...newOpenHouse, virtualTour: e.target.checked })}
                        className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                      />
                      <span className="text-gray-700">ðŸŽ¥ Virtual tour available</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newOpenHouse.vastuExpert}
                        onChange={(e) => setNewOpenHouse({ ...newOpenHouse, vastuExpert: e.target.checked })}
                        className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                      />
                      <span className="text-gray-700">ðŸ•‰ï¸ Vastu expert will be present</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateOpenHouse}
                  disabled={!newOpenHouse.propertyId || !newOpenHouse.date || !newOpenHouse.startTime || !newOpenHouse.endTime}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 disabled:opacity-50"
                >
                  Schedule
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}













'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface VastuScore {
  overall: number;
  entrance: number;
  kitchen: number;
  bedroom: number;
  bathroom: number;
}

interface AstrologyCompatibility {
  score: number;
  favorableDirections: string[];
  auspiciousDates: string[];
}

interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  price: number;
  propertyType: 'APARTMENT' | 'HOUSE' | 'VILLA' | 'PLOT' | 'COMMERCIAL';
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: 'SQFT' | 'SQMT';
  yearBuilt: number;
  parking: number;
  furnished: 'UNFURNISHED' | 'SEMI_FURNISHED' | 'FULLY_FURNISHED';
  facing: string;
  floor?: number;
  totalFloors?: number;
  amenities: string[];
  images: string[];
  vastu: VastuScore;
  astrology?: AstrologyCompatibility;
  pricePerSqft: number;
  maintenanceFee?: number;
  availableFrom: string;
  listedDate: string;
  views: number;
  saves: number;
}

const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Serene Valley Villa',
    address: '123 Green Valley Road',
    city: 'Bangalore',
    state: 'Karnataka',
    price: 15000000,
    propertyType: 'VILLA',
    bedrooms: 4,
    bathrooms: 4,
    area: 3500,
    areaUnit: 'SQFT',
    yearBuilt: 2021,
    parking: 2,
    furnished: 'SEMI_FURNISHED',
    facing: 'East',
    amenities: ['Swimming Pool', 'Garden', 'Gym', 'Security', 'Power Backup', 'Club House'],
    images: [],
    vastu: { overall: 92, entrance: 95, kitchen: 88, bedroom: 94, bathroom: 90 },
    astrology: { score: 88, favorableDirections: ['East', 'North'], auspiciousDates: ['2024-02-15', '2024-03-10'] },
    pricePerSqft: 4286,
    maintenanceFee: 8000,
    availableFrom: '2024-03-01',
    listedDate: '2024-01-15',
    views: 245,
    saves: 32,
  },
  {
    id: '2',
    title: 'Harmony Heights Apartment',
    address: '456 Peace Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    price: 12500000,
    propertyType: 'APARTMENT',
    bedrooms: 3,
    bathrooms: 3,
    area: 1850,
    areaUnit: 'SQFT',
    yearBuilt: 2023,
    parking: 1,
    furnished: 'FULLY_FURNISHED',
    facing: 'North-East',
    floor: 12,
    totalFloors: 25,
    amenities: ['Gym', 'Security', 'Power Backup', 'Lift', 'Intercom', 'CCTV'],
    images: [],
    vastu: { overall: 85, entrance: 82, kitchen: 90, bedroom: 85, bathroom: 82 },
    astrology: { score: 75, favorableDirections: ['North', 'East'], auspiciousDates: ['2024-02-20'] },
    pricePerSqft: 6757,
    maintenanceFee: 6500,
    availableFrom: '2024-02-15',
    listedDate: '2024-01-20',
    views: 189,
    saves: 28,
  },
  {
    id: '3',
    title: 'Lotus Garden House',
    address: '789 Temple Road',
    city: 'Chennai',
    state: 'Tamil Nadu',
    price: 9500000,
    propertyType: 'HOUSE',
    bedrooms: 3,
    bathrooms: 2,
    area: 2200,
    areaUnit: 'SQFT',
    yearBuilt: 2019,
    parking: 2,
    furnished: 'UNFURNISHED',
    facing: 'South',
    amenities: ['Garden', 'Security', 'Power Backup', 'Water Storage'],
    images: [],
    vastu: { overall: 78, entrance: 75, kitchen: 82, bedroom: 80, bathroom: 76 },
    pricePerSqft: 4318,
    availableFrom: '2024-01-30',
    listedDate: '2024-01-10',
    views: 156,
    saves: 19,
  },
];

const allProperties: Property[] = [
  ...mockProperties,
  {
    id: '4',
    title: 'Sunrise Towers Penthouse',
    address: '101 Sky High Avenue',
    city: 'Delhi',
    state: 'Delhi',
    price: 25000000,
    propertyType: 'APARTMENT',
    bedrooms: 5,
    bathrooms: 5,
    area: 4500,
    areaUnit: 'SQFT',
    yearBuilt: 2022,
    parking: 3,
    furnished: 'FULLY_FURNISHED',
    facing: 'West',
    floor: 30,
    totalFloors: 32,
    amenities: ['Private Pool', 'Terrace', 'Gym', 'Spa', 'Concierge', 'Helipad Access'],
    images: [],
    vastu: { overall: 88, entrance: 90, kitchen: 85, bedroom: 92, bathroom: 84 },
    astrology: { score: 92, favorableDirections: ['West', 'North'], auspiciousDates: ['2024-03-01', '2024-03-15'] },
    pricePerSqft: 5556,
    maintenanceFee: 25000,
    availableFrom: '2024-04-01',
    listedDate: '2024-01-25',
    views: 320,
    saves: 45,
  },
];

export default function ComparePage() {
  const [selectedProperties, setSelectedProperties] = useState<Property[]>(mockProperties.slice(0, 2));
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightDifferences, setHighlightDifferences] = useState(true);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `â‚¹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `â‚¹${(price / 100000).toFixed(2)} L`;
    }
    return `â‚¹${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const removeProperty = (id: string) => {
    setSelectedProperties(prev => prev.filter(p => p.id !== id));
  };

  const addProperty = (property: Property) => {
    if (selectedProperties.length < 4 && !selectedProperties.find(p => p.id === property.id)) {
      setSelectedProperties(prev => [...prev, property]);
    }
    setShowAddModal(false);
  };

  const getComparisonClass = (values: (number | string | undefined)[], index: number, higherIsBetter: boolean = true) => {
    if (!highlightDifferences) return '';
    
    const numericValues = values.filter(v => typeof v === 'number') as number[];
    if (numericValues.length < 2) return '';
    
    const currentValue = values[index];
    if (typeof currentValue !== 'number') return '';
    
    const best = higherIsBetter ? Math.max(...numericValues) : Math.min(...numericValues);
    const worst = higherIsBetter ? Math.min(...numericValues) : Math.max(...numericValues);
    
    if (currentValue === best) return 'bg-green-50 text-green-700 font-semibold';
    if (currentValue === worst && numericValues.length > 2) return 'bg-red-50 text-red-700';
    return '';
  };

  const getVastuScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const availableToAdd = allProperties.filter(
    p => !selectedProperties.find(sp => sp.id === p.id) &&
    (searchQuery === '' || 
     p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     p.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const comparisonRows = [
    { label: 'Price', key: 'price', format: (v: number) => formatPrice(v), higherIsBetter: false },
    { label: 'Price per Sq.Ft', key: 'pricePerSqft', format: (v: number) => `â‚¹${v.toLocaleString()}`, higherIsBetter: false },
    { label: 'Area', key: 'area', format: (v: number, p: Property) => `${v.toLocaleString()} ${p.areaUnit}`, higherIsBetter: true },
    { label: 'Bedrooms', key: 'bedrooms', format: (v: number) => v.toString(), higherIsBetter: true },
    { label: 'Bathrooms', key: 'bathrooms', format: (v: number) => v.toString(), higherIsBetter: true },
    { label: 'Parking', key: 'parking', format: (v: number) => `${v} spot${v > 1 ? 's' : ''}`, higherIsBetter: true },
    { label: 'Year Built', key: 'yearBuilt', format: (v: number) => v.toString(), higherIsBetter: true },
    { label: 'Facing', key: 'facing', format: (v: string) => v, higherIsBetter: null },
    { label: 'Furnished', key: 'furnished', format: (v: string) => v.replace('_', ' '), higherIsBetter: null },
    { label: 'Maintenance', key: 'maintenanceFee', format: (v: number | undefined) => v ? `â‚¹${v.toLocaleString()}/mo` : 'N/A', higherIsBetter: false },
    { label: 'Available From', key: 'availableFrom', format: (v: string) => formatDate(v), higherIsBetter: null },
  ];

  const vastuRows = [
    { label: 'Overall Score', key: 'overall' },
    { label: 'Entrance', key: 'entrance' },
    { label: 'Kitchen', key: 'kitchen' },
    { label: 'Bedroom', key: 'bedroom' },
    { label: 'Bathroom', key: 'bathroom' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/search" className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Compare Properties</h1>
                <p className="text-sm text-gray-600">
                  {selectedProperties.length} of 4 properties selected
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={highlightDifferences}
                  onChange={(e) => setHighlightDifferences(e.target.checked)}
                  className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
                />
                Highlight differences
              </label>
              {selectedProperties.length < 4 && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Property
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedProperties.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties to compare</h3>
            <p className="text-gray-600 mb-6">Add properties to start comparing</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Add Properties
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Property Headers */}
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left p-4 w-48 font-medium text-gray-600">Property</th>
                    {selectedProperties.map((property) => (
                      <th key={property.id} className="p-4 min-w-[250px]">
                        <div className="relative">
                          <button
                            onClick={() => removeProperty(property.id)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full hover:bg-red-200 flex items-center justify-center"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <div className="aspect-video bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg mb-3 flex items-center justify-center">
                            <svg className="w-12 h-12 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                          </div>
                          <h3 className="font-semibold text-gray-900">{property.title}</h3>
                          <p className="text-sm text-gray-500">{property.city}, {property.state}</p>
                          <p className="text-lg font-bold text-orange-600 mt-1">{formatPrice(property.price)}</p>
                        </div>
                      </th>
                    ))}
                    {selectedProperties.length < 4 && (
                      <th className="p-4 min-w-[200px]">
                        <button
                          onClick={() => setShowAddModal(true)}
                          className="w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-orange-400 hover:text-orange-500 transition-colors"
                        >
                          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="text-sm mt-2">Add Property</span>
                        </button>
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {/* Property Type */}
                  <tr className="border-b">
                    <td className="p-4 font-medium text-gray-600 bg-gray-50">Property Type</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className="p-4 text-center">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {property.propertyType}
                        </span>
                      </td>
                    ))}
                    {selectedProperties.length < 4 && <td />}
                  </tr>

                  {/* Basic Details */}
                  {comparisonRows.map((row) => (
                    <tr key={row.key} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-600 bg-gray-50">{row.label}</td>
                      {selectedProperties.map((property, index) => {
                        const value = property[row.key as keyof Property];
                        const values = selectedProperties.map(p => p[row.key as keyof Property]);
                        return (
                          <td
                            key={property.id}
                            className={`p-4 text-center ${row.higherIsBetter !== null ? getComparisonClass(values as (number | string | undefined)[], index, row.higherIsBetter) : ''}`}
                          >
                            {row.format(value as any, property)}
                          </td>
                        );
                      })}
                      {selectedProperties.length < 4 && <td />}
                    </tr>
                  ))}

                  {/* Floor Info */}
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-600 bg-gray-50">Floor</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className="p-4 text-center">
                        {property.floor ? `${property.floor} of ${property.totalFloors}` : 'N/A'}
                      </td>
                    ))}
                    {selectedProperties.length < 4 && <td />}
                  </tr>

                  {/* Section Header: Vastu Scores */}
                  <tr className="bg-gradient-to-r from-orange-50 to-amber-50">
                    <td colSpan={selectedProperties.length + 2} className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">ðŸ•‰ï¸</span>
                        <span className="font-semibold text-gray-900">Vastu Shastra Analysis</span>
                      </div>
                    </td>
                  </tr>

                  {vastuRows.map((row) => (
                    <tr key={row.key} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-600 bg-gray-50">{row.label}</td>
                      {selectedProperties.map((property, index) => {
                        const score = property.vastu[row.key as keyof VastuScore];
                        const scores = selectedProperties.map(p => p.vastu[row.key as keyof VastuScore]);
                        return (
                          <td
                            key={property.id}
                            className={`p-4 text-center ${getComparisonClass(scores, index, true)}`}
                          >
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    score >= 85 ? 'bg-green-500' : score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${score}%` }}
                                />
                              </div>
                              <span className={getVastuScoreColor(score)}>{score}%</span>
                            </div>
                          </td>
                        );
                      })}
                      {selectedProperties.length < 4 && <td />}
                    </tr>
                  ))}

                  {/* Section Header: Astrology */}
                  <tr className="bg-gradient-to-r from-purple-50 to-indigo-50">
                    <td colSpan={selectedProperties.length + 2} className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">â­</span>
                        <span className="font-semibold text-gray-900">Jyotish Compatibility</span>
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-600 bg-gray-50">Compatibility Score</td>
                    {selectedProperties.map((property, index) => {
                      const score = property.astrology?.score;
                      const scores = selectedProperties.map(p => p.astrology?.score);
                      return (
                        <td
                          key={property.id}
                          className={`p-4 text-center ${score ? getComparisonClass(scores as number[], index, true) : ''}`}
                        >
                          {score ? (
                            <span className={getVastuScoreColor(score)}>{score}%</span>
                          ) : (
                            <span className="text-gray-400">Not calculated</span>
                          )}
                        </td>
                      );
                    })}
                    {selectedProperties.length < 4 && <td />}
                  </tr>

                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-600 bg-gray-50">Favorable Directions</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className="p-4 text-center">
                        {property.astrology?.favorableDirections ? (
                          <div className="flex flex-wrap gap-1 justify-center">
                            {property.astrology.favorableDirections.map((dir) => (
                              <span key={dir} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                                {dir}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                    ))}
                    {selectedProperties.length < 4 && <td />}
                  </tr>

                  {/* Section Header: Amenities */}
                  <tr className="bg-gradient-to-r from-green-50 to-teal-50">
                    <td colSpan={selectedProperties.length + 2} className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">âœ¨</span>
                        <span className="font-semibold text-gray-900">Amenities</span>
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b">
                    <td className="p-4 font-medium text-gray-600 bg-gray-50">Features</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className="p-4">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {property.amenities.map((amenity) => (
                            <span
                              key={amenity}
                              className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                    {selectedProperties.length < 4 && <td />}
                  </tr>

                  {/* Section Header: Engagement */}
                  <tr className="bg-gradient-to-r from-blue-50 to-cyan-50">
                    <td colSpan={selectedProperties.length + 2} className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">ðŸ“Š</span>
                        <span className="font-semibold text-gray-900">Engagement Stats</span>
                      </div>
                    </td>
                  </tr>

                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-600 bg-gray-50">Views</td>
                    {selectedProperties.map((property, index) => {
                      const views = selectedProperties.map(p => p.views);
                      return (
                        <td
                          key={property.id}
                          className={`p-4 text-center ${getComparisonClass(views, index, true)}`}
                        >
                          {property.views}
                        </td>
                      );
                    })}
                    {selectedProperties.length < 4 && <td />}
                  </tr>

                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-600 bg-gray-50">Saves</td>
                    {selectedProperties.map((property, index) => {
                      const saves = selectedProperties.map(p => p.saves);
                      return (
                        <td
                          key={property.id}
                          className={`p-4 text-center ${getComparisonClass(saves, index, true)}`}
                        >
                          {property.saves}
                        </td>
                      );
                    })}
                    {selectedProperties.length < 4 && <td />}
                  </tr>

                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-600 bg-gray-50">Listed</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className="p-4 text-center text-gray-600">
                        {formatDate(property.listedDate)}
                      </td>
                    ))}
                    {selectedProperties.length < 4 && <td />}
                  </tr>
                </tbody>

                {/* Actions */}
                <tfoot>
                  <tr className="bg-gray-50 border-t">
                    <td className="p-4 font-medium text-gray-600">Actions</td>
                    {selectedProperties.map((property) => (
                      <td key={property.id} className="p-4">
                        <div className="flex flex-col gap-2">
                          <Link
                            href={`/property/${property.id}`}
                            className="w-full py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg text-center hover:shadow-lg transition-all text-sm"
                          >
                            View Details
                          </Link>
                          <button className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                            Schedule Visit
                          </button>
                        </div>
                      </td>
                    ))}
                    {selectedProperties.length < 4 && <td />}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Property Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Add Property to Compare</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mt-4">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search properties..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>
              <div className="p-4 overflow-y-auto max-h-[50vh]">
                {availableToAdd.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No properties available to add</p>
                ) : (
                  <div className="space-y-3">
                    {availableToAdd.map((property) => (
                      <motion.div
                        key={property.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 border rounded-lg hover:border-orange-300 hover:bg-orange-50/50 cursor-pointer transition-colors"
                        onClick={() => addProperty(property)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-8 h-8 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{property.title}</h3>
                            <p className="text-sm text-gray-500">{property.city}, {property.state}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-orange-600 font-semibold">{formatPrice(property.price)}</span>
                              <span className="text-xs text-gray-500">
                                {property.bedrooms} BHK â€¢ {property.area.toLocaleString()} {property.areaUnit}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm ${getVastuScoreColor(property.vastu.overall)}`}>
                              ðŸ•‰ï¸ {property.vastu.overall}%
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaymentMethod {
  id: string;
  type: 'CARD' | 'UPI' | 'NETBANKING';
  last4?: string;
  brand?: string;
  upiId?: string;
  bankName?: string;
  isDefault: boolean;
}

interface PlanDetails {
  id: string;
  name: string;
  price: number;
  billingPeriod: 'MONTHLY' | 'YEARLY';
  features: string[];
}

interface PropertyBooking {
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  bookingType: 'TOKEN' | 'DOWN_PAYMENT' | 'FULL_PAYMENT';
  amount: number;
}

interface OrderSummary {
  type: 'SUBSCRIPTION' | 'PROPERTY_BOOKING' | 'SERVICE';
  plan?: PlanDetails;
  propertyBooking?: PropertyBooking;
  serviceName?: string;
  servicePrice?: number;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'CARD',
    last4: '4242',
    brand: 'Visa',
    isDefault: true,
  },
  {
    id: '2',
    type: 'UPI',
    upiId: 'user@okicici',
    isDefault: false,
  },
];

const plans: Record<string, PlanDetails> = {
  basic: {
    id: 'basic',
    name: 'Basic Plan',
    price: 499,
    billingPeriod: 'MONTHLY',
    features: ['25 Favorite Properties', '10 Saved Searches', 'Unlimited Messages', '10 Vastu Analyses'],
  },
  premium: {
    id: 'premium',
    name: 'Premium Plan',
    price: 999,
    billingPeriod: 'MONTHLY',
    features: ['Unlimited Favorites', 'Unlimited Searches', 'Jyotish Reports', 'Muhurat Calculations', 'Dedicated Support'],
  },
  agent: {
    id: 'agent',
    name: 'Agent Pro',
    price: 2999,
    billingPeriod: 'MONTHLY',
    features: ['All Premium Features', 'List Properties', 'CRM Access', 'Analytics Dashboard', 'Blockchain Integration'],
  },
};

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  
  // New payment form
  const [newPaymentType, setNewPaymentType] = useState<'CARD' | 'UPI' | 'NETBANKING'>('CARD');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [savePaymentMethod, setSavePaymentMethod] = useState(true);

  useEffect(() => {
    // Simulate loading
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPaymentMethods(mockPaymentMethods);
      setSelectedPaymentMethod(mockPaymentMethods.find(pm => pm.isDefault)?.id || '');
      
      // Parse order from URL params
      const planId = searchParams.get('plan');
      const propertyId = searchParams.get('property');
      const bookingType = searchParams.get('bookingType');
      const serviceType = searchParams.get('service');
      
      let summary: OrderSummary;
      
      if (planId && plans[planId]) {
        const plan = plans[planId];
        const subtotal = plan.price;
        const tax = Math.round(subtotal * 0.18);
        summary = {
          type: 'SUBSCRIPTION',
          plan,
          subtotal,
          tax,
          discount: 0,
          total: subtotal + tax,
        };
      } else if (propertyId) {
        const amount = parseInt(searchParams.get('amount') || '100000');
        const subtotal = amount;
        const tax = Math.round(subtotal * 0.01); // 1% stamp duty approximation
        summary = {
          type: 'PROPERTY_BOOKING',
          propertyBooking: {
            propertyId,
            propertyTitle: 'Serene Valley Villa',
            propertyAddress: '123 Green Valley Road, Bangalore',
            bookingType: (bookingType as 'TOKEN' | 'DOWN_PAYMENT' | 'FULL_PAYMENT') || 'TOKEN',
            amount,
          },
          subtotal,
          tax,
          discount: 0,
          total: subtotal + tax,
        };
      } else {
        // Default to basic plan
        const plan = plans.basic;
        const subtotal = plan.price;
        const tax = Math.round(subtotal * 0.18);
        summary = {
          type: 'SUBSCRIPTION',
          plan,
          subtotal,
          tax,
          discount: 0,
          total: subtotal + tax,
        };
      }
      
      setOrderSummary(summary);
      setLoading(false);
    };
    
    loadData();
  }, [searchParams]);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `â‚¹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `â‚¹${(price / 100000).toFixed(2)} L`;
    }
    return `â‚¹${price.toLocaleString()}`;
  };

  const applyPromoCode = () => {
    if (!orderSummary) return;
    
    if (promoCode.toUpperCase() === 'DHARMA20') {
      const discount = Math.round(orderSummary.subtotal * 0.2);
      setOrderSummary({
        ...orderSummary,
        discount,
        total: orderSummary.subtotal + orderSummary.tax - discount,
      });
      setPromoApplied(true);
      setPromoError('');
    } else if (promoCode.toUpperCase() === 'FIRST50') {
      const discount = 50;
      setOrderSummary({
        ...orderSummary,
        discount,
        total: orderSummary.subtotal + orderSummary.tax - discount,
      });
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
    }
  };

  const removePromoCode = () => {
    if (!orderSummary) return;
    setOrderSummary({
      ...orderSummary,
      discount: 0,
      total: orderSummary.subtotal + orderSummary.tax,
    });
    setPromoApplied(false);
    setPromoCode('');
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g) || [];
    return groups.join(' ').substr(0, 19);
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod && !showAddPayment) {
      setShowAddPayment(true);
      return;
    }
    
    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setProcessing(false);
    setPaymentSuccess(true);
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'CARD':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
          </svg>
        );
      case 'UPI':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        );
      case 'NETBANKING':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4.5-9L2 6v2h19V6l-9.5-5z" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-10 h-10 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </motion.svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your payment of {formatPrice(orderSummary?.total || 0)} has been processed successfully.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">Transaction ID</p>
            <p className="font-mono text-gray-900">TXN{Date.now().toString(36).toUpperCase()}</p>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            A confirmation email has been sent to your registered email address.
          </p>
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="block w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/"
              className="block w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">à¥</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Type Banner */}
            <div className={`p-4 rounded-xl ${
              orderSummary?.type === 'SUBSCRIPTION' 
                ? 'bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-200'
                : 'bg-gradient-to-r from-green-100 to-teal-100 border border-green-200'
            }`}>
              <div className="flex items-center gap-3">
                {orderSummary?.type === 'SUBSCRIPTION' ? (
                  <>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{orderSummary.plan?.name}</h3>
                      <p className="text-sm text-gray-600">
                        {orderSummary.plan?.billingPeriod === 'MONTHLY' ? 'Monthly' : 'Yearly'} Subscription
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{orderSummary?.propertyBooking?.propertyTitle}</h3>
                      <p className="text-sm text-gray-600">
                        {orderSummary?.propertyBooking?.bookingType === 'TOKEN' && 'Token Amount'}
                        {orderSummary?.propertyBooking?.bookingType === 'DOWN_PAYMENT' && 'Down Payment'}
                        {orderSummary?.propertyBooking?.bookingType === 'FULL_PAYMENT' && 'Full Payment'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Saved Payment Methods */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
              
              {paymentMethods.length > 0 && (
                <div className="space-y-3 mb-4">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedPaymentMethod === method.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedPaymentMethod === method.id}
                        onChange={(e) => {
                          setSelectedPaymentMethod(e.target.value);
                          setShowAddPayment(false);
                        }}
                        className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                      />
                      <div className="text-gray-600">
                        {getPaymentMethodIcon(method.type)}
                      </div>
                      <div className="flex-1">
                        {method.type === 'CARD' && (
                          <>
                            <p className="font-medium text-gray-900">{method.brand} â€¢â€¢â€¢â€¢ {method.last4}</p>
                            <p className="text-sm text-gray-500">Credit/Debit Card</p>
                          </>
                        )}
                        {method.type === 'UPI' && (
                          <>
                            <p className="font-medium text-gray-900">{method.upiId}</p>
                            <p className="text-sm text-gray-500">UPI</p>
                          </>
                        )}
                        {method.type === 'NETBANKING' && (
                          <>
                            <p className="font-medium text-gray-900">{method.bankName}</p>
                            <p className="text-sm text-gray-500">Net Banking</p>
                          </>
                        )}
                      </div>
                      {method.isDefault && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">Default</span>
                      )}
                    </label>
                  ))}
                </div>
              )}

              {/* Add New Payment */}
              <button
                onClick={() => {
                  setShowAddPayment(!showAddPayment);
                  setSelectedPaymentMethod('');
                }}
                className={`w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg transition-colors ${
                  showAddPayment
                    ? 'border-orange-500 bg-orange-50 text-orange-600'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Payment Method
              </button>

              {/* New Payment Form */}
              <AnimatePresence>
                {showAddPayment && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 space-y-4">
                      {/* Payment Type Tabs */}
                      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                        {(['CARD', 'UPI', 'NETBANKING'] as const).map((type) => (
                          <button
                            key={type}
                            onClick={() => setNewPaymentType(type)}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                              newPaymentType === type
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            {type === 'CARD' && 'Card'}
                            {type === 'UPI' && 'UPI'}
                            {type === 'NETBANKING' && 'Net Banking'}
                          </button>
                        ))}
                      </div>

                      {/* Card Form */}
                      {newPaymentType === 'CARD' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Card Number
                            </label>
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Cardholder Name
                            </label>
                            <input
                              type="text"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              placeholder="John Doe"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expiry Date
                              </label>
                              <input
                                type="text"
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                                placeholder="MM/YY"
                                maxLength={5}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                CVV
                              </label>
                              <input
                                type="password"
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                placeholder="â€¢â€¢â€¢"
                                maxLength={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* UPI Form */}
                      {newPaymentType === 'UPI' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            UPI ID
                          </label>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="yourname@upi"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Enter your UPI ID linked to any UPI app
                          </p>
                        </div>
                      )}

                      {/* Net Banking Form */}
                      {newPaymentType === 'NETBANKING' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Bank
                          </label>
                          <select
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            <option value="">Choose your bank</option>
                            <option value="sbi">State Bank of India</option>
                            <option value="hdfc">HDFC Bank</option>
                            <option value="icici">ICICI Bank</option>
                            <option value="axis">Axis Bank</option>
                            <option value="kotak">Kotak Mahindra Bank</option>
                            <option value="pnb">Punjab National Bank</option>
                            <option value="bob">Bank of Baroda</option>
                            <option value="idbi">IDBI Bank</option>
                          </select>
                          <p className="text-sm text-gray-500 mt-1">
                            You will be redirected to your bank's website
                          </p>
                        </div>
                      )}

                      {/* Save Payment Method */}
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={savePaymentMethod}
                          onChange={(e) => setSavePaymentMethod(e.target.checked)}
                          className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-600">
                          Save this payment method for future transactions
                        </span>
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Promo Code */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Promo Code</h2>
              {promoApplied ? (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium text-green-700">{promoCode.toUpperCase()}</span>
                    <span className="text-green-600">- {formatPrice(orderSummary?.discount || 0)} off</span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value);
                      setPromoError('');
                    }}
                    placeholder="Enter promo code"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    onClick={applyPromoCode}
                    disabled={!promoCode}
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
              {promoError && (
                <p className="text-sm text-red-500 mt-2">{promoError}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Try: DHARMA20 for 20% off
              </p>
            </div>

            {/* Security Info */}
            <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p className="font-medium text-green-900">Secure Payment</p>
                <p className="text-sm text-green-700">
                  Your payment information is encrypted and secure. We never store your full card details.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {orderSummary?.type === 'SUBSCRIPTION' && orderSummary.plan && (
                <div className="mb-4 pb-4 border-b">
                  <h3 className="font-medium text-gray-900">{orderSummary.plan.name}</h3>
                  <ul className="mt-2 space-y-1">
                    {orderSummary.plan.features.slice(0, 3).map((feature, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                    {orderSummary.plan.features.length > 3 && (
                      <li className="text-sm text-gray-500">
                        +{orderSummary.plan.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {orderSummary?.type === 'PROPERTY_BOOKING' && orderSummary.propertyBooking && (
                <div className="mb-4 pb-4 border-b">
                  <h3 className="font-medium text-gray-900">{orderSummary.propertyBooking.propertyTitle}</h3>
                  <p className="text-sm text-gray-500">{orderSummary.propertyBooking.propertyAddress}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {orderSummary.propertyBooking.bookingType === 'TOKEN' && 'Token Booking Amount'}
                    {orderSummary.propertyBooking.bookingType === 'DOWN_PAYMENT' && 'Down Payment (10%)'}
                    {orderSummary.propertyBooking.bookingType === 'FULL_PAYMENT' && 'Full Payment'}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(orderSummary?.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (GST)</span>
                  <span>{formatPrice(orderSummary?.tax || 0)}</span>
                </div>
                {(orderSummary?.discount || 0) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(orderSummary?.discount || 0)}</span>
                  </div>
                )}
                <div className="pt-3 border-t">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(orderSummary?.total || 0)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full mt-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Pay {formatPrice(orderSummary?.total || 0)}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By completing this payment, you agree to our{' '}
                <Link href="/terms" className="text-orange-500 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-orange-500 hover:underline">Privacy Policy</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Participant {
  id: string;
  name: string;
  role: 'HOST' | 'GUEST';
  avatar?: string;
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  isSpeaking: boolean;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
}

interface CallInfo {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  agentName: string;
  agentAvatar?: string;
  scheduledTime?: Date;
  duration: number;
}

export default function VideoCallPage() {
  const searchParams = useSearchParams();
  const [callState, setCallState] = useState<'WAITING' | 'CONNECTING' | 'CONNECTED' | 'ENDED'>('WAITING');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedCamera, setSelectedCamera] = useState('default');
  const [selectedMicrophone, setSelectedMicrophone] = useState('default');
  const [selectedSpeaker, setSelectedSpeaker] = useState('default');
  
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [callInfo] = useState<CallInfo>({
    id: searchParams.get('id') || 'call-123',
    propertyId: searchParams.get('property') || 'prop-1',
    propertyTitle: 'Serene Valley Villa',
    propertyAddress: '123 Green Valley Road, Bangalore',
    agentName: 'Priya Sharma',
    agentAvatar: '',
    duration: 0,
  });

  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: 'user-1',
      name: 'You',
      role: 'GUEST',
      isMuted: false,
      isVideoOff: false,
      isScreenSharing: false,
      isSpeaking: false,
    },
  ]);

  // Simulate call timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callState === 'CONNECTED') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  // Simulate participant joining
  useEffect(() => {
    if (callState === 'CONNECTING') {
      const timer = setTimeout(() => {
        setParticipants(prev => [
          ...prev,
          {
            id: 'agent-1',
            name: callInfo.agentName,
            role: 'HOST',
            isMuted: false,
            isVideoOff: false,
            isScreenSharing: false,
            isSpeaking: false,
          },
        ]);
        setCallState('CONNECTED');
        
        // Add welcome message
        setMessages([{
          id: '1',
          senderId: 'agent-1',
          senderName: callInfo.agentName,
          message: `Hello! Thank you for joining the virtual tour for ${callInfo.propertyTitle}. How can I help you today?`,
          timestamp: new Date(),
        }]);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [callState, callInfo]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const joinCall = () => {
    setCallState('CONNECTING');
  };

  const endCall = () => {
    setCallState('ENDED');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setParticipants(prev =>
      prev.map(p => (p.id === 'user-1' ? { ...p, isMuted: !isMuted } : p))
    );
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    setParticipants(prev =>
      prev.map(p => (p.id === 'user-1' ? { ...p, isVideoOff: !isVideoOff } : p))
    );
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    setParticipants(prev =>
      prev.map(p => (p.id === 'user-1' ? { ...p, isScreenSharing: !isScreenSharing } : p))
    );
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await videoContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        senderId: 'user-1',
        senderName: 'You',
        message: newMessage,
        timestamp: new Date(),
      },
    ]);
    setNewMessage('');

    // Simulate agent response
    setTimeout(() => {
      const responses = [
        'That\'s a great question! Let me show you that area.',
        'Yes, the property has excellent natural lighting throughout the day.',
        'The neighborhood is very peaceful with good schools nearby.',
        'I can schedule an in-person visit if you\'d like to see it yourself.',
        'The Vastu compliance for this property is excellent, especially for the master bedroom.',
      ];
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          senderId: 'agent-1',
          senderName: callInfo.agentName,
          message: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
        },
      ]);
    }, 1500);
  };

  // Waiting Room
  if (callState === 'WAITING') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gray-800 rounded-2xl p-8 max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Virtual Property Tour</h1>
            <p className="text-gray-400">{callInfo.propertyTitle}</p>
          </div>

          {/* Preview Video */}
          <div className="relative aspect-video bg-gray-700 rounded-lg mb-6 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              {isVideoOff ? (
                <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-white font-semibold">Y</span>
                </div>
              ) : (
                <div className="text-gray-400 text-sm">Camera preview</div>
              )}
            </div>
            {isMuted && (
              <div className="absolute bottom-3 left-3 px-2 py-1 bg-red-500 rounded text-white text-xs flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
                Muted
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={toggleMute}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                isMuted ? 'bg-red-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              {isMuted ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>
            <button
              onClick={toggleVideo}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                isVideoOff ? 'bg-red-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              {isVideoOff ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="w-14 h-14 bg-gray-700 text-white rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          {/* Join Button */}
          <button
            onClick={joinCall}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all text-lg"
          >
            Join Tour
          </button>

          <Link
            href="/dashboard"
            className="block text-center text-gray-400 hover:text-white mt-4 transition-colors"
          >
            Cancel and return to dashboard
          </Link>
        </motion.div>

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
              onClick={() => setShowSettings(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-gray-800 rounded-xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Settings</h2>
                  <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Camera</label>
                    <select
                      value={selectedCamera}
                      onChange={(e) => setSelectedCamera(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="default">Default Camera</option>
                      <option value="front">Front Camera</option>
                      <option value="back">Back Camera</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Microphone</label>
                    <select
                      value={selectedMicrophone}
                      onChange={(e) => setSelectedMicrophone(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="default">Default Microphone</option>
                      <option value="headset">Headset Microphone</option>
                      <option value="external">External Microphone</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Speaker</label>
                    <select
                      value={selectedSpeaker}
                      onChange={(e) => setSelectedSpeaker(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="default">Default Speaker</option>
                      <option value="headphones">Headphones</option>
                      <option value="external">External Speaker</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Connecting State
  if (callState === 'CONNECTING') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-semibold text-white mb-2">Connecting...</h2>
          <p className="text-gray-400">Waiting for {callInfo.agentName} to join</p>
        </motion.div>
      </div>
    );
  }

  // Call Ended State
  if (callState === 'ENDED') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Tour Ended</h1>
          <p className="text-gray-400 mb-4">Duration: {formatDuration(callDuration)}</p>
          
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-white mb-1">{callInfo.propertyTitle}</h3>
            <p className="text-sm text-gray-400">{callInfo.propertyAddress}</p>
          </div>

          <div className="space-y-3">
            <Link
              href={`/property/${callInfo.propertyId}`}
              className="block w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              View Property Details
            </Link>
            <Link
              href="/dashboard/showings"
              className="block w-full py-3 border border-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Schedule In-Person Visit
            </Link>
            <Link
              href="/dashboard"
              className="block w-full py-3 text-gray-400 hover:text-white transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Connected - Main Call Interface
  return (
    <div ref={videoContainerRef} className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">à¥</span>
            </div>
            <div>
              <h1 className="text-white font-medium">{callInfo.propertyTitle}</h1>
              <p className="text-gray-300 text-sm">{callInfo.propertyAddress}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">{formatDuration(callDuration)}</span>
            </div>
            <button
              onClick={toggleFullscreen}
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              {isFullscreen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V5a2 2 0 012-2h2M15 9V5a2 2 0 00-2-2h-2M9 15v4a2 2 0 002 2h2m4-6v4a2 2 0 01-2 2h-2" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative">
        {/* Main Video (Agent) */}
        <div className="absolute inset-0 bg-gray-800">
          <div className="h-full flex items-center justify-center">
            {participants.find(p => p.role === 'HOST')?.isVideoOff ? (
              <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-4xl text-white font-semibold">
                  {callInfo.agentName.charAt(0)}
                </span>
              </div>
            ) : (
              <div className="text-gray-500">
                <svg className="w-24 h-24 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p>{callInfo.agentName} is sharing video</p>
              </div>
            )}
          </div>
          {/* Agent name overlay */}
          <div className="absolute bottom-4 left-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/50 rounded-lg">
              <span className="text-white text-sm">{callInfo.agentName}</span>
              {participants.find(p => p.role === 'HOST')?.isMuted && (
                <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Self Video (Picture-in-Picture) */}
        <motion.div
          drag
          dragConstraints={videoContainerRef}
          className="absolute bottom-24 right-4 w-48 aspect-video bg-gray-700 rounded-lg overflow-hidden shadow-xl cursor-move z-20"
        >
          {isVideoOff ? (
            <div className="h-full flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-lg text-white font-semibold">Y</span>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm">
              Your camera
            </div>
          )}
          <div className="absolute bottom-2 left-2 flex items-center gap-1">
            <span className="text-white text-xs bg-black/50 px-2 py-0.5 rounded">You</span>
            {isMuted && (
              <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
          </div>
        </motion.div>

        {/* Chat Panel */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-gray-800 border-l border-gray-700 z-20 flex flex-col"
            >
              <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-white font-medium">Chat</h3>
                <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`${msg.senderId === 'user-1' ? 'ml-8' : 'mr-8'}`}
                  >
                    <div
                      className={`p-3 rounded-lg ${
                        msg.senderId === 'user-1'
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-700 text-white'
                      }`}
                    >
                      {msg.senderId !== 'user-1' && (
                        <p className="text-xs text-gray-300 mb-1">{msg.senderName}</p>
                      )}
                      <p className="text-sm">{msg.message}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    onClick={sendMessage}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Participants Panel */}
        <AnimatePresence>
          {showParticipants && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-72 bg-gray-800 border-r border-gray-700 z-20"
            >
              <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-white font-medium">Participants ({participants.length})</h3>
                <button onClick={() => setShowParticipants(false)} className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4 space-y-3">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {participant.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">{participant.name}</p>
                      <p className="text-gray-400 text-xs">{participant.role === 'HOST' ? 'Agent' : 'Guest'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {participant.isMuted && (
                        <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                        </svg>
                      )}
                      {participant.isVideoOff && (
                        <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={toggleMute}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isMuted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {isMuted ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>

          <button
            onClick={toggleVideo}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isVideoOff ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {isVideoOff ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>

          <button
            onClick={toggleScreenShare}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isScreenSharing ? 'bg-green-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>

          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              showParticipants ? 'bg-orange-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all relative ${
              showChat ? 'bg-orange-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {messages.length > 0 && !showChat && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
                {messages.length}
              </span>
            )}
          </button>

          <button
            onClick={endCall}
            className="w-16 h-14 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface SignatureField {
  id: string;
  type: 'SIGNATURE' | 'INITIAL' | 'DATE' | 'TEXT' | 'CHECKBOX';
  label: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  required: boolean;
  value?: string;
  signed?: boolean;
}

interface Document {
  id: string;
  name: string;
  description: string;
  totalPages: number;
  fields: SignatureField[];
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED';
  createdAt: Date;
  expiresAt: Date;
  senderName: string;
  senderEmail: string;
}

const mockDocument: Document = {
  id: 'doc-1',
  name: 'Sale Agreement - Serene Valley Villa',
  description: 'This agreement outlines the terms and conditions for the sale of property located at 123 Green Valley Road, Bangalore.',
  totalPages: 5,
  status: 'PENDING',
  createdAt: new Date('2024-01-20'),
  expiresAt: new Date('2024-02-20'),
  senderName: 'Priya Sharma',
  senderEmail: 'priya.sharma@dharma-realty.com',
  fields: [
    { id: '1', type: 'SIGNATURE', label: 'Buyer Signature', page: 1, x: 100, y: 600, width: 200, height: 60, required: true },
    { id: '2', type: 'DATE', label: 'Date', page: 1, x: 350, y: 610, width: 120, height: 40, required: true },
    { id: '3', type: 'INITIAL', label: 'Buyer Initials', page: 2, x: 450, y: 700, width: 80, height: 40, required: true },
    { id: '4', type: 'CHECKBOX', label: 'I agree to the terms', page: 3, x: 100, y: 500, width: 20, height: 20, required: true },
    { id: '5', type: 'TEXT', label: 'Full Legal Name', page: 4, x: 100, y: 400, width: 300, height: 40, required: true },
    { id: '6', type: 'SIGNATURE', label: 'Final Signature', page: 5, x: 100, y: 600, width: 200, height: 60, required: true },
  ],
};

export default function SigningPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [document, setDocument] = useState<Document | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [signedFields, setSignedFields] = useState<Record<string, string>>({});
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [activeField, setActiveField] = useState<SignatureField | null>(null);
  const [signatureType, setSignatureType] = useState<'DRAW' | 'TYPE' | 'UPLOAD'>('TYPE');
  const [typedSignature, setTypedSignature] = useState('');
  const [signatureFont, setSignatureFont] = useState('dancing-script');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    const loadDocument = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      setDocument(mockDocument);
      setLoading(false);
    };
    loadDocument();
  }, []);

  const getFieldsForPage = (page: number) => {
    return document?.fields.filter(f => f.page === page) || [];
  };

  const getCompletedFieldsCount = () => {
    return Object.keys(signedFields).length;
  };

  const getTotalRequiredFields = () => {
    return document?.fields.filter(f => f.required).length || 0;
  };

  const isFieldComplete = (fieldId: string) => {
    return signedFields[fieldId] !== undefined;
  };

  const openSignatureModal = (field: SignatureField) => {
    setActiveField(field);
    setShowSignatureModal(true);
  };

  const applySignature = () => {
    if (!activeField) return;
    
    let value = '';
    if (activeField.type === 'SIGNATURE' || activeField.type === 'INITIAL') {
      if (signatureType === 'TYPE') {
        value = typedSignature;
      } else {
        value = 'signed';
      }
    } else if (activeField.type === 'DATE') {
      value = new Date().toLocaleDateString();
    } else if (activeField.type === 'CHECKBOX') {
      value = 'checked';
    } else {
      value = typedSignature;
    }
    
    setSignedFields(prev => ({ ...prev, [activeField.id]: value }));
    setShowSignatureModal(false);
    setTypedSignature('');
    setActiveField(null);

    // Auto-navigate to next unsigned field
    const currentIndex = document?.fields.findIndex(f => f.id === activeField.id) || 0;
    const nextUnsignedField = document?.fields.slice(currentIndex + 1).find(f => !signedFields[f.id] && f.required);
    if (nextUnsignedField) {
      setCurrentPage(nextUnsignedField.page);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsCompleted(true);
  };

  const handleDecline = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Redirect to dashboard
    window.location.href = '/dashboard/documents';
  };

  const canSubmit = getCompletedFieldsCount() === getTotalRequiredFields();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-10 h-10 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </motion.svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Document Signed!</h1>
          <p className="text-gray-600 mb-6">
            Your signed document has been submitted successfully. All parties will receive a copy via email.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-500 mb-1">Document</p>
            <p className="font-medium text-gray-900">{document?.name}</p>
            <p className="text-sm text-gray-500 mt-3 mb-1">Signed on</p>
            <p className="font-medium text-gray-900">{new Date().toLocaleString()}</p>
          </div>
          <div className="space-y-3">
            <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Signed Copy
            </button>
            <Link
              href="/dashboard/documents"
              className="block w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Documents
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/documents" className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Link>
              <div>
                <h1 className="font-semibold text-gray-900 truncate max-w-md">{document?.name}</h1>
                <p className="text-sm text-gray-500">From: {document?.senderName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeclineModal(true)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || isSubmitting}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Finish
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar - Fields List */}
        <div className="w-72 bg-white border-r hidden lg:block">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-medium text-gray-900">Required Fields</h2>
              <span className="text-sm text-gray-500">
                {getCompletedFieldsCount()}/{getTotalRequiredFields()}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all"
                style={{ width: `${(getCompletedFieldsCount() / getTotalRequiredFields()) * 100}%` }}
              />
            </div>
          </div>
          <div className="p-2 max-h-[calc(100vh-200px)] overflow-y-auto">
            {document?.fields.filter(f => f.required).map((field, index) => (
              <button
                key={field.id}
                onClick={() => {
                  setCurrentPage(field.page);
                  if (!isFieldComplete(field.id)) {
                    openSignatureModal(field);
                  }
                }}
                className={`w-full p-3 rounded-lg text-left mb-2 transition-colors ${
                  isFieldComplete(field.id)
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isFieldComplete(field.id)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-white'
                  }`}>
                    {isFieldComplete(field.id) ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      isFieldComplete(field.id) ? 'text-green-700' : 'text-gray-900'
                    }`}>
                      {field.label}
                    </p>
                    <p className="text-xs text-gray-500">Page {field.page}</p>
                  </div>
                  {field.type === 'SIGNATURE' && (
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Document Viewer */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {document?.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(document?.totalPages || 1, currentPage + 1))}
                disabled={currentPage === document?.totalPages}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom(Math.max(50, zoom - 25))}
                className="p-2 rounded hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                </svg>
              </button>
              <span className="text-sm text-gray-600 w-12 text-center">{zoom}%</span>
              <button
                onClick={() => setZoom(Math.min(200, zoom + 25))}
                className="p-2 rounded hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Document */}
          <div className="flex-1 overflow-auto p-8 bg-gray-200">
            <div className="flex justify-center">
              <div
                className="bg-white shadow-lg relative"
                style={{
                  width: `${(8.5 * 96 * zoom) / 100}px`,
                  height: `${(11 * 96 * zoom) / 100}px`,
                }}
              >
                {/* Document Content Placeholder */}
                <div className="absolute inset-0 p-8" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}>
                  <div className="text-center mb-8">
                    <h2 className="text-xl font-bold text-gray-900">PROPERTY SALE AGREEMENT</h2>
                    <p className="text-sm text-gray-500 mt-2">Page {currentPage} of {document?.totalPages}</p>
                  </div>
                  
                  {currentPage === 1 && (
                    <div className="space-y-4 text-sm text-gray-600">
                      <p>This Property Sale Agreement ("Agreement") is entered into as of the date of execution by and between:</p>
                      <p><strong>SELLER:</strong> Dharma Realty Pvt. Ltd., represented by Priya Sharma</p>
                      <p><strong>BUYER:</strong> [Your Name]</p>
                      <p><strong>PROPERTY:</strong> Serene Valley Villa, 123 Green Valley Road, Bangalore, Karnataka 560001</p>
                      <p className="mt-4">The parties hereby agree to the following terms and conditions:</p>
                      <p>1. The Seller agrees to sell and the Buyer agrees to purchase the above-described property for the total consideration of â‚¹1,50,00,000 (Rupees One Crore Fifty Lakhs Only).</p>
                      <p>2. The Buyer shall pay a token amount of â‚¹5,00,000 upon signing this agreement.</p>
                    </div>
                  )}

                  {currentPage === 2 && (
                    <div className="space-y-4 text-sm text-gray-600">
                      <p>3. The balance amount shall be paid as per the following schedule:</p>
                      <p className="ml-4">a) 20% within 30 days of signing</p>
                      <p className="ml-4">b) 30% upon completion of due diligence</p>
                      <p className="ml-4">c) Remaining 50% on possession date</p>
                      <p>4. The property is sold in "as-is" condition with all existing fixtures and fittings.</p>
                      <p>5. The Seller warrants that the property is free from any encumbrances, liens, or legal disputes.</p>
                    </div>
                  )}

                  {currentPage === 3 && (
                    <div className="space-y-4 text-sm text-gray-600">
                      <p>6. <strong>Vastu Compliance:</strong> The property has been verified for Vastu compliance with an overall score of 92%.</p>
                      <p>7. <strong>Possession:</strong> Physical possession shall be handed over within 60 days of full payment.</p>
                      <p>8. <strong>Registration:</strong> All registration charges and stamp duty shall be borne by the Buyer.</p>
                      <p className="mt-8 font-medium">ACKNOWLEDGMENT OF TERMS</p>
                      <p>By checking below, you acknowledge that you have read, understood, and agree to all terms and conditions stated in this agreement.</p>
                    </div>
                  )}

                  {currentPage === 4 && (
                    <div className="space-y-4 text-sm text-gray-600">
                      <p>9. <strong>Dispute Resolution:</strong> Any disputes arising from this agreement shall be resolved through arbitration in Bangalore.</p>
                      <p>10. <strong>Governing Law:</strong> This agreement shall be governed by the laws of India.</p>
                      <p className="mt-8 font-medium">BUYER INFORMATION</p>
                      <p>Please provide your full legal name as it appears on your government-issued ID:</p>
                    </div>
                  )}

                  {currentPage === 5 && (
                    <div className="space-y-4 text-sm text-gray-600">
                      <p className="font-medium">EXECUTION</p>
                      <p>IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.</p>
                      <div className="mt-8 grid grid-cols-2 gap-8">
                        <div>
                          <p className="font-medium mb-2">SELLER</p>
                          <p className="text-xs text-gray-500">Dharma Realty Pvt. Ltd.</p>
                          <div className="mt-4 border-b border-gray-300 pb-1">
                            <p className="text-sm italic text-gray-400">Priya Sharma</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Authorized Signatory</p>
                        </div>
                        <div>
                          <p className="font-medium mb-2">BUYER</p>
                          <p className="text-xs text-gray-500">[Buyer Name]</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Signature Fields */}
                {getFieldsForPage(currentPage).map((field) => (
                  <button
                    key={field.id}
                    onClick={() => openSignatureModal(field)}
                    className={`absolute border-2 rounded transition-all ${
                      isFieldComplete(field.id)
                        ? 'border-green-500 bg-green-50'
                        : 'border-orange-500 bg-orange-50 hover:bg-orange-100 animate-pulse'
                    }`}
                    style={{
                      left: `${(field.x * zoom) / 100}px`,
                      top: `${(field.y * zoom) / 100}px`,
                      width: `${(field.width * zoom) / 100}px`,
                      height: `${(field.height * zoom) / 100}px`,
                    }}
                  >
                    {isFieldComplete(field.id) ? (
                      <div className="w-full h-full flex items-center justify-center">
                        {field.type === 'SIGNATURE' || field.type === 'INITIAL' ? (
                          <span
                            className="text-2xl text-blue-700"
                            style={{ fontFamily: signatureFont === 'dancing-script' ? 'cursive' : 'serif' }}
                          >
                            {signedFields[field.id]}
                          </span>
                        ) : field.type === 'CHECKBOX' ? (
                          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-sm text-gray-700">{signedFields[field.id]}</span>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-orange-600">
                        {field.type === 'SIGNATURE' && (
                          <>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            <span className="text-xs mt-1">Sign here</span>
                          </>
                        )}
                        {field.type === 'INITIAL' && (
                          <>
                            <span className="text-sm font-medium">AB</span>
                            <span className="text-xs">Initial here</span>
                          </>
                        )}
                        {field.type === 'DATE' && (
                          <>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs mt-1">Date</span>
                          </>
                        )}
                        {field.type === 'CHECKBOX' && (
                          <div className="w-5 h-5 border-2 border-orange-500 rounded" />
                        )}
                        {field.type === 'TEXT' && (
                          <span className="text-xs">{field.label}</span>
                        )}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Page Thumbnails */}
          <div className="bg-white border-t p-2 flex gap-2 overflow-x-auto">
            {Array.from({ length: document?.totalPages || 0 }, (_, i) => i + 1).map((page) => {
              const pageFields = getFieldsForPage(page);
              const hasUnsignedFields = pageFields.some(f => f.required && !isFieldComplete(f.id));
              
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex-shrink-0 w-16 h-20 rounded border-2 relative ${
                    currentPage === page
                      ? 'border-orange-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                    {page}
                  </div>
                  {hasUnsignedFields && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">{pageFields.filter(f => f.required && !isFieldComplete(f.id)).length}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Signature Modal */}
      <AnimatePresence>
        {showSignatureModal && activeField && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSignatureModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-lg w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">{activeField.label}</h2>
                  <button onClick={() => setShowSignatureModal(false)} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6">
                {(activeField.type === 'SIGNATURE' || activeField.type === 'INITIAL') && (
                  <>
                    {/* Signature Type Tabs */}
                    <div className="flex gap-2 mb-6">
                      {(['TYPE', 'DRAW', 'UPLOAD'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setSignatureType(type)}
                          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                            signatureType === type
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {type === 'TYPE' && 'Type'}
                          {type === 'DRAW' && 'Draw'}
                          {type === 'UPLOAD' && 'Upload'}
                        </button>
                      ))}
                    </div>

                    {signatureType === 'TYPE' && (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={typedSignature}
                          onChange={(e) => setTypedSignature(e.target.value)}
                          placeholder={activeField.type === 'SIGNATURE' ? 'Type your full name' : 'Type your initials'}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-xl"
                          style={{ fontFamily: signatureFont === 'dancing-script' ? 'cursive' : 'serif' }}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSignatureFont('dancing-script')}
                            className={`flex-1 py-3 border rounded-lg ${
                              signatureFont === 'dancing-script' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                            }`}
                            style={{ fontFamily: 'cursive' }}
                          >
                            Script
                          </button>
                          <button
                            onClick={() => setSignatureFont('serif')}
                            className={`flex-1 py-3 border rounded-lg ${
                              signatureFont === 'serif' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                            }`}
                            style={{ fontFamily: 'serif' }}
                          >
                            Formal
                          </button>
                        </div>
                        {typedSignature && (
                          <div className="p-4 bg-gray-50 rounded-lg text-center">
                            <p className="text-sm text-gray-500 mb-2">Preview</p>
                            <p
                              className="text-3xl text-blue-700"
                              style={{ fontFamily: signatureFont === 'dancing-script' ? 'cursive' : 'serif' }}
                            >
                              {typedSignature}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {signatureType === 'DRAW' && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex items-center justify-center text-gray-400">
                        <p className="text-center">
                          <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Draw your signature here
                        </p>
                      </div>
                    )}

                    {signatureType === 'UPLOAD' && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          <p>Click to upload or drag and drop</p>
                          <p className="text-xs mt-1">PNG, JPG up to 2MB</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {activeField.type === 'DATE' && (
                  <div className="text-center py-4">
                    <p className="text-gray-600 mb-4">The current date will be applied:</p>
                    <p className="text-2xl font-medium text-gray-900">
                      {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                )}

                {activeField.type === 'CHECKBOX' && (
                  <div className="text-center py-4">
                    <p className="text-gray-600 mb-4">{activeField.label}</p>
                    <label className="inline-flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={signedFields[activeField.id] === 'checked'}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSignedFields(prev => ({ ...prev, [activeField.id]: 'checked' }));
                          } else {
                            const newFields = { ...signedFields };
                            delete newFields[activeField.id];
                            setSignedFields(newFields);
                          }
                        }}
                        className="w-6 h-6 rounded text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-gray-900">I agree</span>
                    </label>
                  </div>
                )}

                {activeField.type === 'TEXT' && (
                  <div>
                    <input
                      type="text"
                      value={typedSignature}
                      onChange={(e) => setTypedSignature(e.target.value)}
                      placeholder={activeField.label}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                )}
              </div>

              <div className="p-6 bg-gray-50 border-t flex gap-3">
                <button
                  onClick={() => setShowSignatureModal(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={applySignature}
                  disabled={
                    (activeField.type === 'SIGNATURE' || activeField.type === 'INITIAL' || activeField.type === 'TEXT') &&
                    !typedSignature
                  }
                  className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decline Modal */}
      <AnimatePresence>
        {showDeclineModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeclineModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Decline to Sign?</h2>
                <p className="text-gray-600">
                  Are you sure you want to decline this document? The sender will be notified.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason (optional)
                </label>
                <textarea
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder="Please provide a reason for declining..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeclineModal(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDecline}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Declining...' : 'Decline'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}










---

### 📄 about/page.tsx
> **File**: `frontend/src/app/about/page.tsx`  
> **Description**: About Us Page with Team Members

