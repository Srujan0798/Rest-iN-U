'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Showing {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyAddress: string;
  propertyPrice: number;
  date: string;
  time: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  type: 'IN_PERSON' | 'VIRTUAL' | 'OPEN_HOUSE';
  agent?: {
    id: string;
    name: string;
    photo: string;
    phone: string;
  };
  notes?: string;
  feedback?: {
    rating: number;
    comment: string;
    interested: boolean;
  };
}

const mockShowings: Showing[] = [
  {
    id: '1',
    propertyId: 'prop1',
    propertyTitle: 'Luxurious 4BHK Villa with Vastu',
    propertyImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400',
    propertyAddress: '123 Koramangala 4th Block, Bangalore',
    propertyPrice: 25000000,
    date: '2024-12-20',
    time: '10:00 AM',
    status: 'SCHEDULED',
    type: 'IN_PERSON',
    agent: {
      id: 'agent1',
      name: 'Priya Sharma',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      phone: '+91 98765 43210'
    },
    notes: 'Please bring ID proof. Parking available in basement.'
  },
  {
    id: '2',
    propertyId: 'prop2',
    propertyTitle: 'Modern 3BHK Apartment',
    propertyImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
    propertyAddress: '456 HSR Layout, Bangalore',
    propertyPrice: 12500000,
    date: '2024-12-21',
    time: '2:00 PM',
    status: 'SCHEDULED',
    type: 'VIRTUAL',
    agent: {
      id: 'agent2',
      name: 'Rahul Verma',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      phone: '+91 98765 12345'
    },
    notes: 'Virtual tour link will be sent 30 mins before.'
  },
  {
    id: '3',
    propertyId: 'prop3',
    propertyTitle: 'Spacious 5BHK Penthouse',
    propertyImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
    propertyAddress: '789 Indiranagar, Bangalore',
    propertyPrice: 45000000,
    date: '2024-12-22',
    time: '11:00 AM',
    status: 'SCHEDULED',
    type: 'OPEN_HOUSE',
    notes: 'Open house event. Multiple visitors expected.'
  },
  {
    id: '4',
    propertyId: 'prop4',
    propertyTitle: 'Cozy 2BHK Flat',
    propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    propertyAddress: '321 Whitefield, Bangalore',
    propertyPrice: 8500000,
    date: '2024-12-15',
    time: '3:00 PM',
    status: 'COMPLETED',
    type: 'IN_PERSON',
    agent: {
      id: 'agent1',
      name: 'Priya Sharma',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      phone: '+91 98765 43210'
    },
    feedback: {
      rating: 4,
      comment: 'Great location but kitchen space is smaller than expected.',
      interested: true
    }
  },
  {
    id: '5',
    propertyId: 'prop5',
    propertyTitle: 'Premium 4BHK Duplex',
    propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
    propertyAddress: '555 JP Nagar, Bangalore',
    propertyPrice: 32000000,
    date: '2024-12-18',
    time: '10:30 AM',
    status: 'CANCELLED',
    type: 'IN_PERSON',
    agent: {
      id: 'agent3',
      name: 'Amit Kumar',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      phone: '+91 98765 67890'
    },
    notes: 'Cancelled by seller - property under renovation.'
  }
];

