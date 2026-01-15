'use client';

import { useState } from 'react';
import { Search, MapPin, Home, IndianRupee, ChevronDown } from 'lucide-react';

export interface SearchFilters {
    city: string;
    minPrice?: number;
    maxPrice?: number;
    propertyType?: string;
    bedrooms?: number;
    bathrooms?: number;
    minVastuScore?: number;
}

interface SearchFormProps {
    onSearch: (filters: SearchFilters) => void;
    initialFilters?: Partial<SearchFilters>;
    loading?: boolean;
}

const CITIES = [
    'Bangalore',
    'Mumbai',
    'Delhi',
    'Chennai',
    'Hyderabad',
    'Pune',
    'Kolkata',
    'Ahmedabad',
    'Jaipur',
    'Gurgaon',
];

const PROPERTY_TYPES = [
    { value: '', label: 'All Types' },
    { value: 'HOUSE', label: 'House' },
    { value: 'CONDO', label: 'Condo' },
    { value: 'APARTMENT', label: 'Apartment' },
    { value: 'VILLA', label: 'Villa' },
    { value: 'TOWNHOUSE', label: 'Townhouse' },
    { value: 'LAND', label: 'Land' },
];

const PRICE_RANGES = [
    { value: '', label: 'Any', min: undefined, max: undefined },
    { value: '0-50L', label: 'Under 50L', min: 0, max: 5000000 },
    { value: '50L-1Cr', label: '50L - 1Cr', min: 5000000, max: 10000000 },
    { value: '1Cr-2Cr', label: '1Cr - 2Cr', min: 10000000, max: 20000000 },
    { value: '2Cr-5Cr', label: '2Cr - 5Cr', min: 20000000, max: 50000000 },
    { value: '5Cr+', label: 'Above 5Cr', min: 50000000, max: undefined },
];

export default function SearchForm({ onSearch, initialFilters, loading }: SearchFormProps) {
    const [filters, setFilters] = useState<SearchFilters>({
        city: initialFilters?.city || '',
        propertyType: initialFilters?.propertyType || '',
        minPrice: initialFilters?.minPrice,
        maxPrice: initialFilters?.maxPrice,
        bedrooms: initialFilters?.bedrooms,
        bathrooms: initialFilters?.bathrooms,
        minVastuScore: initialFilters?.minVastuScore,
    });

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [priceRange, setPriceRange] = useState('');

    const handlePriceChange = (value: string) => {
        setPriceRange(value);
        const selected = PRICE_RANGES.find(p => p.value === value);
        if (selected) {
            setFilters(prev => ({
                ...prev,
                minPrice: selected.min,
                maxPrice: selected.max,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(filters);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            {/* Main Search Bar */}
            <div className="bg-white rounded-2xl shadow-xl p-2 md:p-3">
                <div className="flex flex-col md:flex-row gap-2 md:gap-0 md:items-center">
                    {/* City Input */}
                    <div className="flex-1 flex items-center gap-2 px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200">
                        <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <select
                            value={filters.city}
                            onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                            className="w-full bg-transparent text-gray-800 outline-none cursor-pointer"
                            aria-label="Select city"
                        >
                            <option value="">All Cities</option>
                            {CITIES.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    {/* Price Range */}
                    <div className="flex-1 flex items-center gap-2 px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200">
                        <IndianRupee className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <select
                            value={priceRange}
                            onChange={(e) => handlePriceChange(e.target.value)}
                            className="w-full bg-transparent text-gray-800 outline-none cursor-pointer"
                            aria-label="Select price range"
                        >
                            {PRICE_RANGES.map(range => (
                                <option key={range.value} value={range.value}>{range.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Property Type */}
                    <div className="flex-1 flex items-center gap-2 px-4 py-2 border-b md:border-b-0 md:border-r border-gray-200">
                        <Home className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <select
                            value={filters.propertyType}
                            onChange={(e) => setFilters(prev => ({ ...prev, propertyType: e.target.value }))}
                            className="w-full bg-transparent text-gray-800 outline-none cursor-pointer"
                            aria-label="Select property type"
                        >
                            {PROPERTY_TYPES.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Search Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Search className="w-5 h-5" />
                        <span className="hidden md:inline">{loading ? 'Searching...' : 'Search'}</span>
                    </button>
                </div>

                {/* Advanced Filters Toggle */}
                <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-1 mt-2 px-4 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                    <span>Advanced Filters</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* Advanced Filters Panel */}
            {showAdvanced && (
                <div className="mt-3 bg-white rounded-xl shadow-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Bedrooms */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                            <select
                                value={filters.bedrooms || ''}
                                onChange={(e) => setFilters(prev => ({
                                    ...prev,
                                    bedrooms: e.target.value ? Number(e.target.value) : undefined
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Any</option>
                                <option value="1">1+</option>
                                <option value="2">2+</option>
                                <option value="3">3+</option>
                                <option value="4">4+</option>
                                <option value="5">5+</option>
                            </select>
                        </div>

                        {/* Bathrooms */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                            <select
                                value={filters.bathrooms || ''}
                                onChange={(e) => setFilters(prev => ({
                                    ...prev,
                                    bathrooms: e.target.value ? Number(e.target.value) : undefined
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Any</option>
                                <option value="1">1+</option>
                                <option value="2">2+</option>
                                <option value="3">3+</option>
                                <option value="4">4+</option>
                            </select>
                        </div>

                        {/* Min Price (Manual) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (Lakhs)</label>
                            <input
                                type="number"
                                value={filters.minPrice ? filters.minPrice / 100000 : ''}
                                onChange={(e) => setFilters(prev => ({
                                    ...prev,
                                    minPrice: e.target.value ? Number(e.target.value) * 100000 : undefined
                                }))}
                                placeholder="e.g., 50"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Max Price (Manual) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (Lakhs)</label>
                            <input
                                type="number"
                                value={filters.maxPrice ? filters.maxPrice / 100000 : ''}
                                onChange={(e) => setFilters(prev => ({
                                    ...prev,
                                    maxPrice: e.target.value ? Number(e.target.value) * 100000 : undefined
                                }))}
                                placeholder="e.g., 200"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Min Vastu Score */}
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Min Vastu Score</label>
                            <select
                                value={filters.minVastuScore || ''}
                                onChange={(e) => setFilters(prev => ({
                                    ...prev,
                                    minVastuScore: e.target.value ? Number(e.target.value) : undefined
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Any</option>
                                <option value="60">60+ (Fair)</option>
                                <option value="70">70+ (Good)</option>
                                <option value="80">80+ (Excellent)</option>
                                <option value="90">90+ (Superior)</option>
                            </select>
                        </div>
                    </div>

                    {/* Filter Actions */}
                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => {
                                setFilters({
                                    city: '',
                                    propertyType: '',
                                    minPrice: undefined,
                                    maxPrice: undefined,
                                    bedrooms: undefined,
                                    bathrooms: undefined,
                                    minVastuScore: undefined,
                                });
                                setPriceRange('');
                            }}
                            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Reset All
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}
        </form>
    );
}
