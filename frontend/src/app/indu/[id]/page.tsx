"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Factory,
  MapPin,
  Square,
  Calendar,
  Truck,
  ArrowLeft,
  Share2,
  Heart,
  Phone,
  Mail,
  Shield,
  Zap,
  Activity,
  Layers,
  Box,
  Construction
} from "lucide-react";
import { DebatePanel } from "@/components/agents/DebatePanel";
import { Agent, AgentAnalysis, Message, SwarmVerdict } from "@/components/agents/DebatePanel";

// Mock Data for INDU Property
const MOCK_INDU_PROPERTY = {
  id: "ind-1",
  title: "Premium Industrial Warehouse Hub",
  price: 45000000,
  address: {
    street: "Plot 45, Peenya Industrial Area",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560058",
  },
  specifications: {
    plotArea: 15000,
    builtUpArea: 12000,
    floorLoading: "5 Ton/sqm",
    ceilingHeight: "32 ft",
    powerSupply: "150 kVA",
    zoning: "Industrial HI",
    yearBuilt: 2019,
    docks: 4,
  },
  features: [
    "Fire Sprinkler System",
    "24/7 Security",
    "CCTV Surveillance",
    "Staff Canteen",
    "Rainwater Harvesting",
    "Solar Power Ready",
    "Wide Access Roads",
    "Crane Gantry Ready",
  ],
  images: [
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  ],
  agent: {
    name: "Vikram Industrial",
    phone: "+91 98765 43210",
    email: "vikram@indu-estate.com",
  },
};

// Custom Agents for INDU Mode
const INDU_AGENTS: Agent[] = [
  {
    id: "industrial-vastu",
    name: "Industrial Vastu",
    role: "Vastu Shastra Expert",
    description: "Analyzes factory layout, machinery placement, and energy flow for productivity.",
    icon: "compass",
    color: "orange",
    gradient: "from-orange-500 to-amber-600",
  },
  {
    id: "logistics",
    name: "Logistics Pro",
    role: "Supply Chain Analyst",
    description: "Evaluates connectivity, access roads, loading docks, and transport efficiency.",
    icon: "trending",
    color: "blue",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: "compliance",
    name: "Compliance Guardian",
    role: "Regulatory Expert",
    description: "Checks industrial zoning, fire safety, environmental clearances, and legal titles.",
    icon: "shield",
    color: "red",
    gradient: "from-red-500 to-rose-600",
  },
  {
    id: "structural",
    name: "Structura",
    role: "Civil Engineer",
    description: "Assesses building integrity, floor loading capacity, and construction quality.",
    icon: "brain",
    color: "purple",
    gradient: "from-purple-500 to-violet-600",
  },
];

// Mock Analysis Data
const INDU_ANALYSES: AgentAnalysis[] = [
  {
    id: "a1",
    agentId: "industrial-vastu",
    score: 8.2,
    verdict: "positive",
    summary: "Main gate in East creates positive entry. Machinery placement zone in South-West is optimal for stability.",
    confidence: 0.88,
    timestamp: new Date(),
    reasoning: [
      {
        id: "r1",
        type: "observation",
        title: "Entry Orientation",
        content: "Main entrance faces East, which allows morning sun and positive pranic energy.",
        confidence: 0.95,
      },
      {
        id: "r2",
        type: "analysis",
        title: "Production Flow",
        content: "Raw material storage in South-West and finished goods in North-West aligns with energy movement.",
        confidence: 0.85,
      },
    ],
    recommendations: [
      "Keep the North-East corner free of heavy machinery.",
      "Ensure administrative office is in the North or East zone.",
    ],
  },
  {
    id: "a2",
    agentId: "logistics",
    score: 9.0,
    verdict: "positive",
    summary: "Excellent connectivity to highway (2km). 4 loading docks are sufficient for high throughput.",
    confidence: 0.92,
    timestamp: new Date(),
    reasoning: [
      {
        id: "r1",
        type: "observation",
        title: "Access Roads",
        content: "60ft wide road access allows easy movement for heavy trucks and containers.",
        confidence: 0.98,
      },
    ],
    recommendations: [
      "Install automated dock levelers for faster turnaround.",
    ],
  },
  {
    id: "a3",
    agentId: "compliance",
    score: 7.5,
    verdict: "neutral",
    summary: "Zoning is correct. Fire safety NOC is pending renewal. Environmental clearance is valid.",
    confidence: 0.90,
    timestamp: new Date(),
    reasoning: [
      {
        id: "r1",
        type: "observation",
        title: "Zoning Check",
        content: "Property falls under KIADB Industrial Zone, suitable for Red/Orange category industries.",
        confidence: 1.0,
      },
      {
        id: "r2",
        type: "warning", // custom type fallback
        title: "Fire Safety",
        content: "Current Fire NOC expires in 2 months. Renewal process should be initiated immediately.",
        confidence: 0.95,
      } as any,
    ],
    recommendations: [
      "Apply for Fire NOC renewal immediately.",
      "Verify latest pollution control board norms for specific industry type.",
    ],
  },
];

