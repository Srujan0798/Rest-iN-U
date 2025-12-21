'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import HomeIcon from '@mui/icons-material/Home';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 8, display: 'flex', alignItems: 'center' }}>
            <Container maxWidth="sm">
                <Paper sx={{ p: 4 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <HomeIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                        <Typography variant="h4" fontWeight={700} gutterBottom>Welcome Back</Typography>
                        <Typography color="text.secondary">Sign in to your Rest-iN-U account</Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            sx={{ mb: 3 }}
                        />
                        <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </Box>

                    <Divider sx={{ my: 3 }}>or</Divider>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button variant="outlined" fullWidth startIcon={<GoogleIcon />}>Google</Button>
                        <Button variant="outlined" fullWidth startIcon={<FacebookIcon />}>Facebook</Button>
                    </Box>

                    <Typography textAlign="center" sx={{ mt: 3 }}>
                        Don't have an account? <Link href="/register" style={{ color: '#1976d2' }}>Sign up</Link>
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
}
