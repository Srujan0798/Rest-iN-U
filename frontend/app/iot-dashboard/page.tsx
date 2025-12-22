'use client';
import { useState } from 'react';
import { Radio, Wind, Droplets, Volume2, Zap, Thermometer, Home, Shield, Lightbulb } from 'lucide-react';

export default function IoTDashboardPage() {
    const [activeTab, setActiveTab] = useState(0);

    const sensorData = {
        airQuality: { aqi: 42, pm25: 8.5, co2: 520, humidity: 45, status: 'Good', color: 'green' },
        water: { tds: 150, ph: 7.2, chlorine: 0.3, status: 'Safe', color: 'green' },
        noise: { current: 38, average: 42, peak: 58, status: 'Quiet', color: 'green' },
        emf: { level: 0.15, status: 'Low', risk: 'Minimal', color: 'green' }
    };

    const smartDevices = [
        { category: 'Lighting', count: 12, brand: 'Philips Hue', status: 'connected' },
        { category: 'Climate', count: 3, brand: 'Nest', status: 'connected' },
        { category: 'Security', count: 8, brand: 'Ring', status: 'connected' },
        { category: 'Entertainment', count: 4, brand: 'Sonos', status: 'connected' },
        { category: 'Appliances', count: 5, brand: 'Samsung', status: 'connected' }
    ];

    const automations = [
        { name: 'Morning Routine', devices: 8, active: true, trigger: '6:30 AM' },
        { name: 'Away Mode', devices: 15, active: true, trigger: 'Location' },
        { name: 'Night Mode', devices: 12, active: true, trigger: '10:00 PM' },
        { name: 'Guest Mode', devices: 6, active: false, trigger: 'Manual' }
    ];

    const tabs = [
        { icon: Radio, label: 'Environmental Sensors' },
        { icon: Home, label: 'Smart Home' },
        { icon: Shield, label: 'Security' },
    ];

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <Radio className="w-12 h-12 text-blue-600" />
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">IoT & Smart Home Dashboard</h1>
                        <p className="text-gray-600">Real-time environmental monitoring and smart device control</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        6 Sensors Active
                    </span>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {tabs.map((tab, index) => (
                        <button
                            key={tab.label}
                            onClick={() => setActiveTab(index)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === index
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Environmental Sensors Tab */}
                {activeTab === 0 && (
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Air Quality */}
                        <div className="bg-white rounded-xl shadow-md p-5">
                            <div className="flex items-center gap-3 mb-4">
                                <Wind className="w-10 h-10 text-green-600" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Air Quality</h3>
                                    <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                        {sensorData.airQuality.status}
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">AQI</p>
                                    <p className="text-3xl font-bold text-green-600">{sensorData.airQuality.aqi}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">PM2.5</p>
                                    <p className="text-3xl font-bold text-gray-900">{sensorData.airQuality.pm25} µg/m³</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">CO2</p>
                                    <p className="text-xl font-semibold text-gray-900">{sensorData.airQuality.co2} ppm</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Humidity</p>
                                    <p className="text-xl font-semibold text-gray-900">{sensorData.airQuality.humidity}%</p>
                                </div>
                            </div>
                        </div>

                        {/* Water Quality */}
                        <div className="bg-white rounded-xl shadow-md p-5">
                            <div className="flex items-center gap-3 mb-4">
                                <Droplets className="w-10 h-10 text-blue-500" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Water Quality</h3>
                                    <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                        {sensorData.water.status}
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">TDS</p>
                                    <p className="text-xl font-semibold text-gray-900">{sensorData.water.tds} ppm</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">pH</p>
                                    <p className="text-xl font-semibold text-gray-900">{sensorData.water.ph}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Chlorine</p>
                                    <p className="text-xl font-semibold text-gray-900">{sensorData.water.chlorine} ppm</p>
                                </div>
                            </div>
                        </div>

                        {/* Noise Levels */}
                        <div className="bg-white rounded-xl shadow-md p-5">
                            <div className="flex items-center gap-3 mb-4">
                                <Volume2 className="w-10 h-10 text-yellow-500" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Noise Levels</h3>
                                    <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                        {sensorData.noise.status}
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Current</p>
                                    <p className="text-xl font-semibold text-gray-900">{sensorData.noise.current} dB</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Average</p>
                                    <p className="text-xl font-semibold text-gray-900">{sensorData.noise.average} dB</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Peak</p>
                                    <p className="text-xl font-semibold text-gray-900">{sensorData.noise.peak} dB</p>
                                </div>
                            </div>
                        </div>

                        {/* EMF Radiation */}
                        <div className="bg-white rounded-xl shadow-md p-5">
                            <div className="flex items-center gap-3 mb-4">
                                <Zap className="w-10 h-10 text-purple-500" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">EMF Radiation</h3>
                                    <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                        {sensorData.emf.status}
                                    </span>
                                </div>
                            </div>
                            <p className="text-4xl font-bold text-green-600">{sensorData.emf.level} mG</p>
                            <p className="text-gray-500 mt-1">Health Risk: {sensorData.emf.risk}</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Smart Home Tab */}
                {activeTab === 1 && (
                    <div className="grid md:grid-cols-3 gap-4">
                        {/* Connected Devices */}
                        <div className="md:col-span-2 bg-white rounded-xl shadow-md p-5">
                            <h3 className="font-semibold text-gray-900 mb-4">Connected Devices</h3>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {smartDevices.map(device => (
                                    <div key={device.category} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-gray-900">{device.category}</p>
                                            <p className="text-sm text-gray-500">{device.count} devices • {device.brand}</p>
                                        </div>
                                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                            {device.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Smart Home Score */}
                        <div className="bg-white rounded-xl shadow-md p-5 text-center">
                            <h3 className="font-semibold text-gray-900 mb-4">Smart Home Score</h3>
                            <p className="text-6xl font-bold text-blue-600">85</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                A-
                            </span>
                            <p className="text-gray-500 mt-4">32 devices connected</p>
                            <p className="text-xl font-semibold text-green-600 mt-2">$75/mo savings</p>
                        </div>

                        {/* Automations */}
                        <div className="md:col-span-3 bg-white rounded-xl shadow-md p-5">
                            <h3 className="font-semibold text-gray-900 mb-4">Automations</h3>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {automations.map(auto => (
                                    <div key={auto.name} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="font-semibold text-gray-900">{auto.name}</p>
                                            <div className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${auto.active ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'
                                                }`}>
                                                <div className="w-4 h-4 bg-white rounded-full shadow"></div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500">{auto.devices} devices</p>
                                        <p className="text-xs text-gray-400">Trigger: {auto.trigger}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Security Tab */}
                {activeTab === 2 && (
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Security Status */}
                        <div className="bg-white rounded-xl shadow-md p-5">
                            <h3 className="font-semibold text-gray-900 mb-4">Security Status</h3>
                            <div className="flex items-center gap-4 my-6">
                                <Shield className="w-16 h-16 text-green-600" />
                                <div>
                                    <p className="text-3xl font-bold text-green-600">Armed</p>
                                    <p className="text-gray-500">All sensors active</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-gray-700">
                                <p>Cameras: 4</p>
                                <p>Door Locks: 3</p>
                                <p>Motion Sensors: 6</p>
                                <p>Video Doorbells: 2</p>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl shadow-md p-5">
                            <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                            {[
                                { time: '2 mins ago', event: 'Motion detected at front door', type: 'info' },
                                { time: '1 hour ago', event: 'Front door unlocked', type: 'success' },
                                { time: '3 hours ago', event: 'Garage door closed', type: 'success' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                                    <span className="px-2 py-1 border border-gray-300 rounded-full text-xs text-gray-600">
                                        {item.time}
                                    </span>
                                    <p className="text-sm text-gray-700">{item.event}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
