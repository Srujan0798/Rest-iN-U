'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

const mockListings = [
    { id: '1', address: '123 Main St, New York, NY', price: 485000, status: 'ACTIVE', beds: 3, baths: 2, views: 234, inquiries: 12, daysOnMarket: 15, photo: 'https://picsum.photos/100/80?random=1' },
    { id: '2', address: '456 Park Ave, Brooklyn, NY', price: 725000, status: 'ACTIVE', beds: 4, baths: 3, views: 456, inquiries: 23, daysOnMarket: 8, photo: 'https://picsum.photos/100/80?random=2' },
    { id: '3', address: '789 Broadway, Manhattan, NY', price: 550000, status: 'PENDING', beds: 2, baths: 2, views: 678, inquiries: 34, daysOnMarket: 45, photo: 'https://picsum.photos/100/80?random=3' },
    { id: '4', address: '321 5th Ave, New York, NY', price: 1200000, status: 'ACTIVE', beds: 5, baths: 4, views: 123, inquiries: 5, daysOnMarket: 3, photo: 'https://picsum.photos/100/80?random=4' },
    { id: '5', address: '555 Ocean Dr, Boston, MA', price: 680000, status: 'SOLD', beds: 4, baths: 3, views: 890, inquiries: 45, daysOnMarket: 30, photo: 'https://picsum.photos/100/80?random=5' },
];

const statusColors: Record<string, 'success' | 'warning' | 'default'> = {
    ACTIVE: 'success',
    PENDING: 'warning',
    SOLD: 'default',
};

export default function ListingsManager() {
    const [listings] = useState(mockListings);

    return (
        <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>My Listings</Typography>
                <Button variant="contained" startIcon={<AddIcon />}>Add New Listing</Button>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Property</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="center">Beds/Baths</TableCell>
                            <TableCell align="right">Views</TableCell>
                            <TableCell align="right">Inquiries</TableCell>
                            <TableCell align="right">Days</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listings.map((listing) => (
                            <TableRow key={listing.id} hover>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar variant="rounded" src={listing.photo} sx={{ width: 60, height: 45 }} />
                                        <Typography variant="body2">{listing.address}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography fontWeight={600}>${listing.price.toLocaleString()}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip label={listing.status} size="small" color={statusColors[listing.status]} />
                                </TableCell>
                                <TableCell align="center">{listing.beds}/{listing.baths}</TableCell>
                                <TableCell align="right">{listing.views}</TableCell>
                                <TableCell align="right">{listing.inquiries}</TableCell>
                                <TableCell align="right">{listing.daysOnMarket}</TableCell>
                                <TableCell>
                                    <IconButton size="small"><VisibilityIcon fontSize="small" /></IconButton>
                                    <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                                    <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
