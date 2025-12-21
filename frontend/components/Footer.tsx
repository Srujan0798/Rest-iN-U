'use client';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';

export default function Footer() {
    return (
        <Box sx={{ bgcolor: 'grey.900', color: 'grey.300', py: 6 }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" color="white" fontWeight={700} gutterBottom>
                            Rest-iN-U
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            The future of real estate technology. Find your perfect home with AI-powered search, virtual tours, and expert agents.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton color="inherit" size="small"><FacebookIcon /></IconButton>
                            <IconButton color="inherit" size="small"><TwitterIcon /></IconButton>
                            <IconButton color="inherit" size="small"><InstagramIcon /></IconButton>
                            <IconButton color="inherit" size="small"><LinkedInIcon /></IconButton>
                            <IconButton color="inherit" size="small"><YouTubeIcon /></IconButton>
                        </Box>
                    </Grid>

                    <Grid item xs={6} sm={2}>
                        <Typography variant="subtitle1" color="white" fontWeight={600} gutterBottom>Explore</Typography>
                        <Link href="/search" color="inherit" display="block" sx={{ mb: 1 }}>Buy</Link>
                        <Link href="/rent" color="inherit" display="block" sx={{ mb: 1 }}>Rent</Link>
                        <Link href="/sell" color="inherit" display="block" sx={{ mb: 1 }}>Sell</Link>
                        <Link href="/agents" color="inherit" display="block" sx={{ mb: 1 }}>Find Agents</Link>
                        <Link href="/open-houses" color="inherit" display="block" sx={{ mb: 1 }}>Open Houses</Link>
                    </Grid>

                    <Grid item xs={6} sm={2}>
                        <Typography variant="subtitle1" color="white" fontWeight={600} gutterBottom>Tools</Typography>
                        <Link href="/valuation" color="inherit" display="block" sx={{ mb: 1 }}>Home Value</Link>
                        <Link href="/market" color="inherit" display="block" sx={{ mb: 1 }}>Market Insights</Link>
                        <Link href="/compare" color="inherit" display="block" sx={{ mb: 1 }}>Compare Homes</Link>
                    </Grid>

                    <Grid item xs={6} sm={2}>
                        <Typography variant="subtitle1" color="white" fontWeight={600} gutterBottom>Company</Typography>
                        <Link href="/about" color="inherit" display="block" sx={{ mb: 1 }}>About Us</Link>
                        <Link href="/contact" color="inherit" display="block" sx={{ mb: 1 }}>Contact</Link>
                        <Link href="/faq" color="inherit" display="block" sx={{ mb: 1 }}>FAQ</Link>
                    </Grid>

                    <Grid item xs={6} sm={2}>
                        <Typography variant="subtitle1" color="white" fontWeight={600} gutterBottom>For Agents</Typography>
                        <Link href="/register" color="inherit" display="block" sx={{ mb: 1 }}>Join as Agent</Link>
                        <Link href="/dashboard/agent" color="inherit" display="block" sx={{ mb: 1 }}>Agent Dashboard</Link>
                    </Grid>
                </Grid>

                {/* Newsletter */}
                <Box sx={{ borderTop: 1, borderColor: 'grey.700', mt: 4, pt: 4 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" color="white" fontWeight={600}>Stay Updated</Typography>
                            <Typography variant="body2">Get the latest listings and market updates</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                    placeholder="Enter your email"
                                    size="small"
                                    sx={{ flex: 1, bgcolor: 'grey.800', borderRadius: 1, '& fieldset': { border: 'none' }, input: { color: 'white' } }}
                                />
                                <Button variant="contained">Subscribe</Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                {/* Bottom */}
                <Box sx={{ borderTop: 1, borderColor: 'grey.700', mt: 4, pt: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">© 2025 Rest-iN-U. All rights reserved.</Typography>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <Link href="/privacy" color="inherit" sx={{ fontSize: 14 }}>Privacy Policy</Link>
                        <Link href="/terms" color="inherit" sx={{ fontSize: 14 }}>Terms of Service</Link>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
