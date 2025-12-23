'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function HelpCenterPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('Getting Started');

    const categories = [
        { name: 'Getting Started', icon: '🚀', articles: 8 },
        { name: 'Vastu & Analysis', icon: '🪷', articles: 12 },
        { name: 'Account & Settings', icon: '⚙️', articles: 6 },
        { name: 'Buying Process', icon: '🏠', articles: 10 },
        { name: 'RESTINU Tokens', icon: '🪙', articles: 5 },
        { name: 'DAO & Governance', icon: '🏛️', articles: 4 },
    ];

    const articles: Record<string, any[]> = {
        'Getting Started': [
            { title: 'How to create your account', views: 2500 },
            { title: 'Understanding your dashboard', views: 1800 },
            { title: 'Setting up property preferences', views: 1200 },
            { title: 'How to save and compare properties', views: 950 },
            { title: 'Scheduling your first property tour', views: 850 },
            { title: 'Connecting your crypto wallet', views: 600 },
            { title: 'Understanding karma points', views: 550 },
            { title: 'Referring friends and earning rewards', views: 450 },
        ],
        'Vastu & Analysis': [
            { title: 'What is Vastu Shastra?', views: 3200 },
            { title: 'Understanding your Vastu score', views: 2800 },
            { title: 'How we calculate directional analysis', views: 1500 },
            { title: 'Interpreting Vastu defects and remedies', views: 1400 },
            { title: 'Feng Shui vs Vastu comparison', views: 1200 },
            { title: 'Sacred Geometry analysis explained', views: 900 },
            { title: 'Land energy and Bhumi Shuddhi', views: 750 },
            { title: 'Climate risk methodology', views: 700 },
        ],
        'Account & Settings': [
            { title: 'Updating your profile information', views: 800 },
            { title: 'Managing notification preferences', views: 650 },
            { title: 'Two-factor authentication setup', views: 500 },
            { title: 'Privacy settings and data control', views: 450 },
            { title: 'Deleting your account', views: 300 },
            { title: 'Connecting social accounts', views: 250 },
        ],
        'Buying Process': [
            { title: 'How to make an inquiry', views: 1500 },
            { title: 'Working with our agents', views: 1200 },
            { title: 'Understanding the mortgage calculator', views: 1100 },
            { title: 'Auspicious timing (Muhurat) for purchases', views: 950 },
            { title: 'Blockchain property verification', views: 850 },
            { title: 'Virtual vs in-person tours', views: 700 },
        ],
        'RESTINU Tokens': [
            { title: 'What are RESTINU tokens?', views: 1800 },
            { title: 'How to earn tokens', views: 1200 },
            { title: 'Token staking and rewards', views: 800 },
            { title: 'Using tokens for governance', views: 600 },
            { title: 'Token security best practices', views: 400 },
        ],
        'DAO & Governance': [
            { title: 'How REST-iN-U DAO works', views: 900 },
            { title: 'Creating and voting on proposals', views: 700 },
            { title: 'Understanding voting power', views: 500 },
            { title: 'Governance best practices', views: 350 },
        ],
    };

    const popularArticles = [
        'What is Vastu Shastra?',
        'Understanding your Vastu score',
        'How to create your account',
        'What are RESTINU tokens?',
        'Understanding your dashboard',
    ];

    const currentArticles = articles[activeCategory] || [];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Help Center</h1>
                    <p className="text-white/80 mb-8">Find answers to your questions</p>

                    <div className="relative max-w-xl mx-auto">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search for help..."
                            className="w-full px-6 py-4 rounded-xl text-lg focus:ring-2 focus:ring-white/50"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-lg">
                            🔍
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Categories Sidebar */}
                    <div className="space-y-4">
                        <h2 className="font-semibold text-gray-800 mb-4">Categories</h2>
                        {categories.map(cat => (
                            <button
                                key={cat.name}
                                onClick={() => setActiveCategory(cat.name)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition ${activeCategory === cat.name
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'hover:bg-gray-100 text-gray-600'
                                    }`}
                            >
                                <span className="text-2xl">{cat.icon}</span>
                                <div>
                                    <div className="font-medium">{cat.name}</div>
                                    <div className="text-sm text-gray-400">{cat.articles} articles</div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Articles */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">{activeCategory}</h2>
                        <div className="space-y-3">
                            {currentArticles.map((article, i) => (
                                <Link
                                    key={i}
                                    href={`/help/${article.title.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition"
                                >
                                    <span className="text-gray-800">{article.title}</span>
                                    <span className="text-gray-400 text-sm">{article.views.toLocaleString()} views</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Popular */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="font-semibold text-gray-800 mb-4">🔥 Most Popular</h3>
                            <div className="space-y-3">
                                {popularArticles.map((title, i) => (
                                    <Link
                                        key={i}
                                        href={`/help/${title.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="block text-sm text-gray-600 hover:text-blue-600"
                                    >
                                        {title}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-sm p-6 text-white">
                            <h3 className="font-semibold mb-3">Still need help?</h3>
                            <p className="text-white/80 text-sm mb-4">Our support team is available 24/7</p>
                            <Link href="/contact" className="block w-full py-2 bg-white text-blue-600 rounded-lg text-center font-medium hover:bg-blue-50">
                                Contact Support
                            </Link>
                        </div>

                        {/* Community */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="font-semibold text-gray-800 mb-3">💬 Community</h3>
                            <p className="text-gray-600 text-sm mb-4">Join discussions with other users</p>
                            <Link href="/community" className="text-blue-600 text-sm font-medium hover:underline">
                                Visit Community Forum →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

