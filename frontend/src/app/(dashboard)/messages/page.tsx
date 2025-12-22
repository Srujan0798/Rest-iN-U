'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface SavedProperty {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  images: string[];
  status: 'ACTIVE' | 'PENDING' | 'SOLD' | 'OFF_MARKET';
  vastuScore?: number;
  daysOnMarket: number;
  priceChange?: {
    amount: number;
    type: 'increase' | 'decrease';
    date: string;
  };
  savedAt: string;
  notes?: string;
  folder?: string;
}

interface Folder {
  id: string;
  name: string;
  count: number;
  color: string;
}

export default function FavoritesPage() {
  const [properties, setProperties] = useState<SavedProperty[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'savedAt' | 'price' | 'vastuScore'>('savedAt');
  const [showCompare, setShowCompare] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [editingNote, setEditingNote] = useState<string | null>(null);

  useEffect(() => {
    // Mock data
    setFolders([
      { id: 'all', name: 'All Saved', count: 12, color: 'gray' },
      { id: 'shortlist', name: 'Shortlisted', count: 4, color: 'green' },
      { id: 'visit', name: 'To Visit', count: 3, color: 'blue' },
      { id: 'compare', name: 'For Comparison', count: 5, color: 'purple' },
    ]);

    setProperties([
      {
        id: 'p1',
        title: 'Luxury Villa with Garden',
        address: '123 Palm Street',
        city: 'Whitefield',
        state: 'Karnataka',
        price: 25000000,
        beds: 5,
        baths: 4,
        sqft: 4500,
        images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'],
        status: 'ACTIVE',
        vastuScore: 95,
        daysOnMarket: 15,
        priceChange: { amount: 1500000, type: 'decrease', date: '2024-12-15' },
        savedAt: '2024-12-10',
        notes: 'Beautiful garden, perfect for family. Need to check parking.',
        folder: 'shortlist',
      },
      {
        id: 'p2',
        title: 'Modern 3BHK Apartment',
        address: '456 Tech Park Road',
        city: 'Koramangala',
        state: 'Karnataka',
        price: 12000000,
        beds: 3,
        baths: 2,
        sqft: 1800,
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'],
        status: 'ACTIVE',
        vastuScore: 88,
        daysOnMarket: 30,
        savedAt: '2024-12-05',
        folder: 'visit',
      },
      {
        id: 'p3',
        title: 'Premium Penthouse',
        address: '789 MG Road',
        city: 'Indiranagar',
        state: 'Karnataka',
        price: 35000000,
        beds: 4,
        baths: 3,
        sqft: 3200,
        images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'],
        status: 'PENDING',
        vastuScore: 92,
        daysOnMarket: 5,
        savedAt: '2024-12-18',
        folder: 'shortlist',
      },
      {
        id: 'p4',
        title: 'Vastu-Compliant Bungalow',
        address: '321 Lake View',
        city: 'HSR Layout',
        state: 'Karnataka',
        price: 18000000,
        beds: 4,
        baths: 3,
        sqft: 2800,
        images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop'],
        status: 'ACTIVE',
        vastuScore: 98,
        daysOnMarket: 20,
        savedAt: '2024-12-01',
        folder: 'compare',
      },
    ]);

    setLoading(false);
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `â‚¹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `â‚¹${(price / 100000).toFixed(2)} L`;
    }
    return `â‚¹${price.toLocaleString()}`;
  };

  const filteredProperties = selectedFolder && selectedFolder !== 'all'
    ? properties.filter(p => p.folder === selectedFolder)
    : properties;

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === 'price') return b.price - a.price;
    if (sortBy === 'vastuScore') return (b.vastuScore || 0) - (a.vastuScore || 0);
    return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
  });

  const toggleCompare = (id: string) => {
    if (compareList.includes(id)) {
      setCompareList(compareList.filter(i => i !== id));
    } else if (compareList.length < 4) {
      setCompareList([...compareList, id]);
    }
  };

  const removeFromFavorites = (id: string) => {
    setProperties(properties.filter(p => p.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Properties</h1>
          <p className="text-gray-600">{properties.length} properties saved</p>
        </div>
        <div className="flex gap-3">
          {compareList.length > 1 && (
            <button
              onClick={() => setShowCompare(true)}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-amber-600"
            >
              Compare ({compareList.length})
            </button>
          )}
          <Link
            href="/search"
            className="px-4 py-2 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
          >
            Find More
          </Link>
        </div>
      </div>

      {/* Folders */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {folders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => setSelectedFolder(folder.id === 'all' ? null : folder.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
              (selectedFolder === folder.id) || (!selectedFolder && folder.id === 'all')
                ? 'bg-orange-500 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-orange-300'
            }`}
          >
            <span>{folder.name}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              (selectedFolder === folder.id) || (!selectedFolder && folder.id === 'all')
                ? 'bg-white/20'
                : 'bg-gray-100'
            }`}>
              {folder.count}
            </span>
          </button>
        ))}
        <button className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-orange-300 hover:text-orange-500 whitespace-nowrap">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Folder
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="savedAt">Recently Saved</option>
            <option value="price">Price (High to Low)</option>
            <option value="vastuScore">Vastu Score</option>
          </select>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Properties Grid/List */}
      {sortedProperties.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved properties</h3>
          <p className="text-gray-600 mb-4">Start saving properties you love to see them here</p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium"
          >
            Browse Properties
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {sortedProperties.map((property, i) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden group"
              >
                <div className="relative">
                  <Link href={`/property/${property.id}`}>
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      property.status === 'ACTIVE' ? 'bg-green-500 text-white' :
                      property.status === 'PENDING' ? 'bg-yellow-500 text-white' :
                      property.status === 'SOLD' ? 'bg-red-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {property.status}
                    </span>
                    {property.vastuScore && property.vastuScore >= 90 && (
                      <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
                        ðŸ•‰ï¸ {property.vastuScore}%
                      </span>
                    )}
                  </div>

                  {/* Price Change Badge */}
                  {property.priceChange && (
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        property.priceChange.type === 'decrease' ? 'bg-green-500' : 'bg-red-500'
                      } text-white flex items-center gap-1`}>
                        {property.priceChange.type === 'decrease' ? 'â†“' : 'â†‘'}
                        {formatPrice(property.priceChange.amount)}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleCompare(property.id)}
                      className={`p-2 rounded-lg backdrop-blur-sm transition-colors ${
                        compareList.includes(property.id)
                          ? 'bg-orange-500 text-white'
                          : 'bg-white/90 text-gray-700 hover:bg-white'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => removeFromFavorites(property.id)}
                      className="p-2 bg-white/90 rounded-lg backdrop-blur-sm text-red-500 hover:bg-white"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xl font-bold text-gray-900">{formatPrice(property.price)}</p>
                    <span className="text-xs text-gray-500">{property.daysOnMarket} days</span>
                  </div>
                  <Link href={`/property/${property.id}`}>
                    <h3 className="font-semibold text-gray-900 hover:text-orange-600 transition-colors">{property.title}</h3>
                  </Link>
                  <p className="text-sm text-gray-600">{property.address}, {property.city}</p>
                  
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                    <span>{property.beds} beds</span>
                    <span>â€¢</span>
                    <span>{property.baths} baths</span>
                    <span>â€¢</span>
                    <span>{property.sqft.toLocaleString()} sqft</span>
                  </div>

                  {/* Notes */}
                  {editingNote === property.id ? (
                    <div className="mt-3">
                      <textarea
                        defaultValue={property.notes}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        rows={2}
                        placeholder="Add a note..."
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => setEditingNote(null)}
                          className="px-3 py-1 text-sm bg-orange-500 text-white rounded-lg"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingNote(null)}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : property.notes ? (
                    <div
                      onClick={() => setEditingNote(property.id)}
                      className="mt-3 p-2 bg-yellow-50 border border-yellow-100 rounded-lg text-sm text-gray-700 cursor-pointer hover:bg-yellow-100 transition-colors"
                    >
                      ðŸ“ {property.notes}
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingNote(property.id)}
                      className="mt-3 text-sm text-gray-500 hover:text-orange-600"
                    >
                      + Add note
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {sortedProperties.map((property, i) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex group"
              >
                <Link href={`/property/${property.id}`} className="flex-shrink-0">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-48 h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-xl font-bold text-gray-900">{formatPrice(property.price)}</p>
                        {property.priceChange && (
                          <span className={`text-sm ${property.priceChange.type === 'decrease' ? 'text-green-600' : 'text-red-600'}`}>
                            {property.priceChange.type === 'decrease' ? 'â†“' : 'â†‘'} {formatPrice(property.priceChange.amount)}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          property.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                          property.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {property.status}
                        </span>
                      </div>
                      <Link href={`/property/${property.id}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-orange-600">{property.title}</h3>
                      </Link>
                      <p className="text-sm text-gray-600">{property.address}, {property.city}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>{property.beds} beds</span>
                        <span>â€¢</span>
                        <span>{property.baths} baths</span>
                        <span>â€¢</span>
                        <span>{property.sqft.toLocaleString()} sqft</span>
                        {property.vastuScore && (
                          <>
                            <span>â€¢</span>
                            <span className="text-orange-600">ðŸ•‰ï¸ {property.vastuScore}% Vastu</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCompare(property.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          compareList.includes(property.id)
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => removeFromFavorites(property.id)}
                        className="p-2 bg-gray-100 rounded-lg text-red-500 hover:bg-red-50"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {property.notes && (
                    <div className="mt-3 p-2 bg-yellow-50 rounded-lg text-sm text-gray-700">
                      ðŸ“ {property.notes}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Compare Modal */}
      <AnimatePresence>
        {showCompare && compareList.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Compare Properties</h2>
                <button
                  onClick={() => setShowCompare(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left p-4 bg-gray-50">Feature</th>
                        {compareList.map(id => {
                          const p = properties.find(prop => prop.id === id);
                          if (!p) return null;
                          return (
                            <th key={id} className="p-4 bg-gray-50 min-w-[200px]">
                              <img src={p.images[0]} alt={p.title} className="w-full h-32 object-cover rounded-lg mb-2" />
                              <p className="font-semibold text-gray-900">{p.title}</p>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: 'Price', key: 'price', format: (v: number) => formatPrice(v) },
                        { label: 'Bedrooms', key: 'beds' },
                        { label: 'Bathrooms', key: 'baths' },
                        { label: 'Square Feet', key: 'sqft', format: (v: number) => v.toLocaleString() },
                        { label: 'Vastu Score', key: 'vastuScore', format: (v: number) => v ? `${v}%` : 'N/A' },
                        { label: 'Days on Market', key: 'daysOnMarket' },
                        { label: 'Status', key: 'status' },
                      ].map(row => (
                        <tr key={row.key} className="border-b">
                          <td className="p-4 font-medium text-gray-700">{row.label}</td>
                          {compareList.map(id => {
                            const p = properties.find(prop => prop.id === id);
                            if (!p) return null;
                            const value = (p as any)[row.key];
                            return (
                              <td key={id} className="p-4 text-center">
                                {row.format ? row.format(value) : value}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
