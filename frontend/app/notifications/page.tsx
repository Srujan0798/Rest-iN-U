'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    data?: any;
    read: boolean;
    createdAt: string;
}

export default function NotificationsPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    // Mock notifications for demo
    useEffect(() => {
        const mockNotifications: Notification[] = [
            {
                id: '1', type: 'PRICE_DROP', title: '💰 Price Drop Alert!',
                message: 'Price dropped 12% on Modern Vastu Villa in San Jose',
                data: { propertyId: '1', discount: 12 }, read: false, createdAt: new Date().toISOString(),
            },
            {
                id: '2', type: 'MUHURAT_REMINDER', title: '📅 Auspicious Date Tomorrow',
                message: 'Tomorrow is an excellent day for property purchase!',
                data: { eventType: 'Purchase' }, read: false, createdAt: new Date(Date.now() - 3600000).toISOString(),
            },
            {
                id: '3', type: 'KARMA_EARNED', title: '🌟 Karma Points Earned!',
                message: 'You earned 50 karma for completing your profile',
                data: { amount: 50 }, read: true, createdAt: new Date(Date.now() - 86400000).toISOString(),
            },
            {
                id: '4', type: 'DAO_PROPOSAL', title: '🏛️ New DAO Proposal',
                message: 'Vote on: Reduce platform fees for verified agents',
                data: { proposalId: '1' }, read: true, createdAt: new Date(Date.now() - 172800000).toISOString(),
            },
            {
                id: '5', type: 'IOT_ALERT', title: '⚠️ Sensor Alert',
                message: 'Air quality index exceeded threshold in your property',
                data: { sensorType: 'AIR_QUALITY' }, read: true, createdAt: new Date(Date.now() - 259200000).toISOString(),
            },
        ];

        setTimeout(() => {
            setNotifications(mockNotifications);
            setLoading(false);
        }, 500);
    }, []);

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const getIcon = (type: string) => {
        const icons: Record<string, string> = {
            PRICE_DROP: '💰', MUHURAT_REMINDER: '📅', KARMA_EARNED: '🌟',
            DAO_PROPOSAL: '🏛️', IOT_ALERT: '⚠️', NEW_LISTING: '🏠',
            INQUIRY_RECEIVED: '📧', VASTU_UPDATE: '🪷', BLOCKCHAIN_CONFIRMED: '🔗',
        };
        return icons[type] || '🔔';
    };

    const getTimeAgo = (date: string) => {
        const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.read)
        : notifications;

    const unreadCount = notifications.filter(n => !n.read).length;

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔔</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign in to view notifications</h2>
                    <Link href="/login?redirect=/notifications" className="text-amber-600 hover:underline">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 py-12 px-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Notifications</h1>
                        <p className="text-white/70">{unreadCount} unread</p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition"
                        >
                            Mark all read
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Filter Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'all' ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'unread' ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Unread ({unreadCount})
                    </button>
                </div>

                {/* Notifications List */}
                <div className="space-y-3">
                    {filteredNotifications.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl">
                            <div className="text-4xl mb-4">🔔</div>
                            <p className="text-gray-500">No notifications</p>
                        </div>
                    ) : (
                        filteredNotifications.map(notification => (
                            <div
                                key={notification.id}
                                onClick={() => markAsRead(notification.id)}
                                className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition ${notification.read ? 'bg-white' : 'bg-amber-50 border-l-4 border-amber-500'
                                    } hover:shadow-md`}
                            >
                                <div className="text-3xl">{getIcon(notification.type)}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-4">
                                        <h3 className={`font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                                            {notification.title}
                                        </h3>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">
                                            {getTimeAgo(notification.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                                </div>
                                {!notification.read && (
                                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2" />
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
