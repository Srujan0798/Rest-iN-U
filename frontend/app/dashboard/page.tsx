'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import PropertyCard from '@/components/PropertyCard';

const mockFavorites = [
    { property_id: '1', address: '123 Main St, New York, NY', price: 485000, bedrooms: 3, bathrooms: 2, square_feet: 1800, primary_photo: 'https://picsum.photos/400/300?random=1' },
    { property_id: '2', address: '456 Park Ave, Brooklyn, NY', price: 725000, bedrooms: 4, bathrooms: 3, square_feet: 2400, primary_photo: 'https://picsum.photos/400/300?random=2' },
];

const mockSavedSearches = [
    { id: '1', name: 'Brooklyn 3BR Under 600K', filters: { location: 'Brooklyn, NY', maxPrice: 600000, bedrooms: 3 }, frequency: 'INSTANT', matchCount: 42 },
    { id: '2', name: 'Manhattan Condos', filters: { location: 'Manhattan, NY', propertyType: 'CONDO' }, frequency: 'DAILY', matchCount: 156 },
];

const mockAlerts = [
    { id: '1', message: 'New property matches your "Brooklyn 3BR" search', date: '2 hours ago', read: false },
    { id: '2', message: 'Price drop on 123 Main St - Now $475,000', date: '1 day ago', read: false },
    { id: '3', message: 'Agent Sarah responded to your inquiry', date: '2 days ago', read: true },
];

export default function UserDashboardPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0);

    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Typography variant="h4" fontWeight={700} gutterBottom>My Dashboard</Typography>

                <Grid container spacing={3}>
                    {/* Sidebar */}
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ p: 3, mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Avatar sx={{ width: 60, height: 60 }}><PersonIcon /></Avatar>
                                <Box>
                                    <Typography fontWeight={600}>John Buyer</Typography>
                                    <Typography variant="body2" color="text.secondary">buyer@example.com</Typography>
                                </Box>
                            </Box>
                            <Button variant="outlined" fullWidth size="small">Edit Profile</Button>
                        </Paper>

                        <Paper>
                            <List>
                                <ListItem button selected={activeTab === 0} onClick={() => setActiveTab(0)}>
                                    <ListItemAvatar><Avatar sx={{ bgcolor: 'error.light' }}><FavoriteIcon /></Avatar></ListItemAvatar>
                                    <ListItemText primary="Favorites" secondary={`${mockFavorites.length} properties`} />
                                </ListItem>
                                <ListItem button selected={activeTab === 1} onClick={() => setActiveTab(1)}>
                                    <ListItemAvatar><Avatar sx={{ bgcolor: 'primary.light' }}><SearchIcon /></Avatar></ListItemAvatar>
                                    <ListItemText primary="Saved Searches" secondary={`${mockSavedSearches.length} searches`} />
                                </ListItem>
                                <ListItem button selected={activeTab === 2} onClick={() => setActiveTab(2)}>
                                    <ListItemAvatar><Avatar sx={{ bgcolor: 'warning.light' }}><NotificationsIcon /></Avatar></ListItemAvatar>
                                    <ListItemText primary="Alerts" secondary={`${mockAlerts.filter(a => !a.read).length} new`} />
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid>

                    {/* Main Content */}
                    <Grid item xs={12} md={9}>
                        {activeTab === 0 && (
                            <Box>
                                <Typography variant="h6" fontWeight={600} gutterBottom>Saved Properties</Typography>
                                <Grid container spacing={2}>
                                    {mockFavorites.map((p) => (
                                        <Grid item xs={12} sm={6} key={p.property_id}>
                                            <PropertyCard property={p} isFavorited onClick={() => router.push(`/property/${p.property_id}`)} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}

                        {activeTab === 1 && (
                            <Box>
                                <Typography variant="h6" fontWeight={600} gutterBottom>Saved Searches</Typography>
                                {mockSavedSearches.map((search) => (
                                    <Paper key={search.id} sx={{ p: 3, mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>
                                                <Typography fontWeight={600}>{search.name}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {search.matchCount} matching properties • Alerts: {search.frequency}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Button variant="outlined" size="small" sx={{ mr: 1 }}>View Results</Button>
                                                <IconButton size="small" color="error"><DeleteIcon /></IconButton>
                                            </Box>
                                        </Box>
                                    </Paper>
                                ))}
                            </Box>
                        )}

                        {activeTab === 2 && (
                            <Box>
                                <Typography variant="h6" fontWeight={600} gutterBottom>Notifications</Typography>
                                <Paper>
                                    <List>
                                        {mockAlerts.map((alert) => (
                                            <ListItem key={alert.id} sx={{ bgcolor: alert.read ? 'transparent' : 'action.hover' }}>
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: alert.read ? 'grey.300' : 'primary.main' }}>
                                                        <NotificationsIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary={alert.message} secondary={alert.date} />
                                                {!alert.read && <Chip label="New" size="small" color="primary" />}
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
