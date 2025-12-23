'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, User, Phone, Mail, CheckCircle, ArrowLeft, Home, Video, Users } from 'lucide-react';

interface Tour {
    id: string;
    propertyId: string;
    propertyTitle: string;
    propertyImage: string;
    propertyAddress: string;
    date: string;
    time: string;
    type: 'in-person' | 'virtual';
    status: 'upcoming' | 'completed' | 'cancelled';
    agent: { name: string; phone: string; email: string; image?: string };
}

const mockTours: Tour[] = [
    {
        id: '1', propertyId: 'p1', propertyTitle: 'Vastu Villa Beverly Hills', propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
        propertyAddress: '123 Sunset Blvd, Beverly Hills, CA', date: '2024-12-28', time: '10:00 AM', type: 'in-person', status: 'upcoming',
        agent: { name: 'Priya Sharma', phone: '(310) 555-0123', email: 'priya@restinu.com' }
    },
    {
        id: '2', propertyId: 'p2', propertyTitle: 'Spiritual Retreat Sedona', propertyImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
        propertyAddress: '456 Red Rock Dr, Sedona, AZ', date: '2024-12-30', time: '2:00 PM', type: 'virtual', status: 'upcoming',
        agent: { name: 'Raj Patel', phone: '(480) 555-0456', email: 'raj@restinu.com' }
    },
];

export default function ToursPage() {
    const [tours] = useState<Tour[]>(mockTours);
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

    const filteredTours = tours.filter(t => filter === 'all' || t.status === filter);

    const getStatusBadge = (status: Tour['status']) => {
        const styles = {
            upcoming: 'bg-blue-100 text-blue-700',
            completed: 'bg-green-100 text-green-700',
            cancelled: 'bg-red-100 text-red-700',
        };
        return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>{status}</span>;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5" /></Link>
                        <h1 className="text-xl font-bold text-gray-900">My Property Tours</h1>
                    </div>
                    <Link href="/search" className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium">
                        <Calendar className="w-4 h-4" /> Schedule New Tour
                    </Link>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6">
                    {(['all', 'upcoming', 'completed'] as const).map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg font-medium capitalize ${filter === f ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
                            {f} ({tours.filter(t => f === 'all' || t.status === f).length})
                        </button>
                    ))}
                </div>

                {/* Tours List */}
                {filteredTours.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl">
                        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No tours scheduled</h3>
                        <p className="text-gray-500 mb-4">Start exploring properties and schedule a tour!</p>
                        <Link href="/search" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600">
                            <Home className="w-4 h-4" /> Browse Properties
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredTours.map(tour => (
                            <div key={tour.id} className="bg-white rounded-2xl shadow-sm p-5 flex gap-5">
                                <img src={tour.propertyImage} alt={tour.propertyTitle} className="w-32 h-24 object-cover rounded-xl" />
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{tour.propertyTitle}</h3>
                                            <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{tour.propertyAddress}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {tour.type === 'virtual' && <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs"><Video className="w-3 h-3" />Virtual</span>}
                                            {getStatusBadge(tour.status)}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 mt-3 text-sm text-gray-600">
                                        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{new Date(tour.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{tour.time}</span>
                                        <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{tour.agent.name}</span>
                                    </div>
                                    {tour.status === 'upcoming' && (
                                        <div className="flex items-center gap-3 mt-4">
                                            <a href={`tel:${tour.agent.phone}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">
                                                <Phone className="w-3.5 h-3.5" />Call Agent
                                            </a>
                                            <a href={`mailto:${tour.agent.email}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm">
                                                <Mail className="w-3.5 h-3.5" />Email
                                            </a>
                                            {tour.type === 'virtual' && (
                                                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm">
                                                    <Video className="w-3.5 h-3.5" />Join Tour
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
