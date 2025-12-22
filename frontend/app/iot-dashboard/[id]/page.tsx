'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '../../../lib/api';

export default function IoTDashboardPage() {
    const params = useParams();
    const propertyId = params?.id as string;

    const [dashboard, setDashboard] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!propertyId) return;

        fetch(`http://localhost:4000/api/v1/iot/dashboard/${propertyId}`)
            .then(res => res.json())
            .then(data => {
                setDashboard(data.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [propertyId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    const getComfortColor = (index: number) => {
        if (index >= 80) return 'text-green-600';
        if (index >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getGradeColor = (grade: string) => {
        if (grade.startsWith('A')) return 'bg-green-500';
        if (grade === 'B') return 'bg-emerald-500';
        if (grade === 'C') return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-2">
                        <Link href={`/property/${propertyId}`} className="text-white/70 hover:text-white">
                            ← Back to Property
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <span className="text-4xl">📡</span> IoT Smart Home Dashboard
                    </h1>
                    <p className="text-white/70 mt-1">Real-time environmental monitoring</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {!dashboard?.sensors?.total ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📡</div>
                        <h2 className="text-2xl font-bold mb-2">No IoT Sensors Configured</h2>
                        <p className="text-gray-400 mb-6">This property doesn't have IoT sensors installed yet.</p>
                        <div className="bg-gray-800 rounded-xl p-6 max-w-md mx-auto">
                            <h3 className="font-semibold mb-3">Benefits of IoT Monitoring:</h3>
                            <ul className="text-left text-gray-400 space-y-2">
                                <li>✓ Real-time temperature & humidity tracking</li>
                                <li>✓ Air quality monitoring (AQI, CO2)</li>
                                <li>✓ Energy usage optimization</li>
                                <li>✓ Automated alerts for issues</li>
                                <li>✓ Solar generation tracking</li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Sensors Overview */}
                        <div className="bg-gray-800 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-300">Sensors</h3>
                                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-sm">
                                    {dashboard.sensors.online}/{dashboard.sensors.total} Online
                                </span>
                            </div>
                            <div className="space-y-3">
                                {dashboard.sensors.list?.map((sensor: any) => (
                                    <div key={sensor.id} className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">{sensor.sensorType}</span>
                                        <span className={`w-2 h-2 rounded-full ${sensor.status === 'ONLINE' ? 'bg-green-500' : 'bg-red-500'
                                            }`} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Environmental Data */}
                        {dashboard.environmental && (
                            <>
                                <div className="bg-gray-800 rounded-xl p-6">
                                    <div className="text-gray-400 text-sm mb-2">🌡️ Temperature</div>
                                    <div className="text-4xl font-bold">{dashboard.environmental.temperature}°F</div>
                                    <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 via-green-500 to-red-500"
                                            style={{ width: `${Math.min(100, (dashboard.environmental.temperature / 100) * 100)}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="bg-gray-800 rounded-xl p-6">
                                    <div className="text-gray-400 text-sm mb-2">💧 Humidity</div>
                                    <div className="text-4xl font-bold">{dashboard.environmental.humidity}%</div>
                                    <div className="text-sm text-gray-500 mt-2">
                                        {dashboard.environmental.humidity < 40 ? 'Too Dry' :
                                            dashboard.environmental.humidity > 60 ? 'Too Humid' : 'Optimal'}
                                    </div>
                                </div>

                                <div className="bg-gray-800 rounded-xl p-6">
                                    <div className="text-gray-400 text-sm mb-2">🌬️ Air Quality</div>
                                    <div className="text-4xl font-bold">{dashboard.environmental.airQuality}</div>
                                    <div className="text-sm text-gray-500 mt-2">
                                        {dashboard.environmental.airQuality < 50 ? 'Good' :
                                            dashboard.environmental.airQuality < 100 ? 'Moderate' : 'Unhealthy'}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Comfort Index */}
                        {dashboard.environmental?.comfortIndex !== undefined && (
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 col-span-full md:col-span-2 lg:col-span-1">
                                <div className="text-gray-400 text-sm mb-2">😊 Comfort Index</div>
                                <div className={`text-5xl font-bold ${getComfortColor(dashboard.environmental.comfortIndex)}`}>
                                    {dashboard.environmental.comfortIndex}
                                </div>
                                <div className="text-lg text-gray-400 mt-1">
                                    {dashboard.environmental.comfortIndex >= 80 ? 'Excellent' :
                                        dashboard.environmental.comfortIndex >= 60 ? 'Good' :
                                            dashboard.environmental.comfortIndex >= 40 ? 'Fair' : 'Poor'}
                                </div>
                            </div>
                        )}

                        {/* Energy Score */}
                        {dashboard.energy && (
                            <div className="bg-gray-800 rounded-xl p-6 col-span-full md:col-span-2">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="font-semibold text-lg">⚡ Energy Efficiency</h3>
                                        <p className="text-gray-500 text-sm">30-day analysis</p>
                                    </div>
                                    <div className={`w-16 h-16 rounded-full ${getGradeColor(dashboard.energy.grade)} flex items-center justify-center text-2xl font-bold`}>
                                        {dashboard.energy.grade}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    {dashboard.energy.metrics && (
                                        <>
                                            <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                                                <div className="text-2xl font-bold text-yellow-400">
                                                    {dashboard.energy.metrics.powerUsageKwh?.toLocaleString() || 0}
                                                </div>
                                                <div className="text-xs text-gray-400">kWh Used</div>
                                            </div>
                                            <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                                                <div className="text-2xl font-bold text-green-400">
                                                    {dashboard.energy.metrics.solarGenerationKwh?.toLocaleString() || 0}
                                                </div>
                                                <div className="text-xs text-gray-400">kWh Solar</div>
                                            </div>
                                            <div className="bg-gray-700/50 rounded-lg p-3 text-center">
                                                <div className="text-2xl font-bold text-blue-400">
                                                    {dashboard.energy.metrics.renewableRatio || 0}%
                                                </div>
                                                <div className="text-xs text-gray-400">Renewable</div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {dashboard.energy.recommendations?.length > 0 && (
                                    <div className="mt-4 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                        <div className="text-emerald-400 text-sm font-medium mb-2">💡 Recommendations</div>
                                        <ul className="text-sm text-gray-400 space-y-1">
                                            {dashboard.energy.recommendations.map((r: string, i: number) => (
                                                <li key={i}>• {r}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Recent Activity */}
                        {dashboard.recentActivity?.length > 0 && (
                            <div className="bg-gray-800 rounded-xl p-6 col-span-full lg:col-span-2">
                                <h3 className="font-semibold mb-4">📊 Recent Activity</h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {dashboard.recentActivity.map((activity: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-gray-700 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <span className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center text-xs">
                                                    {activity.type === 'TEMPERATURE' ? '🌡️' :
                                                        activity.type === 'HUMIDITY' ? '💧' :
                                                            activity.type === 'AIR_QUALITY' ? '🌬️' :
                                                                activity.type === 'POWER' ? '⚡' : '📡'}
                                                </span>
                                                <span className="text-gray-300">{activity.type}</span>
                                            </div>
                                            <span className="font-mono">{activity.value} {activity.unit}</span>
                                            <span className="text-gray-500 text-xs">
                                                {new Date(activity.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
