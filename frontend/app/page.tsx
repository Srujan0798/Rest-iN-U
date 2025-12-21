'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import SearchBar from '@/components/SearchBar';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';

const features = [
    { icon: <SearchIcon sx={{ fontSize: 40 }} />, title: 'Advanced Search', desc: 'Search 2M+ properties with 50+ filters' },
    { icon: <ThreeDRotationIcon sx={{ fontSize: 40 }} />, title: '3D Virtual Tours', desc: 'Explore homes without leaving yours' },
    { icon: <TrendingUpIcon sx={{ fontSize: 40 }} />, title: 'Market Analytics', desc: 'AI-powered price estimates and trends' },
    { icon: <PeopleIcon sx={{ fontSize: 40 }} />, title: 'Top Agents', desc: 'Connect with verified professionals' },
];

const featuredProperties = [
    { id: '1', image: 'https://picsum.photos/400/300?random=1', address: '123 Main St, New York', price: 485000, beds: 3, baths: 2 },
    { id: '2', image: 'https://picsum.photos/400/300?random=2', address: '456 Park Ave, Brooklyn', price: 725000, beds: 4, baths: 3 },
    { id: '3', image: 'https://picsum.photos/400/300?random=3', address: '789 Broadway, Manhattan', price: 550000, beds: 2, baths: 2 },
];

export default function HomePage() {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = (location: string) => {
        router.push(`/search?location=${encodeURIComponent(location)}`);
    };

    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
                    color: 'white',
                    py: 12,
                    textAlign: 'center',
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h2" component="h1" fontWeight={700} gutterBottom>
                        Find Your Perfect Home
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                        The future of real estate. Search millions of properties, take virtual tours, and connect with top agents.
                    </Typography>
                    <SearchBar onSearch={handleSearch} />
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Typography variant="h4" textAlign="center" fontWeight={600} gutterBottom>
                    Why Choose Rest-iN-U
                </Typography>
                <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
                    The most comprehensive real estate platform for everyone
                </Typography>
                <Grid container spacing={4}>
                    {features.map((f, i) => (
                        <Grid item xs={12} sm={6} md={3} key={i}>
                            <Box sx={{ textAlign: 'center', p: 2 }}>
                                <Box sx={{ color: 'primary.main', mb: 2 }}>{f.icon}</Box>
                                <Typography variant="h6" fontWeight={600}>{f.title}</Typography>
                                <Typography color="text.secondary">{f.desc}</Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Featured Properties */}
            <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" fontWeight={600} gutterBottom>
                        Featured Properties
                    </Typography>
                    <Grid container spacing={3}>
                        {featuredProperties.map((p) => (
                            <Grid item xs={12} sm={6} md={4} key={p.id}>
                                <Card className="property-card" sx={{ cursor: 'pointer' }} onClick={() => router.push(`/property/${p.id}`)}>
                                    <CardMedia component="img" height="200" image={p.image} alt={p.address} />
                                    <CardContent>
                                        <Typography variant="h6" fontWeight={600}>${p.price.toLocaleString()}</Typography>
                                        <Typography color="text.secondary">{p.address}</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            {p.beds} beds • {p.baths} baths
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Button variant="contained" size="large" onClick={() => router.push('/search')}>
                            View All Properties
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* CTA Section */}
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight={600} gutterBottom>
                    Ready to Find Your Dream Home?
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 4 }}>
                    Join thousands of happy buyers and sellers on Rest-iN-U
                </Typography>
                <Button variant="contained" size="large" sx={{ mr: 2 }}>Get Started</Button>
                <Button variant="outlined" size="large">Learn More</Button>
            </Container>
        </Box>
    );
}
