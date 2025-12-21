'use client';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const monthlyData = {
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
        { label: 'Views', data: [1200, 1900, 1500, 2100, 1800, 2400], backgroundColor: '#1976d2' },
        { label: 'Inquiries', data: [45, 72, 58, 89, 76, 102], backgroundColor: '#2e7d32' },
    ],
};

const conversionData = {
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
        label: 'Conversion Rate %',
        data: [18, 22, 19, 24, 21, 26],
        borderColor: '#9c27b0',
        backgroundColor: 'rgba(156, 39, 176, 0.1)',
        fill: true,
        tension: 0.4,
    }],
};

const leadSourceData = {
    labels: ['Property Inquiry', 'Direct Search', 'Referral', 'Social Media'],
    datasets: [{
        data: [45, 30, 15, 10],
        backgroundColor: ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0'],
    }],
};

export default function AnalyticsDashboard() {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>Views & Inquiries</Typography>
                    <Box sx={{ height: 300 }}>
                        <Bar data={monthlyData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </Box>
                </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>Lead Sources</Typography>
                    <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Doughnut data={leadSourceData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </Box>
                </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>Conversion Rate Trend</Typography>
                    <Box sx={{ height: 250 }}>
                        <Line data={conversionData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </Box>
                </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>Performance Summary</Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                <Typography variant="h4" fontWeight={700} color="primary">$2.4M</Typography>
                                <Typography variant="body2" color="text.secondary">Total Sales Volume</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                <Typography variant="h4" fontWeight={700} color="success.main">8</Typography>
                                <Typography variant="body2" color="text.secondary">Properties Sold</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                <Typography variant="h4" fontWeight={700} color="warning.main">23</Typography>
                                <Typography variant="body2" color="text.secondary">Avg Days on Market</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                                <Typography variant="h4" fontWeight={700} color="secondary.main">4.8</Typography>
                                <Typography variant="body2" color="text.secondary">Client Rating</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
}
