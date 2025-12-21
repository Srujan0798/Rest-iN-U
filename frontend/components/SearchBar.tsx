'use client';
import { useState } from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';

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
        <Paper
            component="form"
            onSubmit={handleSubmit}
            sx={{
                p: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                maxWidth: 600,
                mx: 'auto',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
        >
            <LocationOnIcon sx={{ color: 'grey.500', ml: 1 }} />
            <InputBase
                sx={{ ml: 1, flex: 1, py: 1 }}
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                inputProps={{ 'aria-label': 'search location' }}
            />
            <IconButton type="submit" sx={{ p: 1.5, bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}>
                <SearchIcon />
            </IconButton>
        </Paper>
    );
}
