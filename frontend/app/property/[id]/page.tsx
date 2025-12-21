'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';
import PropertyGallery from '@/components/PropertyGallery';
import MortgageCalculator from '@/components/MortgageCalculator';
import ContactForm from '@/components/ContactForm';

// Mock data
const mockProperty = {
    property_id: '1',
    address: { street: '123 Main St', city: 'New York', state: 'NY', zip: '10001' },
    price: 485000,
    bedrooms: 3,
    bathrooms: 2,
    square_feet: 1800,
    lot_size: 5000,
    year_built: 2015,
    days_on_market: 12,
    description: 'Beautiful colonial in prime location with modern amenities. Features include hardwood floors throughout, updated kitchen with granite counters, and a spacious backyard perfect for entertaining. Close to schools, parks, and public transportation.',
    features: ['Central Air', 'Hardwood Floors', 'Granite Counters', 'Updated Kitchen', 'Garage', 'Backyard', 'Fireplace'],
    photos: [
        { url: 'https://picsum.photos/800/600?random=1', caption: 'Front View' },
        { url: 'https://picsum.photos/800/600?random=2', caption: 'Living Room' },
        { url: 'https://picsum.photos/800/600?random=3', caption: 'Kitchen' },
        { url: 'https://picsum.photos/800/600?random=4', caption: 'Bedroom' },
    ],
    virtual_tour_url: 'https://my.matterport.com/show/?m=example',
    listing_agent: {
        agent_id: '1',
        name: 'Sarah Agent',
        phone: '555-0202',
        email: 'sarah@realty.com',
        photo: 'https://picsum.photos/100/100?random=10',
        rating: 4.8,
        review_count: 127,
        brokerage: 'Top Realty Group',
    },
    estimated_payment: {
        principal_interest: 2100,
        property_tax: 580,
        insurance: 120,
        total: 2800,
    },
};

export default function PropertyDetailPage() {
    const { id } = useParams();
    const [isFavorited, setIsFavorited] = useState(false);
    const property = mockProperty;

    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>
            {/* Gallery */}
            <PropertyGallery photos={property.photos} />

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Grid container spacing={4}>
                    {/* Main Content */}
                    <Grid item xs={12} md={8}>
                        {/* Header */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                            <Box>
                                <Typography variant="h4" fontWeight={700} color="primary">
                                    ${property.price.toLocaleString()}
                                </Typography>
                                <Typography variant="h6" color="text.secondary">
                                    {property.address.street}, {property.address.city}, {property.address.state} {property.address.zip}
                                </Typography>
                            </Box>
                            <Box>
                                <IconButton onClick={() => setIsFavorited(!isFavorited)}>
                                    <FavoriteIcon color={isFavorited ? 'error' : 'action'} />
                                </IconButton>
                                <IconButton><ShareIcon /></IconButton>
                            </Box>
                        </Box>

                        {/* Stats */}
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={3}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <BedIcon color="primary" />
                                        <Box>
                                            <Typography variant="h6">{property.bedrooms}</Typography>
                                            <Typography variant="body2" color="text.secondary">Beds</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={3}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <BathtubIcon color="primary" />
                                        <Box>
                                            <Typography variant="h6">{property.bathrooms}</Typography>
                                            <Typography variant="body2" color="text.secondary">Baths</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={3}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <SquareFootIcon color="primary" />
                                        <Box>
                                            <Typography variant="h6">{property.square_feet.toLocaleString()}</Typography>
                                            <Typography variant="body2" color="text.secondary">Sq Ft</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={3}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CalendarTodayIcon color="primary" />
                                        <Box>
                                            <Typography variant="h6">{property.year_built}</Typography>
                                            <Typography variant="body2" color="text.secondary">Built</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Virtual Tour */}
                        {property.virtual_tour_url && (
                            <Button variant="outlined" startIcon={<ThreeDRotationIcon />} fullWidth sx={{ mb: 3 }}>
                                Take 3D Virtual Tour
                            </Button>
                        )}

                        {/* Description */}
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>About This Home</Typography>
                            <Typography color="text.secondary">{property.description}</Typography>
                        </Paper>

                        {/* Features */}
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>Features</Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {property.features.map((f) => (
                                    <Chip key={f} label={f} variant="outlined" />
                                ))}
                            </Box>
                        </Paper>

                        {/* Mortgage Calculator */}
                        <MortgageCalculator price={property.price} />
                    </Grid>

                    {/* Sidebar */}
                    <Grid item xs={12} md={4}>
                        {/* Agent Card */}
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Avatar src={property.listing_agent.photo} sx={{ width: 60, height: 60 }} />
                                <Box>
                                    <Typography variant="h6" fontWeight={600}>{property.listing_agent.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">{property.listing_agent.brokerage}</Typography>
                                    <Typography variant="body2">⭐ {property.listing_agent.rating} ({property.listing_agent.review_count} reviews)</Typography>
                                </Box>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <ContactForm agentId={property.listing_agent.agent_id} propertyId={property.property_id} />
                        </Paper>

                        {/* Estimated Payment */}
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>Estimated Monthly Payment</Typography>
                            <Typography variant="h4" color="primary" fontWeight={700}>
                                ${property.estimated_payment.total.toLocaleString()}/mo
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Principal & Interest</Typography>
                                    <Typography variant="body2">${property.estimated_payment.principal_interest}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Property Tax</Typography>
                                    <Typography variant="body2">${property.estimated_payment.property_tax}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2">Insurance</Typography>
                                    <Typography variant="body2">${property.estimated_payment.insurance}</Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
