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
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import HomeIcon from '@mui/icons-material/Home';

const steps = ['Account Info', 'Personal Details', 'Account Type'];

export default function RegisterPage() {
    const router = useRouter();
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        email: '', password: '', confirmPassword: '',
        firstName: '', lastName: '', phone: '',
        userType: 'BUYER'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleNext = () => {
        if (activeStep === 0) {
            if (!formData.email || !formData.password) {
                setError('Please fill in all fields');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return;
            }
        }
        setError('');
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/v1/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    userType: formData.userType,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed');
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
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 8 }}>
            <Container maxWidth="sm">
                <Paper sx={{ p: 4 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <HomeIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                        <Typography variant="h4" fontWeight={700} gutterBottom>Create Account</Typography>
                        <Typography color="text.secondary">Join Rest-iN-U and find your dream home</Typography>
                    </Box>

                    <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                        {steps.map((label) => (
                            <Step key={label}><StepLabel>{label}</StepLabel></Step>
                        ))}
                    </Stepper>

                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                    {activeStep === 0 && (
                        <Box>
                            <TextField label="Email" type="email" fullWidth required value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })} sx={{ mb: 2 }} />
                            <TextField label="Password" type="password" fullWidth required value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })} sx={{ mb: 2 }}
                                helperText="At least 8 characters" />
                            <TextField label="Confirm Password" type="password" fullWidth required value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} sx={{ mb: 2 }} />
                        </Box>
                    )}

                    {activeStep === 1 && (
                        <Box>
                            <TextField label="First Name" fullWidth required value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} sx={{ mb: 2 }} />
                            <TextField label="Last Name" fullWidth required value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} sx={{ mb: 2 }} />
                            <TextField label="Phone Number" fullWidth value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} sx={{ mb: 2 }} />
                        </Box>
                    )}

                    {activeStep === 2 && (
                        <Box>
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>I am a</InputLabel>
                                <Select value={formData.userType} label="I am a"
                                    onChange={(e) => setFormData({ ...formData, userType: e.target.value })}>
                                    <MenuItem value="BUYER">Home Buyer</MenuItem>
                                    <MenuItem value="SELLER">Property Seller</MenuItem>
                                    <MenuItem value="AGENT">Real Estate Agent</MenuItem>
                                </Select>
                            </FormControl>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {formData.userType === 'AGENT'
                                    ? 'You will need to provide your license information after registration.'
                                    : 'You can always change this later in your settings.'}
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                        {activeStep > 0 && (
                            <Button variant="outlined" onClick={handleBack} fullWidth>Back</Button>
                        )}
                        {activeStep < steps.length - 1 ? (
                            <Button variant="contained" onClick={handleNext} fullWidth>Next</Button>
                        ) : (
                            <Button variant="contained" onClick={handleSubmit} fullWidth disabled={loading}>
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        )}
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography textAlign="center">
                        Already have an account? <Link href="/login" style={{ color: '#1976d2' }}>Sign in</Link>
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
}
