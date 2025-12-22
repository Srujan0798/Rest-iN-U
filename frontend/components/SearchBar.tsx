'use client';
import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

interface SearchBarProps {
    onSearch: (location: string) => void;
    placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = 'Enter city, neighborhood, or ZIP' }: SearchBarProps) {
    const [value, setValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            onSearch(value.trim());
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-center max-w-xl mx-auto bg-white rounded-full shadow-lg px-2 py-1"
        >
            <MapPin className="w-5 h-5 text-gray-400 ml-3" />
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                aria-label="search location"
                className="flex-1 px-3 py-3 text-gray-900 placeholder-gray-500 outline-none bg-transparent"
            />
            <button
                type="submit"
                className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
                <Search className="w-5 h-5" />
            </button>
        </form>
    );
}