const INDU_MESSAGES: Message[] = [
  {
    id: "m1",
    agentId: "industrial-vastu",
    content: "The East-facing entrance is a major plus for industrial prosperity. The South-West corner is heavy, which is perfect for stability.",
    timestamp: new Date(Date.now() - 10000),
    type: "evidence",
  },
  {
    id: "m2",
    agentId: "compliance",
    content: "While layout is good, the Fire NOC expiration is a risk. We need to factor in the renewal timeline.",
    timestamp: new Date(Date.now() - 8000),
    type: "argument",
  },
  {
    id: "m3",
    agentId: "logistics",
    content: "Operationally, this is a gem. The wide access road and 4 docks will minimize turnaround time significantly.",
    timestamp: new Date(Date.now() - 5000),
    type: "argument",
  },
  {
    id: "m4",
    agentId: "structural",
    content: "Floor loading of 5 Ton/sqm is impressive. It can handle most heavy machinery without reinforcement.",
    timestamp: new Date(Date.now() - 2000),
    type: "conclusion",
  },
];

const INDU_VERDICT: SwarmVerdict = {
  decision: "approve",
  confidence: 0.85,
  summary: "Strongly recommended for logistics or manufacturing. Excellent infrastructure and Vastu compliance outweigh minor compliance renewal needs.",
  consensusLevel: "majority",
  agentVotes: [
    { agentId: "industrial-vastu", vote: "approve", weight: 0.8 },
    { agentId: "logistics", vote: "approve", weight: 0.9 },
    { agentId: "compliance", vote: "conditional", weight: 0.85 },
    { agentId: "structural", vote: "approve", weight: 0.8 },
  ],
  recommendations: [
    "Proceed with purchase/lease.",
    "Initiate Fire NOC renewal as a condition of sale.",
    "Plan machinery layout to leverage South-West stability.",
  ],
  risks: [
    "Fire NOC renewal delay.",
    "Potential traffic congestion on main road during peak hours.",
  ],
  opportunities: [
    "High appreciation potential due to upcoming metro line nearby.",
    "Suitable for high-end manufacturing or warehousing.",
  ],
};