export default function ShowingsPage() {
  const [showings, setShowings] = useState<Showing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [selectedShowing, setSelectedShowing] = useState<Showing | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({ date: '', time: '' });
  const [feedbackData, setFeedbackData] = useState({ rating: 0, comment: '', interested: false });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setShowings(mockShowings);
      setLoading(false);
    }, 500);
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `â‚¹${(price / 10000000).toFixed(1)} Cr`;
    }
    return `â‚¹${(price / 100000).toFixed(0)} L`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const getStatusColor = (status: Showing['status']) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-700';
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      case 'RESCHEDULED': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: Showing['type']) => {
    switch (type) {
      case 'IN_PERSON':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'VIRTUAL':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'OPEN_HOUSE':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
    }
  };

  const filteredShowings = showings.filter(showing => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return showing.status === 'SCHEDULED' || showing.status === 'RESCHEDULED';
    if (filter === 'completed') return showing.status === 'COMPLETED';
    if (filter === 'cancelled') return showing.status === 'CANCELLED';
    return true;
  });

  const upcomingCount = showings.filter(s => s.status === 'SCHEDULED' || s.status === 'RESCHEDULED').length;
  const completedCount = showings.filter(s => s.status === 'COMPLETED').length;
  const cancelledCount = showings.filter(s => s.status === 'CANCELLED').length;

  const handleCancelShowing = (showingId: string) => {
    setShowings(prev => prev.map(s => 
      s.id === showingId ? { ...s, status: 'CANCELLED' as const } : s
    ));
  };

  const handleReschedule = () => {
    if (selectedShowing && rescheduleData.date && rescheduleData.time) {
      setShowings(prev => prev.map(s =>
        s.id === selectedShowing.id 
          ? { ...s, date: rescheduleData.date, time: rescheduleData.time, status: 'RESCHEDULED' as const }
          : s
      ));
      setShowRescheduleModal(false);
      setSelectedShowing(null);
      setRescheduleData({ date: '', time: '' });
    }
  };

  const handleSubmitFeedback = () => {
    if (selectedShowing && feedbackData.rating > 0) {
      setShowings(prev => prev.map(s =>
        s.id === selectedShowing.id
          ? { ...s, feedback: { ...feedbackData } }
          : s
      ));
      setShowFeedbackModal(false);
      setSelectedShowing(null);
      setFeedbackData({ rating: 0, comment: '', interested: false });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scheduled Showings</h1>
          <p className="text-gray-600 mt-1">Manage your property viewing appointments</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow text-orange-600' : 'text-gray-500'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'calendar' ? 'bg-white shadow text-orange-600' : 'text-gray-500'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          <Link
            href="/search"
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-colors"
          >
            Schedule New
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setFilter('all')}
          className={`p-4 rounded-xl border-2 transition-all ${filter === 'all' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
        >
          <div className="text-3xl font-bold text-gray-900">{showings.length}</div>
          <div className="text-gray-600">Total Showings</div>
        </motion.button>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          onClick={() => setFilter('upcoming')}
          className={`p-4 rounded-xl border-2 transition-all ${filter === 'upcoming' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
        >
          <div className="text-3xl font-bold text-blue-600">{upcomingCount}</div>
          <div className="text-gray-600">Upcoming</div>
        </motion.button>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => setFilter('completed')}
          className={`p-4 rounded-xl border-2 transition-all ${filter === 'completed' ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
        >
          <div className="text-3xl font-bold text-green-600">{completedCount}</div>
          <div className="text-gray-600">Completed</div>
        </motion.button>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={() => setFilter('cancelled')}
          className={`p-4 rounded-xl border-2 transition-all ${filter === 'cancelled' ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
        >
          <div className="text-3xl font-bold text-red-600">{cancelledCount}</div>
          <div className="text-gray-600">Cancelled</div>
        </motion.button>
      </div>

      {/* Showings List */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredShowings.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-white rounded-xl border border-gray-200"
              >
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No showings found</h3>
                <p className="text-gray-600 mb-4">You don't have any {filter !== 'all' ? filter : ''} showings.</p>
                <Link
                  href="/search"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600"
                >
                  Browse Properties
                </Link>
              </motion.div>
            ) : (
              filteredShowings.map((showing, index) => (
                <motion.div
                  key={showing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Property Image */}
                    <div className="relative w-full md:w-64 h-48 md:h-auto flex-shrink-0">
                      <img
                        src={showing.propertyImage}
                        alt={showing.propertyTitle}
                        className="w-full h-full object-cover"
                      />
                      <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(showing.status)}`}>
                        {showing.status}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <Link href={`/property/${showing.propertyId}`} className="hover:text-orange-600">
                            <h3 className="text-lg font-semibold text-gray-900">{showing.propertyTitle}</h3>
                          </Link>
                          <p className="text-gray-600 text-sm mt-1">{showing.propertyAddress}</p>
                          <p className="text-xl font-bold text-orange-600 mt-2">{formatPrice(showing.propertyPrice)}</p>

                          {/* Date & Time */}
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-2 text-gray-600">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="font-medium">{formatDate(showing.date)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="font-medium">{showing.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              {getTypeIcon(showing.type)}
                              <span className="text-sm">{showing.type.replace('_', ' ')}</span>
                            </div>
                          </div>

                          {/* Agent Info */}
                          {showing.agent && (
                            <div className="flex items-center gap-3 mt-4 p-3 bg-gray-50 rounded-lg">
                              <img
                                src={showing.agent.photo}
                                alt={showing.agent.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <Link href={`/agent/${showing.agent.id}`} className="font-medium text-gray-900 hover:text-orange-600">
                                  {showing.agent.name}
                                </Link>
                                <p className="text-sm text-gray-600">{showing.agent.phone}</p>
                              </div>
                            </div>
                          )}

                          {/* Notes */}
                          {showing.notes && (
                            <div className="mt-3 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800">
                              <span className="font-medium">Note:</span> {showing.notes}
                            </div>
                          )}

                          {/* Feedback */}
                          {showing.feedback && (
                            <div className="mt-3 p-3 bg-green-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-green-800">Your Feedback:</span>
                                <div className="flex items-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                      key={star}
                                      className={`w-4 h-4 ${star <= showing.feedback!.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                {showing.feedback.interested && (
                                  <span className="ml-2 px-2 py-0.5 bg-green-200 text-green-800 text-xs rounded-full">Interested</span>
                                )}
                              </div>
                              <p className="text-sm text-green-800">{showing.feedback.comment}</p>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-row md:flex-col gap-2">
                          {(showing.status === 'SCHEDULED' || showing.status === 'RESCHEDULED') && (
                            <>
                              {showing.type === 'VIRTUAL' && (
                                <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm">
                                  Join Call
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedShowing(showing);
                                  setShowRescheduleModal(true);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                              >
                                Reschedule
                              </button>
                              <button
                                onClick={() => handleCancelShowing(showing.id)}
                                className="px-4 py-2 text-red-600 border border-red-300 rounded-lg font-medium hover:bg-red-50 transition-colors text-sm"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {showing.status === 'COMPLETED' && !showing.feedback && (
                            <button
                              onClick={() => {
                                setSelectedShowing(showing);
                                setShowFeedbackModal(true);
                              }}
                              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-colors text-sm"
                            >
                              Add Feedback
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* Calendar View */
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-center text-gray-600">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar View Coming Soon</h3>
            <p className="text-gray-600">We're working on a beautiful calendar interface for your showings.</p>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      <AnimatePresence>
        {showRescheduleModal && selectedShowing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowRescheduleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-md w-full p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Reschedule Showing</h2>
              <p className="text-gray-600 mb-4">{selectedShowing.propertyTitle}</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Date</label>
                  <input
                    type="date"
                    value={rescheduleData.date}
                    onChange={(e) => setRescheduleData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Time</label>
                  <input
                    type="time"
                    value={rescheduleData.time}
                    onChange={(e) => setRescheduleData(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowRescheduleModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReschedule}
                  disabled={!rescheduleData.date || !rescheduleData.time}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedbackModal && selectedShowing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowFeedbackModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-md w-full p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Share Your Feedback</h2>
              <p className="text-gray-600 mb-4">{selectedShowing.propertyTitle}</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setFeedbackData(prev => ({ ...prev, rating: star }))}
                        className="focus:outline-none"
                      >
                        <svg
                          className={`w-8 h-8 transition-colors ${star <= feedbackData.rating ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                  <textarea
                    value={feedbackData.comment}
                    onChange={(e) => setFeedbackData(prev => ({ ...prev, comment: e.target.value }))}
                    rows={3}
                    placeholder="Share your thoughts about the property..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={feedbackData.interested}
                    onChange={(e) => setFeedbackData(prev => ({ ...prev, interested: e.target.checked }))}
                    className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-gray-700">I'm interested in this property</span>
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitFeedback}
                  disabled={feedbackData.rating === 0}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
