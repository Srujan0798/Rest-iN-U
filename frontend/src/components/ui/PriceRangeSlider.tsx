"use client";

import { useState, useCallback } from "react";
import { Minus, Plus, DollarSign } from "lucide-react";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  className?: string;
  format?: "INR" | "USD";
}

export function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
  className = "",
  format = "INR",
}: PriceRangeSliderProps) {
  const [minValue, maxValue] = value;
  const [isDragging, setIsDragging] = useState<"min" | "null">("null");

  const formatPrice = (price: number) => {
    if (format === "INR") {
      if (price >= 10000000) {
        return `₹${(price / 10000000).toFixed(1)}Cr`;
      } else if (price >= 100000) {
        return `₹${(price / 100000).toFixed(1)}L`;
      } else {
        return `₹${price.toLocaleString("en-IN")}`;
      }
    } else {
      if (price >= 1000000) {
        return `$${(price / 1000000).toFixed(1)}M`;
      } else if (price >= 1000) {
        return `$${(price / 1000).toFixed(0)}K`;
      } else {
        return `$${price.toLocaleString()}`;
      }
    }
  };

  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const handleMinChange = useCallback(
    (newValue: number) => {
      const clampedValue = Math.min(
        Math.max(min, newValue),
        maxValue - (max - min) * 0.05,
      );
      onChange([clampedValue, maxValue]);
    },
    [min, maxValue, onChange],
  );

  const handleMaxChange = useCallback(
    (newValue: number) => {
      const clampedValue = Math.max(
        max,
        Math.min(max, newValue, minValue + (max - min) * 0.05),
      );
      onChange([minValue, clampedValue]);
    },
    [max, minValue, onChange],
  );

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value.replace(/[^0-9]/g, ""));
    if (!isNaN(value)) {
      handleMinChange(value);
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value.replace(/[^0-9]/g, ""));
    if (!isNaN(value)) {
      handleMaxChange(value);
    }
  };

  const incrementMin = () => {
    handleMinChange(minValue + 100000);
  };

  const decrementMin = () => {
    handleMinChange(minValue - 100000);
  };

  const incrementMax = () => {
    handleMaxChange(maxValue + 100000);
  };

  const decrementMax = () => {
    handleMaxChange(maxValue - 100000);
  };

  const minPercentage = getPercentage(minValue);
  const maxPercentage = getPercentage(maxValue);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">Price Range</label>
        <span className="text-sm text-gray-500">
          {formatPrice(minValue)} - {formatPrice(maxValue)}
        </span>
      </div>

      {/* Dual Slider */}
      <div className="relative">
        {/* Track */}
        <div className="relative h-2 bg-gray-200 rounded-full">
          {/* Range */}
          <div
            className="absolute h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
            style={{
              left: `${minPercentage}%`,
              right: `${100 - maxPercentage}%`,
            }}
          />
        </div>

        {/* Min Handle */}
        <div
          className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border-2 border-blue-600 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform"
          style={{ left: `calc(${minPercentage}% - 12px)` }}
          onMouseDown={() => setIsDragging("min")}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full" />
          </div>
        </div>

        {/* Max Handle */}
        <div
          className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border-2 border-blue-600 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform"
          style={{ left: `calc(${maxPercentage}% - 12px)` }}
          onMouseDown={() => setIsDragging("max")}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full" />
          </div>
        </div>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-2 gap-4">
        {/* Min Price */}
        <div>
          <label className="block text-xs text-gray-600 mb-1">Min Price</label>
          <div className="flex items-center">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <DollarSign className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={formatPrice(minValue)}
                onChange={handleMinInputChange}
                className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex flex-col">
                <button
                  onClick={incrementMin}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  disabled={minValue >= maxValue - 100000}
                >
                  <Plus className="w-3 h-3 text-gray-500" />
                </button>
                <button
                  onClick={decrementMin}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  disabled={minValue <= min}
                >
                  <Minus className="w-3 h-3 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-xs text-gray-600 mb-1">Max Price</label>
          <div className="flex items-center">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <DollarSign className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={formatPrice(maxValue)}
                onChange={handleMaxInputChange}
                className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex flex-col">
                <button
                  onClick={incrementMax}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  disabled={maxValue >= max}
                >
                  <Plus className="w-3 h-3 text-gray-500" />
                </button>
                <button
                  onClick={decrementMax}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  disabled={maxValue <= minValue + 100000}
                >
                  <Minus className="w-3 h-3 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div>
        <label className="block text-xs text-gray-600 mb-2">Quick Ranges</label>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Under ₹50L", min: min, max: 5000000 },
            { label: "₹50L - ₹1Cr", min: 5000000, max: 10000000 },
            { label: "₹1Cr - ₹2Cr", min: 10000000, max: 20000000 },
            { label: "₹2Cr - ₹5Cr", min: 20000000, max: 50000000 },
            { label: "Above ₹5Cr", min: 50000000, max: max },
          ].map((preset, index) => (
            <button
              key={index}
              onClick={() => onChange([preset.min, preset.max])}
              className="px-3 py-1 text-xs border border-gray-300 rounded-full hover:bg-blue-50 hover:border-blue-500 hover:text-blue-700 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
