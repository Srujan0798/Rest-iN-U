'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Offer {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyAddress: string;
  listPrice: number;
  offerAmount: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTERED' | 'WITHDRAWN' | 'EXPIRED';
  type: 'MADE' | 'RECEIVED';
  submittedAt: string;
  expiresAt: string;
  counterOffer?: number;
  contingencies: string[];
  earnestMoney: number;
  financingType: 'CASH' | 'CONVENTIONAL' | 'FHA' | 'VA';
  closingDate: string;
  buyer?: {
    name: string;
    phone: string;
    email: string;
  };
  seller?: {
    name: string;
    phone: string;
  };
  agent?: {
    id: string;
    name: string;
    photo: string;
  };
  notes?: string;
  messages: Array<{
    id: string;
    sender: string;
    message: string;
    timestamp: string;
  }>;
}

const mockOffers: Offer[] = [
  {
    id: '1',
    propertyId: 'prop1',
    propertyTitle: 'Luxurious 4BHK Villa with Vastu',
    propertyImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400',
    propertyAddress: '123 Koramangala 4th Block, Bangalore',
    listPrice: 25000000,
    offerAmount: 24000000,
    status: 'PENDING',
    type: 'MADE',
    submittedAt: '2024-12-18T10:30:00',
    expiresAt: '2024-12-21T23:59:00',
    contingencies: ['Home Inspection', 'Vastu Verification', 'Financing'],
    earnestMoney: 500000,
    financingType: 'CONVENTIONAL',
    closingDate: '2025-01-30',
    seller: {
      name: 'Vikram Mehta',
      phone: '+91 98765 11111'
    },
    agent: {
      id: 'agent1',
      name: 'Priya Sharma',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
    },
    messages: [
      { id: '1', sender: 'You', message: 'We love the property and the Vastu compliance!', timestamp: '2024-12-18T10:30:00' }
    ]
  },
  {
    id: '2',
    propertyId: 'prop2',
    propertyTitle: 'Modern 3BHK Apartment',
    propertyImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
    propertyAddress: '456 HSR Layout, Bangalore',
    listPrice: 12500000,
    offerAmount: 12000000,
    status: 'COUNTERED',
    type: 'MADE',
    submittedAt: '2024-12-15T14:00:00',
    expiresAt: '2024-12-22T23:59:00',
    counterOffer: 12250000,
    contingencies: ['Home Inspection', 'Financing'],
    earnestMoney: 250000,
    financingType: 'CONVENTIONAL',
    closingDate: '2025-02-15',
    seller: {
      name: 'Anita Reddy',
      phone: '+91 98765 22222'
    },
    agent: {
      id: 'agent2',
      name: 'Rahul Verma',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
    },
    messages: [
      { id: '1', sender: 'You', message: 'Offering â‚¹1.2 Cr for quick closing.', timestamp: '2024-12-15T14:00:00' },
      { id: '2', sender: 'Seller', message: 'Counter offer at â‚¹1.225 Cr with same terms.', timestamp: '2024-12-17T09:00:00' }
    ]
  },
  {
    id: '3',
    propertyId: 'prop3',
    propertyTitle: 'Cozy 2BHK in Whitefield',
    propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    propertyAddress: '789 Whitefield Main Road, Bangalore',
    listPrice: 8500000,
    offerAmount: 8200000,
    status: 'ACCEPTED',
    type: 'MADE',
    submittedAt: '2024-12-10T11:00:00',
    expiresAt: '2024-12-13T23:59:00',
    contingencies: ['Home Inspection'],
    earnestMoney: 200000,
    financingType: 'CASH',
    closingDate: '2025-01-15',
    seller: {
      name: 'Suresh Kumar',
      phone: '+91 98765 33333'
    },
    messages: [
      { id: '1', sender: 'You', message: 'Cash offer for quick closing.', timestamp: '2024-12-10T11:00:00' },
      { id: '2', sender: 'Seller', message: 'Accepted! Looking forward to closing.', timestamp: '2024-12-12T16:00:00' }
    ]
  },
  {
    id: '4',
    propertyId: 'prop4',
    propertyTitle: 'Premium Penthouse',
    propertyImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
    propertyAddress: '321 Indiranagar 100ft Road, Bangalore',
    listPrice: 45000000,
    offerAmount: 42000000,
    status: 'REJECTED',
    type: 'MADE',
    submittedAt: '2024-12-05T09:00:00',
    expiresAt: '2024-12-08T23:59:00',
    contingencies: ['Home Inspection', 'Vastu Verification', 'Financing'],
    earnestMoney: 1000000,
    financingType: 'CONVENTIONAL',
    closingDate: '2025-02-28',
    seller: {
      name: 'Rajesh Gupta',
      phone: '+91 98765 44444'
    },
    messages: [
      { id: '1', sender: 'Seller', message: 'Thank you for your offer but we have accepted another offer closer to asking price.', timestamp: '2024-12-07T10:00:00' }
    ]
  }
];

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected' | 'countered'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'made' | 'received'>('all');
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [counterAmount, setCounterAmount] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setOffers(mockOffers);
      setLoading(false);
    }, 500);
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `â‚¹${(price / 10000000).toFixed(2)} Cr`;
    }
    return `â‚¹${(price / 100000).toFixed(0)} L`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status: Offer['status']) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'ACCEPTED': return 'bg-green-100 text-green-700 border-green-300';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-300';
      case 'COUNTERED': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'WITHDRAWN': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'EXPIRED': return 'bg-gray-100 text-gray-500 border-gray-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status: Offer['status']) => {
    switch (status) {
      case 'PENDING':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'ACCEPTED':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'REJECTED':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'COUNTERED':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getDaysRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const filteredOffers = offers.filter(offer => {
    const statusMatch = filter === 'all' || offer.status.toLowerCase() === filter;
    const typeMatch = typeFilter === 'all' || offer.type.toLowerCase() === typeFilter;
    return statusMatch && typeMatch;
  });

  const stats = {
    total: offers.length,
    pending: offers.filter(o => o.status === 'PENDING').length,
    accepted: offers.filter(o => o.status === 'ACCEPTED').length,
    countered: offers.filter(o => o.status === 'COUNTERED').length
  };

  const handleWithdraw = (offerId: string) => {
    setOffers(prev => prev.map(o =>
      o.id === offerId ? { ...o, status: 'WITHDRAWN' as const } : o
    ));
  };

  const handleAcceptCounter = (offerId: string) => {
    setOffers(prev => prev.map(o =>
      o.id === offerId ? { ...o, status: 'ACCEPTED' as const, offerAmount: o.counterOffer! } : o
    ));
  };

  const handleSubmitCounter = () => {
    if (selectedOffer && counterAmount) {
      setOffers(prev => prev.map(o =>
        o.id === selectedOffer.id ? { ...o, counterOffer: parseInt(counterAmount), status: 'COUNTERED' as const } : o
      ));
      setShowCounterModal(false);
      setSelectedOffer(null);
      setCounterAmount('');
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
          <h1 className="text-2xl font-bold text-gray-900">My Offers</h1>
          <p className="text-gray-600 mt-1">Track and manage your property offers</p>
        </div>
        <Link
          href="/search"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Browse Properties
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-4"
        >
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-gray-600">Total Offers</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-xl border border-gray-200 p-4"
        >
          <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-gray-600">Pending</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-200 p-4"
        >
          <div className="text-3xl font-bold text-green-600">{stats.accepted}</div>
          <div className="text-gray-600">Accepted</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl border border-gray-200 p-4"
        >
          <div className="text-3xl font-bold text-blue-600">{stats.countered}</div>
          <div className="text-gray-600">Countered</div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'accepted', 'rejected', 'countered'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as typeof filter)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                filter === status
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="flex gap-2 md:ml-auto">
          {['all', 'made', 'received'].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type as typeof typeFilter)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                typeFilter === type
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type === 'all' ? 'All Types' : `Offers ${type}`}
            </button>
          ))}
        </div>
      </div>

      {/* Offers List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredOffers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-xl border border-gray-200"
            >
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No offers found</h3>
              <p className="text-gray-600 mb-4">You don't have any {filter !== 'all' ? filter : ''} offers yet.</p>
              <Link
                href="/search"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium"
              >
                Start Browsing
              </Link>
            </motion.div>
          ) : (
            filteredOffers.map((offer, index) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Property Image */}
                  <div className="relative w-full lg:w-72 h-48 lg:h-auto flex-shrink-0">
                    <img
                      src={offer.propertyImage}
                      alt={offer.propertyTitle}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border ${getStatusColor(offer.status)}`}>
                      {getStatusIcon(offer.status)}
                      {offer.status}
                    </div>
                    <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${offer.type === 'MADE' ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'}`}>
                      {offer.type === 'MADE' ? 'Offer Made' : 'Offer Received'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <Link href={`/property/${offer.propertyId}`} className="hover:text-orange-600">
                          <h3 className="text-lg font-semibold text-gray-900">{offer.propertyTitle}</h3>
                        </Link>
                        <p className="text-gray-600 text-sm mt-1">{offer.propertyAddress}</p>

                        {/* Price Comparison */}
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <div className="text-xs text-gray-500 uppercase">List Price</div>
                              <div className="text-lg font-bold text-gray-700">{formatPrice(offer.listPrice)}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 uppercase">Your Offer</div>
                              <div className={`text-lg font-bold ${offer.offerAmount < offer.listPrice ? 'text-green-600' : 'text-orange-600'}`}>
                                {formatPrice(offer.offerAmount)}
                              </div>
                            </div>
                            {offer.counterOffer && (
                              <div>
                                <div className="text-xs text-gray-500 uppercase">Counter Offer</div>
                                <div className="text-lg font-bold text-blue-600">{formatPrice(offer.counterOffer)}</div>
                              </div>
                            )}
                            <div>
                              <div className="text-xs text-gray-500 uppercase">Difference</div>
                              <div className={`text-lg font-bold ${offer.offerAmount < offer.listPrice ? 'text-green-600' : 'text-red-600'}`}>
                                {offer.offerAmount < offer.listPrice ? '-' : '+'}{formatPrice(Math.abs(offer.listPrice - offer.offerAmount))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Submitted:</span>
                            <span className="ml-2 font-medium text-gray-900">{formatDate(offer.submittedAt)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Financing:</span>
                            <span className="ml-2 font-medium text-gray-900">{offer.financingType}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Earnest Money:</span>
                            <span className="ml-2 font-medium text-gray-900">{formatPrice(offer.earnestMoney)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Closing:</span>
                            <span className="ml-2 font-medium text-gray-900">{formatDate(offer.closingDate)}</span>
                          </div>
                        </div>

                        {/* Contingencies */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {offer.contingencies.map((contingency, i) => (
                            <span key={i} className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full">
                              {contingency}
                            </span>
                          ))}
                        </div>

                        {/* Expiration Warning */}
                        {(offer.status === 'PENDING' || offer.status === 'COUNTERED') && (
                          <div className={`mt-3 flex items-center gap-2 text-sm ${getDaysRemaining(offer.expiresAt) <= 1 ? 'text-red-600' : 'text-gray-600'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>
                              {getDaysRemaining(offer.expiresAt) > 0
                                ? `Expires in ${getDaysRemaining(offer.expiresAt)} day${getDaysRemaining(offer.expiresAt) !== 1 ? 's' : ''}`
                                : 'Expired'}
                            </span>
                          </div>
                        )}

                        {/* Messages Preview */}
                        {offer.messages.length > 0 && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-500 uppercase mb-2">Latest Message</div>
                            <div className="flex items-start gap-2">
                              <span className="font-medium text-gray-700">{offer.messages[offer.messages.length - 1].sender}:</span>
                              <span className="text-gray-600">{offer.messages[offer.messages.length - 1].message}</span>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {formatDateTime(offer.messages[offer.messages.length - 1].timestamp)}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-row lg:flex-col gap-2 flex-shrink-0">
                        {offer.status === 'PENDING' && offer.type === 'MADE' && (
                          <>
                            <button
                              onClick={() => handleWithdraw(offer.id)}
                              className="px-4 py-2 text-red-600 border border-red-300 rounded-lg font-medium hover:bg-red-50 transition-colors text-sm"
                            >
                              Withdraw
                            </button>
                            <Link
                              href={`/dashboard/messages?offer=${offer.id}`}
                              className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm text-center"
                            >
                              Message
                            </Link>
                          </>
                        )}
                        {offer.status === 'COUNTERED' && offer.type === 'MADE' && (
                          <>
                            <button
                              onClick={() => handleAcceptCounter(offer.id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
                            >
                              Accept Counter
                            </button>
                            <button
                              onClick={() => {
                                setSelectedOffer(offer);
                                setShowCounterModal(true);
                              }}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                            >
                              Counter Back
                            </button>
                            <button
                              onClick={() => handleWithdraw(offer.id)}
                              className="px-4 py-2 text-red-600 border border-red-300 rounded-lg font-medium hover:bg-red-50 transition-colors text-sm"
                            >
                              Decline
                            </button>
                          </>
                        )}
                        {offer.status === 'ACCEPTED' && (
                          <Link
                            href={`/dashboard/documents?offer=${offer.id}`}
                            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-colors text-sm text-center"
                          >
                            View Documents
                          </Link>
                        )}
                        <Link
                          href={`/property/${offer.propertyId}`}
                          className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm text-center"
                        >
                          View Property
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Counter Offer Modal */}
      <AnimatePresence>
        {showCounterModal && selectedOffer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCounterModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-md w-full p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">Submit Counter Offer</h2>
              <p className="text-gray-600 mb-4">{selectedOffer.propertyTitle}</p>

              <div className="p-4 bg-gray-50 rounded-lg mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Their Counter:</span>
                  <span className="font-bold text-blue-600">{formatPrice(selectedOffer.counterOffer!)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Your Previous Offer:</span>
                  <span className="font-medium text-gray-700">{formatPrice(selectedOffer.offerAmount)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Counter Offer (â‚¹)</label>
                  <input
                    type="number"
                    value={counterAmount}
                    onChange={(e) => setCounterAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                  />
                  {counterAmount && (
                    <div className="mt-2 text-sm text-gray-600">
                      = {formatPrice(parseInt(counterAmount))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCounterModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitCounter}
                  disabled={!counterAmount}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-colors disabled:opacity-50"
                >
                  Submit Counter
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
