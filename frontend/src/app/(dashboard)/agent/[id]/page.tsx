'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Agent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  bio?: string;
  licenseNumber: string;
  brokerage: string;
  specializations: string[];
  serviceAreas: string[];
  languages: string[];
  yearsExperience: number;
  totalTransactions: number;
  avgRating: number;
  reviewCount: number;
  responseTime: string;
  listingsCount: number;
  soldCount: number;
  vastuCertified: boolean;
  verified: boolean;
  createdAt: string;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  helpful: number;
  createdAt: string;
}

interface Listing {
  id: string;
  title: string;
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  status: 'ACTIVE' | 'PENDING' | 'SOLD';
  vastuScore?: number;
}

export default function AgentProfilePage() {
  const params = useParams();
  const agentId = params.id as string;

  const [agent, setAgent] = useState<Agent | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [activeTab, setActiveTab] = useState<'listings' | 'reviews' | 'about'>('listings');
  const [loading, setLoading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    // Mock data - replace with API call
    setAgent({
      id: agentId,
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya.sharma@dharmarealty.com',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
      bio: 'With over 15 years of experience in Bangalore\'s real estate market, I specialize in helping families find homes that align with both their practical needs and Vastu principles. As a certified Vastu consultant, I understand the importance of harmonious living spaces and work closely with clients to find properties that promote prosperity and well-being.',
      licenseNumber: 'RERA-KAR-2019-12345',
      brokerage: 'Dharma Realty Premium',
      specializations: ['Luxury Homes', 'Vastu Properties', 'Investment Properties', 'First-Time Buyers'],
      serviceAreas: ['Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout', 'Jayanagar'],
      languages: ['English', 'Hindi', 'Kannada', 'Telugu'],
      yearsExperience: 15,
      totalTransactions: 350,
      avgRating: 4.9,
      reviewCount: 127,
      responseTime: '< 1 hour',
      listingsCount: 24,
      soldCount: 326,
      vastuCertified: true,
      verified: true,
      createdAt: '2019-03-15',
    });

    setReviews([
      {
        id: 'r1',
        userId: 'u1',
        userName: 'Rajesh Kumar',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        rating: 5,
        title: 'Exceptional service and Vastu expertise',
        content: 'Priya helped us find our dream home with perfect Vastu alignment. Her knowledge of both real estate and Vedic principles is remarkable. She was patient, professional, and always available to answer our questions.',
        helpful: 24,
        createdAt: '2024-11-20',
      },
      {
        id: 'r2',
        userId: 'u2',
        userName: 'Anita Reddy',
        rating: 5,
        title: 'Highly recommended!',
        content: 'Working with Priya was a wonderful experience. She understood our requirements perfectly and showed us properties that matched our budget and Vastu preferences. The entire process was smooth and stress-free.',
        helpful: 18,
        createdAt: '2024-10-15',
      },
      {
        id: 'r3',
        userId: 'u3',
        userName: 'Vikram Singh',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        rating: 4,
        title: 'Great experience overall',
        content: 'Priya is very knowledgeable and professional. She helped us navigate the complex Bangalore market with ease. Only minor issue was scheduling conflicts due to her busy calendar, but she always made time for us.',
        helpful: 12,
        createdAt: '2024-09-08',
      },
    ]);

    setListings([
      {
        id: 'l1',
        title: 'Luxury Villa with Garden',
        address: 'Whitefield, Bangalore',
        price: 25000000,
        beds: 5,
        baths: 4,
        sqft: 4500,
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
        status: 'ACTIVE',
        vastuScore: 95,
      },
      {
        id: 'l2',
        title: 'Modern 3BHK Apartment',
        address: 'Koramangala, Bangalore',
        price: 12000000,
        beds: 3,
        baths: 2,
        sqft: 1800,
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
        status: 'ACTIVE',
        vastuScore: 88,
      },
      {
        id: 'l3',
        title: 'Premium Penthouse',
        address: 'Indiranagar, Bangalore',
        price: 35000000,
        beds: 4,
        baths: 3,
        sqft: 3200,
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
        status: 'PENDING',
        vastuScore: 92,
      },
    ]);

    setLoading(false);
  }, [agentId]);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `â‚¹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `â‚¹${(price / 100000).toFixed(2)} L`;
    }
    return `â‚¹${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Agent not found</h1>
          <Link href="/agents" className="text-orange-600 hover:text-orange-700 mt-2 inline-block">
            Browse all agents â†’
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Agent Photo & Quick Actions */}
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={agent.avatar || `https://ui-avatars.com/api/?name=${agent.firstName}+${agent.lastName}&size=200`}
                  alt={`${agent.firstName} ${agent.lastName}`}
                  className="w-48 h-48 rounded-2xl object-cover border-4 border-white shadow-xl"
                />
                {agent.verified && (
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center border-4 border-white">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Agent Info */}
            <div className="flex-1 text-white">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{agent.firstName} {agent.lastName}</h1>
                {agent.vastuCertified && (
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm flex items-center gap-1">
                    ðŸ•‰ï¸ Vastu Certified
                  </span>
                )}
              </div>
              <p className="text-white/90 text-lg mb-4">{agent.brokerage}</p>

              <div className="flex flex-wrap gap-6 mb-6">
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold">{agent.avgRating}</span>
                    <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <p className="text-white/80 text-sm">{agent.reviewCount} reviews</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{agent.yearsExperience}+</p>
                  <p className="text-white/80 text-sm">Years Experience</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{agent.totalTransactions}</p>
                  <p className="text-white/80 text-sm">Transactions</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{agent.responseTime}</p>
                  <p className="text-white/80 text-sm">Response Time</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowContactModal(true)}
                  className="px-6 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-colors"
                >
                  Contact Agent
                </button>
                <a
                  href={`tel:${agent.phone}`}
                  className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-xl font-semibold hover:bg-white/30 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Now
                </a>
                <button className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-xl font-semibold hover:bg-white/30 transition-colors flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit mb-8">
          {[
            { id: 'listings', label: `Listings (${agent.listingsCount})` },
            { id: 'reviews', label: `Reviews (${agent.reviewCount})` },
            { id: 'about', label: 'About' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={`/property/${listing.id}`}
                  className="block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all group"
                >
                  <div className="relative">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        listing.status === 'ACTIVE' ? 'bg-green-500 text-white' :
                        listing.status === 'PENDING' ? 'bg-yellow-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {listing.status}
                      </span>
                      {listing.vastuScore && listing.vastuScore >= 85 && (
                        <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
                          ðŸ•‰ï¸ {listing.vastuScore}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xl font-bold text-gray-900">{formatPrice(listing.price)}</p>
                    <h3 className="font-semibold text-gray-900 mt-1">{listing.title}</h3>
                    <p className="text-sm text-gray-600">{listing.address}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                      <span>{listing.beds} beds</span>
                      <span>â€¢</span>
                      <span>{listing.baths} baths</span>
                      <span>â€¢</span>
                      <span>{listing.sqft.toLocaleString()} sqft</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* Rating Summary */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-8">
                <div className="text-center">
                  <p className="text-5xl font-bold text-gray-900">{agent.avgRating}</p>
                  <div className="flex justify-center gap-1 my-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-6 h-6 ${star <= Math.round(agent.avgRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600">{agent.reviewCount} reviews</p>
                </div>
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = rating === 5 ? 100 : rating === 4 ? 20 : rating === 3 ? 5 : 2;
                    const percentage = (count / agent.reviewCount) * 100;
                    return (
                      <div key={rating} className="flex items-center gap-3">
                        <span className="w-3 text-sm text-gray-600">{rating}</span>
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-full bg-yellow-400 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-8 text-sm text-gray-600">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Reviews List */}
            {reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-gray-200 p-6"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={review.userAvatar || `https://ui-avatars.com/api/?name=${review.userName}&size=48`}
                    alt={review.userName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{review.userName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{review.createdAt}</span>
                        </div>
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-900 mt-3">{review.title}</h4>
                    <p className="text-gray-600 mt-2">{review.content}</p>
                    <div className="flex items-center gap-4 mt-4">
                      <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        Helpful ({review.helpful})
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About {agent.firstName}</h3>
                <p className="text-gray-600 leading-relaxed">{agent.bio}</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {agent.specializations.map((spec) => (
                    <span key={spec} className="px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-sm">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {agent.serviceAreas.map((area) => (
                    <span key={area} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <a href={`mailto:${agent.email}`} className="text-orange-600 hover:text-orange-700">
                        {agent.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <a href={`tel:${agent.phone}`} className="text-orange-600 hover:text-orange-700">
                        {agent.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {agent.languages.map((lang) => (
                    <span key={lang} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">License</h3>
                <p className="text-gray-600">{agent.licenseNumber}</p>
                <p className="text-sm text-gray-500 mt-1">Member since {new Date(agent.createdAt).getFullYear()}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-md p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Contact {agent.firstName}</h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter your phone"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="I'm interested in learning more about your listings..."
                />
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all">
                Send Message
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
