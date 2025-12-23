'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Eye, MessageSquare, TrendingUp, Users } from 'lucide-react';

// Mock data for analytics
const viewsData = [
    { name: 'Mon', views: 400, inquiries: 24 },
    { name: 'Tue', views: 300, inquiries: 13 },
    { name: 'Wed', views: 200, inquiries: 98 },
    { name: 'Thu', views: 278, inquiries: 39 },
    { name: 'Fri', views: 189, inquiries: 48 },
    { name: 'Sat', views: 239, inquiries: 38 },
    { name: 'Sun', views: 349, inquiries: 43 },
];

const performanceData = [
    { name: 'Week 1', conversion: 2.4 },
    { name: 'Week 2', conversion: 3.1 },
    { name: 'Week 3', conversion: 2.8 },
    { name: 'Week 4', conversion: 3.5 },
];

/**
 * AgentAnalytics Component
 * Displays performance metrics for real estate agents including views, inquiries, and conversion rates.
 * Uses Recharts for data visualization.
 */
export default function AgentAnalytics() {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Performance Analytics</h2>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Total Views"
                    value="1,955"
                    change="+12%"
                    icon={<Eye className="w-5 h-5 text-blue-600" />}
                    trend="up"
                />
                <MetricCard
                    title="Inquiries"
                    value="303"
                    change="+5%"
                    icon={<MessageSquare className="w-5 h-5 text-purple-600" />}
                    trend="up"
                />
                <MetricCard
                    title="Conversion Rate"
                    value="3.5%"
                    change="+0.4%"
                    icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
                    trend="up"
                />
                <MetricCard
                    title="Active Leads"
                    value="42"
                    change="-2%"
                    icon={<Users className="w-5 h-5 text-amber-600" />}
                    trend="down"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Views vs Inquiries Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-4">Views vs Inquiries (Last 7 Days)</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={viewsData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend />
                                <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Property Views" />
                                <Bar dataKey="inquiries" fill="#a855f7" radius={[4, 4, 0, 0]} name="Inquiries" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Conversion Trend Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-4">Conversion Rate Trend</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} unit="%" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="conversion"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#10b981' }}
                                    activeDot={{ r: 6 }}
                                    name="Conversion Rate"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper Component for Metric Cards
function MetricCard({ title, value, change, icon, trend }: { title: string; value: string; change: string; icon: React.ReactNode; trend: 'up' | 'down' }) {
    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
                <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {change}
                </span>
            </div>
            <h4 className="text-gray-500 text-sm font-medium">{title}</h4>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
    );
}
