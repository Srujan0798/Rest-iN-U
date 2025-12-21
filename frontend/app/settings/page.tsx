'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Alert from '@mui/material/Alert';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import PaymentIcon from '@mui/icons-material/Payment';
import DeleteIcon from '@mui/icons-material/Delete';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState(0);
    const [saved, setSaved] = useState(false);

    const [profile, setProfile] = useState({
        firstName: 'John',
        lastName: 'Buyer',
        email: 'john@example.com',
        phone: '555-0101',
    });

    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        pushNotifications: true,
        newListings: true,
        priceChanges: true,
        agentMessages: true,
        marketingEmails: false,
    });

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="md">
                <Typography variant="h4" fontWeight={700} gutterBottom>Settings</Typography>

                <Paper sx={{ mb: 3 }}>
                    <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
                        <Tab icon={<PersonIcon />} label="Profile" iconPosition="start" />
                        <Tab icon={<NotificationsIcon />} label="Notifications" iconPosition="start" />
                        <Tab icon={<SecurityIcon />} label="Security" iconPosition="start" />
                        <Tab icon={<PaymentIcon />} label="Subscription" iconPosition="start" />
                    </Tabs>
                </Paper>

                {saved && <Alert severity="success" sx={{ mb: 2 }}>Settings saved successfully!</Alert>}

                {/* Profile Tab */}
                {activeTab === 0 && (
                    <Paper sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                            <Avatar sx={{ width: 80, height: 80 }}><PersonIcon sx={{ fontSize: 40 }} /></Avatar>
                            <Box>
                                <Button variant="outlined" size="small">Change Photo</Button>
                                <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                                    JPG, PNG or GIF. Max 5MB.
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <TextField label="First Name" fullWidth value={profile.firstName}
                                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
                            <TextField label="Last Name" fullWidth value={profile.lastName}
                                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
                        </Box>
                        <TextField label="Email" type="email" fullWidth value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })} sx={{ mb: 2 }} />
                        <TextField label="Phone" fullWidth value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })} sx={{ mb: 3 }} />

                        <Button variant="contained" onClick={handleSave}>Save Changes</Button>
                    </Paper>
                )}

                {/* Notifications Tab */}
                {activeTab === 1 && (
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>Email Notifications</Typography>
                        <List>
                            <ListItem>
                                <ListItemText primary="New Listing Alerts" secondary="Get notified when new properties match your saved searches" />
                                <Switch checked={notifications.newListings}
                                    onChange={(e) => setNotifications({ ...notifications, newListings: e.target.checked })} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Price Change Alerts" secondary="Get notified when prices change on your saved properties" />
                                <Switch checked={notifications.priceChanges}
                                    onChange={(e) => setNotifications({ ...notifications, priceChanges: e.target.checked })} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Agent Messages" secondary="Receive email when an agent responds to your inquiry" />
                                <Switch checked={notifications.agentMessages}
                                    onChange={(e) => setNotifications({ ...notifications, agentMessages: e.target.checked })} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Marketing Emails" secondary="Receive tips, market updates, and promotional offers" />
                                <Switch checked={notifications.marketingEmails}
                                    onChange={(e) => setNotifications({ ...notifications, marketingEmails: e.target.checked })} />
                            </ListItem>
                        </List>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="h6" fontWeight={600} gutterBottom>Push Notifications</Typography>
                        <FormControlLabel
                            control={<Switch checked={notifications.pushNotifications}
                                onChange={(e) => setNotifications({ ...notifications, pushNotifications: e.target.checked })} />}
                            label="Enable push notifications in browser"
                        />

                        <Box sx={{ mt: 3 }}>
                            <Button variant="contained" onClick={handleSave}>Save Preferences</Button>
                        </Box>
                    </Paper>
                )}

                {/* Security Tab */}
                {activeTab === 2 && (
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>Change Password</Typography>
                        <TextField label="Current Password" type="password" fullWidth sx={{ mb: 2 }} />
                        <TextField label="New Password" type="password" fullWidth sx={{ mb: 2 }} />
                        <TextField label="Confirm New Password" type="password" fullWidth sx={{ mb: 3 }} />
                        <Button variant="contained" sx={{ mb: 4 }}>Update Password</Button>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h6" fontWeight={600} gutterBottom>Two-Factor Authentication</Typography>
                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                            Add an extra layer of security to your account
                        </Typography>
                        <Button variant="outlined">Enable 2FA</Button>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h6" fontWeight={600} color="error" gutterBottom>Danger Zone</Typography>
                        <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>
                            Delete Account
                        </Button>
                    </Paper>
                )}

                {/* Subscription Tab */}
                {activeTab === 3 && (
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>Current Plan</Typography>
                        <Box sx={{ p: 3, bgcolor: 'grey.100', borderRadius: 2, mb: 3 }}>
                            <Typography variant="h5" fontWeight={700}>Free Plan</Typography>
                            <Typography color="text.secondary">Basic property search and saved listings</Typography>
                        </Box>

                        <Typography variant="h6" fontWeight={600} gutterBottom>Upgrade to Pro</Typography>
                        <List>
                            <ListItem><ListItemText primary="✓ Unlimited saved searches" /></ListItem>
                            <ListItem><ListItemText primary="✓ Instant new listing alerts" /></ListItem>
                            <ListItem><ListItemText primary="✓ Market analytics and price trends" /></ListItem>
                            <ListItem><ListItemText primary="✓ No ads" /></ListItem>
                        </List>
                        <Button variant="contained" color="secondary" size="large">
                            Upgrade for $9.99/month
                        </Button>
                    </Paper>
                )}
            </Container>
        </Box>
    );
}
