"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Phone,
  Mail,
  Home,
  TrendingUp,
  Shield,
  Sun,
  Wind,
  Droplets,
} from "lucide-react";
import PropertyCard from "../PropertyCard";
import MortgageCalculator from "./MortgageCalculator";

interface PropertyDetail {
  id: string;
  title: string;
  description: string;
  price: number;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  specifications: {
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    yearBuilt: number;
    propertyType: string;
    furnishing: string;
    parking: number;
  };
  features: string[];
  images: string[];
  agent: {
    name: string;
    phone: string;
    email: string;
    avatar?: string;
  };
  vastu: {
    score: number;
    details: string[];
  };
  climate: {
    risk: "low" | "medium" | "high";
    factors: {
      flood: number;
      earthquake: number;
      temperature: number;
    };
  };
  nearby: {
    schools: { name: string; distance: string }[];
    hospitals: { name: string; distance: string }[];
    transport: { name: string; distance: string }[];
  };
}

// Mock data - in real app this would come from API
const mockProperty: PropertyDetail = {
  id: "1",
  title: "Luxurious 3BHK Apartment with Premium Amenities",
  description:
    "Experience luxury living in this stunning 3BHK apartment located in the heart of the city. This spacious residence offers modern amenities, excellent connectivity, and breathtaking views from every room.",
  price: 25000000,
  address: {
    street: "123 Brigade Gateway",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560001",
  },
  specifications: {
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1850,
    yearBuilt: 2022,
    propertyType: "Apartment",
    furnishing: "Semi-Furnished",
    parking: 2,
  },
  features: [
    "Swimming Pool",
    "Gymnasium",
    "24/7 Security",
    "Power Backup",
    "Children's Play Area",
    "Clubhouse",
    "Rainwater Harvesting",
    "Solar Panels",
  ],
  images: [],
  agent: {
    name: "Rahul Sharma",
    phone: "+91 98765 43210",
    email: "rahul.sharma@estate.com",
    avatar: undefined,
  },
  vastu: {
    score: 8,
    details: [
      "Excellent main door direction (North-East)",
      "Balanced room distribution",
      "Positive energy flow throughout",
      "Auspicious kitchen placement (South-East)",
    ],
  },
  climate: {
    risk: "low",
    factors: {
      flood: 2,
      earthquake: 3,
      temperature: 4,
    },
  },
  nearby: {
    schools: [
      { name: "Delhi Public School", distance: "0.8 km" },
      { name: "National Public School", distance: "1.2 km" },
    ],
    hospitals: [
      { name: "Fortis Hospital", distance: "1.5 km" },
      { name: "Manipal Hospital", distance: "2.0 km" },
    ],
    transport: [
      { name: "MG Road Metro Station", distance: "0.5 km" },
      { name: "Brigade Bus Stop", distance: "0.2 km" },
    ],
  },
};

export default function PropertyDetailPage() {
  const params = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showCalculator, setShowCalculator] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const property = mockProperty; // In real app: fetchProperty(params.id)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getClimateRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600 bg-green-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "high":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getVastuScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-50";
    if (score >= 6) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Images */}
      <div className="relative h-96 bg-gray-200">
        {property.images.length > 0 ? (
          <Image
            src={property.images[selectedImage]}
            alt={property.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <Home className="w-24 h-24 text-blue-300" />
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className={`p-3 rounded-lg backdrop-blur-md transition-all ${
              isFavorited
                ? "bg-red-600 text-white"
                : "bg-white/80 text-gray-700 hover:bg-white"
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
          </button>

          <button className="p-3 bg-white/80 backdrop-blur-md rounded-lg hover:bg-white transition-all">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Image Thumbnails */}
        {property.images.length > 1 && (
          <div className="absolute bottom-4 left-4 flex space-x-2">
            {property.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                  selectedImage === index ? "border-white" : "border-white/50"
                }`}
              >
                <Image
                  src={property.images[index]}
                  alt={`View ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>
                      {property.address.street}, {property.address.city},{" "}
                      {property.address.state} - {property.address.pincode}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    {formatPrice(property.price)}
                  </div>
                  <div className="text-sm text-gray-500">Negotiable</div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <Bed className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                  <div className="text-lg font-semibold">
                    {property.specifications.bedrooms}
                  </div>
                  <div className="text-sm text-gray-500">Bedrooms</div>
                </div>
                <div className="text-center">
                  <Bath className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                  <div className="text-lg font-semibold">
                    {property.specifications.bathrooms}
                  </div>
                  <div className="text-sm text-gray-500">Bathrooms</div>
                </div>
                <div className="text-center">
                  <Square className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                  <div className="text-lg font-semibold">
                    {property.specifications.sqft}
                  </div>
                  <div className="text-sm text-gray-500">Sq Ft</div>
                </div>
                <div className="text-center">
                  <Calendar className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                  <div className="text-lg font-semibold">
                    {property.specifications.yearBuilt}
                  </div>
                  <div className="text-sm text-gray-500">Year Built</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Features & Amenities */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Features & Amenities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {property.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-gray-700"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vastu Analysis */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Vastu Analysis
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getVastuScoreColor(property.vastu.score)}`}
                >
                  Score: {property.vastu.score}/10
                </span>
              </div>
              <ul className="space-y-2">
                {property.vastu.details.map((detail, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-2 text-gray-700"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Climate Risk Assessment */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Climate Risk Assessment
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getClimateRiskColor(property.climate.risk)}`}
                >
                  {property.climate.risk.toUpperCase()} RISK
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Flood Risk
                    </span>
                    <span className="text-sm text-gray-500">
                      {property.climate.factors.flood}/10
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${property.climate.factors.flood * 10}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Earthquake Risk
                    </span>
                    <span className="text-sm text-gray-500">
                      {property.climate.factors.earthquake}/10
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{
                        width: `${property.climate.factors.earthquake * 10}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Temperature Risk
                    </span>
                    <span className="text-sm text-gray-500">
                      {property.climate.factors.temperature}/10
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{
                        width: `${property.climate.factors.temperature * 10}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nearby Places */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Nearby Places
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                      <span className="text-blue-600">🎓</span>
                    </div>
                    Schools
                  </h3>
                  <ul className="space-y-2">
                    {property.nearby.schools.map((school, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span className="text-gray-700">{school.name}</span>
                        <span className="text-gray-500">{school.distance}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-2">
                      <span className="text-red-600">🏥</span>
                    </div>
                    Hospitals
                  </h3>
                  <ul className="space-y-2">
                    {property.nearby.hospitals.map((hospital, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span className="text-gray-700">{hospital.name}</span>
                        <span className="text-gray-500">
                          {hospital.distance}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                      <span className="text-green-600">🚇</span>
                    </div>
                    Transport
                  </h3>
                  <ul className="space-y-2">
                    {property.nearby.transport.map((transport, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span className="text-gray-700">{transport.name}</span>
                        <span className="text-gray-500">
                          {transport.distance}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Listed by
              </h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {property.agent.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {property.agent.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    Property Consultant
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>{property.agent.phone}</span>
                </button>

                <button className="w-full flex items-center justify-center space-x-2 border border-blue-600 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>Email Agent</span>
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowCalculator(!showCalculator)}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all"
                >
                  Calculate EMI
                </button>

                <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all">
                  Schedule Visit
                </button>
              </div>
            </div>

            {/* Mortgage Calculator */}
            {showCalculator && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Mortgage Calculator
                </h3>
                <MortgageCalculator principal={property.price} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
