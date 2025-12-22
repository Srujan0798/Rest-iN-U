'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SmartHomePage() {
    const [propertyId] = useState('demo-property-1');

    const smartHomeData = {
        overall: 72,
        categories: {
            security: 85,
            energy: 68,
            comfort: 75,
            connectivity: 60,
        },
        devices: [
            { id: '1', name: 'Nest Thermostat', type: 'TEMPERATURE', status: 'ONLINE', value: '72°F', manufacturer: 'Google' },
            { id: '2', name: 'Ring Doorbell', type: 'SECURITY', status: 'ONLINE', value: 'Armed', manufacturer: 'Ring' },
            { id: '3', name: 'Philips Hue', type: 'LIGHTING', status: 'ONLINE', value: '80%', manufacturer: 'Philips' },
            { id: '4', name: 'Ecobee Sensor', type: 'TEMPERATURE', status: 'ONLINE', value: '70°F', manufacturer: 'Ecobee' },
            { id: '5', name: 'August Lock', type: 'SECURITY', status: 'OFFLINE', value: 'Locked', manufacturer: 'August' },
            { id: '6', name: 'Air Quality Monitor', type: 'AIR_QUALITY', status: 'ONLINE', value: 'Good (42)', manufacturer: 'Awair' },
        ],
        automations: [
            { name: 'Morning Ritual', trigger: '6:00 AM', actions: ['Lights on gradually', 'Thermostat to 72°F'], active: true, vastuNote: 'Aligns with Brahma Muhurta' },
            { name: 'Away Mode', trigger: 'Everyone leaves', actions: ['Arm security', 'HVAC eco mode'], active: true, vastuNote: null },
            { name: 'Welcome Home', trigger: 'First arrival', actions: ['Disarm security', 'Perfect temperature'], active: true, vastuNote: 'Positive energy welcome' },
            { name: 'Night Mode', trigger: '10:00 PM', actions: ['Dim lights', 'Lock doors', 'Lower temp'], active: false, vastuNote: 'Supports restful sleep' },
        ],
        recommendations: [
            'Add CO2 sensor for better air quality monitoring',
            'Install smart blinds in southeast rooms for energy savings',
            'Connect water leak sensors in bathrooms',
            'Position devices according to Vastu for optimal energy flow',
        ],
    };

    const getStatusColor = (status: string) => {
        if (status === 'ONLINE') return 'bg-green-500';
        if (status === 'OFFLINE') return 'bg-gray-400';
        return 'bg-red-500';
    };

    const getCategoryIcon = (category: string) => {
        const icons: Record<string, string> = {
            security: '🔒', energy: '⚡', comfort: '🌡️', connectivity: '📶',
        };
        return icons[category] || '📱';
    };

    const getDeviceIcon = (type: string) => {
        const icons: Record<string, string> = {
            TEMPERATURE: '🌡️', SECURITY: '🔒', LIGHTING: '💡',
            AIR_QUALITY: '🌬️', HUMIDITY: '💧', NOISE: '🔊',
        };
        return icons[type] || '📱';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="text-5xl">🏠</div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Smart Home Dashboard</h1>
                            <p className="text-white/70">Connected devices and automation</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8 -mt-8">
                {/* Score Cards */}
                <div className="grid grid-cols-5 gap-4 mb-8">
                    <div className="bg-white rounded-2xl shadow-md p-6 text-center col-span-1">
                        <div className="text-5xl font-bold text-cyan-600">{smartHomeData.overall}</div>
                        <div className="text-gray-500 text-sm mt-1">Overall Score</div>
                    </div>
                    {Object.entries(smartHomeData.categories).map(([cat, score]) => (
                        <div key={cat} className="bg-white rounded-2xl shadow-md p-4 text-center">
                            <div className="text-3xl mb-1">{getCategoryIcon(cat)}</div>
                            <div className="text-2xl font-bold text-gray-800">{score}</div>
                            <div className="text-gray-500 text-xs capitalize">{cat}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Devices */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold">Connected Devices</h2>
                                <span className="text-sm text-gray-500">
                                    {smartHomeData.devices.filter(d => d.status === 'ONLINE').length}/{smartHomeData.devices.length} online
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {smartHomeData.devices.map(device => (
                                    <div key={device.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer">
                                        <div className="text-3xl">{getDeviceIcon(device.type)}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-800 truncate">{device.name}</span>
                                                <div className={`w-2 h-2 rounded-full ${getStatusColor(device.status)}`} />
                                            </div>
                                            <div className="text-sm text-gray-500">{device.manufacturer}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold text-gray-800">{device.value}</div>
                                            <div className="text-xs text-gray-400">{device.status.toLowerCase()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Automations */}
                        <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
                            <h2 className="text-xl font-semibold mb-6">🤖 Automations</h2>
                            <div className="space-y-4">
                                {smartHomeData.automations.map((auto, i) => (
                                    <div key={i} className={`p-4 rounded-xl ${auto.active ? 'bg-cyan-50 border border-cyan-200' : 'bg-gray-50'}`}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-gray-800">{auto.name}</span>
                                                    {auto.vastuNote && (
                                                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">🪷 Vastu</span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-500">Trigger: {auto.trigger}</div>
                                                <div className="text-sm text-gray-400 mt-1">{auto.actions.join(' → ')}</div>
                                            </div>
                                            <div className={`w-12 h-6 rounded-full relative ${auto.active ? 'bg-cyan-500' : 'bg-gray-300'}`}>
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${auto.active ? 'right-1' : 'left-1'}`} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Controls */}
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-6">Quick Controls</h2>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="p-4 bg-cyan-50 hover:bg-cyan-100 rounded-xl text-center transition">
                                    <div className="text-2xl mb-1">🔒</div>
                                    <div className="text-sm font-medium">Lock All</div>
                                </button>
                                <button className="p-4 bg-red-50 hover:bg-red-100 rounded-xl text-center transition">
                                    <div className="text-2xl mb-1">💡</div>
                                    <div className="text-sm font-medium">All Off</div>
                                </button>
                                <button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl text-center transition">
                                    <div className="text-2xl mb-1">🏠</div>
                                    <div className="text-sm font-medium">Home Mode</div>
                                </button>
                                <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-center transition">
                                    <div className="text-2xl mb-1">🌙</div>
                                    <div className="text-sm font-medium">Night Mode</div>
                                </button>
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-6">💡 Recommendations</h2>
                            <div className="space-y-3">
                                {smartHomeData.recommendations.map((rec, i) => (
                                    <div key={i} className="flex gap-3 text-sm">
                                        <span className="text-cyan-500">•</span>
                                        <span className="text-gray-600">{rec}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Vastu Tips */}
                        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-md p-6 text-white">
                            <h2 className="text-xl font-semibold mb-4">🪷 Vastu Smart Home Tips</h2>
                            <ul className="space-y-2 text-sm text-white/90">
                                <li>• Place smart hub in the center (Brahmasthan)</li>
                                <li>• Security cameras should face away from NE</li>
                                <li>• Smart lighting warm in SW, cool in NE</li>
                                <li>• Avoid electronic devices in prayer room</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
