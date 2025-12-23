'use client';

import React from 'react';

// Vastu Direction Grid Visualization
interface VastuGridProps {
    scores: {
        north: number;
        south: number;
        east: number;
        west: number;
        northeast: number;
        northwest: number;
        southeast: number;
        southwest: number;
        center: number;
    };
    size?: 'sm' | 'md' | 'lg';
}

export function VastuGrid({ scores, size = 'md' }: VastuGridProps) {
    const sizes = { sm: 'w-48', md: 'w-64', lg: 'w-80' };

    const getColor = (score: number) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const directions = [
        { key: 'northwest', label: 'NW', score: scores.northwest },
        { key: 'north', label: 'N', score: scores.north },
        { key: 'northeast', label: 'NE', score: scores.northeast },
        { key: 'west', label: 'W', score: scores.west },
        { key: 'center', label: '🪷', score: scores.center },
        { key: 'east', label: 'E', score: scores.east },
        { key: 'southwest', label: 'SW', score: scores.southwest },
        { key: 'south', label: 'S', score: scores.south },
        { key: 'southeast', label: 'SE', score: scores.southeast },
    ];

    return (
        <div className={`${sizes[size]} aspect-square grid grid-cols-3 gap-1 p-2 bg-amber-100 rounded-lg`}>
            {directions.map(({ key, label, score }) => (
                <div
                    key={key}
                    className={`${getColor(score)} rounded flex flex-col items-center justify-center text-white transition hover:scale-105`}
                    title={`${label}: ${score}%`}
                >
                    <span className="text-xs font-bold">{label}</span>
                    <span className="text-xs">{score}</span>
                </div>
            ))}
        </div>
    );
}

// Climate Risk Radar Chart
interface ClimateRadarProps {
    data: {
        flood: number;
        wildfire: number;
        hurricane: number;
        earthquake: number;
        drought: number;
        heat: number;
    };
}

export function ClimateRadar({ data }: ClimateRadarProps) {
    const risks = [
        { key: 'flood', label: '🌊 Flood', value: data.flood },
        { key: 'wildfire', label: '🔥 Fire', value: data.wildfire },
        { key: 'hurricane', label: '🌀 Storm', value: data.hurricane },
        { key: 'earthquake', label: '🌍 Seismic', value: data.earthquake },
        { key: 'drought', label: '☀️ Drought', value: data.drought },
        { key: 'heat', label: '🌡️ Heat', value: data.heat },
    ];

    return (
        <div className="space-y-3">
            {risks.map(risk => (
                <div key={risk.key} className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span>{risk.label}</span>
                        <span className={risk.value > 60 ? 'text-red-600' : risk.value > 30 ? 'text-yellow-600' : 'text-green-600'}>
                            {risk.value}%
                        </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all ${risk.value > 60 ? 'bg-red-500' : risk.value > 30 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${risk.value}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

// Price History Chart
interface PriceHistoryProps {
    data: { date: string; price: number }[];
}

export function PriceHistory({ data }: PriceHistoryProps) {
    if (!data.length) return null;

    const maxPrice = Math.max(...data.map(d => d.price));
    const minPrice = Math.min(...data.map(d => d.price));
    const range = maxPrice - minPrice || 1;

    return (
        <div className="h-40 flex items-end gap-1">
            {data.map((point, i) => {
                const height = ((point.price - minPrice) / range) * 100 + 10;
                return (
                    <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-amber-500 to-orange-400 rounded-t transition hover:from-amber-600 hover:to-orange-500"
                        style={{ height: `${height}%` }}
                        title={`${point.date}: $${(point.price / 1000).toFixed(0)}K`}
                    />
                );
            })}
        </div>
    );
}

// Energy Gauge
interface EnergyGaugeProps {
    score: number;
    grade: string;
}

export function EnergyGauge({ score, grade }: EnergyGaugeProps) {
    const rotation = (score / 100) * 180 - 90;

    return (
        <div className="relative w-48 h-24 mx-auto">
            {/* Background arc */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="w-48 h-48 rounded-full border-[16px] border-gray-200"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }} />
            </div>

            {/* Colored sections */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="w-48 h-48 rounded-full"
                    style={{
                        background: 'conic-gradient(from 180deg, #ef4444 0deg, #eab308 90deg, #22c55e 180deg, transparent 180deg)',
                        clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)',
                    }} />
            </div>

            {/* Needle */}
            <div className="absolute bottom-0 left-1/2 w-1 h-20 bg-gray-800 origin-bottom rounded-full"
                style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }} />

            {/* Center circle */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center">
                <span className="text-xs font-bold">{grade}</span>
            </div>

            {/* Score label */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-center">
                <div className="text-2xl font-bold text-gray-900">{score}</div>
                <div className="text-xs text-gray-500">Energy Score</div>
            </div>
        </div>
    );
}

// Donut Chart
interface DonutChartProps {
    value: number;
    max?: number;
    label: string;
    color?: 'amber' | 'green' | 'red' | 'blue';
    size?: 'sm' | 'md';
}

export function DonutChart({ value, max = 100, label, color = 'amber', size = 'md' }: DonutChartProps) {
    const percentage = Math.min(100, (value / max) * 100);
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const colors = {
        amber: 'stroke-amber-500',
        green: 'stroke-green-500',
        red: 'stroke-red-500',
        blue: 'stroke-blue-500',
    };

    const sizes = { sm: 'w-24 h-24', md: 'w-32 h-32' };

    return (
        <div className={`relative ${sizes[size]}`}>
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <circle
                    cx="50" cy="50" r="45"
                    fill="none"
                    className={colors[color]}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{value}</span>
                <span className="text-xs text-gray-500">{label}</span>
            </div>
        </div>
    );
}

// Activity Timeline
interface TimelineItem {
    icon: string;
    title: string;
    description?: string;
    time: string;
}

interface TimelineProps {
    items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
    return (
        <div className="space-y-4">
            {items.map((item, i) => (
                <div key={i} className="flex gap-4">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-xl">
                            {item.icon}
                        </div>
                        {i < items.length - 1 && (
                            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-full bg-gray-200" />
                        )}
                    </div>
                    <div className="flex-1 pb-4">
                        <div className="flex justify-between items-start">
                            <h4 className="font-medium text-gray-900">{item.title}</h4>
                            <span className="text-xs text-gray-400">{item.time}</span>
                        </div>
                        {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
                    </div>
                </div>
            ))}
        </div>
    );
}

