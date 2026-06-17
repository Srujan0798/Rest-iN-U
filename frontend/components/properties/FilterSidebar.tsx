import React from 'react';
import { Sliders, Check } from 'lucide-react';
import { Button, Input, Card } from '../ui';

interface FilterState {
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  minBathrooms?: number;
  propertyType?: string[];
  minVastuScore?: number;
  city?: string;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
  className?: string;
}

const PROPERTY_TYPES = [
  'HOUSE', 'CONDO', 'TOWNHOUSE', 'APARTMENT', 'LAND',
  'MULTI_FAMILY', 'COMMERCIAL', 'VILLA', 'PENTHOUSE',
  'FARMHOUSE', 'ASHRAM', 'PLOT'
];

export function FilterSidebar({ filters, onFilterChange, onReset, className = '' }: FilterSidebarProps) {

  const handleInputChange = (key: keyof FilterState, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value === '' ? undefined : value
    });
  };

  const togglePropertyType = (type: string) => {
    const currentTypes = filters.propertyType || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];

    onFilterChange({
      ...filters,
      propertyType: newTypes.length > 0 ? newTypes : undefined
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Sliders size={20} />
          Filters
        </h3>
        <button
          onClick={onReset}
          className="text-sm text-amber-600 hover:text-amber-700 font-medium"
        >
          Reset All
        </button>
      </div>

      {/* Location */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Location</label>
        <Input
          placeholder="City (e.g. Austin)"
          value={filters.city || ''}
          onChange={(e) => handleInputChange('city', e.target.value)}
        />
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Price Range</label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Min"
            type="number"
            value={filters.minPrice || ''}
            onChange={(e) => handleInputChange('minPrice', Number(e.target.value))}
          />
          <Input
            placeholder="Max"
            type="number"
            value={filters.maxPrice || ''}
            onChange={(e) => handleInputChange('maxPrice', Number(e.target.value))}
          />
        </div>
      </div>

      {/* Beds & Baths */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Beds & Baths</label>
        <div className="grid grid-cols-2 gap-2">
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            value={filters.minBedrooms || ''}
            onChange={(e) => handleInputChange('minBedrooms', e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">Any Beds</option>
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num}+ Beds</option>
            ))}
          </select>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            value={filters.minBathrooms || ''}
            onChange={(e) => handleInputChange('minBathrooms', e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">Any Baths</option>
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num}+ Baths</option>
            ))}
          </select>
        </div>
      </div>

      {/* Vastu Score */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 flex justify-between">
          <span>Min Vastu Score</span>
          <span className="text-amber-600 font-bold">{filters.minVastuScore || 0}</span>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="10"
          value={filters.minVastuScore || 0}
          onChange={(e) => handleInputChange('minVastuScore', Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>

      {/* Property Type */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Property Type</label>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {PROPERTY_TYPES.map(type => {
            const isSelected = filters.propertyType?.includes(type);
            return (
              <label key={type} className="flex items-center gap-2 cursor-pointer group">
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-amber-500 border-amber-500 text-white' : 'border-gray-300 bg-white group-hover:border-amber-400'
                  }`}
                >
                  {isSelected && <Check size={14} strokeWidth={3} />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={isSelected}
                  onChange={() => togglePropertyType(type)}
                />
                <span className="text-sm text-gray-600 capitalize">
                  {type.toLowerCase().replace('_', ' ')}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <Button className="w-full mt-6" onClick={() => {}}>
        Apply Filters
      </Button>
    </div>
  );
}
