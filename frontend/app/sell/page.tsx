'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import Slider from '@mui/material/Slider';
import Alert from '@mui/material/Alert';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HomeIcon from '@mui/icons-material/Home';

export default function SellPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        address: '',
        propertyType: '',
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1500,
        yearBuilt: 2000,
        condition: 'GOOD',
    });
    const [estimate, setEstimate] = useState<number | null>(null);

    const handleGetEstimate = () => {
        // Mock valuation calculation
        const basePrice = formData.squareFeet * 250;
        const bedroomBonus = formData.bedrooms * 20000;
        const bathroomBonus = formData.bathrooms * 15000;
        const conditionMultiplier = formData.condition === 'EXCELLENT' ? 1.1 : formData.condition === 'GOOD' ? 1 : 0.85;
        const ageDeduction = Math.max(0, (2024 - formData.yearBuilt) * 500);

        const calculatedEstimate = Math.round((basePrice + bedroomBonus + bathroomBonus - ageDeduction) * conditionMultiplier);
        setEstimate(calculatedEstimate);
        setStep(2);
    };

    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 6 }}>
            <Container maxWidth="lg">
                {/* Hero */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h3" fontWeight={700} gutterBottom>Sell Your Home</Typography>
                    <Typography variant="h6" color="text.secondary">
                        Get a free home valuation and connect with top agents
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={7}>
                        {step === 1 ? (
                            <Paper sx={{ p: 4 }}>
                                <Typography variant="h5" fontWeight={600} gutterBottom>
                                    <HomeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Property Details
                                </Typography>
                                <Typography color="text.secondary" sx={{ mb: 3 }}>
                                    Tell us about your home to get an instant estimate
                                </Typography>

                                <TextField
                                    label="Property Address"
                                    fullWidth
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><LocationOnIcon /></InputAdornment>
                                    }}
                                    sx={{ mb: 3 }}
                                />

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Property Type</InputLabel>
                                            <Select
                                                value={formData.propertyType}
                                                label="Property Type"
                                                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                                            >
                                                <MenuItem value="HOUSE">Single Family Home</MenuItem>
                                                <MenuItem value="CONDO">Condo</MenuItem>
                                                <MenuItem value="TOWNHOUSE">Townhouse</MenuItem>
                                                <MenuItem value="MULTI_FAMILY">Multi-Family</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Condition</InputLabel>
                                            <Select
                                                value={formData.condition}
                                                label="Condition"
                                                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                            >
                                                <MenuItem value="EXCELLENT">Excellent</MenuItem>
                                                <MenuItem value="GOOD">Good</MenuItem>
                                                <MenuItem value="FAIR">Fair</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>

                                <Box sx={{ mt: 3 }}>
                                    <Typography gutterBottom>Bedrooms: {formData.bedrooms}</Typography>
                                    <Slider
                                        value={formData.bedrooms}
                                        onChange={(e, v) => setFormData({ ...formData, bedrooms: v as number })}
                                        min={1}
                                        max={6}
                                        marks
                                    />
                                </Box>

                                <Box sx={{ mt: 2 }}>
                                    <Typography gutterBottom>Bathrooms: {formData.bathrooms}</Typography>
                                    <Slider
                                        value={formData.bathrooms}
                                        onChange={(e, v) => setFormData({ ...formData, bathrooms: v as number })}
                                        min={1}
                                        max={5}
                                        marks
                                    />
                                </Box>

                                <Box sx={{ mt: 2 }}>
                                    <Typography gutterBottom>Square Feet: {formData.squareFeet.toLocaleString()}</Typography>
                                    <Slider
                                        value={formData.squareFeet}
                                        onChange={(e, v) => setFormData({ ...formData, squareFeet: v as number })}
                                        min={500}
                                        max={5000}
                                        step={100}
                                    />
                                </Box>

                                <TextField
                                    label="Year Built"
                                    type="number"
                                    fullWidth
                                    value={formData.yearBuilt}
                                    onChange={(e) => setFormData({ ...formData, yearBuilt: parseInt(e.target.value) })}
                                    sx={{ mt: 3 }}
                                />

                                <Button
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    onClick={handleGetEstimate}
                                    sx={{ mt: 4 }}
                                >
                                    Get Free Estimate
                                </Button>
                            </Paper>
                        ) : (
                            <Paper sx={{ p: 4 }}>
                                <Typography variant="h5" fontWeight={600} gutterBottom>
                                    <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'success.main' }} />
                                    Your Home Estimate
                                </Typography>

                                <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'success.50', borderRadius: 2, mb: 3 }}>
                                    <Typography variant="h3" fontWeight={700} color="success.main">
                                        ${estimate?.toLocaleString()}
                                    </Typography>
                                    <Typography color="text.secondary">Estimated Value</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        Range: ${Math.round((estimate || 0) * 0.95).toLocaleString()} - ${Math.round((estimate || 0) * 1.05).toLocaleString()}
                                    </Typography>
                                </Box>

                                <Alert severity="info" sx={{ mb: 3 }}>
                                    This is an automated estimate. Connect with an agent for a more accurate valuation.
                                </Alert>

                                <Typography variant="h6" fontWeight={600} gutterBottom>Next Steps</Typography>
                                <Button variant="contained" size="large" fullWidth sx={{ mb: 2 }}>
                                    Connect with a Local Agent
                                </Button>
                                <Button variant="outlined" size="large" fullWidth onClick={() => setStep(1)}>
                                    Update Details
                                </Button>
                            </Paper>
                        )}
                    </Grid>

                    <Grid item xs={12} md={5}>
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>Why Sell with Us?</Typography>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <AttachMoneyIcon color="primary" />
                                <Box>
                                    <Typography fontWeight={500}>No Hidden Fees</Typography>
                                    <Typography variant="body2" color="text.secondary">Transparent pricing</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <TrendingUpIcon color="primary" />
                                <Box>
                                    <Typography fontWeight={500}>Market Insights</Typography>
                                    <Typography variant="body2" color="text.secondary">Data-driven pricing</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <HomeIcon color="primary" />
                                <Box>
                                    <Typography fontWeight={500}>Expert Agents</Typography>
                                    <Typography variant="body2" color="text.secondary">Top-rated professionals</Typography>
                                </Box>
                            </Box>
                        </Paper>

                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>Have Questions?</Typography>
                            <Typography color="text.secondary" sx={{ mb: 2 }}>
                                Our team is here to help you every step of the way
                            </Typography>
                            <Button variant="outlined" fullWidth>Talk to an Expert</Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
