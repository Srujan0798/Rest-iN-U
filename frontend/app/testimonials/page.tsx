'use client';

import React from 'react';
import Link from 'next/link';

export default function TestimonialsPage() {
    const testimonials = [
        {
            id: 1,
            name: 'Ananya Mehta',
            role: 'Homeowner, San Jose',
            image: '👩',
            rating: 5,
            quote: "The Vastu analysis was incredibly accurate. Our new home feels completely different - more peaceful and prosperous. We've seen positive changes in our family life since moving in.",
            property: 'Modern Villa with 92 Vastu Score',
            date: 'November 2024',
        },
        {
            id: 2,
            name: 'Vikram & Priya Singh',
            role: 'First-time Buyers, Palo Alto',
            image: '👨‍👩‍👦',
            rating: 5,
            quote: 'As first-time buyers, we were overwhelmed. The climate risk analysis helped us avoid a flood-prone area we were considering. The platform literally saved us from a huge mistake.',
            property: 'Townhouse near Stanford',
            date: 'October 2024',
        },
        {
            id: 3,
            name: 'Rajesh Patel',
            role: 'Investor, Mumbai',
            image: '👨‍💼',
            rating: 5,
            quote: 'The blockchain property verification gave me confidence to invest in US real estate from India. Everything is transparent and verifiable on-chain. Revolutionary platform!',
            property: 'Multi-family Investment',
            date: 'September 2024',
        },
        {
            id: 4,
            name: 'Dr. Sunita Sharma',
            role: 'Surgeon, San Francisco',
            image: '👩‍⚕️',
            rating: 5,
            quote: 'The muhurat timing feature was wonderful. We closed on our home during an auspicious window and did Griha Pravesh on the most favorable day. Everything has flowed smoothly since.',
            property: 'Victorian Home',
            date: 'August 2024',
        },
        {
            id: 5,
            name: 'Amit Kumar',
            role: 'Tech Executive, Cupertino',
            image: '👨‍💻',
            rating: 5,
            quote: "The smart home integration and IoT monitoring sold me. I can track air quality, energy usage, and even get Vastu-aligned automation suggestions. It's the future of home ownership.",
            property: 'Smart Home with Solar',
            date: 'July 2024',
        },
        {
            id: 6,
            name: 'The Krishnamurthy Family',
            role: 'Relocating from Texas',
            image: '👨‍👩‍👧‍👦',
            rating: 5,
            quote: 'Relocating across states was stressful, but the virtual tours and self-guided options made it manageable. The agent was incredibly knowledgeable about both Vastu and the local market.',
            property: 'Family Home in Sunnyvale',
            date: 'June 2024',
        },
    ];

    const stats = [
        { value: '4.9', label: 'Average Rating' },
        { value: '10,000+', label: 'Happy Families' },
        { value: '98%', label: 'Would Recommend' },
        { value: '500+', label: '5-Star Reviews' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-white mb-3">What Our Clients Say</h1>
                    <p className="text-white/80">Real stories from families who found their dharmic homes</p>
                </div>
            </div>

            {/* Stats */}
            <div className="max-w-6xl mx-auto px-4 -mt-8">
                <div className="grid grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-md p-4 text-center">
                            <div className="text-2xl font-bold text-amber-600">{stat.value}</div>
                            <div className="text-gray-500 text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Testimonials */}
            <div className="max-w-6xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {testimonials.map(t => (
                        <div key={t.id} className="bg-white rounded-2xl shadow-md p-8">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="text-5xl">{t.image}</div>
                                <div>
                                    <h3 className="font-bold text-gray-800">{t.name}</h3>
                                    <p className="text-gray-500 text-sm">{t.role}</p>
                                    <div className="flex gap-1 mt-1">
                                        {Array(t.rating).fill(0).map((_, i) => (
                                            <span key={i} className="text-amber-400">⭐</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <blockquote className="text-gray-700 italic mb-4">
                                "{t.quote}"
                            </blockquote>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-amber-600">{t.property}</span>
                                <span className="text-gray-400">{t.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Video Section */}
            <div className="bg-amber-50 py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Watch Their Stories</h2>
                    <div className="grid grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="h-40 bg-gradient-to-br from-amber-200 to-orange-200 flex items-center justify-center">
                                    <span className="text-6xl">▶️</span>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-800">Family Story #{i}</h3>
                                    <p className="text-gray-500 text-sm">2 min watch</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Start Your Journey</h2>
                    <p className="text-white/80 mb-8">Join thousands of happy families who found harmony</p>
                    <Link href="/search" className="inline-block px-8 py-4 bg-white text-amber-600 rounded-lg font-semibold hover:bg-amber-50 transition">
                        Find Your Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
