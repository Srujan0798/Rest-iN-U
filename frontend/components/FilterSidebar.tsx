'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterSidebarProps {
    filters: any;
    onFilterChange: (filters: any) => void;
}

const propertyTypes = ['HOUSE', 'CONDO', 'TOWNHOUSE', 'APARTMENT', 'LAND', 'MULTI_FAMILY'];

export default function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
    const [priceRange, setPriceRange] = useState([filters.minPrice || 0, filters.maxPrice || 2000000]);
    const [openSections, setOpenSections] = useState({ price: true, beds: true, baths: false, type: false });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handlePriceChange = (index: number, value: number) => {
        const newRange = [...priceRange];
        newRange[index] = value;
        setPriceRange(newRange);
        onFilterChange({ ...filters, minPrice: newRange[0], maxPrice: newRange[1] });
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>

            {/* Price Range */}
            <div className="border-b border-gray-200">
                <button
                    onClick={() => toggleSection('price')}
                    className="w-full py-3 flex items-center justify-between text-left"
                >
                    <span className="font-medium text-gray-900">Price Range</span>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openSections.price ? 'rotate-180' : ''}`} />
                </button>
                {openSections.price && (
                    <div className="pb-4 px-1">
                        <input
                            type="range"
                            value={priceRange[0]}
                            onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                            min={0}
                            max={2000000}
                            step={50000}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-2"
                        />
                        <input
                            type="range"
                            value={priceRange[1]}
                            onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                            min={0}
                            max={2000000}
                            step={50000}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between mt-2 text-sm text-gray-600">
                            <span>${(priceRange[0] / 1000).toFixed(0)}K</span>
                            <span>${(priceRange[1] / 1000).toFixed(0)}K</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Bedrooms */}
            <div className="border-b border-gray-200">
                <button
                    onClick={() => toggleSection('beds')}
                    className="w-full py-3 flex items-center justify-between text-left"
                >
                    <span className="font-medium text-gray-900">Bedrooms</span>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openSections.beds ? 'rotate-180' : ''}`} />
                </button>
                {openSections.beds && (
                    <div className="pb-4 flex flex-wrap gap-2">
                        {['Any', '1+', '2+', '3+', '4+', '5+'].map((b, i) => (
                            <button
                                key={b}
                                onClick={() => onFilterChange({ ...filters, minBedrooms: i === 0 ? undefined : i })}
                                className={`px-3 py-1 rounded-full text-sm border transition-colors ${filters.minBedrooms === i
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {b}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Bathrooms */}
            <div className="border-b border-gray-200">
                <button
                    onClick={() => toggleSection('baths')}
                    className="w-full py-3 flex items-center justify-between text-left"
                >
                    <span className="font-medium text-gray-900">Bathrooms</span>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openSections.baths ? 'rotate-180' : ''}`} />
                </button>
                {openSections.baths && (
                    <div className="pb-4 flex flex-wrap gap-2">
                        {['Any', '1+', '2+', '3+', '4+'].map((b, i) => (
                            <button
                                key={b}
                                onClick={() => onFilterChange({ ...filters, minBathrooms: i === 0 ? undefined : i })}
                                className={`px-3 py-1 rounded-full text-sm border transition-colors ${filters.minBathrooms === i
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {b}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Property Type */}
            <div className="border-b border-gray-200">
                <button
                    onClick={() => toggleSection('type')}
                    className="w-full py-3 flex items-center justify-between text-left"
                >
                    <span className="font-medium text-gray-900">Property Type</span>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openSections.type ? 'rotate-180' : ''}`} />
                </button>
                {openSections.type && (
                    <div className="pb-4 flex flex-wrap gap-2">
                        {propertyTypes.map((type) => (
                            <button
                                key={type}
                                onClick={() => onFilterChange({ ...filters, propertyType: filters.propertyType === type ? undefined : type })}
                                className={`px-3 py-1 rounded-full text-xs border transition-colors ${filters.propertyType === type
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                {type.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <button
                onClick={() => onFilterChange({})}
                className="w-full mt-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
                Clear All Filters
            </button>
        </div>
    );
}
