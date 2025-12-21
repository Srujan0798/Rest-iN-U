'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface FilterSidebarProps {
    filters: any;
    onFilterChange: (filters: any) => void;
}

const propertyTypes = ['HOUSE', 'CONDO', 'TOWNHOUSE', 'APARTMENT', 'LAND', 'MULTI_FAMILY'];

export default function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
    const [priceRange, setPriceRange] = useState([filters.minPrice || 0, filters.maxPrice || 2000000]);

    const handlePriceChange = (event: Event, newValue: number | number[]) => {
        const [min, max] = newValue as number[];
        setPriceRange([min, max]);
        onFilterChange({ ...filters, minPrice: min, maxPrice: max });
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Filters</Typography>

            {/* Price Range */}
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight={500}>Price Range</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ px: 1 }}>
                        <Slider
                            value={priceRange}
                            onChange={handlePriceChange}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(v) => `$${(v / 1000).toFixed(0)}K`}
                            min={0}
                            max={2000000}
                            step={50000}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="body2">${(priceRange[0] / 1000).toFixed(0)}K</Typography>
                            <Typography variant="body2">${(priceRange[1] / 1000).toFixed(0)}K</Typography>
                        </Box>
                    </Box>
                </AccordionDetails>
            </Accordion>

            {/* Bedrooms */}
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight={500}>Bedrooms</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {['Any', '1+', '2+', '3+', '4+', '5+'].map((b, i) => (
                            <Chip
                                key={b}
                                label={b}
                                onClick={() => onFilterChange({ ...filters, minBedrooms: i === 0 ? undefined : i })}
                                color={filters.minBedrooms === i ? 'primary' : 'default'}
                                variant={filters.minBedrooms === i ? 'filled' : 'outlined'}
                            />
                        ))}
                    </Box>
                </AccordionDetails>
            </Accordion>

            {/* Bathrooms */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight={500}>Bathrooms</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {['Any', '1+', '2+', '3+', '4+'].map((b, i) => (
                            <Chip
                                key={b}
                                label={b}
                                onClick={() => onFilterChange({ ...filters, minBathrooms: i === 0 ? undefined : i })}
                                color={filters.minBathrooms === i ? 'primary' : 'default'}
                                variant={filters.minBathrooms === i ? 'filled' : 'outlined'}
                            />
                        ))}
                    </Box>
                </AccordionDetails>
            </Accordion>

            {/* Property Type */}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight={500}>Property Type</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {propertyTypes.map((type) => (
                            <Chip
                                key={type}
                                label={type.replace('_', ' ')}
                                onClick={() => onFilterChange({ ...filters, propertyType: filters.propertyType === type ? undefined : type })}
                                color={filters.propertyType === type ? 'primary' : 'default'}
                                variant={filters.propertyType === type ? 'filled' : 'outlined'}
                                size="small"
                            />
                        ))}
                    </Box>
                </AccordionDetails>
            </Accordion>

            <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={() => onFilterChange({})}>
                Clear All Filters
            </Button>
        </Box>
    );
}
