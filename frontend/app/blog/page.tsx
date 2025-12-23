'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    author: string;
    date: string;
    readTime: string;
    image: string;
    featured?: boolean;
}

export default function BlogPage() {
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = ['All', 'Vastu', 'Market Trends', 'Feng Shui', 'Climate', 'Blockchain', 'Tips'];

    const posts: BlogPost[] = [
        {
            id: '1',
            title: 'The Complete Guide to Vastu-Compliant Home Buying',
            excerpt: 'Learn how ancient Vastu principles can guide your next property purchase for maximum prosperity and peace.',
            category: 'Vastu',
            author: 'Raj Krishnamurthy',
            date: 'Dec 20, 2024',
            readTime: '8 min read',
            image: '🏠',
            featured: true,
        },
        {
            id: '2',
            title: '2025 Real Estate Market Predictions',
            excerpt: 'Our AI analyzes 10 million data points to forecast housing trends for the upcoming year.',
            category: 'Market Trends',
            author: 'Maya Chen',
            date: 'Dec 18, 2024',
            readTime: '6 min read',
            image: '📈',
            featured: true,
        },
        {
            id: '3',
            title: 'Feng Shui vs Vastu: Understanding the Differences',
            excerpt: 'Both ancient systems aim for harmony, but their approaches differ in fascinating ways.',
            category: 'Feng Shui',
            author: 'Priya Patel',
            date: 'Dec 15, 2024',
            readTime: '5 min read',
            image: '☯️',
        },
        {
            id: '4',
            title: 'How Climate Risk Affects Property Values',
            excerpt: 'Understanding the long-term impact of climate change on your real estate investment.',
            category: 'Climate',
            author: 'Arjun Sharma',
            date: 'Dec 12, 2024',
            readTime: '7 min read',
            image: '🌍',
        },
        {
            id: '5',
            title: 'Blockchain Property Records: The Future is Here',
            excerpt: 'How immutable ledgers are revolutionizing property ownership verification.',
            category: 'Blockchain',
            author: 'Tech Team',
            date: 'Dec 10, 2024',
            readTime: '4 min read',
            image: '⛓️',
        },
        {
            id: '6',
            title: '10 Vastu Tips for Your Home Office',
            excerpt: 'Optimize your work-from-home setup according to ancient directional principles.',
            category: 'Tips',
            author: 'Raj Krishnamurthy',
            date: 'Dec 8, 2024',
            readTime: '4 min read',
            image: '💼',
        },
        {
            id: '7',
            title: 'Sacred Geometry in Modern Architecture',
            excerpt: 'How ancient proportions are making a comeback in contemporary home design.',
            category: 'Vastu',
            author: 'Architecture Team',
            date: 'Dec 5, 2024',
            readTime: '6 min read',
            image: '🔯',
        },
        {
            id: '8',
            title: 'Understanding Muhurat: Best Times to Buy Property',
            excerpt: 'Astrological timing can influence the success of your property transactions.',
            category: 'Vastu',
            author: 'Raj Krishnamurthy',
            date: 'Dec 1, 2024',
            readTime: '5 min read',
            image: '📅',
        },
    ];

    const filteredPosts = activeCategory === 'All'
        ? posts
        : posts.filter(p => p.category === activeCategory);

    const featuredPosts = posts.filter(p => p.featured);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-white mb-3">REST-iN-U Insights</h1>
                    <p className="text-white/70">Expert articles on Vastu, real estate, and conscious living</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Featured */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {featuredPosts.map(post => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.id}`}
                            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition group"
                        >
                            <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                <span className="text-7xl group-hover:scale-110 transition">{post.image}</span>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full">
                                        {post.category}
                                    </span>
                                    <span className="text-gray-400 text-sm">{post.readTime}</span>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition">
                                    {post.title}
                                </h2>
                                <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span>By {post.author}</span>
                                    <span>•</span>
                                    <span>{post.date}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full font-medium transition ${activeCategory === cat
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredPosts.map(post => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.id}`}
                            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition group"
                        >
                            <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <span className="text-5xl group-hover:scale-110 transition">{post.image}</span>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                        {post.category}
                                    </span>
                                    <span className="text-gray-400 text-xs">{post.readTime}</span>
                                </div>
                                <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-gray-500 text-sm line-clamp-2">{post.excerpt}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Newsletter */}
                <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-3">Subscribe to REST-iN-U Insights</h2>
                    <p className="text-white/70 mb-6">Get weekly articles on Vastu, market trends, and conscious living</p>
                    <div className="flex max-w-md mx-auto gap-3">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 rounded-lg focus:ring-2 focus:ring-white/50"
                        />
                        <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

