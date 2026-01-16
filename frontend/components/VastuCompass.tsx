'use client';

import React from 'react';
import { Compass } from 'lucide-react';

interface VastuCompassProps {
  direction?: number; // 0-360 degrees
  score?: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function VastuCompass({
  direction = 0,
  score,
  size = 'md',
  className = ''
}: VastuCompassProps) {
  const sizes = {
    sm: 'w-24 h-24',
    md: 'w-48 h-48',
    lg: 'w-64 h-64'
  };

  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-green-500';
    if (s >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className={`relative flex flex-col items-center justify-center ${sizes[size]} ${className}`}>
      <div className="relative w-full h-full flex items-center justify-center border-4 border-gray-200 rounded-full bg-white shadow-inner">
        {/* Cardinal Directions */}
        <div className="absolute top-2 text-xs font-bold text-gray-400">N</div>
        <div className="absolute bottom-2 text-xs font-bold text-gray-400">S</div>
        <div className="absolute left-2 text-xs font-bold text-gray-400">W</div>
        <div className="absolute right-2 text-xs font-bold text-gray-400">E</div>

        {/* Needle */}
        <div
          className="absolute w-full h-full flex items-center justify-center transition-transform duration-1000 ease-out"
          style={{ transform: `rotate(${direction}deg)` }}
        >
          <div className="w-1 h-1/2 bg-gradient-to-t from-transparent to-red-500 origin-bottom mb-[50%]" />
          <div className="w-1 h-1/2 bg-gradient-to-b from-transparent to-gray-400 origin-top mt-[50%]" />
          <div className="absolute w-3 h-3 bg-white border-2 border-gray-400 rounded-full" />
        </div>

        {/* Center Icon */}
        <Compass className="absolute w-1/4 h-1/4 text-gray-300 opacity-20" />
      </div>

      {score !== undefined && (
        <div className="absolute -bottom-8 flex flex-col items-center">
          <span className={`text-xl font-bold ${getScoreColor(score)}`}>
            {score}/100
          </span>
          <span className="text-xs text-gray-500">Vastu Score</span>
        </div>
      )}
    </div>
  );
}
