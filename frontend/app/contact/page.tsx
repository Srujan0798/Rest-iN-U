'use client';

import React, { useState } from 'react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const offices = [
        {
            city: 'San Francisco',
            address: '123 Market Street, Suite 500',
            phone: '(415) 555-0123',
            email: 'sf@dharmarealty.com',
            hours: 'Mon-Fri: 9AM-6PM',
        },
        {
            city: 'Los Angeles',
            address: '456 Wilshire Blvd, Floor 10',
            phone: '(213) 555-0456',
            email: 'la@dharmarealty.com',
            hours: 'Mon-Fri: 9AM-6PM',
        },
        {
            city: 'Mumbai',
            address: 'Nariman Point, Tower 3',
            phone: '+91 22 5555 0789',
            email: 'mumbai@dharmarealty.com',
            hours: 'Mon-Sat: 10AM-7PM IST',
        },
    ];

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
                    <div className="text-6xl mb-4">✉️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Message Sent!</h2>
                    <p className="text-gray-600 mb-6">
                        Thank you for reaching out. Our team will respond within 24 hours.
                    </p>
                    <button
                        onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' }); }}
                        className="px-6 py-3 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600"
                    >
                        Send Another Message
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-500 py-16 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-white mb-3">Contact Us</h1>
                    <p className="text-white/80 text-lg">We're here to help on your real estate journey</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12 -mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-md p-8">
                            <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Email *</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Subject *</label>
                                        <select
                                            required
                                            value={formData.subject}
                                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                        >
                                            <option>General Inquiry</option>
                                            <option>Buying a Property</option>
                                            <option>Selling a Property</option>
                                            <option>Vastu Consultation</option>
                                            <option>Become an Agent</option>
                                            <option>Technical Support</option>
                                            <option>Partnership Inquiry</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Message *</label>
                                    <textarea
                                        required
                                        rows={6}
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="How can we help you?"
                                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition"
                                >
                                    Send Message 📩
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        {/* Quick Contact */}
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4">Quick Contact</h3>
                            <div className="space-y-4">
                                <a href="tel:1-800-DHARMA" className="flex items-center gap-3 text-gray-600 hover:text-amber-600">
                                    <span className="text-2xl">📞</span>
                                    <div>
                                        <div className="font-medium">1-800-DHARMA</div>
                                        <div className="text-sm text-gray-400">Toll Free</div>
                                    </div>
                                </a>
                                <a href="mailto:support@dharmarealty.com" className="flex items-center gap-3 text-gray-600 hover:text-amber-600">
                                    <span className="text-2xl">📧</span>
                                    <div>
                                        <div className="font-medium">support@dharmarealty.com</div>
                                        <div className="text-sm text-gray-400">Email Support</div>
                                    </div>
                                </a>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <span className="text-2xl">💬</span>
                                    <div>
                                        <div className="font-medium">Live Chat</div>
                                        <div className="text-sm text-gray-400">Available 24/7</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Offices */}
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4">Our Offices</h3>
                            <div className="space-y-4">
                                {offices.map((office, i) => (
                                    <div key={i} className="p-4 bg-gray-50 rounded-xl">
                                        <div className="font-semibold text-amber-600 mb-1">{office.city}</div>
                                        <div className="text-sm text-gray-600">{office.address}</div>
                                        <div className="text-sm text-gray-500 mt-1">{office.phone}</div>
                                        <div className="text-xs text-gray-400">{office.hours}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Social */}
                        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-md p-6 text-white">
                            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">
                                    📘
                                </a>
                                <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">
                                    🐦
                                </a>
                                <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">
                                    📸
                                </a>
                                <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">
                                    💼
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <div className="mt-12 bg-white rounded-2xl shadow-md p-8">
                    <h2 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { q: 'What is Vastu-compliant real estate?', a: 'Properties designed following Vastu Shastra principles for optimal energy flow and harmony.' },
                            { q: 'How does the Dharma token work?', a: 'DHARMA tokens provide voting rights in platform governance and can be earned through referrals and engagement.' },
                            { q: 'Can I schedule a virtual tour?', a: 'Yes! All our listings offer virtual tour options through video call with our agents.' },
                            { q: 'What makes your climate risk analysis unique?', a: 'We provide 100-year projections using advanced AI models considering flood, fire, heat, and seismic risks.' },
                        ].map((faq, i) => (
                            <div key={i} className="p-4 bg-gray-50 rounded-xl">
                                <div className="font-semibold text-gray-800 mb-2">{faq.q}</div>
                                <div className="text-sm text-gray-600">{faq.a}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
