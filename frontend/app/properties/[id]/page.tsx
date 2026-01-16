'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  MapPin, Bed, Bath, Square, Calendar, Shield, Sun, Wind, Droplets,
  Heart, Share2, CheckCircle, AlertTriangle, Info, Clock, User
} from 'lucide-react';
import { PropertyCard, Property } from '../../components/properties/PropertyCard';
import { ImageGallery } from '../../components/properties/ImageGallery';
import { Button, Card, Badge, Avatar, Spinner, Input, Modal } from '../../components/ui';

interface PropertyDetail extends Property {
  description?: string;
  amenities?: string[];
  features?: string[];
  climateAnalysis?: {
    overallRiskScore: number;
    riskGrade: string;
    floodRisk?: string;
    fireRisk?: string;
    heatRisk?: string;
    stormRisk?: string;
  };
  listingAgent?: {
    id: string;
    rating: number;
    user: {
      firstName: string;
      lastName: string;
      profilePhotoUrl?: string;
      email?: string;
      phone?: string;
    };
  };
  estimatedPayment?: {
    total: number;
    principalInterest: number;
    propertyTax: number;
    insurance: number;
    hoa: number;
  };
}

export default function PropertyDetailPage() {
  const { id } = useParams();

  // State
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);

  // Schedule Showing State
  const [showingDate, setShowingDate] = useState('');
  const [showingTime, setShowingTime] = useState('');
  const [showingNotes, setShowingNotes] = useState('');
  const [isSubmittingShowing, setIsSubmittingShowing] = useState(false);
  const [showingSuccess, setShowingSuccess] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch property details
        const res = await fetch(`/api/properties/${id}`);
        if (!res.ok) throw new Error('Failed to fetch property');
        const data = await res.json();
        setProperty(data.data);

        // Fetch similar properties
        const simRes = await fetch(`/api/properties/${id}/similar`);
        if (simRes.ok) {
          const simData = await simRes.json();
          setSimilarProperties(simData.data);
        }
      } catch (error) {
        console.error('Error fetching property data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleScheduleShowing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showingDate || !showingTime) return;

    setIsSubmittingShowing(true);
    try {
      // Combine date and time
      const scheduledAt = new Date(`${showingDate}T${showingTime}`);

      const res = await fetch(`/api/properties/${id}/schedule-showing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduledAt: scheduledAt.toISOString(),
          notes: showingNotes
        }),
      });

      if (!res.ok) throw new Error('Failed to schedule showing');

      setShowingSuccess(true);
      setShowingNotes('');
    } catch (error) {
      console.error('Error scheduling showing:', error);
      alert('Failed to schedule showing. Please try again.');
    } finally {
      setIsSubmittingShowing(false);
    }
  };

  const openGallery = (index: number) => {
    setGalleryStartIndex(index);
    setIsGalleryOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
        <Button variant="secondary" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  // Get first 5 photos for the grid
  const displayPhotos = property.photos?.slice(0, 5) || [];
  const remainingPhotosCount = (property.photos?.length || 0) - 5;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Image Gallery Modal */}
      {property.photos && (
        <ImageGallery
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
          photos={property.photos}
          initialIndex={galleryStartIndex}
        />
      )}

      {/* Hero / Image Grid */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <div className="flex items-center text-gray-500">
                <MapPin size={18} className="mr-2 text-amber-500" />
                <span>{property.streetAddress}, {property.city}, {property.state} {property.zipCode}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" icon={<Share2 size={18} />}>Share</Button>
              <Button variant="secondary" icon={<Heart size={18} className={property.isFavorited ? "text-red-500 fill-current" : ""} />}>Save</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] md:h-[500px] rounded-2xl overflow-hidden relative">
            {/* Main Image */}
            <div
              className="md:col-span-2 h-full cursor-pointer group relative"
              onClick={() => openGallery(0)}
            >
              <img
                src={displayPhotos[0]?.url || '/placeholder.jpg'}
                alt="Main view"
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition" />
            </div>

            {/* Side Images */}
            <div className="hidden md:grid grid-cols-2 col-span-2 gap-2 h-full">
              {displayPhotos.slice(1).map((photo, idx) => (
                <div
                  key={idx}
                  className="h-full cursor-pointer group relative overflow-hidden"
                  onClick={() => openGallery(idx + 1)}
                >
                  <img
                    src={photo.url}
                    alt={`View ${idx + 2}`}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  {/* Show "+X more" overlay on the last image if there are more */}
                  {idx === 3 && remainingPhotosCount > 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-xl backdrop-blur-sm">
                      +{remainingPhotosCount} More
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile View All Button */}
            <button
              className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg font-semibold text-sm md:hidden"
              onClick={() => setIsGalleryOpen(true)}
            >
              View All Photos
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="flex flex-col items-center justify-center p-4 text-center">
                <span className="text-3xl font-bold text-gray-900">{formatPrice(property.price)}</span>
                <span className="text-sm text-gray-500">List Price</span>
              </Card>
              <Card className="flex flex-col items-center justify-center p-4 text-center">
                <div className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                  <Bed size={24} className="text-amber-500" />
                  {property.bedrooms}
                </div>
                <span className="text-sm text-gray-500">Bedrooms</span>
              </Card>
              <Card className="flex flex-col items-center justify-center p-4 text-center">
                <div className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                  <Bath size={24} className="text-amber-500" />
                  {property.bathrooms}
                </div>
                <span className="text-sm text-gray-500">Bathrooms</span>
              </Card>
              <Card className="flex flex-col items-center justify-center p-4 text-center">
                <div className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                  <Square size={24} className="text-amber-500" />
                  {property.squareFeet?.toLocaleString()}
                </div>
                <span className="text-sm text-gray-500">Square Feet</span>
              </Card>
            </div>

            {/* Analysis Badges */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Vastu Score */}
              {property.vastuAnalysis && (
                <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <Sun size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-indigo-900">Vastu Score</h3>
                        <p className="text-sm text-indigo-600">Spiritual Harmony</p>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-indigo-700">
                      {property.vastuAnalysis.overallScore}
                      <span className="text-sm text-indigo-400 font-normal">/100</span>
                    </div>
                  </div>
                  <div className="w-full bg-indigo-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-1000"
                      style={{ width: `${property.vastuAnalysis.overallScore}%` }}
                    />
                  </div>
                </Card>
              )}

              {/* Climate Risk */}
              {property.climateAnalysis && (
                <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                        <Shield size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-emerald-900">Climate Risk</h3>
                        <p className="text-sm text-emerald-600">Environmental Safety</p>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-emerald-700">
                      {property.climateAnalysis.overallRiskScore}
                      <span className="text-sm text-emerald-400 font-normal">/100</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-emerald-800">
                    <div className="flex items-center gap-1">
                      <Droplets size={12} /> Flood: {property.climateAnalysis.floodRisk || 'Low'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Wind size={12} /> Storm: {property.climateAnalysis.stormRisk || 'Med'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Sun size={12} /> Heat: {property.climateAnalysis.heatRisk || 'Low'}
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Description */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">About this home</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {property.description || "No description available."}
              </p>
            </section>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-600">
                      <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Similar Properties */}
            {similarProperties.length > 0 && (
              <section className="pt-8 border-t">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Similar Properties</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {similarProperties.map(sim => (
                    <PropertyCard key={sim.id} property={sim} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar (Sticky) */}
          <div className="lg:w-96 flex-shrink-0 space-y-6">
            {/* Schedule Showing Card */}
            <Card className="sticky top-24 shadow-lg border-amber-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Schedule a Showing</h3>

              {showingSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h4 className="text-lg font-semibold text-green-800 mb-2">Request Sent!</h4>
                  <p className="text-gray-600 text-sm mb-6">
                    Your showing request has been sent to the agent. They will contact you shortly to confirm.
                  </p>
                  <Button variant="secondary" onClick={() => setShowingSuccess(false)} className="w-full">
                    Schedule Another
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleScheduleShowing} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="date"
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                        value={showingDate}
                        onChange={(e) => setShowingDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <select
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                        value={showingTime}
                        onChange={(e) => setShowingTime(e.target.value)}
                      >
                        <option value="">Select time</option>
                        {Array.from({ length: 11 }, (_, i) => i + 9).map(hour => (
                          <React.Fragment key={hour}>
                            <option value={`${hour}:00`}>{hour > 12 ? hour - 12 : hour}:00 {hour >= 12 ? 'PM' : 'AM'}</option>
                            <option value={`${hour}:30`}>{hour > 12 ? hour - 12 : hour}:30 {hour >= 12 ? 'PM' : 'AM'}</option>
                          </React.Fragment>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none h-24 resize-none"
                      placeholder="I'm interested in this property..."
                      value={showingNotes}
                      onChange={(e) => setShowingNotes(e.target.value)}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-4 text-lg"
                    loading={isSubmittingShowing}
                  >
                    Request Tour
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-2">
                    No commitment required. It's free to schedule.
                  </p>
                </form>
              )}
            </Card>

            {/* Agent Card */}
            {property.listingAgent && (
              <Card>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar
                    src={property.listingAgent.user.profilePhotoUrl}
                    name={`${property.listingAgent.user.firstName} ${property.listingAgent.user.lastName}`}
                    size="lg"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {property.listingAgent.user.firstName} {property.listingAgent.user.lastName}
                    </h4>
                    <p className="text-sm text-gray-500">Listing Agent</p>
                    <div className="flex items-center text-amber-500 text-sm mt-1">
                      {'★'.repeat(Math.round(property.listingAgent.rating || 5))}
                      <span className="text-gray-400 ml-1">({property.listingAgent.rating || '5.0'})</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" className="flex-1" size="sm">Message</Button>
                  <Button variant="secondary" className="flex-1" size="sm">Call</Button>
                </div>
              </Card>
            )}

            {/* Estimated Payment */}
            {property.estimatedPayment && (
              <Card className="bg-gray-50">
                <h3 className="font-bold text-gray-900 mb-4">Estimated Payment</h3>
                <div className="text-3xl font-bold text-amber-600 mb-4">
                  {formatPrice(property.estimatedPayment.total)}<span className="text-base font-normal text-gray-500">/mo</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Principal & Interest</span>
                    <span className="font-medium">{formatPrice(property.estimatedPayment.principalInterest)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Taxes</span>
                    <span className="font-medium">{formatPrice(property.estimatedPayment.propertyTax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Home Insurance</span>
                    <span className="font-medium">{formatPrice(property.estimatedPayment.insurance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">HOA Fees</span>
                    <span className="font-medium">{formatPrice(property.estimatedPayment.hoa)}</span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
