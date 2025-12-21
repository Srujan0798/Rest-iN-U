'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import CompareIcon from '@mui/icons-material/Compare';
import CheckIcon from '@mui/icons-material/Check';

interface Property {
    id: string;
    address: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    yearBuilt: number;
    propertyType: string;
    lotSize?: number;
    parking?: string;
    heating?: string;
    cooling?: string;
    features: string[];
    photo: string;
    pricePerSqft: number;
}

// Mock data - in production, this would come from URL params and API
const mockProperties: Property[] = [
    {
        id: '1', address: '123 Main St, New York, NY', price: 485000, bedrooms: 3, bathrooms: 2,
        squareFeet: 1800, yearBuilt: 2015, propertyType: 'Single Family', lotSize: 5000,
        parking: '2 Car Garage', heating: 'Central', cooling: 'Central Air',
        features: ['Hardwood Floors', 'Updated Kitchen', 'Fireplace', 'Backyard'],
        photo: 'https://picsum.photos/400/300?random=1', pricePerSqft: 269
    },
    {
        id: '2', address: '456 Park Ave, Brooklyn, NY', price: 725000, bedrooms: 4, bathrooms: 3,
        squareFeet: 2400, yearBuilt: 2018, propertyType: 'Single Family', lotSize: 7500,
        parking: '2 Car Garage', heating: 'Central', cooling: 'Central Air',
        features: ['Hardwood Floors', 'Granite Counters', 'Pool', 'Smart Home'],
        photo: 'https://picsum.photos/400/300?random=2', pricePerSqft: 302
    },
    {
        id: '3', address: '789 Broadway, Manhattan, NY', price: 550000, bedrooms: 2, bathrooms: 2,
        squareFeet: 1200, yearBuilt: 2020, propertyType: 'Condo', lotSize: 0,
        parking: '1 Car Garage', heating: 'Radiant', cooling: 'Central Air',
        features: ['Modern Design', 'City Views', 'Gym Access', 'Doorman'],
        photo: 'https://picsum.photos/400/300?random=3', pricePerSqft: 458
    },
];

const comparisonFields: { key: keyof Property | string; label: string; format: (v: any) => string }[] = [
    { key: 'price', label: 'Price', format: (v) => `$${v?.toLocaleString() || 0}` },
    { key: 'bedrooms', label: 'Bedrooms', format: (v) => String(v ?? 0) },
    { key: 'bathrooms', label: 'Bathrooms', format: (v) => String(v ?? 0) },
    { key: 'squareFeet', label: 'Square Feet', format: (v) => v?.toLocaleString() || '0' },
    { key: 'pricePerSqft', label: 'Price/Sq Ft', format: (v) => `$${v ?? 0}` },
    { key: 'yearBuilt', label: 'Year Built', format: (v) => String(v ?? 'N/A') },
    { key: 'propertyType', label: 'Type', format: (v) => v || 'N/A' },
    { key: 'lotSize', label: 'Lot Size', format: (v) => v ? `${v.toLocaleString()} sqft` : 'N/A' },
    { key: 'parking', label: 'Parking', format: (v) => v || 'N/A' },
    { key: 'heating', label: 'Heating', format: (v) => v || 'N/A' },
    { key: 'cooling', label: 'Cooling', format: (v) => v || 'N/A' },
];

export default function ComparePage() {
    const router = useRouter();
    const [properties, setProperties] = useState<Property[]>(mockProperties);

    const removeProperty = (id: string) => {
        setProperties(properties.filter(p => p.id !== id));
    };

    const getBestValue = (field: string): string | null => {
        if (properties.length < 2) return null;
        if (field === 'price' || field === 'pricePerSqft') {
            const min = Math.min(...properties.map(p => (p as any)[field]));
            return properties.find(p => (p as any)[field] === min)?.id || null;
        }
        if (field === 'squareFeet' || field === 'bedrooms' || field === 'bathrooms' || field === 'yearBuilt') {
            const max = Math.max(...properties.map(p => (p as any)[field]));
            return properties.find(p => (p as any)[field] === max)?.id || null;
        }
        return null;
    };

    if (properties.length === 0) {
        return (
            <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
                    <CompareIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h5" gutterBottom>No Properties to Compare</Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                        Add properties to your comparison from search results
                    </Typography>
                    <Button variant="contained" onClick={() => router.push('/search')}>Browse Properties</Button>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="xl">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" fontWeight={700}>
                        <CompareIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Compare Properties
                    </Typography>
                    <Button variant="outlined" onClick={() => router.push('/search')}>
                        Add More Properties
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600, width: 150 }}>Feature</TableCell>
                                {properties.map((p) => (
                                    <TableCell key={p.id} align="center" sx={{ minWidth: 200 }}>
                                        <Box sx={{ position: 'relative' }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => removeProperty(p.id)}
                                                sx={{ position: 'absolute', top: -8, right: -8 }}
                                            >
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                            <Box
                                                component="img"
                                                src={p.photo}
                                                alt={p.address}
                                                sx={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 1, mb: 1 }}
                                            />
                                            <Typography variant="body2" fontWeight={600} noWrap>{p.address}</Typography>
                                            <Button size="small" onClick={() => router.push(`/property/${p.id}`)}>
                                                View Details
                                            </Button>
                                        </Box>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {comparisonFields.map((field) => {
                                const bestId = getBestValue(field.key);
                                return (
                                    <TableRow key={field.key} hover>
                                        <TableCell sx={{ fontWeight: 500 }}>{field.label}</TableCell>
                                        {properties.map((p) => {
                                            const value = (p as any)[field.key];
                                            const isBest = bestId === p.id;
                                            return (
                                                <TableCell key={p.id} align="center">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                                        <Typography fontWeight={isBest ? 600 : 400} color={isBest ? 'success.main' : 'inherit'}>
                                                            {field.format(value)}
                                                        </Typography>
                                                        {isBest && <CheckIcon fontSize="small" color="success" />}
                                                    </Box>
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                            <TableRow>
                                <TableCell sx={{ fontWeight: 500 }}>Features</TableCell>
                                {properties.map((p) => (
                                    <TableCell key={p.id}>
                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
                                            {p.features.map((f) => (
                                                <Chip key={f} label={f} size="small" variant="outlined" />
                                            ))}
                                        </Box>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </Box>
    );
}
