'use client';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';

export default function PrivacyPage() {
    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 6 }}>
            <Container maxWidth="md">
                <Paper sx={{ p: 5 }}>
                    <Typography variant="h3" fontWeight={700} gutterBottom>Privacy Policy</Typography>
                    <Typography color="text.secondary" gutterBottom>Last updated: December 2025</Typography>
                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 4 }}>1. Information We Collect</Typography>
                    <Typography paragraph>
                        We collect information you provide directly, including name, email, phone number, and property preferences when you create an account, contact agents, or use our services.
                    </Typography>
                    <Typography paragraph>
                        We automatically collect usage data including IP address, browser type, pages visited, and time spent on our platform to improve our services.
                    </Typography>

                    <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 4 }}>2. How We Use Your Information</Typography>
                    <Typography paragraph>
                        We use your information to provide and improve our services, connect you with real estate professionals, send relevant property alerts, and communicate about your account.
                    </Typography>

                    <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 4 }}>3. Information Sharing</Typography>
                    <Typography paragraph>
                        We share your information with real estate agents when you submit inquiries, with service providers who help us operate our platform, and as required by law.
                    </Typography>
                    <Typography paragraph>
                        We do not sell your personal information to third parties for marketing purposes.
                    </Typography>

                    <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 4 }}>4. Cookies and Tracking</Typography>
                    <Typography paragraph>
                        We use cookies and similar technologies to remember your preferences, analyze traffic, and personalize your experience. You can manage cookie preferences in your browser settings.
                    </Typography>

                    <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 4 }}>5. Data Security</Typography>
                    <Typography paragraph>
                        We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits.
                    </Typography>

                    <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 4 }}>6. Your Rights</Typography>
                    <Typography paragraph>
                        You have the right to access, correct, or delete your personal information. You can update your preferences in account settings or contact us directly.
                    </Typography>

                    <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 4 }}>7. Contact Us</Typography>
                    <Typography paragraph>
                        For privacy questions or concerns, contact us at privacy@restinu.com or through our contact page.
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
}
