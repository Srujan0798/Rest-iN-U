// @F1-Web: Property Details Page
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Phone,
  Mail,
  Heart,
  Share2,
  Download,
  ArrowLeft,
  Star,
  TrendingUp,
  Shield,
  Home,
  Building2,
} from "lucide-react";
import { DebatePanel } from "@/components/agents/DebatePanel";
import { GlassBox } from "@/components/common/GlassBox";
import { useTheme } from "@/contexts/ThemeContext";

interface Property {
  id: string;
  title: string;
  price: number;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  propertyType: string;
  description: string;
  images: string[];
  yearBuilt: number;
  vastuScore: number;
  climateRisk: "low" | "medium" | "high";
  amenities: string[];
  agent: {
    name: string;
    phone: string;
    email: string;
    avatar: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
}

export default function PropertyDetailsPage() {
  const params = useParams();
  const { theme } = useTheme();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  // Mock property data
  const mockProperty: Property = {
    id: params.id as string,
    title: "Luxury Vastu-Compliant Villa in Whitefield",
    price: 8500000,
    city: "Bangalore",
    state: "Karnataka",
    bedrooms: 4,
    bathrooms: 3,
    sqft: 3200,
    propertyType: "Villa",
    description:
      "This stunning 4BHK villa combines modern luxury with ancient Vastu principles. Located in the prestigious Whitefield area, this property features excellent connectivity, premium amenities, and perfect alignment with natural energies.",
    images: [
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
      "/api/placeholder/800/600",
    ],
    yearBuilt: 2022,
    vastuScore: 9,
    climateRisk: "low",
    amenities: [
      "Swimming Pool",
      "Garden",
      "Parking",
      "Security",
      "Gym",
      "Power Backup",
      "Rainwater Harvesting",
      "Solar Panels",
    ],
    agent: {
      name: "Rajesh Kumar",
      phone: "+91 98765 43210",
      email: "rajesh.kumar@restinu.com",
      avatar: "/api/placeholder/40/40",
    },
    coordinates: {
      lat: 12.9698,
      lng: 77.7499,
    },
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProperty(mockProperty);
      setLoading(false);
    }, 1000);
  }, [params.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: `Check out this amazing property: ${property?.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Property Not Found
          </h2>
          <Link href="/estate" className="text-blue-600 hover:text-blue-700">
            ← Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/estate"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Properties</span>
            </Link>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleSave}
                className={`p-2 rounded-lg transition-colors ${
                  isSaved
                    ? "bg-red-50 text-red-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative h-96">
                <Image
                  src={property.images[activeImage]}
                  alt={property.title}
                  fill
                  className="object-cover"
                />

                {/* Vastu Score Badge */}
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-2 rounded-full text-sm font-semibold">
                  Vastu Score: {property.vastuScore}/10
                </div>

                {/* Climate Risk Badge */}
                <div
                  className={`absolute top-4 left-4 px-3 py-2 rounded-full text-sm font-semibold ${
                    property.climateRisk === "low"
                      ? "bg-green-100 text-green-800"
                      : property.climateRisk === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {property.climateRisk === "low"
                    ? "🟢 Low Climate Risk"
                    : property.climateRisk === "medium"
                      ? "🟡 Medium Climate Risk"
                      : "🔴 High Climate Risk"}
                </div>
              </div>

              {/* Image Gallery */}
              <div className="p-4">
                <div className="grid grid-cols-4 gap-2">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`relative h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        activeImage === index
                          ? "border-blue-600"
                          : "border-gray-200"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${property.title} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>
                    {property.city}, {property.state}
                  </span>
                </div>

                <div className="text-3xl font-bold text-blue-600 mb-4">
                  {formatPrice(property.price)}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Bed className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-semibold">{property.bedrooms}</div>
                      <div className="text-sm text-gray-500">Bedrooms</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Bath className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-semibold">{property.bathrooms}</div>
                      <div className="text-sm text-gray-500">Bathrooms</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Square className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-semibold">
                        {property.sqft.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">Sq Ft</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-semibold">{property.yearBuilt}</div>
                      <div className="text-sm text-gray-500">Year Built</div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {property.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {property.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 text-sm text-gray-600"
                      >
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Property Agent</h3>
              <div className="flex items-center space-x-4 mb-4">
                <Image
                  src={property.agent.avatar}
                  alt={property.agent.name}
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <div>
                  <div className="font-semibold">{property.agent.name}</div>
                  <div className="text-sm text-gray-500">Real Estate Agent</div>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={`tel:${property.agent.phone}`}
                  className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>{property.agent.phone}</span>
                </a>
                <a
                  href={`mailto:${property.agent.email}`}
                  className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>{property.agent.email}</span>
                </a>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors mt-4">
                Contact Agent
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all">
                  <Download className="w-4 h-4" />
                  <span>Download Full Report</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  <TrendingUp className="w-4 h-4" />
                  <span>View Market Analysis</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  <Shield className="w-4 h-4" />
                  <span>Climate Risk Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Glass Box Component */}
        <div className="mt-8">
          <GlassBox propertyId={property.id} />
        </div>

        {/* Agent Debate Panel */}
        <div className="mt-8">
          <DebatePanel propertyId={property.id} />
        </div>
      </div>
    </div>
  );
}
