'use client';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';

export default function TermsPage() {
    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 6 }}>
            <Container maxWidth="md">
                <Paper sx={{ p: 5 }}>
                    <Typography variant="h3" fontWeight={700} gutterBottom>Terms of Service</Typography>
                    <Typography color="text.secondary" gutterBottom>Last updated: December 2025</Typography>
                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 4 }}>1. Acceptance of Terms</Typography>
                    <Typography paragraph>
                        By accessing or using Rest-iN-U, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                    </Typography>

                    <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 4 }}>2. Use of Service</Typography>
                    <Typography paragraph>
                        You may use our services for lawful purposes only. You agree not to misuse our platform, submit false information, or interfere with other users' access.
                    </Typography>

                    <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 4 }}>3. User Accounts</Typography>
                    <Typography paragraph>
                        You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. Notify us immediately of any unauthorized use.
                    </Typography>

                    <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 4 }}>4. Property Listings</Typography>
                    <Typography paragraph>
                        Property information is provided by third parties including real estate agents and MLS services. While we strive for accuracy, we cannot guarantee the completeness or accuracy of all listings.
                    </Typography>

                    <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 4 }}>5. Agent Services</Typography>
                    <Typography paragraph>
                        Real estate agents using our platform are independent professionals. Rest-iN-U is not responsible for the actions, advice, or services provided by agents.
                    </Typography>

                    <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 4 }}>6. Intellectual Property</Typography>
                    <Typography paragraph>
                        All content on Rest-iN-U, including text, graphics, logos, and software, is our property or licensed to us. You may not copy, distribute, or create derivative works without permission.
                    </Typography>

                    <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 4 }}>7. Limitation of Liability</Typography>
                    <Typography paragraph>
                        Rest-iN-U is provided "as is" without warranties. We are not liable for any damages arising from your use of our services or reliance on information provided.
                    </Typography>

                    <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 4 }}>8. Changes to Terms</Typography>
                    <Typography paragraph>
                        We may modify these terms at any time. Continued use of our services constitutes acceptance of updated terms.
                    </Typography>

                    <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 4 }}>9. Contact</Typography>
                    <Typography paragraph>
                        For questions about these terms, contact us at legal@restinu.com.
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
}
