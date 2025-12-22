'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '../../lib/api';

export default function RegisterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isAgent = searchParams?.get('type') === 'agent';

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phone: '',
        dateOfBirth: '',
        birthTime: '',
        birthPlace: '',
        isAgent: isAgent,
        // Agent fields
        licenseNumber: '',
        licenseState: '',
        brokerage: '',
        yearsExperience: 0,
        specialties: [] as string[],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const specialtyOptions = [
        'Luxury Homes', 'Vastu-Compliant', 'Investment Properties',
        'First-Time Buyers', 'Commercial', 'Eco-Friendly'
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.register({
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone || undefined,
                dateOfBirth: formData.dateOfBirth || undefined,
            });
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left - Image */}
            <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 relative">
                <div className="absolute inset-0 flex items-center justify-center p-12">
                    <div className="text-center text-white">
                        <div className="text-8xl mb-6">🪷</div>
                        <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
                        <p className="text-white/80 max-w-md mx-auto">
                            Connect with Vastu-certified properties and agents aligned with your destiny
                        </p>
                    </div>
                </div>
            </div>

            {/* Right - Form */}
            <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold">
                            <span>🙏</span>
                            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                Dharma Realty
                            </span>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-2">
                            {isAgent ? 'Join as Agent' : 'Create Account'}
                        </h1>
                        <p className="text-gray-500">
                            {isAgent ? 'List properties and connect with buyers' : 'Find your perfect home'}
                        </p>
                    </div>

                    {/* Progress */}
                    <div className="flex items-center gap-2 mb-8">
                        {[1, 2, 3].filter(s => !isAgent || s <= 3).map(s => (
                            <div key={s} className="flex-1 flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${s <= step ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-500'
                                    }`}>
                                    {s}
                                </div>
                                {s < (isAgent ? 3 : 3) && <div className={`flex-1 h-1 ${s < step ? 'bg-amber-500' : 'bg-gray-200'}`} />}
                            </div>
                        ))}
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Basic Info */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="w-full py-3 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600"
                                >
                                    Continue
                                </button>
                            </div>
                        )}

                        {/* Step 2: Password */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        minLength={8}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">At least 8 characters</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 border rounded-lg">
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStep(3)}
                                        className="flex-1 py-3 bg-amber-500 text-white rounded-lg font-semibold"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Vedic Details (optional) */}
                        {step === 3 && (
                            <div className="space-y-4">
                                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 mb-4">
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">🌟</span>
                                        <div>
                                            <div className="font-medium text-purple-800">Personalized Experience</div>
                                            <div className="text-sm text-purple-600">
                                                Birth details enable personalized Vastu recommendations and muhurat calculations
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={formData.dateOfBirth}
                                        onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Birth Time</label>
                                    <input
                                        type="time"
                                        value={formData.birthTime}
                                        onChange={e => setFormData({ ...formData, birthTime: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Birth Place</label>
                                    <input
                                        type="text"
                                        value={formData.birthPlace}
                                        onChange={e => setFormData({ ...formData, birthPlace: e.target.value })}
                                        placeholder="City, Country"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setStep(2)} className="flex-1 py-3 border rounded-lg">
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold disabled:opacity-50"
                                    >
                                        {loading ? 'Creating...' : 'Create Account'}
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-2 text-gray-500 text-sm hover:underline"
                                >
                                    Skip for now
                                </button>
                            </div>
                        )}
                    </form>

                    <p className="mt-8 text-center text-gray-500">
                        Already have an account?{' '}
                        <Link href="/login" className="text-amber-600 font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
