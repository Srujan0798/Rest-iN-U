'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function SettingsPage() {
    const { user, isAuthenticated, loading: authLoading, refreshUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        birthTime: '',
        birthPlace: '',
    });

    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        smsAlerts: false,
        newListings: true,
        priceDrops: true,
        vastuUpdates: true,
        daoProposals: true,
    });

    useEffect(() => {
        if (user) {
            setProfile({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || '',
                dateOfBirth: user.dateOfBirth || '',
                birthTime: user.birthTime || '',
                birthPlace: user.birthPlace || '',
            });
        }
    }, [user]);

    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('restinu_token');
            const response = await fetch('http://localhost:4000/api/v1/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(profile),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                refreshUser();
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔐</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign in Required</h2>
                    <Link href="/login?redirect=/settings" className="text-amber-600 hover:underline">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'profile', label: 'Profile', icon: '👤' },
        { id: 'vedic', label: 'Vedic Details', icon: '🌟' },
        { id: 'notifications', label: 'Notifications', icon: '🔔' },
        { id: 'security', label: 'Security', icon: '🔐' },
        { id: 'wallet', label: 'Wallet', icon: '💰' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-white">Settings</h1>
                    <p className="text-gray-400">Manage your account preferences</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="md:w-64 shrink-0">
                        <nav className="bg-white rounded-xl shadow-md overflow-hidden">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition ${activeTab === tab.id
                                            ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-500'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <span>{tab.icon}</span>
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        {message.text && (
                            <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                }`}>
                                {message.text}
                            </div>
                        )}

                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                                <form onSubmit={handleProfileSave} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                            <input
                                                type="text"
                                                value={profile.firstName}
                                                onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                            <input
                                                type="text"
                                                value={profile.lastName}
                                                onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                                                className="w-full px-4 py-2 border rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            disabled
                                            className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            value={profile.phone}
                                            onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Vedic Details Tab */}
                        {activeTab === 'vedic' && (
                            <div className="bg-white rounded-xl shadow-md p-6" id="vedic">
                                <h2 className="text-xl font-semibold mb-2">Vedic Details</h2>
                                <p className="text-gray-500 text-sm mb-6">
                                    Your birth details enable personalized Vastu recommendations and muhurat calculations
                                </p>

                                <form className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                        <input
                                            type="date"
                                            value={profile.dateOfBirth}
                                            onChange={e => setProfile({ ...profile, dateOfBirth: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Birth Time</label>
                                        <input
                                            type="time"
                                            value={profile.birthTime}
                                            onChange={e => setProfile({ ...profile, birthTime: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Birth Place</label>
                                        <input
                                            type="text"
                                            value={profile.birthPlace}
                                            onChange={e => setProfile({ ...profile, birthPlace: e.target.value })}
                                            placeholder="City, Country"
                                            className="w-full px-4 py-2 border rounded-lg"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
                                    >
                                        Save Vedic Details
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                                <div className="space-y-4">
                                    {Object.entries(notifications).map(([key, value]) => (
                                        <label key={key} className="flex items-center justify-between py-2">
                                            <span className="text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                            <button
                                                type="button"
                                                onClick={() => setNotifications({ ...notifications, [key]: !value })}
                                                className={`w-12 h-6 rounded-full transition ${value ? 'bg-amber-500' : 'bg-gray-300'}`}
                                            >
                                                <div className={`w-5 h-5 bg-white rounded-full shadow transition ${value ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                            </button>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-medium mb-2">Change Password</h3>
                                        <form className="space-y-3">
                                            <input type="password" placeholder="Current Password" className="w-full px-4 py-2 border rounded-lg" />
                                            <input type="password" placeholder="New Password" className="w-full px-4 py-2 border rounded-lg" />
                                            <input type="password" placeholder="Confirm New Password" className="w-full px-4 py-2 border rounded-lg" />
                                            <button className="px-6 py-2 bg-gray-800 text-white rounded-lg">Update Password</button>
                                        </form>
                                    </div>

                                    <div className="border-t pt-6">
                                        <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                                        <p className="text-gray-500 text-sm mb-3">Add extra security to your account</p>
                                        <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                            Enable 2FA
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Wallet Tab */}
                        {activeTab === 'wallet' && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-xl font-semibold mb-6">Wallet & Tokens</h2>
                                <div className="space-y-6">
                                    <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white">
                                        <div className="text-sm opacity-80">REST-iN-U Tokens (DRM)</div>
                                        <div className="text-3xl font-bold">0.00</div>
                                    </div>

                                    <div>
                                        <h3 className="font-medium mb-2">Connect Wallet</h3>
                                        <p className="text-gray-500 text-sm mb-3">
                                            Connect your Web3 wallet for blockchain features
                                        </p>
                                        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                            Connect MetaMask
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

