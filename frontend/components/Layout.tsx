'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthContext } from '../context/AuthContext';

export function Navbar() {
    const { user, isAuthenticated, logout } = useAuthContext();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const navLinks = [
        { href: '/search', label: 'Buy', icon: '🏠' },
        { href: '/rent', label: 'Rent', icon: '🔑' },
        { href: '/sell', label: 'Sell', icon: '💰' },
        { href: '/vastu-analysis', label: 'Vastu', icon: '🪷' },
        { href: '/agents', label: 'Agents', icon: '👤' },
    ];

    return (
        <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl">🙏</span>
                            <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                REST-iN-U
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 rounded-lg text-gray-600 hover:text-amber-600 hover:bg-amber-50 transition font-medium"
                            >
                                <span className="mr-1.5">{link.icon}</span>
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Auth Section */}
                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
                                        {user?.firstName?.[0] || 'U'}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{user?.firstName}</span>
                                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                            {user?.karmicScores && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <span className="text-xs text-amber-600">✨ {user.karmicScores.overallScore} karma</span>
                                                </div>
                                            )}
                                        </div>
                                        <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                            Dashboard
                                        </Link>
                                        <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                            Settings
                                        </Link>
                                        {user?.agent && (
                                            <Link href="/agent" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                Agent Portal
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => { logout(); setUserMenuOpen(false); }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition shadow-md"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 py-4">
                    <div className="space-y-1 px-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-amber-50 hover:text-amber-600"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="mr-2">{link.icon}</span>
                                {link.label}
                            </Link>
                        ))}
                        <div className="border-t border-gray-100 my-3" />
                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                                    className="w-full text-left px-4 py-3 text-red-600"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <div className="flex gap-3">
                                <Link
                                    href="/login"
                                    className="flex-1 text-center py-2.5 border border-gray-300 rounded-lg text-gray-700"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="flex-1 text-center py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">🙏</span>
                            <span className="text-xl font-bold">REST-iN-U</span>
                        </div>
                        <p className="text-gray-400 text-sm max-w-md">
                            The world's first real estate platform combining 5,000 years of Vedic wisdom
                            with cutting-edge technology. Find homes aligned with your destiny.
                        </p>
                        <div className="flex gap-4 mt-6">
                            {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                                <a key={social} href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-amber-600 transition">
                                    <span className="sr-only">{social}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Platform</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="/search" className="hover:text-amber-400">Buy Property</Link></li>
                            <li><Link href="/rent" className="hover:text-amber-400">Rent Property</Link></li>
                            <li><Link href="/sell" className="hover:text-amber-400">Sell Property</Link></li>
                            <li><Link href="/vastu-analysis" className="hover:text-amber-400">Vastu Analysis</Link></li>
                            <li><Link href="/climate-risk" className="hover:text-amber-400">Climate Risk</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="/about" className="hover:text-amber-400">About Us</Link></li>
                            <li><Link href="/agents" className="hover:text-amber-400">Find Agents</Link></li>
                            <li><Link href="/contact" className="hover:text-amber-400">Contact</Link></li>
                            <li><Link href="/privacy" className="hover:text-amber-400">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-amber-400">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
                    <p>© {new Date().getFullYear()} REST-iN-U. Where homes find their rightful owners. 🪷</p>
                </div>
            </div>
        </footer>
    );
}

