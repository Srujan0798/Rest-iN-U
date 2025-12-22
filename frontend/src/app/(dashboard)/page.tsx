'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface DashboardStats {
  savedProperties: number;
  activeSearches: number;
  scheduledShowings: number;
  unreadMessages: number;
  recentViews: number;
  pendingOffers: number;
}

interface Activity {
  id: string;
  type: 'view' | 'save' | 'message' | 'showing' | 'offer' | 'price_change';
  title: string;
  description: string;
  timestamp: string;
  propertyId?: string;
  propertyImage?: string;
}

interface RecommendedProperty {
  id: string;
  title: string;
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  vastuScore?: number;
  matchScore: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    savedProperties: 12,
    activeSearches: 3,
    scheduledShowings: 2,
    unreadMessages: 5,
    recentViews: 24,
    pendingOffers: 1,
  });

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      type: 'price_change',
      title: 'Price Reduced',
      description: 'Sunset Villa dropped by â‚¹15L',
      timestamp: '2 hours ago',
      propertyId: 'p1',
      propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&h=100&fit=crop',
    },
    {
      id: '2',
      type: 'showing',
      title: 'Showing Confirmed',
      description: 'Tomorrow at 10:00 AM - Green Valley Apartment',
      timestamp: '5 hours ago',
      propertyId: 'p2',
    },
    {
      id: '3',
      type: 'message',
      title: 'New Message',
      description: 'Agent Priya replied to your inquiry',
      timestamp: 'Yesterday',
    },
    {
      id: '4',
      type: 'save',
      title: 'Property Saved',
      description: 'Added Modern Penthouse to favorites',
      timestamp: 'Yesterday',
      propertyId: 'p3',
    },
    {
      id: '5',
      type: 'view',
      title: 'Property Viewed',
      description: 'Someone viewed your listing',
      timestamp: '2 days ago',
    },
  ]);

  const [recommended, setRecommended] = useState<RecommendedProperty[]>([
    {
      id: 'r1',
      title: 'Vastu-Compliant Villa',
      address: 'Whitefield, Bangalore',
      price: 15000000,
      beds: 4,
      baths: 3,
      sqft: 3200,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
      vastuScore: 92,
      matchScore: 95,
    },
    {
      id: 'r2',
      title: 'Modern Apartment',
      address: 'Koramangala, Bangalore',
      price: 8500000,
      beds: 3,
      baths: 2,
      sqft: 1800,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      vastuScore: 85,
      matchScore: 88,
    },
    {
      id: 'r3',
      title: 'Heritage Bungalow',
      address: 'Indiranagar, Bangalore',
      price: 22000000,
      beds: 5,
      baths: 4,
      sqft: 4500,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop',
      vastuScore: 98,
      matchScore: 82,
    },
  ]);

  const [panchangData, setPanchangData] = useState({
    tithi: 'Shukla Dashami',
    nakshatra: 'Pushya',
    yoga: 'Siddhi',
    muhurat: 'Auspicious for property dealings',
    isAuspicious: true,
  });

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `â‚¹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `â‚¹${(price / 100000).toFixed(2)} L`;
    }
    return `â‚¹${price.toLocaleString()}`;
  };

  const activityIcons: Record<string, React.ReactNode> = {
    view: (
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </div>
    ),
    save: (
      <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
        <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
    ),
    message: (
      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
    ),
    showing: (
      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    ),
    offer: (
      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
    ),
    price_change: (
      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      </div>
    ),
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back! ðŸ™</h1>
          <p className="text-gray-600">Here's what's happening with your property search</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/search"
            className="px-4 py-2 bg-white border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Search Properties
          </Link>
          <Link
            href="/dashboard/astrology"
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 transition-all"
          >
            Check Muhurat
          </Link>
        </div>
      </div>

      {/* Panchang Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-2xl border ${
          panchangData.isAuspicious
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
            : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              panchangData.isAuspicious ? 'bg-green-100' : 'bg-orange-100'
            }`}>
              <span className="text-2xl">ðŸ•‰ï¸</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Today's Panchang</p>
              <p className="font-semibold text-gray-900">{panchangData.tithi} â€¢ {panchangData.nakshatra}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-sm font-medium ${panchangData.isAuspicious ? 'text-green-600' : 'text-orange-600'}`}>
              {panchangData.muhurat}
            </p>
            <p className="text-xs text-gray-500">Yoga: {panchangData.yoga}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Saved Properties', value: stats.savedProperties, icon: 'â¤ï¸', color: 'pink', href: '/dashboard/favorites' },
          { label: 'Active Searches', value: stats.activeSearches, icon: 'ðŸ”', color: 'blue', href: '/dashboard/searches' },
          { label: 'Scheduled Showings', value: stats.scheduledShowings, icon: 'ðŸ“…', color: 'purple', href: '/dashboard/showings' },
          { label: 'Unread Messages', value: stats.unreadMessages, icon: 'ðŸ’¬', color: 'green', href: '/dashboard/messages' },
          { label: 'Recent Views', value: stats.recentViews, icon: 'ðŸ‘ï¸', color: 'gray', href: '/dashboard/activity' },
          { label: 'Pending Offers', value: stats.pendingOffers, icon: 'ðŸ“', color: 'amber', href: '/dashboard/offers' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={stat.href}
              className="block p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <Link href="/dashboard/activity" className="text-sm text-orange-600 hover:text-orange-700">
                  View all
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {activities.map((activity, i) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {activityIcons[activity.type]}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      {activity.propertyId && (
                        <Link
                          href={`/property/${activity.propertyId}`}
                          className="text-xs text-orange-600 hover:text-orange-700"
                        >
                          View â†’
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Upcoming Showings */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Upcoming Showings</h3>
            <div className="space-y-3">
              <div className="p-3 bg-purple-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">ðŸ </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">Green Valley Apartment</p>
                    <p className="text-xs text-gray-600">Tomorrow, 10:00 AM</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">ðŸ¡</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">Sunset Villa</p>
                    <p className="text-xs text-gray-600">Dec 22, 2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            <Link
              href="/dashboard/showings"
              className="block mt-4 text-center text-sm text-orange-600 hover:text-orange-700"
            >
              View all showings â†’
            </Link>
          </div>

          {/* Saved Search Alerts */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Saved Search Alerts</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900 text-sm">3BHK in Koramangala</p>
                  <p className="text-xs text-gray-600">5 new matches</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900 text-sm">Villa under â‚¹2Cr</p>
                  <p className="text-xs text-gray-600">2 new matches</p>
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Active</span>
              </div>
            </div>
            <Link
              href="/dashboard/searches"
              className="block mt-4 text-center text-sm text-orange-600 hover:text-orange-700"
            >
              Manage searches â†’
            </Link>
          </div>
        </div>
      </div>

      {/* Recommended Properties */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recommended for You</h2>
            <p className="text-sm text-gray-600">Based on your searches and preferences</p>
          </div>
          <Link href="/search" className="text-sm text-orange-600 hover:text-orange-700">
            View all â†’
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommended.map((property, i) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/property/${property.id}`}
                className="block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all group"
              >
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {property.vastuScore && property.vastuScore >= 90 && (
                      <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full flex items-center gap-1">
                        ðŸ•‰ï¸ {property.vastuScore}% Vastu
                      </span>
                    )}
                    <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
                      {property.matchScore}% Match
                    </span>
                  </div>
                  <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-xl font-bold text-gray-900">{formatPrice(property.price)}</p>
                  <h3 className="font-semibold text-gray-900 mt-1">{property.title}</h3>
                  <p className="text-sm text-gray-600">{property.address}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                    <span>{property.beds} beds</span>
                    <span>â€¢</span>
                    <span>{property.baths} baths</span>
                    <span>â€¢</span>
                    <span>{property.sqft.toLocaleString()} sqft</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Find Your Perfect Home with Vastu Guidance
        </h2>
        <p className="text-white/90 mb-6 max-w-2xl mx-auto">
          Let our AI-powered search find properties aligned with ancient Vedic principles 
          for prosperity, health, and harmony.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/search?vastu=true"
            className="px-6 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-colors"
          >
            Search Vastu Properties
          </Link>
          <Link
            href="/dashboard/astrology"
            className="px-6 py-3 bg-white/20 text-white border border-white/30 rounded-xl font-semibold hover:bg-white/30 transition-colors"
          >
            Get Astrological Guidance
          </Link>
        </div>
      </div>
    </div>
  );
}
