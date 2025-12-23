'use client';

import React, { useState } from 'react';
import { Ruler, Camera, Move3D, Smartphone, X, Target } from 'lucide-react';

interface ARMeasurementProps {
    propertyId: string;
    rooms?: { name: string; dimensions?: string }[];
}

export default function ARMeasurement({ propertyId, rooms = [] }: ARMeasurementProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeMode, setActiveMode] = useState<'measure' | 'visualize' | 'furniture'>('measure');

    const modes = [
        { id: 'measure', icon: Ruler, label: 'Measure' },
        { id: 'visualize', icon: Move3D, label: '3D View' },
        { id: 'furniture', icon: Target, label: 'Furniture' },
    ] as const;

    return (
        <>
            {/* AR Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 rounded-xl text-white font-medium shadow-lg shadow-cyan-500/30 transition-all"
            >
                <Ruler className="w-4 h-4" />
                <span>AR Measure</span>
                <span className="text-xs px-1.5 py-0.5 bg-white/20 rounded text-white/90">Beta</span>
            </button>

            {/* AR Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-800">
                        <div>
                            <h2 className="text-white font-semibold">AR Measurement</h2>
                            <p className="text-gray-400 text-sm">Point your camera at the room</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-800 rounded-lg">
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Mode Selector */}
                    <div className="flex justify-center gap-2 p-4">
                        {modes.map(mode => (
                            <button
                                key={mode.id}
                                onClick={() => setActiveMode(mode.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeMode === mode.id
                                        ? 'bg-cyan-600 text-white'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                    }`}
                            >
                                <mode.icon className="w-4 h-4" />
                                <span className="text-sm">{mode.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* AR Viewport Placeholder */}
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center px-8">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                <Camera className="w-10 h-10 text-cyan-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">AR Feature Coming Soon</h3>
                            <p className="text-gray-400 text-sm max-w-sm mb-4">
                                Use your smartphone camera to measure rooms, visualize furniture placement,
                                and explore the property in augmented reality.
                            </p>
                            <div className="flex items-center justify-center gap-2 text-cyan-400">
                                <Smartphone className="w-4 h-4" />
                                <span className="text-sm">Best experienced on mobile</span>
                            </div>
                        </div>
                    </div>

                    {/* Room Dimensions */}
                    {rooms.length > 0 && (
                        <div className="p-4 border-t border-gray-800">
                            <h4 className="text-sm font-medium text-gray-400 mb-2">Room Dimensions</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {rooms.map((room, idx) => (
                                    <div key={idx} className="p-3 bg-gray-800 rounded-lg">
                                        <p className="text-white text-sm font-medium">{room.name}</p>
                                        <p className="text-gray-400 text-xs">{room.dimensions || 'Tap to measure'}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="p-4 bg-gray-900/50">
                        <p className="text-center text-gray-500 text-xs">
                            Move your device slowly • Keep camera steady • Good lighting recommended
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}

