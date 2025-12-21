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
import InputAdornment from '@mui/material/InputAdornment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';

const mockOpenHouses = [
    {
        id: '1',
        date: '2025-12-21',
        startTime: '10:00 AM',
        endTime: '1:00 PM',
        property: { id: '1', address: '123 Main St, New York, NY', price: 485000, beds: 3, baths: 2, photo: 'https://picsum.photos/400/300?random=1' },
        agentName: 'Sarah Agent',
    },
    {
        id: '2',
        date: '2025-12-21',
        startTime: '2:00 PM',
        endTime: '5:00 PM',
        property: { id: '2', address: '456 Park Ave, Brooklyn, NY', price: 725000, beds: 4, baths: 3, photo: 'https://picsum.photos/400/300?random=2' },
        agentName: 'Mike Johnson',
    },
    {
        id: '3',
        date: '2025-12-22',
        startTime: '11:00 AM',
        endTime: '2:00 PM',
        property: { id: '3', address: '789 Broadway, Manhattan, NY', price: 550000, beds: 2, baths: 2, photo: 'https://picsum.photos/400/300?random=3' },
        agentName: 'Emily Davis',
    },
    {
        id: '4',
        date: '2025-12-22',
        startTime: '3:00 PM',
        endTime: '6:00 PM',
        property: { id: '4', address: '321 5th Ave, New York, NY', price: 1200000, beds: 5, baths: 4, photo: 'https://picsum.photos/400/300?random=4' },
        agentName: 'Sarah Agent',
    },
];

export default function OpenHousesPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    const filteredOpenHouses = mockOpenHouses.filter(oh => {
        if (search && !oh.property.address.toLowerCase().includes(search.toLowerCase())) return false;
        if (selectedDate && oh.date !== selectedDate) return false;
        return true;
    });

    // Group by date
    const groupedByDate = filteredOpenHouses.reduce((acc, oh) => {
        if (!acc[oh.date]) acc[oh.date] = [];
        acc[oh.date].push(oh);
        return acc;
    }, {} as Record<string, typeof mockOpenHouses>);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    };

    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                    <CalendarMonthIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    <Box>
                        <Typography variant="h4" fontWeight={700}>Open Houses</Typography>
                        <Typography color="text.secondary">Find open houses near you this weekend</Typography>
                    </Box>
                </Box>

                {/* Filters */}
                <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                    <TextField
                        placeholder="Search by address or city..."
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
                        sx={{ minWidth: 300 }}
                    />
                    <TextField
                        type="date"
                        size="small"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        sx={{ minWidth: 180 }}
                    />
                    {selectedDate && (
                        <Button variant="outlined" size="small" onClick={() => setSelectedDate('')}>
                            Clear Date
                        </Button>
                    )}
                </Box>

                {/* Open Houses by Date */}
                {Object.entries(groupedByDate).map(([date, openHouses]) => (
                    <Box key={date} sx={{ mb: 4 }}>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                            <CalendarMonthIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            {formatDate(date)}
                        </Typography>
                        <Grid container spacing={3}>
                            {openHouses.map((oh) => (
                                <Grid item xs={12} sm={6} md={4} key={oh.id}>
                                    <Card>
                                        <CardActionArea onClick={() => router.push(`/property/${oh.property.id}`)}>
                                            <CardMedia component="img" height="180" image={oh.property.photo} alt={oh.property.address} />
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <AccessTimeIcon fontSize="small" color="primary" />
                                                    <Typography variant="body2" fontWeight={600} color="primary">
                                                        {oh.startTime} - {oh.endTime}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="h6" fontWeight={700}>${oh.property.price.toLocaleString()}</Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                                                    <LocationOnIcon fontSize="small" color="action" />
                                                    <Typography variant="body2" color="text.secondary" noWrap>
                                                        {oh.property.address}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2">
                                                    {oh.property.beds} beds • {oh.property.baths} baths
                                                </Typography>
                                                <Chip label={`Hosted by ${oh.agentName}`} size="small" sx={{ mt: 1 }} />
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ))}

                {Object.keys(groupedByDate).length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <CalendarMonthIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">No open houses found</Typography>
                        <Typography color="text.secondary" sx={{ mb: 2 }}>Try adjusting your search criteria</Typography>
                        <Button variant="contained" onClick={() => { setSearch(''); setSelectedDate(''); }}>
                            Clear Filters
                        </Button>
                    </Box>
                )}
            </Container>
        </Box>
    );
}
