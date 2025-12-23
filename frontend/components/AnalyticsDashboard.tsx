'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Users, Eye, Heart, MapPin, Star, DollarSign, Home, Calendar, Activity } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon: React.ReactNode;
    color: string;
}

function MetricCard({ title, value, change, icon, color }: MetricCardProps) {
    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
                {change !== undefined && (
                    <div className={`flex items-center gap-1 text-xs ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(change)}%
                    </div>
                )}
            </div>
            <p className="text-2xl font-bold text-white mt-3">{value}</p>
            <p className="text-sm text-gray-400">{title}</p>
        </div>
    );
}

export default function AnalyticsDashboard() {
    const metrics = [
        { title: 'Active Users', value: '12,458', change: 8.2, icon: <Users className="w-5 h-5 text-blue-400" />, color: 'bg-blue-500/20' },
        { title: 'Property Views', value: '89.2K', change: 12.5, icon: <Eye className="w-5 h-5 text-purple-400" />, color: 'bg-purple-500/20' },
        { title: 'Favorites Saved', value: '3,847', change: 5.1, icon: <Heart className="w-5 h-5 text-pink-400" />, color: 'bg-pink-500/20' },
        { title: 'Avg Vastu Score', value: '78.4', change: 2.3, icon: <Star className="w-5 h-5 text-amber-400" />, color: 'bg-amber-500/20' },
    ];

    const topCities = [
        { city: 'Los Angeles, CA', properties: 2840, avgPrice: 1.2, views: '45.2K' },
        { city: 'San Francisco, CA', properties: 1950, avgPrice: 1.8, views: '38.1K' },
        { city: 'Austin, TX', properties: 1620, avgPrice: 0.75, views: '29.4K' },
        { city: 'Miami, FL', properties: 1450, avgPrice: 0.95, views: '25.8K' },
        { city: 'Seattle, WA', properties: 1280, avgPrice: 1.1, views: '22.6K' },
    ];

    const recentActivity = [
        { action: 'New property listed', location: 'Beverly Hills, CA', time: '2 min ago', type: 'listing' },
        { action: 'Vastu certificate issued', location: 'Sedona, AZ', time: '15 min ago', type: 'certificate' },
        { action: 'Fractional shares sold', location: 'Austin, TX', time: '32 min ago', type: 'shares' },
        { action: 'Climate analysis complete', location: 'Miami, FL', time: '1 hour ago', type: 'climate' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
                    <p className="text-gray-400">Platform performance overview</p>
                </div>
                <div className="flex gap-2">
                    <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last 90 days</option>
                    </select>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((m, i) => <MetricCard key={i} {...m} />)}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Top Cities */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-indigo-400" /> Top Markets
                    </h2>
                    <div className="space-y-3">
                        {topCities.map((city, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-500 w-5">{idx + 1}</span>
                                    <div>
                                        <p className="text-white font-medium">{city.city}</p>
                                        <p className="text-xs text-gray-400">{city.properties} properties</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-indigo-400 font-semibold">${city.avgPrice}M avg</p>
                                    <p className="text-xs text-gray-500">{city.views} views</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-green-400" /> Recent Activity
                    </h2>
                    <div className="space-y-3">
                        {recentActivity.map((activity, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-3 bg-gray-900/50 rounded-lg">
                                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                                    {activity.type === 'listing' && <Home className="w-5 h-5 text-blue-400" />}
                                    {activity.type === 'certificate' && <Star className="w-5 h-5 text-amber-400" />}
                                    {activity.type === 'shares' && <DollarSign className="w-5 h-5 text-green-400" />}
                                    {activity.type === 'climate' && <Activity className="w-5 h-5 text-cyan-400" />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-white text-sm">{activity.action}</p>
                                    <p className="text-xs text-gray-400">{activity.location}</p>
                                </div>
                                <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-white">24,580</p>
                    <p className="text-sm text-gray-400">Total Properties</p>
                </div>
                <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-white">$4.2B</p>
                    <p className="text-sm text-gray-400">Total Value</p>
                </div>
                <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-white">8,420</p>
                    <p className="text-sm text-gray-400">Vastu Certified</p>
                </div>
                <div className="bg-gradient-to-br from-cyan-600/20 to-teal-600/20 border border-cyan-500/30 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-white">156</p>
                    <p className="text-sm text-gray-400">NFTs Minted</p>
                </div>
            </div>
        </div>
    );
}
