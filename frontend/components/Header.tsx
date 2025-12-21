'use client';
import Link from 'next/link';
import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import MessageIcon from '@mui/icons-material/Message';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TempleHinduIcon from '@mui/icons-material/TempleHindu';
import WbCloudyIcon from '@mui/icons-material/WbCloudy';
import SensorsIcon from '@mui/icons-material/Sensors';
import TokenIcon from '@mui/icons-material/Token';

export default function Header() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [moreAnchor, setMoreAnchor] = useState<null | HTMLElement>(null);

    // Mock auth state - in production, use AuthContext
    const isLoggedIn = false;
    const user = null;

    return (
        <AppBar position="sticky" color="inherit" elevation={1}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                    <HomeIcon sx={{ color: 'primary.main', mr: 1, fontSize: 32 }} />
                    <Typography variant="h6" fontWeight={700} color="primary">
                        Rest-iN-U
                    </Typography>
                </Link>

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {/* Main Navigation */}
                    <Button component={Link} href="/search" color="inherit">Buy</Button>
                    <Button component={Link} href="/rent" color="inherit">Rent</Button>
                    <Button component={Link} href="/sell" color="inherit">Sell</Button>
                    <Button component={Link} href="/agents" color="inherit">Agents</Button>

                    {/* More Menu */}
                    <Button color="inherit" onClick={(e) => setMoreAnchor(e.currentTarget)}>More</Button>
                    <Menu anchorEl={moreAnchor} open={Boolean(moreAnchor)} onClose={() => setMoreAnchor(null)}>
                        <MenuItem component={Link} href="/valuation" onClick={() => setMoreAnchor(null)}>
                            <ListItemIcon><TrendingUpIcon fontSize="small" /></ListItemIcon>
                            Home Value
                        </MenuItem>
                        <MenuItem component={Link} href="/market" onClick={() => setMoreAnchor(null)}>
                            <ListItemIcon><TrendingUpIcon fontSize="small" /></ListItemIcon>
                            Market Insights
                        </MenuItem>
                        <MenuItem component={Link} href="/open-houses" onClick={() => setMoreAnchor(null)}>
                            <ListItemIcon><CalendarMonthIcon fontSize="small" /></ListItemIcon>
                            Open Houses
                        </MenuItem>
                        <Divider />
                        <MenuItem component={Link} href="/vastu-analysis" onClick={() => setMoreAnchor(null)}>
                            <ListItemIcon><TempleHinduIcon fontSize="small" /></ListItemIcon>
                            Vastu AI
                        </MenuItem>
                        <MenuItem component={Link} href="/climate-risk" onClick={() => setMoreAnchor(null)}>
                            <ListItemIcon><WbCloudyIcon fontSize="small" /></ListItemIcon>
                            Climate Risk
                        </MenuItem>
                        <MenuItem component={Link} href="/iot-dashboard" onClick={() => setMoreAnchor(null)}>
                            <ListItemIcon><SensorsIcon fontSize="small" /></ListItemIcon>
                            IoT Sensors
                        </MenuItem>
                        <MenuItem component={Link} href="/blockchain" onClick={() => setMoreAnchor(null)}>
                            <ListItemIcon><TokenIcon fontSize="small" /></ListItemIcon>
                            Blockchain
                        </MenuItem>
                        <MenuItem component={Link} href="/investment" onClick={() => setMoreAnchor(null)}>
                            <ListItemIcon><TrendingUpIcon fontSize="small" /></ListItemIcon>
                            Investment Analysis
                        </MenuItem>
                        <MenuItem component={Link} href="/vr-ar" onClick={() => setMoreAnchor(null)}>
                            <ListItemIcon><SensorsIcon fontSize="small" /></ListItemIcon>
                            VR/AR Tours
                        </MenuItem>
                        <Divider />
                        <MenuItem component={Link} href="/about" onClick={() => setMoreAnchor(null)}>About Us</MenuItem>
                        <MenuItem component={Link} href="/contact" onClick={() => setMoreAnchor(null)}>Contact</MenuItem>
                        <MenuItem component={Link} href="/faq" onClick={() => setMoreAnchor(null)}>FAQ</MenuItem>
                    </Menu>

                    {/* Messages */}
                    {isLoggedIn && (
                        <IconButton component={Link} href="/messages">
                            <Badge badgeContent={3} color="error">
                                <MessageIcon />
                            </Badge>
                        </IconButton>
                    )}

                    {/* User Menu */}
                    <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                        {isLoggedIn ? <Avatar sx={{ width: 32, height: 32 }}>U</Avatar> : <PersonIcon />}
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                        {!isLoggedIn ? (
                            <>
                                <MenuItem component={Link} href="/login" onClick={() => setAnchorEl(null)}>Sign In</MenuItem>
                                <MenuItem component={Link} href="/register" onClick={() => setAnchorEl(null)}>Sign Up</MenuItem>
                            </>
                        ) : (
                            <>
                                <MenuItem component={Link} href="/dashboard" onClick={() => setAnchorEl(null)}>
                                    <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
                                    Dashboard
                                </MenuItem>
                                <MenuItem component={Link} href="/dashboard" onClick={() => setAnchorEl(null)}>
                                    <ListItemIcon><FavoriteIcon fontSize="small" /></ListItemIcon>
                                    Saved Homes
                                </MenuItem>
                                <MenuItem component={Link} href="/messages" onClick={() => setAnchorEl(null)}>
                                    <ListItemIcon><MessageIcon fontSize="small" /></ListItemIcon>
                                    Messages
                                </MenuItem>
                                <Divider />
                                <MenuItem component={Link} href="/settings" onClick={() => setAnchorEl(null)}>
                                    <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                                    Settings
                                </MenuItem>
                                <MenuItem onClick={() => setAnchorEl(null)}>
                                    <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                                    Sign Out
                                </MenuItem>
                            </>
                        )}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
