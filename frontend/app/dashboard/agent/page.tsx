'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import HomeIcon from '@mui/icons-material/Home';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LeadPipeline from '@/components/agent/LeadPipeline';
import ListingsManager from '@/components/agent/ListingsManager';
import AnalyticsDashboard from '@/components/agent/AnalyticsDashboard';

// Mock data
const stats = [
    { label: 'Active Listings', value: 12, icon: <HomeIcon />, color: '#1976d2', change: '+2' },
    { label: 'Total Leads', value: 47, icon: <PeopleIcon />, color: '#2e7d32', change: '+8' },
    { label: 'Views This Month', value: 1243, icon: <VisibilityIcon />, color: '#ed6c02', change: '+15%' },
    { label: 'Conversion Rate', value: '24%', icon: <TrendingUpIcon />, color: '#9c27b0', change: '+3%' },
];

export default function AgentDashboardPage() {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>
            {/* Header */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 4 }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Avatar sx={{ width: 80, height: 80, bgcolor: 'white', color: 'primary.main' }}>SA</Avatar>
                        <Box>
                            <Typography variant="h4" fontWeight={700}>Welcome back, Sarah!</Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                Top Realty Group • ⭐ 4.8 (127 reviews)
                            </Typography>
                        </Box>
                        <Box sx={{ ml: 'auto' }}>
                            <Chip label="Pro Account" sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 600 }} />
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -2 }}>
                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    {stats.map((stat, i) => (
                        <Grid item xs={12} sm={6} md={3} key={i}>
                            <Paper sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${stat.color}15`, color: stat.color }}>
                                        {stat.icon}
                                    </Box>
                                    <Box>
                                        <Typography variant="h4" fontWeight={700}>{stat.value}</Typography>
                                        <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                                    </Box>
                                    <Chip label={stat.change} size="small" color="success" sx={{ ml: 'auto' }} />
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Navigation Tabs */}
                <Paper sx={{ mb: 3 }}>
                    <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
                        <Tab label="Lead Pipeline" />
                        <Tab label="My Listings" />
                        <Tab label="Analytics" />
                        <Tab label="Messages" />
                    </Tabs>
                </Paper>

                {/* Tab Content */}
                {activeTab === 0 && <LeadPipeline />}
                {activeTab === 1 && <ListingsManager />}
                {activeTab === 2 && <AnalyticsDashboard />}
                {activeTab === 3 && (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography color="text.secondary">Messages feature coming soon...</Typography>
                    </Paper>
                )}
            </Container>
        </Box>
    );
}
