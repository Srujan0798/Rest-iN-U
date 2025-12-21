'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Alert from '@mui/material/Alert';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import ThreeSixtyIcon from '@mui/icons-material/ThreeSixty';
import ChairIcon from '@mui/icons-material/Chair';
import ConstructionIcon from '@mui/icons-material/Construction';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

export default function VRARToursPage() {
    const [activeTab, setActiveTab] = useState(0);
    const [style, setStyle] = useState('modern');

    const vrTours = [
        { id: 1, address: '123 Main St', rooms: 8, views: 256, status: 'ready' },
        { id: 2, address: '456 Oak Ave', rooms: 6, views: 189, status: 'ready' },
        { id: 3, address: '789 Pine Rd', rooms: 10, views: 412, status: 'processing' }
    ];

    const stagingStyles = [
        { id: 'modern', name: 'Modern Contemporary', image: '/staging/modern.jpg' },
        { id: 'scandinavian', name: 'Scandinavian', image: '/staging/scandinavian.jpg' },
        { id: 'traditional', name: 'Traditional', image: '/staging/traditional.jpg' },
        { id: 'minimalist', name: 'Minimalist', image: '/staging/minimalist.jpg' },
        { id: 'industrial', name: 'Industrial', image: '/staging/industrial.jpg' },
        { id: 'bohemian', name: 'Bohemian', image: '/staging/bohemian.jpg' }
    ];

    const arFurniture = [
        { id: 'sofa-01', name: 'Modern L-Sofa', price: 1299, brand: 'IKEA' },
        { id: 'table-01', name: 'Coffee Table', price: 449, brand: 'CB2' },
        { id: 'bed-01', name: 'King Platform Bed', price: 899, brand: 'Article' },
        { id: 'chair-01', name: 'Accent Chair', price: 599, brand: 'West Elm' }
    ];

    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <ViewInArIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h3" fontWeight={700} gutterBottom>VR & AR Experience</Typography>
                    <Typography color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                        Immersive 360° virtual tours, AR furniture preview, and AI-powered virtual staging
                    </Typography>
                </Box>

                <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
                    <Tab icon={<ThreeSixtyIcon />} label="360° Virtual Tours" />
                    <Tab icon={<ChairIcon />} label="AR Furniture" />
                    <Tab icon={<ViewInArIcon />} label="Virtual Staging" />
                    <Tab icon={<ConstructionIcon />} label="Renovation Preview" />
                </Tabs>

                {activeTab === 0 && (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper sx={{ p: 3, mb: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6" fontWeight={600}>Your Virtual Tours</Typography>
                                    <Button variant="contained" startIcon={<ThreeSixtyIcon />}>Create New Tour</Button>
                                </Box>

                                <Grid container spacing={3}>
                                    {vrTours.map(tour => (
                                        <Grid item xs={12} sm={6} md={4} key={tour.id}>
                                            <Card>
                                                <CardMedia
                                                    sx={{ height: 180, bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                >
                                                    <ThreeSixtyIcon sx={{ fontSize: 60, color: 'grey.400' }} />
                                                </CardMedia>
                                                <CardContent>
                                                    <Typography variant="subtitle1" fontWeight={600}>{tour.address}</Typography>
                                                    <Box sx={{ display: 'flex', gap: 1, my: 1 }}>
                                                        <Chip label={`${tour.rooms} Rooms`} size="small" />
                                                        <Chip label={`${tour.views} Views`} size="small" variant="outlined" />
                                                    </Box>
                                                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                                        {tour.status === 'ready' ? (
                                                            <>
                                                                <Button variant="contained" size="small" startIcon={<PlayCircleIcon />}>View</Button>
                                                                <Button variant="outlined" size="small" startIcon={<FullscreenIcon />}>VR Mode</Button>
                                                            </>
                                                        ) : (
                                                            <Chip label="Processing..." color="warning" />
                                                        )}
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>VR Headset Support</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
                                    <Chip label="Meta Quest 3" color="primary" />
                                    <Chip label="HTC Vive" color="primary" />
                                    <Chip label="PlayStation VR" color="primary" />
                                    <Chip label="Apple Vision Pro" color="primary" />
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                )}

                {activeTab === 1 && (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Alert severity="info" sx={{ mb: 3 }}>
                                Point your camera at any room to see how furniture would look in real-time using AR technology
                            </Alert>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                                <ViewInArIcon sx={{ fontSize: 80, color: 'primary.main', my: 2 }} />
                                <Typography variant="h6" fontWeight={600} gutterBottom>AR Room Scanner</Typography>
                                <Typography color="text.secondary" sx={{ mb: 2 }}>
                                    Scan your room to get accurate dimensions and place furniture
                                </Typography>
                                <Button variant="contained" size="large">Open AR Camera</Button>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={8}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>Furniture Catalog</Typography>
                                <Grid container spacing={2}>
                                    {arFurniture.map(item => (
                                        <Grid item xs={6} sm={3} key={item.id}>
                                            <Card variant="outlined">
                                                <Box sx={{ height: 100, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <ChairIcon sx={{ fontSize: 40, color: 'grey.400' }} />
                                                </Box>
                                                <CardContent sx={{ py: 1.5 }}>
                                                    <Typography variant="body2" fontWeight={600}>{item.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{item.brand}</Typography>
                                                    <Typography variant="subtitle2" color="primary.main">${item.price}</Typography>
                                                    <Button size="small" fullWidth sx={{ mt: 1 }}>Place in AR</Button>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                )}

                {activeTab === 2 && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>Virtual Staging</Typography>
                                <Typography color="text.secondary" sx={{ mb: 2 }}>
                                    Transform empty rooms into beautifully staged spaces with AI
                                </Typography>

                                <Box sx={{ bgcolor: 'grey.200', height: 400, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <ViewInArIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
                                        <Typography color="text.secondary">Upload an empty room photo</Typography>
                                        <Button variant="contained" sx={{ mt: 2 }}>Upload Image</Button>
                                    </Box>
                                </Box>

                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>Staging Style</InputLabel>
                                    <Select value={style} onChange={(e) => setStyle(e.target.value)} label="Staging Style">
                                        {stagingStyles.map(s => (
                                            <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <Button variant="contained" size="large" fullWidth>Generate Staged Image</Button>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>Pricing</Typography>
                                <Grid container spacing={2}>
                                    {[
                                        { name: 'Per Image', price: 15, desc: 'Single room staging' },
                                        { name: '5 Images', price: 60, desc: 'Save 20%' },
                                        { name: '10 Images', price: 100, desc: 'Save 33%' },
                                        { name: 'Unlimited', price: 199, desc: 'Monthly subscription' }
                                    ].map(plan => (
                                        <Grid item xs={12} key={plan.name}>
                                            <Card variant="outlined">
                                                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Box>
                                                        <Typography fontWeight={600}>{plan.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{plan.desc}</Typography>
                                                    </Box>
                                                    <Typography variant="h6" color="primary.main">${plan.price}</Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                )}

                {activeTab === 3 && (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>Renovation Preview</Typography>
                                <Typography color="text.secondary" sx={{ mb: 3 }}>
                                    Visualize renovations before spending a dime with our AR renovation tool
                                </Typography>

                                <Grid container spacing={3}>
                                    {[
                                        { name: 'Kitchen Remodel', cost: '$25,000 - $75,000', roi: '70-80%', image: 'kitchen' },
                                        { name: 'Bathroom Update', cost: '$10,000 - $30,000', roi: '60-70%', image: 'bathroom' },
                                        { name: 'Flooring Upgrade', cost: '$3,000 - $15,000', roi: '70-80%', image: 'flooring' },
                                        { name: 'Paint & Refresh', cost: '$1,000 - $5,000', roi: '100%+', image: 'paint' }
                                    ].map(reno => (
                                        <Grid item xs={12} sm={6} md={3} key={reno.name}>
                                            <Card>
                                                <Box sx={{ height: 140, bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <ConstructionIcon sx={{ fontSize: 50, color: 'grey.400' }} />
                                                </Box>
                                                <CardContent>
                                                    <Typography variant="subtitle1" fontWeight={600}>{reno.name}</Typography>
                                                    <Typography variant="body2" color="text.secondary">{reno.cost}</Typography>
                                                    <Chip label={`ROI: ${reno.roi}`} size="small" color="success" sx={{ mt: 1 }} />
                                                    <Button fullWidth variant="outlined" sx={{ mt: 2 }}>Preview in AR</Button>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                )}
            </Container>
        </Box>
    );
}
