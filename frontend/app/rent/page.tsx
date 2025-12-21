'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import PetsIcon from '@mui/icons-material/Pets';
import LocalParkingIcon from '@mui/icons-material/LocalParking';

const mockRentals = [
    { id: '1', address: '100 East 42nd St, New York, NY', rent: 2800, beds: 1, baths: 1, sqft: 750, petFriendly: true, parking: true, available: 'Now', photo: 'https://picsum.photos/400/300?random=20' },
    { id: '2', address: '250 West 57th St, New York, NY', rent: 4200, beds: 2, baths: 2, sqft: 1100, petFriendly: false, parking: true, available: 'Jan 1', photo: 'https://picsum.photos/400/300?random=21' },
    { id: '3', address: '75 Park Place, Brooklyn, NY', rent: 2200, beds: 1, baths: 1, sqft: 650, petFriendly: true, parking: false, available: 'Now', photo: 'https://picsum.photos/400/300?random=22' },
    { id: '4', address: '180 Broadway, Manhattan, NY', rent: 5500, beds: 3, baths: 2, sqft: 1500, petFriendly: true, parking: true, available: 'Feb 1', photo: 'https://picsum.photos/400/300?random=23' },
    { id: '5', address: '500 Grand St, Brooklyn, NY', rent: 1900, beds: 0, baths: 1, sqft: 450, petFriendly: false, parking: false, available: 'Now', photo: 'https://picsum.photos/400/300?random=24' },
    { id: '6', address: '320 5th Ave, Manhattan, NY', rent: 6200, beds: 3, baths: 3, sqft: 1800, petFriendly: true, parking: true, available: 'Jan 15', photo: 'https://picsum.photos/400/300?random=25' },
];

export default function RentPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [maxRent, setMaxRent] = useState('');
    const [beds, setBeds] = useState('');
    const [petFriendly, setPetFriendly] = useState('');

    const filteredRentals = mockRentals.filter((r) => {
        if (search && !r.address.toLowerCase().includes(search.toLowerCase())) return false;
        if (maxRent && r.rent > parseInt(maxRent)) return false;
        if (beds && r.beds < parseInt(beds)) return false;
        if (petFriendly === 'yes' && !r.petFriendly) return false;
        return true;
    });

    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Typography variant="h4" fontWeight={700} gutterBottom>Rentals</Typography>
                <Typography color="text.secondary" sx={{ mb: 4 }}>
                    Find apartments and homes for rent
                </Typography>

                {/* Filters */}
                <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                    <TextField
                        placeholder="Search by location..."
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
                        sx={{ minWidth: 250 }}
                    />
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Max Rent</InputLabel>
                        <Select value={maxRent} label="Max Rent" onChange={(e) => setMaxRent(e.target.value)}>
                            <MenuItem value="">Any</MenuItem>
                            <MenuItem value="2000">$2,000</MenuItem>
                            <MenuItem value="3000">$3,000</MenuItem>
                            <MenuItem value="4000">$4,000</MenuItem>
                            <MenuItem value="5000">$5,000</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 130 }}>
                        <InputLabel>Bedrooms</InputLabel>
                        <Select value={beds} label="Bedrooms" onChange={(e) => setBeds(e.target.value)}>
                            <MenuItem value="">Any</MenuItem>
                            <MenuItem value="0">Studio</MenuItem>
                            <MenuItem value="1">1+</MenuItem>
                            <MenuItem value="2">2+</MenuItem>
                            <MenuItem value="3">3+</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                        <InputLabel>Pet Friendly</InputLabel>
                        <Select value={petFriendly} label="Pet Friendly" onChange={(e) => setPetFriendly(e.target.value)}>
                            <MenuItem value="">Any</MenuItem>
                            <MenuItem value="yes">Yes</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* Results */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {filteredRentals.length} rentals found
                </Typography>

                <Grid container spacing={3}>
                    {filteredRentals.map((rental) => (
                        <Grid item xs={12} sm={6} md={4} key={rental.id}>
                            <Card sx={{ height: '100%' }}>
                                <CardActionArea onClick={() => router.push(`/property/${rental.id}`)}>
                                    <CardMedia component="img" height="180" image={rental.photo} alt={rental.address} />
                                    <CardContent>
                                        <Typography variant="h5" fontWeight={700} color="primary">
                                            ${rental.rent.toLocaleString()}<Typography component="span" variant="body2" color="text.secondary">/mo</Typography>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }} noWrap>
                                            {rental.address}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <BedIcon fontSize="small" color="action" />
                                                <Typography variant="body2">{rental.beds === 0 ? 'Studio' : `${rental.beds} bd`}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <BathtubIcon fontSize="small" color="action" />
                                                <Typography variant="body2">{rental.baths} ba</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <SquareFootIcon fontSize="small" color="action" />
                                                <Typography variant="body2">{rental.sqft} sqft</Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                            <Chip
                                                label={rental.available === 'Now' ? 'Available Now' : `Avail ${rental.available}`}
                                                size="small"
                                                color={rental.available === 'Now' ? 'success' : 'default'}
                                            />
                                            {rental.petFriendly && <Chip icon={<PetsIcon />} label="Pets" size="small" variant="outlined" />}
                                            {rental.parking && <Chip icon={<LocalParkingIcon />} label="Parking" size="small" variant="outlined" />}
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {filteredRentals.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" color="text.secondary">No rentals match your criteria</Typography>
                        <Button variant="outlined" sx={{ mt: 2 }} onClick={() => { setSearch(''); setMaxRent(''); setBeds(''); setPetFriendly(''); }}>
                            Clear Filters
                        </Button>
                    </Box>
                )}
            </Container>
        </Box>
    );
}
