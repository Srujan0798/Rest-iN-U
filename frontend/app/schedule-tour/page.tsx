'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function ScheduleTourPage() {
    const { isAuthenticated } = useAuth();
    const [step, setStep] = useState(1);
    const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [tourType, setTourType] = useState<'IN_PERSON' | 'VIRTUAL' | 'SELF_GUIDED'>('IN_PERSON');
    const [notes, setNotes] = useState('');
    const [preferMuhurat, setPreferMuhurat] = useState(false);
    const [booked, setBooked] = useState(false);

    // Mock property
    const property = {
        id: '1',
        title: 'Modern Vastu Villa',
        address: '123 Main St, San Jose, CA',
        price: 1250000,
    };

    // Generate next 7 days
    const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i + 1);
        return {
            dateStr: date.toISOString().split('T')[0],
            dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
            dayNum: date.getDate(),
            muhuratScore: 50 + Math.floor(Math.random() * 40),
        };
    });

    const timeSlots = [
        { time: '09:00', label: '9:00 AM', available: true },
        { time: '10:00', label: '10:00 AM', available: true },
        { time: '11:00', label: '11:00 AM', available: false },
        { time: '12:00', label: '12:00 PM', available: true },
        { time: '14:00', label: '2:00 PM', available: true },
        { time: '15:00', label: '3:00 PM', available: true },
        { time: '16:00', label: '4:00 PM', available: false },
        { time: '17:00', label: '5:00 PM', available: true },
    ];

    const handleBook = () => {
        setBooked(true);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-6xl mb-4">📅</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign in to schedule tours</h2>
                    <Link href="/login?redirect=/schedule-tour" className="text-amber-600 hover:underline">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    if (booked) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Tour Scheduled!</h2>
                    <p className="text-gray-600 mb-6">
                        Your {tourType.toLowerCase().replace('_', ' ')} tour of {property.title} is booked for{' '}
                        {selectedDate} at {timeSlots.find(t => t.time === selectedTime)?.label}
                    </p>
                    <div className="space-y-3">
                        <Link href="/dashboard" className="block w-full py-3 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600">
                            View My Tours
                        </Link>
                        <Link href="/search" className="block text-gray-500 hover:text-gray-700">
                            Browse More Properties
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-2">Schedule a Tour</h1>
                    <p className="text-white/70">{property.title} • {property.address}</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    {[1, 2, 3].map(s => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${s <= step ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-400'
                                }`}>
                                {s}
                            </div>
                            {s < 3 && <div className={`w-16 h-1 ${s < step ? 'bg-amber-500' : 'bg-gray-200'}`} />}
                        </div>
                    ))}
                </div>

                {/* Step 1: Select Tour Type */}
                {step === 1 && (
                    <div className="bg-white rounded-2xl shadow-md p-8">
                        <h2 className="text-xl font-semibold mb-6">Select Tour Type</h2>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            {[
                                { type: 'IN_PERSON' as const, icon: '🏠', label: 'In-Person', desc: 'Tour with agent' },
                                { type: 'VIRTUAL' as const, icon: '📱', label: 'Virtual', desc: 'Video call tour' },
                                { type: 'SELF_GUIDED' as const, icon: '🔑', label: 'Self-Guided', desc: 'Access code provided' },
                            ].map(option => (
                                <button
                                    key={option.type}
                                    onClick={() => setTourType(option.type)}
                                    className={`p-6 rounded-xl text-center transition ${tourType === option.type
                                            ? 'bg-amber-50 border-2 border-amber-500'
                                            : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                                        }`}
                                >
                                    <div className="text-4xl mb-2">{option.icon}</div>
                                    <div className="font-semibold">{option.label}</div>
                                    <div className="text-sm text-gray-500">{option.desc}</div>
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl mb-6">
                            <input
                                type="checkbox"
                                checked={preferMuhurat}
                                onChange={e => setPreferMuhurat(e.target.checked)}
                                className="w-5 h-5 text-amber-500"
                            />
                            <div>
                                <div className="font-medium text-amber-800">🪷 Prefer Auspicious Timing</div>
                                <div className="text-sm text-amber-600">Highlight muhurat-aligned time slots</div>
                            </div>
                        </div>

                        <button
                            onClick={() => setStep(2)}
                            className="w-full py-4 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition"
                        >
                            Continue
                        </button>
                    </div>
                )}

                {/* Step 2: Select Date & Time */}
                {step === 2 && (
                    <div className="bg-white rounded-2xl shadow-md p-8">
                        <h2 className="text-xl font-semibold mb-6">Select Date & Time</h2>

                        {/* Date Selection */}
                        <div className="grid grid-cols-7 gap-2 mb-8">
                            {dates.map(date => (
                                <button
                                    key={date.dateStr}
                                    onClick={() => setSelectedDate(date.dateStr)}
                                    className={`p-4 rounded-xl text-center transition relative ${selectedDate === date.dateStr
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-gray-50 hover:bg-gray-100'
                                        }`}
                                >
                                    <div className="text-xs">{date.dayName}</div>
                                    <div className="text-xl font-bold">{date.dayNum}</div>
                                    {preferMuhurat && date.muhuratScore >= 70 && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs">✓</span>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Time Selection */}
                        {selectedDate && (
                            <>
                                <h3 className="text-lg font-medium mb-4">Available Times</h3>
                                <div className="grid grid-cols-4 gap-3 mb-8">
                                    {timeSlots.map(slot => (
                                        <button
                                            key={slot.time}
                                            onClick={() => slot.available && setSelectedTime(slot.time)}
                                            disabled={!slot.available}
                                            className={`py-3 rounded-lg font-medium transition ${!slot.available
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : selectedTime === slot.time
                                                        ? 'bg-amber-500 text-white'
                                                        : 'bg-gray-50 hover:bg-gray-100'
                                                }`}
                                        >
                                            {slot.label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}

                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 py-4 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                disabled={!selectedDate || !selectedTime}
                                className="flex-1 py-4 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition disabled:opacity-50"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Confirm */}
                {step === 3 && (
                    <div className="bg-white rounded-2xl shadow-md p-8">
                        <h2 className="text-xl font-semibold mb-6">Confirm Your Tour</h2>

                        <div className="bg-gray-50 rounded-xl p-6 mb-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-gray-500">Property</div>
                                    <div className="font-semibold">{property.title}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Tour Type</div>
                                    <div className="font-semibold">{tourType.replace('_', ' ')}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Date</div>
                                    <div className="font-semibold">{selectedDate}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Time</div>
                                    <div className="font-semibold">{timeSlots.find(t => t.time === selectedTime)?.label}</div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm text-gray-600 mb-2">Additional Notes (optional)</label>
                            <textarea
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                placeholder="Any specific areas you'd like to focus on?"
                                className="w-full px-4 py-3 border rounded-lg h-24"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep(2)}
                                className="flex-1 py-4 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleBook}
                                className="flex-1 py-4 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition"
                            >
                                Confirm Tour 📅
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

