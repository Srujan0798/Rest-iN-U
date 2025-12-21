'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import FilterListIcon from '@mui/icons-material/FilterList';
import MapIcon from '@mui/icons-material/Map';
import ViewListIcon from '@mui/icons-material/ViewList';
import PropertyCard from '@/components/PropertyCard';
import FilterSidebar from '@/components/FilterSidebar';
import SearchBar from '@/components/SearchBar';

// Mock data for development
const mockProperties = [
    { property_id: '1', address: { street: '123 Main St', city: 'New York', state: 'NY', zip: '10001' }, price: 485000, bedrooms: 3, bathrooms: 2, square_feet: 1800, primary_photo: 'https://picsum.photos/400/300?random=1', status: 'ACTIVE', days_on_market: 5 },
    { property_id: '2', address: { street: '456 Park Ave', city: 'Brooklyn', state: 'NY', zip: '11201' }, price: 725000, bedrooms: 4, bathrooms: 3, square_feet: 2400, primary_photo: 'https://picsum.photos/400/300?random=2', status: 'ACTIVE', days_on_market: 12 },
    { property_id: '3', address: { street: '789 Broadway', city: 'Manhattan', state: 'NY', zip: '10016' }, price: 550000, bedrooms: 2, bathrooms: 2, square_feet: 1200, primary_photo: 'https://picsum.photos/400/300?random=3', status: 'PENDING', days_on_market: 20 },
    { property_id: '4', address: { street: '321 5th Ave', city: 'New York', state: 'NY', zip: '10010' }, price: 1200000, bedrooms: 5, bathrooms: 4, square_feet: 3500, primary_photo: 'https://picsum.photos/400/300?random=4', status: 'ACTIVE', days_on_market: 2 },
    { property_id: '5', address: { street: '555 Ocean Dr', city: 'Boston', state: 'MA', zip: '02115' }, price: 680000, bedrooms: 4, bathrooms: 3, square_feet: 2200, primary_photo: 'https://picsum.photos/400/300?random=5', status: 'ACTIVE', days_on_market: 8 },
    { property_id: '6', address: { street: '888 Lake View', city: 'Chicago', state: 'IL', zip: '60601' }, price: 420000, bedrooms: 3, bathrooms: 2, square_feet: 1600, primary_photo: 'https://picsum.photos/400/300?random=6', status: 'ACTIVE', days_on_market: 15 },
];

export default function SearchPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [properties, setProperties] = useState(mockProperties);
    const [filters, setFilters] = useState<any>({});
    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(1);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const location = searchParams.get('location') || '';

    const handleSearch = (newLocation: string) => {
        router.push(`/search?location=${encodeURIComponent(newLocation)}`);
    };

    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters);
        setPage(1);
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
            {/* Search Header */}
            <Box sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'divider', py: 2 }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Box sx={{ flex: 1, minWidth: 300 }}>
                            <SearchBar onSearch={handleSearch} placeholder={location || 'Search location...'} />
                        </Box>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <Select value={sort} onChange={(e) => setSort(e.target.value)}>
                                <MenuItem value="newest">Newest</MenuItem>
                                <MenuItem value="price_asc">Price: Low to High</MenuItem>
                                <MenuItem value="price_desc">Price: High to Low</MenuItem>
                                <MenuItem value="sqft_desc">Largest</MenuItem>
                            </Select>
                        </FormControl>
                        <Button startIcon={<FilterListIcon />} variant="outlined" onClick={() => setDrawerOpen(true)}>
                            Filters
                        </Button>
                        <IconButton onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}>
                            {viewMode === 'list' ? <MapIcon /> : <ViewListIcon />}
                        </IconButton>
                    </Box>
                </Container>
            </Box>

            {/* Results */}
            <Container maxWidth="lg" sx={{ py: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {properties.length} properties found {location && `in "${location}"`}
                </Typography>

                <Grid container spacing={3}>
                    {properties.map((property) => (
                        <Grid item xs={12} sm={6} md={4} key={property.property_id}>
                            <PropertyCard
                                property={property}
                                onClick={() => router.push(`/property/${property.property_id}`)}
                                onFavoriteClick={() => console.log('Favorite', property.property_id)}
                            />
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination count={5} page={page} onChange={(e, p) => setPage(p)} color="primary" />
                </Box>
            </Container>

            {/* Filter Drawer */}
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box sx={{ width: 320 }}>
                    <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
                </Box>
            </Drawer>
        </Box>
    );
}
