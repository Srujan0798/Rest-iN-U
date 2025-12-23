'use client';
import { useState } from 'react';
import { Home, Users, Eye, TrendingUp } from 'lucide-react';
import LeadPipeline from '@/components/agent/LeadPipeline';
import ListingsManager from '@/components/agent/ListingsManager';
import AnalyticsDashboard from '@/components/agent/AnalyticsDashboard';

// Mock data
const stats = [
    { label: 'Active Listings', value: 12, icon: <Home className="w-6 h-6" />, color: 'text-blue-600', bg: 'bg-blue-50', change: '+2' },
    { label: 'Total Leads', value: 47, icon: <Users className="w-6 h-6" />, color: 'text-green-600', bg: 'bg-green-50', change: '+8' },
    { label: 'Views This Month', value: 1243, icon: <Eye className="w-6 h-6" />, color: 'text-orange-600', bg: 'bg-orange-50', change: '+15%' },
    { label: 'Conversion Rate', value: '24%', icon: <TrendingUp className="w-6 h-6" />, color: 'text-purple-600', bg: 'bg-purple-50', change: '+3%' },
];

export default function AgentDashboardPage() {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = ['Lead Pipeline', 'My Listings', 'Analytics', 'Messages'];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-primary text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-white text-primary rounded-full flex items-center justify-center text-2xl font-bold">
                            SA
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Welcome back, Sarah!</h1>
                            <p className="opacity-90 mt-1">
                                Top Realty Group • ⭐ 4.8 (127 reviews)
                            </p>
                        </div>
                        <div className="ml-auto">
                            <span className="bg-white text-primary font-semibold px-3 py-1 rounded-full text-sm">
                                Pro Account
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                                    <p className="text-gray-500 text-sm">{stat.label}</p>
                                </div>
                                <span className="ml-auto bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="flex border-b">
                        {tabs.map((tab, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveTab(index)}
                                className={`px-6 py-4 font-medium text-sm transition-colors relative ${activeTab === index
                                        ? 'text-primary border-b-2 border-primary'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-lg shadow-sm min-h-[400px]">
                    {activeTab === 0 && <LeadPipeline />}
                    {activeTab === 1 && <ListingsManager />}
                    {activeTab === 2 && <AnalyticsDashboard />}
                    {activeTab === 3 && (
                        <div className="p-8 text-center text-gray-500">
                            Messages feature coming soon...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

