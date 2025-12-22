'use client';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    <div className="col-span-2 md:col-span-1">
                        <h3 className="text-white text-lg font-bold mb-4">Rest-iN-U</h3>
                        <p className="text-sm mb-4">
                            The future of real estate technology. Find your perfect home with AI-powered search, virtual tours, and expert agents.
                        </p>
                        <div className="flex gap-2">
                            <button className="p-2 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></button>
                            <button className="p-2 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></button>
                            <button className="p-2 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></button>
                            <button className="p-2 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></button>
                            <button className="p-2 hover:text-white transition-colors"><Youtube className="w-5 h-5" /></button>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-3">Explore</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/search" className="hover:text-white transition-colors">Buy</Link></li>
                            <li><Link href="/rent" className="hover:text-white transition-colors">Rent</Link></li>
                            <li><Link href="/sell" className="hover:text-white transition-colors">Sell</Link></li>
                            <li><Link href="/agents" className="hover:text-white transition-colors">Find Agents</Link></li>
                            <li><Link href="/open-houses" className="hover:text-white transition-colors">Open Houses</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-3">Tools</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/valuation" className="hover:text-white transition-colors">Home Value</Link></li>
                            <li><Link href="/market" className="hover:text-white transition-colors">Market Insights</Link></li>
                            <li><Link href="/compare" className="hover:text-white transition-colors">Compare Homes</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-3">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-3">For Agents</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/register" className="hover:text-white transition-colors">Join as Agent</Link></li>
                            <li><Link href="/dashboard/agent" className="hover:text-white transition-colors">Agent Dashboard</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Newsletter */}
                <div className="border-t border-gray-700 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h4 className="text-white font-semibold">Stay Updated</h4>
                            <p className="text-sm">Get the latest listings and market updates</p>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="px-4 py-2 bg-gray-800 border-none rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm">
                    <p>© 2025 Rest-iN-U. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
