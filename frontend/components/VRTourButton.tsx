'use client';

import React, { useState } from 'react';
import { Eye, Play, Pause, Maximize2, RotateCcw, Smartphone, VolumeX, Volume2 } from 'lucide-react';

interface VRTourButtonProps {
    tourUrl?: string;
    propertyId: string;
    propertyTitle: string;
    thumbnailUrl?: string;
}

export default function VRTourButton({ tourUrl, propertyId, propertyTitle, thumbnailUrl }: VRTourButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);

    const handleOpen = () => {
        if (tourUrl) {
            setIsOpen(true);
        } else {
            // Demo mode - show placeholder
            setIsOpen(true);
        }
    };

    return (
        <>
            {/* VR Tour Button */}
            <button
                onClick={handleOpen}
                className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl text-white font-medium shadow-lg shadow-purple-500/30 transition-all"
            >
                <Eye className="w-4 h-4" />
                <span>VR Tour</span>
                <span className="text-xs px-1.5 py-0.5 bg-white/20 rounded text-white/90">360°</span>
            </button>

            {/* VR Viewer Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black">
                    {/* Header */}
                    <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-white font-semibold">{propertyTitle}</h2>
                            <p className="text-gray-400 text-sm">Virtual Reality Tour</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white">
                            Exit Tour
                        </button>
                    </div>

                    {/* VR Content Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        {thumbnailUrl ? (
                            <img src={thumbnailUrl} alt="VR Tour" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center">
                                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                                    <Eye className="w-12 h-12 text-purple-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">VR Tour Coming Soon</h3>
                                <p className="text-gray-400 max-w-md">
                                    Immersive 360° virtual reality tours will be available for this property.
                                    Explore every room in stunning detail.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <div className="flex items-center justify-center gap-4">
                            <button onClick={() => setIsPlaying(!isPlaying)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full">
                                {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
                            </button>
                            <button className="p-3 bg-white/10 hover:bg-white/20 rounded-full">
                                <RotateCcw className="w-5 h-5 text-white" />
                            </button>
                            <button onClick={() => setIsMuted(!isMuted)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full">
                                {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
                            </button>
                            <button className="p-3 bg-white/10 hover:bg-white/20 rounded-full">
                                <Maximize2 className="w-5 h-5 text-white" />
                            </button>
                            <button className="p-3 bg-white/10 hover:bg-white/20 rounded-full">
                                <Smartphone className="w-5 h-5 text-white" />
                            </button>
                        </div>
                        <p className="text-center text-gray-500 text-xs mt-2">
                            Use mouse to look around • Scroll to zoom • VR headset supported
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}

