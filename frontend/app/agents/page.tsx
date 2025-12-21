'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Rating from '@mui/material/Rating';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import VerifiedIcon from '@mui/icons-material/Verified';
import HomeIcon from '@mui/icons-material/Home';

const mockAgents = [
    { id: '1', name: 'Sarah Agent', photo: 'https://picsum.photos/200/200?random=10', rating: 4.8, reviewCount: 127, brokerage: 'Top Realty Group', yearsExperience: 8, activeListings: 12, specialties: ['Luxury Homes', 'First-Time Buyers'], serviceAreas: ['New York', 'Brooklyn'], verified: true },
    { id: '2', name: 'Mike Johnson', photo: 'https://picsum.photos/200/200?random=11', rating: 4.6, reviewCount: 89, brokerage: 'Prime Properties', yearsExperience: 5, activeListings: 8, specialties: ['Investment Properties'], serviceAreas: ['Manhattan', 'Queens'], verified: true },
    { id: '3', name: 'Emily Davis', photo: 'https://picsum.photos/200/200?random=12', rating: 4.9, reviewCount: 203, brokerage: 'Elite Estates', yearsExperience: 12, activeListings: 18, specialties: ['Luxury Homes', 'Waterfront'], serviceAreas: ['Hamptons', 'Long Island'], verified: true },
    { id: '4', name: 'David Wilson', photo: 'https://picsum.photos/200/200?random=13', rating: 4.5, reviewCount: 56, brokerage: 'City Homes', yearsExperience: 3, activeListings: 5, specialties: ['Condos', 'First-Time Buyers'], serviceAreas: ['Brooklyn', 'Bronx'], verified: false },
    { id: '5', name: 'Lisa Chen', photo: 'https://picsum.photos/200/200?random=14', rating: 4.7, reviewCount: 145, brokerage: 'Prestige Realty', yearsExperience: 10, activeListings: 15, specialties: ['Commercial', 'Multi-Family'], serviceAreas: ['Manhattan', 'New Jersey'], verified: true },
    { id: '6', name: 'James Brown', photo: 'https://picsum.photos/200/200?random=15', rating: 4.4, reviewCount: 34, brokerage: 'Home Finders', yearsExperience: 2, activeListings: 3, specialties: ['First-Time Buyers'], serviceAreas: ['Staten Island'], verified: false },
];

export default function AgentsPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [area, setArea] = useState('');

    const filteredAgents = mockAgents.filter(a => {
        if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (specialty && !a.specialties.includes(specialty)) return false;
        if (area && !a.serviceAreas.includes(area)) return false;
        return true;
    });

    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Typography variant="h4" fontWeight={700} gutterBottom>Find a Real Estate Agent</Typography>
                <Typography color="text.secondary" sx={{ mb: 4 }}>
                    Connect with top-rated agents in your area
                </Typography>

                {/* Filters */}
                <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                    <TextField
                        placeholder="Search by name..."
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
                        sx={{ minWidth: 250 }}
                    />
                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel>Specialty</InputLabel>
                        <Select value={specialty} label="Specialty" onChange={(e) => setSpecialty(e.target.value)}>
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="Luxury Homes">Luxury Homes</MenuItem>
                            <MenuItem value="First-Time Buyers">First-Time Buyers</MenuItem>
                            <MenuItem value="Investment Properties">Investment Properties</MenuItem>
                            <MenuItem value="Commercial">Commercial</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel>Service Area</InputLabel>
                        <Select value={area} label="Service Area" onChange={(e) => setArea(e.target.value)}>
                            <MenuItem value="">All Areas</MenuItem>
                            <MenuItem value="New York">New York</MenuItem>
                            <MenuItem value="Brooklyn">Brooklyn</MenuItem>
                            <MenuItem value="Manhattan">Manhattan</MenuItem>
                            <MenuItem value="Queens">Queens</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* Agent Cards */}
                <Grid container spacing={3}>
                    {filteredAgents.map((agent) => (
                        <Grid item xs={12} sm={6} md={4} key={agent.id}>
                            <Card sx={{ height: '100%' }}>
                                <CardActionArea onClick={() => router.push(`/agent/${agent.id}`)}>
                                    <CardMedia component="img" height="200" image={agent.photo} alt={agent.name} />
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <Typography variant="h6" fontWeight={600}>{agent.name}</Typography>
                                            {agent.verified && <VerifiedIcon color="primary" fontSize="small" />}
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            {agent.brokerage} • {agent.yearsExperience} years
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                            <Rating value={agent.rating} precision={0.1} size="small" readOnly />
                                            <Typography variant="body2">({agent.reviewCount})</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                            <HomeIcon fontSize="small" color="action" />
                                            <Typography variant="body2">{agent.activeListings} active listings</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                            {agent.specialties.slice(0, 2).map((s) => (
                                                <Chip key={s} label={s} size="small" variant="outlined" />
                                            ))}
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
