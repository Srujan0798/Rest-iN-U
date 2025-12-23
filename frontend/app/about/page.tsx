'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
    const team = [
        { name: 'Arjun Sharma', role: 'CEO & Founder', bio: 'Former Goldman Sachs, Vedic scholar', image: '👨‍💼' },
        { name: 'Priya Patel', role: 'CTO', bio: 'Ex-Google, MIT AI researcher', image: '👩‍💻' },
        { name: 'Raj Krishnamurthy', role: 'Chief Vastu Officer', bio: '25+ years Vastu expertise', image: '🧘' },
        { name: 'Maya Chen', role: 'Head of Product', bio: 'Former Zillow, Stanford MBA', image: '👩‍💼' },
    ];

    const stats = [
        { value: '10,000+', label: 'Properties Listed' },
        { value: '50,000+', label: 'Happy Users' },
        { value: '98%', label: 'Vastu Accuracy' },
        { value: '500+', label: 'Expert Agents' },
    ];

    const values = [
        { icon: '🪷', title: 'Dharmic Principles', desc: 'Every decision guided by ancient wisdom and ethical practices' },
        { icon: '🔬', title: 'Scientific Rigor', desc: 'AI-powered analysis meets traditional knowledge systems' },
        { icon: '🌍', title: 'Sustainability', desc: 'Climate-conscious real estate for future generations' },
        { icon: '🤝', title: 'Community First', desc: 'DAO governance puts power in users hands' },
    ];

    const timeline = [
        { year: '2022', event: 'Founded with vision to merge Vastu with modern real estate' },
        { year: '2023', event: 'Launched AI-powered Vastu analysis with 10,000+ principles' },
        { year: '2023', event: 'Introduced blockchain property verification' },
        { year: '2024', event: 'Released climate risk and sacred geometry analysis' },
        { year: '2024', event: 'Launched DHARMA token and DAO governance' },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <div className="bg-gradient-to-br from-amber-600 via-orange-500 to-red-500 py-24 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl font-bold text-white mb-6">About REST-iN-U</h1>
                    <p className="text-xl text-white/80 leading-relaxed">
                        We're reimagining real estate by blending ancient Vedic wisdom with cutting-edge technology.
                        Our mission is to help you find not just a house, but a harmonious home aligned with
                        cosmic principles.
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="max-w-6xl mx-auto px-4 -mt-12">
                <div className="grid grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-lg p-6 text-center">
                            <div className="text-3xl font-bold text-amber-600">{stat.value}</div>
                            <div className="text-gray-500">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mission */}
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                    To democratize access to Vastu-compliant properties and empower every home buyer
                    with the knowledge of sacred geometry, climate resilience, and cosmic alignment.
                    We believe your home should nurture your body, mind, and spirit.
                </p>
            </div>

            {/* Values */}
            <div className="bg-amber-50 py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Values</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {values.map((value, i) => (
                            <div key={i} className="text-center">
                                <div className="text-5xl mb-4">{value.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{value.title}</h3>
                                <p className="text-gray-600 text-sm">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="max-w-4xl mx-auto px-4 py-20">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Journey</h2>
                <div className="space-y-6">
                    {timeline.map((item, i) => (
                        <div key={i} className="flex items-start gap-6">
                            <div className="w-20 text-right">
                                <div className="font-bold text-amber-600 text-lg">{item.year}</div>
                            </div>
                            <div className="w-4 h-4 bg-amber-500 rounded-full mt-1 flex-shrink-0" />
                            <div className="flex-1 pb-6 border-l-2 border-amber-200 pl-6 -ml-2">
                                <p className="text-gray-700">{item.event}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Team */}
            <div className="bg-gray-50 py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Leadership Team</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {team.map((member, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-md">
                                <div className="text-6xl mb-4">{member.image}</div>
                                <h3 className="font-semibold text-gray-800">{member.name}</h3>
                                <p className="text-amber-600 text-sm mb-2">{member.role}</p>
                                <p className="text-gray-500 text-sm">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to Find Your Dharmic Home?</h2>
                    <p className="text-white/80 mb-8">Join thousands of buyers who found harmony through our platform</p>
                    <div className="flex justify-center gap-4">
                        <Link href="/search" className="px-8 py-4 bg-white text-amber-600 rounded-lg font-semibold hover:bg-amber-50 transition">
                            Browse Properties
                        </Link>
                        <Link href="/contact" className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

