'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import VerifiedIcon from '@mui/icons-material/Verified';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import ContactForm from '@/components/ContactForm';

const mockAgent = {
    id: '1',
    name: 'Sarah Agent',
    photo: 'https://picsum.photos/300/300?random=10',
    email: 'sarah@toprealty.com',
    phone: '(555) 123-4567',
    website: 'www.sarahagent.com',
    rating: 4.8,
    reviewCount: 127,
    brokerage: 'Top Realty Group',
    yearsExperience: 8,
    bio: 'I am a dedicated real estate professional with over 8 years of experience helping families find their perfect homes. My focus is on providing exceptional service and making the buying/selling process as smooth as possible. I specialize in luxury properties and first-time homebuyers in the New York metropolitan area.',
    specialties: ['Luxury Homes', 'First-Time Buyers', 'Investment Properties'],
    serviceAreas: ['New York', 'Brooklyn', 'Manhattan', 'Queens'],
    verified: true,
    listings: [
        { id: '1', address: '123 Main St, New York', price: 485000, beds: 3, baths: 2, photo: 'https://picsum.photos/400/300?random=1' },
        { id: '2', address: '456 Park Ave, Brooklyn', price: 725000, beds: 4, baths: 3, photo: 'https://picsum.photos/400/300?random=2' },
        { id: '3', address: '789 Broadway, Manhattan', price: 550000, beds: 2, baths: 2, photo: 'https://picsum.photos/400/300?random=3' },
    ],
    reviews: [
        { id: '1', name: 'John D.', rating: 5, comment: 'Sarah was amazing! She helped us find our dream home in just 2 weeks.', date: 'Nov 2025', type: 'Bought' },
        { id: '2', name: 'Emily R.', rating: 5, comment: 'Very professional and knowledgeable. Highly recommend!', date: 'Oct 2025', type: 'Sold' },
        { id: '3', name: 'Mike T.', rating: 4, comment: 'Great experience overall. Sarah was very responsive.', date: 'Sep 2025', type: 'Bought' },
    ],
};

export default function AgentProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0);
    const agent = mockAgent;

    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Left Column - Profile */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, textAlign: 'center' }}>
                            <Avatar src={agent.photo} sx={{ width: 150, height: 150, mx: 'auto', mb: 2 }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                                <Typography variant="h5" fontWeight={700}>{agent.name}</Typography>
                                {agent.verified && <VerifiedIcon color="primary" />}
                            </Box>
                            <Typography color="text.secondary" gutterBottom>{agent.brokerage}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                                <Rating value={agent.rating} precision={0.1} readOnly />
                                <Typography>{agent.rating} ({agent.reviewCount} reviews)</Typography>
                            </Box>
                            <Chip label={`${agent.yearsExperience} years experience`} sx={{ mb: 2 }} />

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ textAlign: 'left' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <PhoneIcon color="action" fontSize="small" />
                                    <Typography variant="body2">{agent.phone}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <EmailIcon color="action" fontSize="small" />
                                    <Typography variant="body2">{agent.email}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LanguageIcon color="action" fontSize="small" />
                                    <Typography variant="body2">{agent.website}</Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>Specialties</Typography>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
                                {agent.specialties.map((s) => (
                                    <Chip key={s} label={s} size="small" variant="outlined" />
                                ))}
                            </Box>

                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>Service Areas</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {agent.serviceAreas.join(' • ')}
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Right Column - Content */}
                    <Grid item xs={12} md={8}>
                        {/* About */}
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>About {agent.name}</Typography>
                            <Typography color="text.secondary">{agent.bio}</Typography>
                        </Paper>

                        {/* Tabs */}
                        <Paper sx={{ mb: 3 }}>
                            <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
                                <Tab label={`Listings (${agent.listings.length})`} />
                                <Tab label={`Reviews (${agent.reviewCount})`} />
                                <Tab label="Contact" />
                            </Tabs>
                        </Paper>

                        {activeTab === 0 && (
                            <Grid container spacing={2}>
                                {agent.listings.map((listing) => (
                                    <Grid item xs={12} sm={6} key={listing.id}>
                                        <Card sx={{ cursor: 'pointer' }} onClick={() => router.push(`/property/${listing.id}`)}>
                                            <CardMedia component="img" height="150" image={listing.photo} />
                                            <CardContent>
                                                <Typography variant="h6" fontWeight={600}>${listing.price.toLocaleString()}</Typography>
                                                <Typography variant="body2" color="text.secondary">{listing.address}</Typography>
                                                <Typography variant="body2">{listing.beds} beds • {listing.baths} baths</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}

                        {activeTab === 1 && (
                            <Box>
                                {agent.reviews.map((review) => (
                                    <Paper key={review.id} sx={{ p: 3, mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Box>
                                                <Typography fontWeight={600}>{review.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">{review.type} a home • {review.date}</Typography>
                                            </Box>
                                            <Rating value={review.rating} size="small" readOnly />
                                        </Box>
                                        <Typography color="text.secondary">"{review.comment}"</Typography>
                                    </Paper>
                                ))}
                            </Box>
                        )}

                        {activeTab === 2 && (
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>Send a Message</Typography>
                                <ContactForm agentId={agent.id} propertyId="" />
                            </Paper>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
