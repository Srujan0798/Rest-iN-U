'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function ValuationPage() {
    const [address, setAddress] = useState('');
    const [details, setDetails] = useState({ bedrooms: '', bathrooms: '', squareFeet: '', yearBuilt: '' });
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleEstimate = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock result
        const basePrice = parseInt(details.squareFeet || '1800') * 250;
        setResult({
            estimate: basePrice,
            confidence_low: Math.round(basePrice * 0.95),
            confidence_high: Math.round(basePrice * 1.05),
            confidence_score: 0.82,
        });
        setLoading(false);
    };

    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 6 }}>
            <Container maxWidth="md">
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <TrendingUpIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h3" fontWeight={700} gutterBottom>
                        What's Your Home Worth?
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Get an instant AI-powered estimate of your home's market value
                    </Typography>
                </Box>

                <Paper sx={{ p: 4 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                label="Property Address"
                                placeholder="Enter full address"
                                fullWidth
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TextField
                                label="Bedrooms"
                                type="number"
                                fullWidth
                                value={details.bedrooms}
                                onChange={(e) => setDetails({ ...details, bedrooms: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TextField
                                label="Bathrooms"
                                type="number"
                                fullWidth
                                value={details.bathrooms}
                                onChange={(e) => setDetails({ ...details, bathrooms: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TextField
                                label="Square Feet"
                                type="number"
                                fullWidth
                                value={details.squareFeet}
                                onChange={(e) => setDetails({ ...details, squareFeet: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <TextField
                                label="Year Built"
                                type="number"
                                fullWidth
                                value={details.yearBuilt}
                                onChange={(e) => setDetails({ ...details, yearBuilt: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" size="large" fullWidth onClick={handleEstimate} disabled={loading || !address}>
                                {loading ? 'Analyzing...' : 'Get Estimate'}
                            </Button>
                        </Grid>
                    </Grid>

                    {loading && <LinearProgress sx={{ mt: 3 }} />}

                    {result && (
                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">Estimated Value</Typography>
                            <Typography variant="h2" fontWeight={700} color="primary">
                                ${result.estimate.toLocaleString()}
                            </Typography>
                            <Typography color="text.secondary">
                                Range: ${result.confidence_low.toLocaleString()} - ${result.confidence_high.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 2 }}>
                                Confidence: {Math.round(result.confidence_score * 100)}%
                            </Typography>
                        </Box>
                    )}
                </Paper>
            </Container>
        </Box>
    );
}
