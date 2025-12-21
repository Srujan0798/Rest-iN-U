'use client';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import HomeIcon from '@mui/icons-material/Home';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const marketStats = [
    { label: 'Median Home Price', value: '$485,000', change: '+5.2%', up: true },
    { label: 'Homes for Sale', value: '12,456', change: '-3.1%', up: false },
    { label: 'Days on Market', value: '28', change: '-12%', up: true },
    { label: 'Price per Sq Ft', value: '$285', change: '+8.4%', up: true },
];

const neighborhoodSpotlight = [
    { name: 'Brooklyn Heights', medianPrice: 950000, inventory: 145, trend: 'up', photo: 'https://picsum.photos/400/200?random=30' },
    { name: 'Williamsburg', medianPrice: 825000, inventory: 203, trend: 'up', photo: 'https://picsum.photos/400/200?random=31' },
    { name: 'Upper East Side', medianPrice: 1250000, inventory: 178, trend: 'down', photo: 'https://picsum.photos/400/200?random=32' },
    { name: 'Park Slope', medianPrice: 1100000, inventory: 89, trend: 'up', photo: 'https://picsum.photos/400/200?random=33' },
];

const recentSales = [
    { address: '123 Main St, Brooklyn', price: 525000, soldDate: 'Dec 15, 2025', daysOnMarket: 12 },
    { address: '456 Park Ave, Manhattan', price: 1250000, soldDate: 'Dec 14, 2025', daysOnMarket: 28 },
    { address: '789 Broadway, Queens', price: 425000, soldDate: 'Dec 13, 2025', daysOnMarket: 45 },
    { address: '321 5th Ave, Brooklyn', price: 675000, soldDate: 'Dec 12, 2025', daysOnMarket: 8 },
];

export default function MarketInsightsPage() {
    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Typography variant="h4" fontWeight={700} gutterBottom>Market Insights</Typography>
                <Typography color="text.secondary" sx={{ mb: 4 }}>
                    Real-time market data for New York Metro Area
                </Typography>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {marketStats.map((stat, i) => (
                        <Grid item xs={6} md={3} key={i}>
                            <Paper sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="h4" fontWeight={700}>{stat.value}</Typography>
                                <Typography color="text.secondary" gutterBottom>{stat.label}</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                    {stat.up ? (
                                        <TrendingUpIcon fontSize="small" color="success" />
                                    ) : (
                                        <TrendingDownIcon fontSize="small" color="error" />
                                    )}
                                    <Typography variant="body2" color={stat.up ? 'success.main' : 'error.main'}>
                                        {stat.change} YoY
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                <Grid container spacing={4}>
                    {/* Neighborhood Spotlight */}
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>Neighborhood Spotlight</Typography>
                            <Grid container spacing={2}>
                                {neighborhoodSpotlight.map((n, i) => (
                                    <Grid item xs={12} sm={6} key={i}>
                                        <Card>
                                            <CardMedia component="img" height="120" image={n.photo} alt={n.name} />
                                            <CardContent sx={{ py: 2 }}>
                                                <Typography fontWeight={600}>{n.name}</Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary">Median Price</Typography>
                                                        <Typography fontWeight={600}>${n.medianPrice.toLocaleString()}</Typography>
                                                    </Box>
                                                    <Box sx={{ textAlign: 'right' }}>
                                                        <Typography variant="body2" color="text.secondary">Inventory</Typography>
                                                        <Typography fontWeight={600}>{n.inventory} homes</Typography>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Recent Sales */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>Recent Sales</Typography>
                            {recentSales.map((sale, i) => (
                                <Box key={i} sx={{ py: 2, borderBottom: i < recentSales.length - 1 ? 1 : 0, borderColor: 'divider' }}>
                                    <Typography fontWeight={500} noWrap>{sale.address}</Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                        <Typography variant="body2" color="success.main" fontWeight={600}>
                                            ${sale.price.toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {sale.daysOnMarket} days
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">{sale.soldDate}</Typography>
                                </Box>
                            ))}
                        </Paper>
                    </Grid>

                    {/* CTA */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
                            <Typography variant="h5" fontWeight={600} gutterBottom>
                                Want personalized market insights?
                            </Typography>
                            <Typography sx={{ mb: 3, opacity: 0.9 }}>
                                Get a custom report for your neighborhood and property type
                            </Typography>
                            <Button variant="contained" sx={{ bgcolor: 'white', color: 'primary.main' }}>
                                Get Free Report
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
