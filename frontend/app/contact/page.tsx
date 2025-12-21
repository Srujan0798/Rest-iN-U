'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate form submission
        setSubmitted(true);
    };

    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 6 }}>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h3" fontWeight={700} gutterBottom>Contact Us</Typography>
                    <Typography variant="h6" color="text.secondary">
                        Have questions? We'd love to hear from you
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {/* Contact Form */}
                    <Grid item xs={12} md={7}>
                        <Paper sx={{ p: 4 }}>
                            <Typography variant="h5" fontWeight={600} gutterBottom>Send us a Message</Typography>

                            {submitted ? (
                                <Alert severity="success" sx={{ mt: 2 }}>
                                    Thank you for your message! We'll get back to you within 24 hours.
                                </Alert>
                            ) : (
                                <Box component="form" onSubmit={handleSubmit}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Your Name"
                                                fullWidth
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Email"
                                                type="email"
                                                fullWidth
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Phone"
                                                fullWidth
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Subject</InputLabel>
                                                <Select
                                                    value={formData.subject}
                                                    label="Subject"
                                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                >
                                                    <MenuItem value="general">General Inquiry</MenuItem>
                                                    <MenuItem value="support">Technical Support</MenuItem>
                                                    <MenuItem value="billing">Billing Question</MenuItem>
                                                    <MenuItem value="agent">Become an Agent</MenuItem>
                                                    <MenuItem value="partnership">Partnership</MenuItem>
                                                    <MenuItem value="press">Press Inquiry</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Your Message"
                                                multiline
                                                rows={5}
                                                fullWidth
                                                required
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button type="submit" variant="contained" size="large">
                                                Send Message
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                        </Paper>
                    </Grid>

                    {/* Contact Info */}
                    <Grid item xs={12} md={5}>
                        <Paper sx={{ p: 4, mb: 3 }}>
                            <Typography variant="h5" fontWeight={600} gutterBottom>Get in Touch</Typography>

                            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                <LocationOnIcon color="primary" />
                                <Box>
                                    <Typography fontWeight={600}>Headquarters</Typography>
                                    <Typography color="text.secondary">
                                        123 Real Estate Ave<br />
                                        New York, NY 10001
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                <PhoneIcon color="primary" />
                                <Box>
                                    <Typography fontWeight={600}>Phone</Typography>
                                    <Typography color="text.secondary">
                                        (800) 123-4567
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                <EmailIcon color="primary" />
                                <Box>
                                    <Typography fontWeight={600}>Email</Typography>
                                    <Typography color="text.secondary">
                                        support@restinu.com
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <AccessTimeIcon color="primary" />
                                <Box>
                                    <Typography fontWeight={600}>Hours</Typography>
                                    <Typography color="text.secondary">
                                        Mon - Fri: 9AM - 6PM EST<br />
                                        Sat: 10AM - 4PM EST<br />
                                        Sun: Closed
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>

                        <Paper sx={{ p: 4 }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>Quick Links</Typography>
                            <Typography color="primary" sx={{ cursor: 'pointer', mb: 1 }}>→ Help Center</Typography>
                            <Typography color="primary" sx={{ cursor: 'pointer', mb: 1 }}>→ FAQ</Typography>
                            <Typography color="primary" sx={{ cursor: 'pointer', mb: 1 }}>→ Agent Support</Typography>
                            <Typography color="primary" sx={{ cursor: 'pointer' }}>→ Report a Problem</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
