'use client';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Home, User, MessageSquare, Heart, Settings, LogOut, LayoutDashboard, TrendingUp, Calendar, Landmark, Cloud, Radio, Coins, ChevronDown, Menu, X } from 'lucide-react';

export default function Header() {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [moreMenuOpen, setMoreMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const moreMenuRef = useRef<HTMLDivElement>(null);

    // Mock auth state - in production, use AuthContext
    const isLoggedIn = false;

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
            if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) setMoreMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const moreMenuItems = [
        { href: '/valuation', icon: TrendingUp, label: 'Home Value' },
        { href: '/market', icon: TrendingUp, label: 'Market Insights' },
        { href: '/open-houses', icon: Calendar, label: 'Open Houses' },
        { divider: true },
        { href: '/vastu-analysis', icon: Landmark, label: 'Vastu AI' },
        { href: '/climate-risk', icon: Cloud, label: 'Climate Risk' },
        { href: '/iot-dashboard', icon: Radio, label: 'IoT Sensors' },
        { href: '/blockchain', icon: Coins, label: 'Blockchain' },
        { href: '/investment', icon: TrendingUp, label: 'Investment Analysis' },
        { href: '/vr-ar', icon: Radio, label: 'VR/AR Tours' },
        { divider: true },
        { href: '/about', label: 'About Us' },
        { href: '/contact', label: 'Contact' },
        { href: '/faq', label: 'FAQ' },
    ];

    return (
        <header className="sticky top-0 bg-white border-b border-gray-200 z-50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Home className="w-8 h-8 text-blue-600" />
                        <span className="text-xl font-bold text-blue-600">Rest-iN-U</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        <Link href="/search" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">Buy</Link>
                        <Link href="/rent" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">Rent</Link>
                        <Link href="/sell" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">Sell</Link>
                        <Link href="/agents" className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">Agents</Link>

                        {/* More Menu */}
                        <div className="relative" ref={moreMenuRef}>
                            <button
                                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                                className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                More <ChevronDown className="w-4 h-4" />
                            </button>
                            {moreMenuOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                                    {moreMenuItems.map((item, i) =>
                                        item.divider ? (
                                            <hr key={i} className="my-2 border-gray-200" />
                                        ) : (
                                            <Link
                                                key={item.href}
                                                href={item.href!}
                                                onClick={() => setMoreMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                {item.icon && <item.icon className="w-4 h-4 text-gray-500" />}
                                                {item.label}
                                            </Link>
                                        )
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Messages (logged in only) */}
                        {isLoggedIn && (
                            <Link href="/messages" className="relative p-2">
                                <MessageSquare className="w-5 h-5 text-gray-700" />
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
                            </Link>
                        )}

                        {/* User Menu */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                {isLoggedIn ? (
                                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">U</div>
                                ) : (
                                    <User className="w-6 h-6" />
                                )}
                            </button>
                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                                    {!isLoggedIn ? (
                                        <>
                                            <Link href="/login" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign In</Link>
                                            <Link href="/register" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign Up</Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                <LayoutDashboard className="w-4 h-4" /> Dashboard
                                            </Link>
                                            <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                <Heart className="w-4 h-4" /> Saved Homes
                                            </Link>
                                            <Link href="/messages" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                <MessageSquare className="w-4 h-4" /> Messages
                                            </Link>
                                            <hr className="my-2 border-gray-200" />
                                            <Link href="/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                <Settings className="w-4 h-4" /> Settings
                                            </Link>
                                            <button onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                <LogOut className="w-4 h-4" /> Sign Out
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-gray-700"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 py-4">
                    <nav className="flex flex-col px-4 space-y-2">
                        <Link href="/search" onClick={() => setMobileMenuOpen(false)} className="py-2 text-gray-700">Buy</Link>
                        <Link href="/rent" onClick={() => setMobileMenuOpen(false)} className="py-2 text-gray-700">Rent</Link>
                        <Link href="/sell" onClick={() => setMobileMenuOpen(false)} className="py-2 text-gray-700">Sell</Link>
                        <Link href="/agents" onClick={() => setMobileMenuOpen(false)} className="py-2 text-gray-700">Agents</Link>
                        <hr className="border-gray-200" />
                        <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="py-2 text-gray-700">Sign In</Link>
                        <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="py-2 text-blue-600 font-medium">Sign Up</Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
