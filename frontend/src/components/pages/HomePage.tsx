"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building,
  Users,
  Cpu,
  ArrowRight,
  Star,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Heart,
  MessageSquare,
  Wallet,
  Home,
  Search,
  BarChart3,
  CheckCircle,
} from "lucide-react";
import MainNavigation from "../components/shared/MainNavigation";

interface ModuleCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgGradient: string;
  features: string[];
  stats: { label: string; value: string }[];
  path: string;
  isComingSoon?: boolean;
}

const modules: ModuleCard[] = [
  {
    id: "estate",
    title: "ESTATE",
    description:
      "Smart Real Estate Management with AI-powered insights and vastu compliance",
    icon: Building,
    color: "text-blue-600",
    bgGradient: "from-blue-600 to-blue-800",
    features: [
      "AI Property Valuation",
      "Vastu Score Analysis",
      "Climate Risk Assessment",
      "Mortgage Calculator",
    ],
    stats: [
      { label: "Properties Listed", value: "12,500+" },
      { label: "Active Users", value: "45,000+" },
      { label: "Cities Covered", value: "50+" },
    ],
    path: "/estate",
  },
  {
    id: "ind",
    title: "IND",
    description:
      "Civic engagement platform for Indian democracy and political participation",
    icon: Users,
    color: "text-orange-600",
    bgGradient: "from-orange-600 to-orange-800",
    features: [
      "Political Debates",
      "Civic Polling System",
      "Representative Directory",
      "Policy Discussions",
    ],
    stats: [
      { label: "Active Debates", value: "1,200+" },
      { label: "Participants", value: "25,000+" },
      { label: "Polls Conducted", value: "890+" },
    ],
    path: "/ind",
  },
  {
    id: "web3",
    title: "WEB3",
    description:
      "Decentralized finance, NFT marketplace, and crypto asset management",
    icon: Cpu,
    color: "text-green-600",
    bgGradient: "from-green-600 to-emerald-800",
    features: [
      "NFT Marketplace",
      "DeFi Protocols",
      "Crypto Portfolio",
      "Web3 Wallet",
    ],
    stats: [
      { label: "NFTs Listed", value: "5,000+" },
      { label: "Trading Volume", value: "$2.5M+" },
      { label: "Active Wallets", value: "10,000+" },
    ],
    path: "/web3",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Real Estate Investor",
    content:
      "The Vastu score and AI valuation features helped me make informed investment decisions. Saved me from potential climate risks!",
    rating: 5,
    module: "ESTATE",
  },
  {
    name: "Raj Kumar",
    role: "Civic Activist",
    content:
      "Finally a platform where citizens can engage in meaningful political debates. The polling system is transparent and effective.",
    rating: 5,
    module: "IND",
  },
  {
    name: "Amit Patel",
    role: "Crypto Enthusiast",
    content:
      "The NFT marketplace for virtual real estate is revolutionary. Got my first digital villa at a great price!",
    rating: 5,
    module: "WEB3",
  },
];

const features = [
  {
    icon: Shield,
    title: "Secure & Trusted",
    description: "Bank-level security with blockchain verification",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Real-time updates and instant transactions",
  },
  {
    icon: Globe,
    title: "Global Access",
    description: "Available 24/7 across all devices",
  },
  {
    icon: Heart,
    title: "User-Centric",
    description: "Built with love and user feedback",
  },
];

export default function HomePage() {
  const [activeModule, setActiveModule] = useState("estate");

  const handleModuleHover = (moduleId: string) => {
    setActiveModule(moduleId);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <MainNavigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Rest-iN-U
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              India's first integrated platform combining Real Estate, Civic
              Engagement, and Web3 Technologies
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/estate"
                className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
              >
                <Explore className="w-5 h-5" />
                <span>Explore Platform</span>
              </Link>
              <button className="px-8 py-4 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition-colors flex items-center justify-center space-x-2">
                <PlayCircle className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full animate-bounce delay-100"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Rest-iN-U?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of digital integration with our cutting-edge
              features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Our Modules
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each module is designed to transform how you interact with
              traditional services
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {modules.map((module) => {
              const Icon = module.icon;
              const isActive = activeModule === module.id;

              return (
                <div
                  key={module.id}
                  className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                    isActive ? "ring-4 ring-purple-500 ring-opacity-50" : ""
                  }`}
                  onMouseEnter={() => handleModuleHover(module.id)}
                >
                  {/* Module Header */}
                  <div
                    className={`bg-gradient-to-br ${module.bgGradient} p-6 text-white`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                        ACTIVE
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{module.title}</h3>
                    <p className="text-white/90">{module.description}</p>
                  </div>

                  {/* Module Content */}
                  <div className="p-6">
                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Key Features
                      </h4>
                      <ul className="space-y-2">
                        {module.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-600">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Stats */}
                    <div className="mb-6">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        {module.stats.map((stat, index) => (
                          <div
                            key={index}
                            className="p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="text-lg font-bold text-gray-900">
                              {stat.value}
                            </div>
                            <div className="text-xs text-gray-600">
                              {stat.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      href={module.path}
                      className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                        module.isComingSoon
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : `bg-gradient-to-r ${module.bgGradient} text-white hover:opacity-90`
                      }`}
                    >
                      <span>
                        {module.isComingSoon ? "Coming Soon" : "Explore Module"}
                      </span>
                      {!module.isComingSoon && (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied users transforming their digital
              experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 border border-gray-200"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>

                <div className="flex mb-3">
                  {renderStars(testimonial.rating)}
                </div>

                <p className="text-gray-700 mb-4">"{testimonial.content}"</p>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Module: {testimonial.module}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full ${
                      testimonial.module === "ESTATE"
                        ? "bg-blue-500"
                        : testimonial.module === "IND"
                          ? "bg-orange-500"
                          : "bg-green-500"
                    }`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              By the Numbers
            </h2>
            <p className="text-xl text-white/90">
              Making an impact across India
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">80,000+</div>
              <div className="text-white/80">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">12,500+</div>
              <div className="text-white/80">Properties Listed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">1,200+</div>
              <div className="text-white/80">Debates Conducted</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">$2.5M+</div>
              <div className="text-white/80">Trading Volume</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join the revolution and experience the future of integrated
              digital services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/estate"
                className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
              >
                <Rocket className="w-5 h-5" />
                <span>Get Started Now</span>
              </Link>
              <button className="px-8 py-4 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition-colors flex items-center justify-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Contact Us</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <span className="text-xl font-bold">Rest-iN-U</span>
              </div>
              <p className="text-gray-400">
                Transforming digital experiences across Real Estate, Civic
                Engagement, and Web3.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Modules</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/estate" className="hover:text-white">
                    ESTATE
                  </Link>
                </li>
                <li>
                  <Link href="/ind" className="hover:text-white">
                    IND
                  </Link>
                </li>
                <li>
                  <Link href="/web3" className="hover:text-white">
                    WEB3
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Disclaimer
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Rest-iN-U. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Import missing icons
const Explore = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const PlayCircle = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const Rocket = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);
