'use client';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const stats = [
    { value: '2M+', label: 'Properties Listed' },
    { value: '500K+', label: 'Happy Customers' },
    { value: '10K+', label: 'Verified Agents' },
    { value: '50', label: 'States Covered' },
];

const values = [
    { icon: <SecurityIcon sx={{ fontSize: 40 }} />, title: 'Trust & Transparency', desc: 'We believe in honest listings and verified information' },
    { icon: <SpeedIcon sx={{ fontSize: 40 }} />, title: 'Innovation', desc: 'Cutting-edge technology to simplify your search' },
    { icon: <SupportAgentIcon sx={{ fontSize: 40 }} />, title: 'Customer First', desc: 'Your satisfaction is our top priority' },
    { icon: <GroupsIcon sx={{ fontSize: 40 }} />, title: 'Community', desc: 'Building communities, one home at a time' },
];

const team = [
    { name: 'Alex Thompson', role: 'CEO & Founder', photo: 'https://picsum.photos/200/200?random=20' },
    { name: 'Maria Garcia', role: 'CTO', photo: 'https://picsum.photos/200/200?random=21' },
    { name: 'James Wilson', role: 'Head of Product', photo: 'https://picsum.photos/200/200?random=22' },
    { name: 'Sarah Chen', role: 'Head of Marketing', photo: 'https://picsum.photos/200/200?random=23' },
];

export default function AboutPage() {
    return (
        <Box>
            {/* Hero */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 10, textAlign: 'center' }}>
                <Container maxWidth="md">
                    <HomeIcon sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h3" fontWeight={700} gutterBottom>About Rest-iN-U</Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                        We're on a mission to make finding your perfect home simple, transparent, and enjoyable
                    </Typography>
                </Container>
            </Box>

            {/* Stats */}
            <Container maxWidth="lg" sx={{ mt: -4 }}>
                <Paper sx={{ p: 4 }}>
                    <Grid container spacing={4}>
                        {stats.map((stat, i) => (
                            <Grid item xs={6} md={3} key={i}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h3" fontWeight={700} color="primary">{stat.value}</Typography>
                                    <Typography color="text.secondary">{stat.label}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Container>

            {/* Story */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" fontWeight={700} gutterBottom>Our Story</Typography>
                        <Typography color="text.secondary" paragraph>
                            Rest-iN-U was founded in 2020 with a simple idea: buying or renting a home shouldn't be stressful.
                            Our founders experienced firsthand the frustration of outdated listings, unresponsive agents, and
                            confusing processes.
                        </Typography>
                        <Typography color="text.secondary" paragraph>
                            Today, we're the fastest-growing real estate platform in the country, connecting millions of buyers
                            and renters with their perfect homes. We combine cutting-edge technology with human expertise to
                            deliver an unmatched experience.
                        </Typography>
                        <Typography color="text.secondary">
                            Whether you're a first-time buyer, seasoned investor, or looking to sell, Rest-iN-U is here to
                            make your real estate journey smooth and successful.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box
                            component="img"
                            src="https://picsum.photos/600/400?random=30"
                            alt="Our Team"
                            sx={{ width: '100%', borderRadius: 3, boxShadow: 3 }}
                        />
                    </Grid>
                </Grid>
            </Container>

            {/* Values */}
            <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>Our Values</Typography>
                    <Typography color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
                        The principles that guide everything we do
                    </Typography>
                    <Grid container spacing={4}>
                        {values.map((value, i) => (
                            <Grid item xs={12} sm={6} md={3} key={i}>
                                <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                                    <CardContent>
                                        <Box sx={{ color: 'primary.main', mb: 2 }}>{value.icon}</Box>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>{value.title}</Typography>
                                        <Typography color="text.secondary">{value.desc}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Team */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>Leadership Team</Typography>
                <Typography color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
                    The people behind Rest-iN-U
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                    {team.map((member, i) => (
                        <Grid item xs={6} sm={3} key={i}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Avatar src={member.photo} sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }} />
                                <Typography fontWeight={600}>{member.name}</Typography>
                                <Typography variant="body2" color="text.secondary">{member.role}</Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* CTA */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8, textAlign: 'center' }}>
                <Container maxWidth="sm">
                    <Typography variant="h4" fontWeight={700} gutterBottom>Join Our Journey</Typography>
                    <Typography sx={{ mb: 3, opacity: 0.9 }}>
                        Ready to find your dream home or grow your real estate business?
                    </Typography>
                    <Button variant="contained" size="large" sx={{ bgcolor: 'white', color: 'primary.main', mr: 2 }}>
                        Get Started
                    </Button>
                    <Button variant="outlined" size="large" sx={{ borderColor: 'white', color: 'white' }}>
                        Contact Us
                    </Button>
                </Container>
            </Box>
        </Box>
    );
}