export default function InduPropertyPage() {
  const params = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  // In a real app, we would fetch data based on params.id
  const property = { ...MOCK_INDU_PROPERTY, id: params.id as string };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-orange-50/30">
      {/* Navigation */}
      <div className="bg-white border-b border-orange-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/indu"
            className="flex items-center text-orange-700 hover:text-orange-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Industrial
          </Link>
          <div className="flex items-center gap-2">
            <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              INDU Mode
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Title Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-2 text-orange-500" />
            {property.address.street}, {property.address.city}, {property.address.state}
          </div>
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column: Images & Key Specs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
              <div className="relative h-[400px]">
                <Image
                  src={property.images[selectedImage]}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`p-3 rounded-full backdrop-blur-md transition-all ${
                      isFavorited ? "bg-red-500 text-white" : "bg-white/90 text-gray-700 hover:bg-white"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
                  </button>
                  <button className="p-3 bg-white/90 rounded-full text-gray-700 hover:bg-white transition-all">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex p-4 gap-4 overflow-x-auto">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                      selectedImage === idx ? "border-orange-500" : "border-transparent"
                    }`}
                  >
                    <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Specifications Grid */}
            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Factory className="w-5 h-5 text-orange-500" />
                Industrial Specifications
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <span className="text-sm text-gray-500 block">Plot Area</span>
                  <span className="font-semibold text-gray-900 flex items-center gap-2">
                    <Square className="w-4 h-4 text-orange-400" />
                    {property.specifications.plotArea.toLocaleString()} sqft
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-gray-500 block">Built-up Area</span>
                  <span className="font-semibold text-gray-900 flex items-center gap-2">
                    <Box className="w-4 h-4 text-orange-400" />
                    {property.specifications.builtUpArea.toLocaleString()} sqft
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-gray-500 block">Power Supply</span>
                  <span className="font-semibold text-gray-900 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-400" />
                    {property.specifications.powerSupply}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-gray-500 block">Ceiling Height</span>
                  <span className="font-semibold text-gray-900 flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4 text-orange-400 rotate-90" />
                    {property.specifications.ceilingHeight}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-gray-500 block">Floor Loading</span>
                  <span className="font-semibold text-gray-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-orange-400" />
                    {property.specifications.floorLoading}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-gray-500 block">Loading Docks</span>
                  <span className="font-semibold text-gray-900 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-orange-400" />
                    {property.specifications.docks}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-gray-500 block">Year Built</span>
                  <span className="font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-400" />
                    {property.specifications.yearBuilt}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-sm text-gray-500 block">Zoning</span>
                  <span className="font-semibold text-gray-900 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-orange-400" />
                    {property.specifications.zoning}
                  </span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Construction className="w-5 h-5 text-orange-500" />
                Infrastructure & Amenities
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {property.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-orange-50/50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Price, Agent, Debate */}
          <div className="space-y-8">
            {/* Price Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
              <div className="mb-4">
                <span className="text-gray-500 text-sm">Asking Price</span>
                <div className="text-3xl font-bold text-orange-600">
                  {formatPrice(property.price)}
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg mb-3">
                Schedule Site Visit
              </button>
              <button className="w-full bg-white border-2 border-orange-100 text-orange-700 font-bold py-3 px-4 rounded-xl hover:bg-orange-50 transition-all">
                Download Brochure
              </button>
            </div>

            {/* Agent Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Listed By</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                  VI
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{property.agent.name}</h4>
                  <p className="text-sm text-gray-500">Industrial Specialist</p>
                </div>
              </div>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-800 py-2.5 rounded-lg transition-colors font-medium border border-gray-200">
                  <Phone className="w-4 h-4 text-orange-500" />
                  {property.agent.phone}
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-800 py-2.5 rounded-lg transition-colors font-medium border border-gray-200">
                  <Mail className="w-4 h-4 text-orange-500" />
                  Email Agent
                </button>
              </div>
            </div>

            {/* Debate Panel Placeholder - In a real app, this would be sticky or modal on mobile */}
            <div className="hidden lg:block">
              <div className="p-4 bg-orange-100/50 rounded-2xl border border-orange-200 text-center mb-4">
                <h3 className="font-bold text-orange-900 flex items-center justify-center gap-2">
                  <Shield className="w-5 h-5" />
                  AI Assessment Ready
                </h3>
                <p className="text-sm text-orange-700 mt-1">
                  Scroll down to view detailed AI agent analysis
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Debate Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg shadow-md">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Industrial Intelligence Report</h2>
              <p className="text-gray-500">Multi-agent analysis of Vastu, Logistics, and Compliance</p>
            </div>
          </div>

          <DebatePanel
            propertyId={property.id}
            agents={INDU_AGENTS}
            analyses={INDU_ANALYSES}
            messages={INDU_MESSAGES}
            verdict={INDU_VERDICT}
          />
        </div>
      </div>
    </div>
  );
}
