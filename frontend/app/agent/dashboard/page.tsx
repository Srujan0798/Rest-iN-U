'use client';

import React, { useState } from 'react';
import AgentAnalytics from '@/components/AgentAnalytics';
import LeadManagement from '@/components/LeadManagement';
import { LayoutDashboard, Users, Settings } from 'lucide-react';

export default function AgentDashboard() {
    const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'settings'>('overview');

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
                        <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
                    </div>
                    <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'overview' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <LayoutDashboard className="w-4 h-4" /> Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('leads')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'leads' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Users className="w-4 h-4" /> Leads
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'settings' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Settings className="w-4 h-4" /> Settings
                        </button>
                    </div>
                </div>

                {activeTab === 'overview' && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <AgentAnalytics />
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-gray-800 mb-4">Recent Leads</h3>
                            <LeadManagement />
                        </div>
                    </div>
                )}

                {activeTab === 'leads' && (
                    <div className="h-[calc(100vh-200px)] animate-in fade-in duration-500">
                        <LeadManagement />
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in duration-500">
                        <h2 className="text-lg font-semibold mb-4">Agent Settings</h2>
                        <p className="text-gray-500">Settings configuration would go here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
