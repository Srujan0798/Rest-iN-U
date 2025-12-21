'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const columns = [
    { id: 'NEW', label: 'New Leads', color: '#1976d2' },
    { id: 'CONTACTED', label: 'Contacted', color: '#ed6c02' },
    { id: 'SHOWING_SCHEDULED', label: 'Showing Scheduled', color: '#9c27b0' },
    { id: 'OFFER_MADE', label: 'Offer Made', color: '#2e7d32' },
];

const mockLeads = [
    { id: '1', name: 'John Smith', email: 'john@email.com', phone: '555-0101', status: 'NEW', property: '123 Main St', message: 'Interested in scheduling a viewing', date: '2 hours ago' },
    { id: '2', name: 'Emily Davis', email: 'emily@email.com', phone: '555-0102', status: 'NEW', property: '456 Park Ave', message: 'Looking for 3BR under 500K', date: '5 hours ago' },
    { id: '3', name: 'Mike Johnson', email: 'mike@email.com', phone: '555-0103', status: 'CONTACTED', property: '789 Broadway', message: 'First time buyer', date: '1 day ago' },
    { id: '4', name: 'Sarah Wilson', email: 'sarah@email.com', phone: '555-0104', status: 'SHOWING_SCHEDULED', property: '321 Oak Lane', message: 'Relocating from Boston', date: '2 days ago' },
    { id: '5', name: 'David Brown', email: 'david@email.com', phone: '555-0105', status: 'OFFER_MADE', property: '555 Elm St', message: 'Ready to make an offer', date: '3 days ago' },
];

export default function LeadPipeline() {
    const [leads, setLeads] = useState(mockLeads);
    const [menuAnchor, setMenuAnchor] = useState<{ el: HTMLElement | null; leadId: string | null }>({ el: null, leadId: null });

    const handleStatusChange = (leadId: string, newStatus: string) => {
        setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
        setMenuAnchor({ el: null, leadId: null });
    };

    return (
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
            {columns.map((col) => (
                <Paper key={col.id} sx={{ minWidth: 300, flex: 1, p: 2, bgcolor: 'grey.100' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: col.color, mr: 1 }} />
                        <Typography fontWeight={600}>{col.label}</Typography>
                        <Chip label={leads.filter(l => l.status === col.id).length} size="small" sx={{ ml: 'auto' }} />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {leads.filter(l => l.status === col.id).map((lead) => (
                            <Card key={lead.id} sx={{ cursor: 'grab', '&:hover': { boxShadow: 4 } }}>
                                <CardContent sx={{ pb: '12px !important' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Avatar sx={{ width: 36, height: 36, mr: 1, bgcolor: col.color }}>
                                            {lead.name.charAt(0)}
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography fontWeight={600} variant="body2">{lead.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{lead.date}</Typography>
                                        </Box>
                                        <IconButton size="small" onClick={(e) => setMenuAnchor({ el: e.currentTarget, leadId: lead.id })}>
                                            <MoreVertIcon fontSize="small" />
                                        </IconButton>
                                    </Box>

                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        🏠 {lead.property}
                                    </Typography>
                                    <Typography variant="body2" noWrap sx={{ mb: 1 }}>{lead.message}</Typography>

                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Chip icon={<PhoneIcon />} label="Call" size="small" clickable />
                                        <Chip icon={<EmailIcon />} label="Email" size="small" clickable />
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Paper>
            ))}

            <Menu
                anchorEl={menuAnchor.el}
                open={Boolean(menuAnchor.el)}
                onClose={() => setMenuAnchor({ el: null, leadId: null })}
            >
                <MenuItem disabled><Typography variant="caption">Move to:</Typography></MenuItem>
                {columns.map((col) => (
                    <MenuItem key={col.id} onClick={() => handleStatusChange(menuAnchor.leadId!, col.id)}>
                        {col.label}
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
}
