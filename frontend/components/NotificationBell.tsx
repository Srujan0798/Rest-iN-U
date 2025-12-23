'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bell, X, CheckCheck, Trash2, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';

interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    link?: string;
}

const iconMap = {
    info: <Info className="w-4 h-4 text-blue-400" />,
    success: <CheckCircle className="w-4 h-4 text-green-400" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
    error: <AlertCircle className="w-4 h-4 text-red-400" />,
};

const bgMap = {
    info: 'bg-blue-500/10',
    success: 'bg-green-500/10',
    warning: 'bg-amber-500/10',
    error: 'bg-red-500/10',
};

const formatTimeAgo = (date: Date): string => {
    const s = Math.floor((Date.now() - date.getTime()) / 1000);
    if (s < 60) return 'Just now';
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
};

const defaultNotifications: Notification[] = [
    { id: '1', type: 'success', title: 'New Property Match!', message: 'A Vastu A+ property is now available.', timestamp: new Date(Date.now() - 300000), read: false },
    { id: '2', type: 'info', title: 'Price Drop Alert', message: 'A saved property reduced price by $50K.', timestamp: new Date(Date.now() - 1800000), read: false },
    { id: '3', type: 'warning', title: 'Climate Update', message: 'New flood zone data available.', timestamp: new Date(Date.now() - 7200000), read: true },
];

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    const removeNotification = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));
    const clearAll = () => setNotifications([]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 rounded-lg hover:bg-gray-800 transition-colors">
                <Bell className="w-5 h-5 text-gray-400 hover:text-white" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
                    <div className="flex items-center justify-between p-4 border-b border-gray-800">
                        <h3 className="font-semibold text-white">Notifications</h3>
                        <div className="flex gap-2">
                            {unreadCount > 0 && <button onClick={markAllAsRead} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"><CheckCheck className="w-4 h-4" /></button>}
                            {notifications.length > 0 && <button onClick={clearAll} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg"><Trash2 className="w-4 h-4" /></button>}
                        </div>
                    </div>

                    <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <Bell className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                                <p className="text-gray-500 text-sm">No notifications</p>
                            </div>
                        ) : notifications.map(n => (
                            <div key={n.id} className={`p-4 border-b border-gray-800 last:border-0 hover:bg-gray-800/50 ${!n.read ? 'bg-indigo-500/5' : ''}`}>
                                <div className="flex gap-3">
                                    <div className={`p-2 rounded-lg ${bgMap[n.type]}`}>{iconMap[n.type]}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between">
                                            <p className={`text-sm font-medium ${n.read ? 'text-gray-300' : 'text-white'}`}>{n.title}</p>
                                            <button onClick={() => removeNotification(n.id)} className="p-1 text-gray-500 hover:text-red-400"><X className="w-3.5 h-3.5" /></button>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-0.5">{n.message}</p>
                                        <span className="text-xs text-gray-500 mt-1 block">{formatTimeAgo(n.timestamp)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
