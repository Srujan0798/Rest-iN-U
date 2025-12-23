'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Users, Home, Settings, BarChart3, Bell, CreditCard } from 'lucide-react';

export default function AdminPage() {
    const adminSections = [
        { icon: Users, title: 'User Management', description: 'Manage users, agents, and roles', href: '#users' },
        { icon: Home, title: 'Property Management', description: 'Review and moderate property listings', href: '#properties' },
        { icon: BarChart3, title: 'Analytics', description: 'View platform statistics and reports', href: '#analytics' },
        { icon: CreditCard, title: 'Payments', description: 'Manage transactions and payouts', href: '#payments' },
        { icon: Bell, title: 'Notifications', description: 'Configure system notifications', href: '#notifications' },
        { icon: Settings, title: 'Settings', description: 'Platform configuration and preferences', href: '#settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <Shield className="w-10 h-10 text-blue-600" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-600">Manage your Rest-iN-U platform</p>
                    </div>
                </div>

                {/* Admin Sections Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {adminSections.map((section) => (
                        <div
                            key={section.title}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <section.icon className="w-8 h-8 text-blue-600 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h3>
                            <p className="text-gray-600 text-sm">{section.description}</p>
                        </div>
                    ))}
                </div>

                {/* Coming Soon Notice */}
                <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                    <p className="text-amber-800">
                        🚧 Admin features are under development. Full functionality coming soon!
                    </p>
                </div>
            </div>
        </div>
    );
}

