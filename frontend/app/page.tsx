'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState('');

    const features = [
        { icon: '🪷', title: 'Vastu Analysis', desc: '5,000-year-old Vedic wisdom for home harmony', link: '/vastu-analysis' },
        { icon: '🌍', title: 'Climate Prophet', desc: '100-year flood, fire, and storm projections', link: '/climate-risk' },
        { icon: '🔗', title: 'Blockchain Verified', desc: 'Immutable property records on Polygon', link: '/blockchain' },
        { icon: '📡', title: 'IoT Monitoring', desc: 'Real-time environmental & energy tracking', link: '/iot-dashboard' },
        { icon: '🏛️', title: 'DAO Governance', desc: 'Community-owned platform decisions', link: '/dao' },
        { icon: '💰', title: 'AI Valuation', desc: 'Machine learning price estimates', link: '/valuation' },
    ];

    const stats = [
        { value: '10,000+', label: 'Properties Listed' },
        { value: '5,000+', label: 'Vastu Reports' },
        { value: '98%', label: 'Client Satisfaction' },
        { value: '50+', label: 'Cities Covered' },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-500 to-red-600" />
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />

                <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white/90 text-sm mb-8">
                        <span>🙏</span>
                        <span>Where Ancient Wisdom Meets Modern Real Estate</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Find Your{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-white">
                            Dharma Home
                        </span>
                    </h1>

                    <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
                        The world's first real estate platform combining 5,000 years of Vedic
                        principles with AI, Blockchain, and IoT technology
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Try: '3 bed house with pool and high vastu score'..."
                            className="w-full px-6 py-5 rounded-2xl shadow-2xl text-gray-800 text-lg focus:outline-none focus:ring-4 focus:ring-white/30"
                        />
                        <Link
                            href={`/search?q=${encodeURIComponent(searchQuery)}`}
                            className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 transition"
                        >
                            Search ✨
                        </Link>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-wrap justify-center gap-4 mt-8">
                        <Link href="/search?type=HOUSE" className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full text-sm transition">
                            🏠 Houses
                        </Link>
                        <Link href="/search?type=CONDO" className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full text-sm transition">
                            🏢 Condos
                        </Link>
                        <Link href="/search?vastu=high" className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full text-sm transition">
                            🪷 High Vastu
                        </Link>
                        <Link href="/search?climate=low" className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full text-sm transition">
                            🌍 Low Climate Risk
                        </Link>
                        <Link href="/agents" className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full text-sm transition">
                            👤 Find Agent
                        </Link>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-8 h-12 rounded-full border-2 border-white/40 flex items-start justify-center p-2">
                        <div className="w-1 h-3 bg-white/60 rounded-full animate-pulse" />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white border-b">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-gray-500 mt-2">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Revolutionary Features
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Experience the fusion of ancient wisdom and cutting-edge technology
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <Link
                                key={i}
                                href={feature.link}
                                className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition group"
                            >
                                <div className="text-5xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-500">{feature.desc}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vastu CTA Section */}
            <section className="py-20 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    <div className="text-6xl mb-6">🪷</div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Discover Your Property's Vastu Score
                    </h2>
                    <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                        Upload your floor plan and get an instant AI-powered Vastu analysis
                        based on 5,000 years of Vedic architectural principles
                    </p>
                    <Link
                        href="/vastu-analysis"
                        className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold text-lg hover:bg-indigo-50 transition shadow-xl"
                    >
                        Analyze Your Property →
                    </Link>
                </div>
            </section>

            {/* Agent CTA */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-12 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Work with Certified Vastu Agents
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Connect with agents who understand both ancient wisdom and modern
                                real estate. All agents are verified and karma-scored.
                            </p>
                            <Link
                                href="/agents"
                                className="inline-block px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition"
                            >
                                Find Your Agent 👤
                            </Link>
                        </div>
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div
                                    key={i}
                                    className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-4 border-white flex items-center justify-center text-white font-bold text-xl"
                                >
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-16 bg-gray-900 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        Ready to Find Your Dharma Home?
                    </h2>
                    <p className="text-gray-400 mb-8">
                        Join thousands of buyers who found homes aligned with their destiny
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/search"
                            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition"
                        >
                            Start Searching
                        </Link>
                        <Link
                            href="/register"
                            className="px-8 py-4 border border-white/30 rounded-xl font-semibold hover:bg-white/10 transition"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
