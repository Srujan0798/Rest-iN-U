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
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';

const neighborhoods = [
    { id: '1', name: 'Brooklyn Heights', city: 'Brooklyn', state: 'NY', medianPrice: 950000, listings: 145, rating: 9.2, photo: 'https://picsum.photos/400/250?random=40', tags: ['Walkable', 'Historic', 'Parks'] },
    { id: '2', name: 'Williamsburg', city: 'Brooklyn', state: 'NY', medianPrice: 825000, listings: 203, rating: 8.8, photo: 'https://picsum.photos/400/250?random=41', tags: ['Trendy', 'Nightlife', 'Arts'] },
    { id: '3', name: 'Upper East Side', city: 'Manhattan', state: 'NY', medianPrice: 1250000, listings: 178, rating: 9.0, photo: 'https://picsum.photos/400/250?random=42', tags: ['Upscale', 'Museums', 'Schools'] },
    { id: '4', name: 'Park Slope', city: 'Brooklyn', state: 'NY', medianPrice: 1100000, listings: 89, rating: 9.5, photo: 'https://picsum.photos/400/250?random=43', tags: ['Family', 'Parks', 'Brownstones'] },
    { id: '5', name: 'SoHo', city: 'Manhattan', state: 'NY', medianPrice: 2500000, listings: 67, rating: 8.5, photo: 'https://picsum.photos/400/250?random=44', tags: ['Shopping', 'Lofts', 'Dining'] },
    { id: '6', name: 'Astoria', city: 'Queens', state: 'NY', medianPrice: 650000, listings: 156, rating: 8.7, photo: 'https://picsum.photos/400/250?random=45', tags: ['Diverse', 'Food', 'Affordable'] },
    { id: '7', name: 'Chelsea', city: 'Manhattan', state: 'NY', medianPrice: 1800000, listings: 92, rating: 8.9, photo: 'https://picsum.photos/400/250?random=46', tags: ['Galleries', 'Highline', 'LGBTQ+'] },
    { id: '8', name: 'Tribeca', city: 'Manhattan', state: 'NY', medianPrice: 3200000, listings: 45, rating: 9.3, photo: 'https://picsum.photos/400/250?random=47', tags: ['Luxury', 'Celebrity', 'Lofts'] },
];

export default function NeighborhoodsPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');

    const filteredNeighborhoods = neighborhoods.filter(n =>
        n.name.toLowerCase().includes(search.toLowerCase()) ||
        n.city.toLowerCase().includes(search.toLowerCase()) ||
        n.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <LocationOnIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    <Box>
                        <Typography variant="h4" fontWeight={700}>Explore Neighborhoods</Typography>
                        <Typography color="text.secondary">Discover the perfect neighborhood for your lifestyle</Typography>
                    </Box>
                </Box>

                <TextField
                    placeholder="Search neighborhoods, cities, or features..."
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
                    sx={{ mb: 4, maxWidth: 500 }}
                />

                <Grid container spacing={3}>
                    {filteredNeighborhoods.map((n) => (
                        <Grid item xs={12} sm={6} md={4} key={n.id}>
                            <Card sx={{ height: '100%' }}>
                                <CardActionArea onClick={() => router.push(`/search?neighborhood=${encodeURIComponent(n.name)}`)}>
                                    <CardMedia component="img" height="160" image={n.photo} alt={n.name} />
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <Box>
                                                <Typography variant="h6" fontWeight={600}>{n.name}</Typography>
                                                <Typography variant="body2" color="text.secondary">{n.city}, {n.state}</Typography>
                                            </Box>
                                            <Chip label={`${n.rating}/10`} size="small" color="primary" />
                                        </Box>

                                        <Grid container spacing={1} sx={{ mt: 2 }}>
                                            <Grid item xs={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <TrendingUpIcon fontSize="small" color="success" />
                                                    <Box>
                                                        <Typography variant="caption" color="text.secondary">Median Price</Typography>
                                                        <Typography variant="body2" fontWeight={600}>${(n.medianPrice / 1000).toFixed(0)}K</Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <HomeIcon fontSize="small" color="primary" />
                                                    <Box>
                                                        <Typography variant="caption" color="text.secondary">Listings</Typography>
                                                        <Typography variant="body2" fontWeight={600}>{n.listings}</Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        </Grid>

                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 2 }}>
                                            {n.tags.map((tag) => (
                                                <Chip key={tag} label={tag} size="small" variant="outlined" />
                                            ))}
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {filteredNeighborhoods.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography color="text.secondary">No neighborhoods match your search</Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );
}
