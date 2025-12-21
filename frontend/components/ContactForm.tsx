'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

interface ContactFormProps {
    agentId: string;
    propertyId: string;
}

export default function ContactForm({ agentId, propertyId }: ContactFormProps) {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setSubmitted(true);
        setLoading(false);
    };

    if (submitted) {
        return (
            <Alert severity="success">
                Your message has been sent! The agent will respond within 2 hours.
            </Alert>
        );
    }

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <TextField
                label="Your Name"
                fullWidth
                size="small"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                sx={{ mb: 2 }}
            />
            <TextField
                label="Email"
                type="email"
                fullWidth
                size="small"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                sx={{ mb: 2 }}
            />
            <TextField
                label="Phone"
                fullWidth
                size="small"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                sx={{ mb: 2 }}
            />
            <TextField
                label="Message"
                multiline
                rows={3}
                fullWidth
                size="small"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="I'm interested in this property..."
                sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" fullWidth disabled={loading}>
                {loading ? 'Sending...' : 'Contact Agent'}
            </Button>
        </Box>
    );
}
