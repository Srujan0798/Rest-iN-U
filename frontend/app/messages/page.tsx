'use client';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ChatWindow from '@/components/ChatWindow';

export default function MessagesPage() {
    // In production, get current user from auth context
    const currentUserId = 'current-user-id';

    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Typography variant="h4" fontWeight={700} gutterBottom>Messages</Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Stay connected with agents and buyers
                </Typography>
                <ChatWindow currentUserId={currentUserId} />
            </Container>
        </Box>
    );
}
