'use client';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SquareFootIcon from '@mui/icons-material/SquareFoot';

interface PropertyCardProps {
    property: {
        property_id: string;
        address: { street: string; city: string; state: string; zip: string } | string;
        price: number;
        bedrooms: number;
        bathrooms: number;
        square_feet: number | null;
        primary_photo: string | null;
        status?: string;
        days_on_market?: number;
    };
    isFavorited?: boolean;
    onFavoriteClick?: () => void;
    onClick?: () => void;
}

export default function PropertyCard({ property, isFavorited, onFavoriteClick, onClick }: PropertyCardProps) {
    const address = typeof property.address === 'string'
        ? property.address
        : `${property.address.street}, ${property.address.city}, ${property.address.state}`;

    return (
        <Card className="property-card" sx={{ position: 'relative', height: '100%' }}>
            <CardActionArea onClick={onClick}>
                <Box sx={{ position: 'relative' }}>
                    <CardMedia
                        component="img"
                        height="200"
                        image={property.primary_photo || 'https://picsum.photos/400/300?random=1'}
                        alt={address}
                    />
                    {property.status === 'PENDING' && (
                        <Chip label="Pending" color="warning" size="small" sx={{ position: 'absolute', top: 8, left: 8 }} />
                    )}
                    {property.days_on_market && property.days_on_market <= 3 && (
                        <Chip label="New" color="success" size="small" sx={{ position: 'absolute', top: 8, left: 8 }} />
                    )}
                </Box>
                <CardContent>
                    <Typography variant="h6" fontWeight={700} color="primary.main">
                        ${property.price.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                        {address}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <BedIcon fontSize="small" color="action" />
                            <Typography variant="body2">{property.bedrooms} beds</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <BathtubIcon fontSize="small" color="action" />
                            <Typography variant="body2">{property.bathrooms} baths</Typography>
                        </Box>
                        {property.square_feet && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <SquareFootIcon fontSize="small" color="action" />
                                <Typography variant="body2">{property.square_feet.toLocaleString()} sqft</Typography>
                            </Box>
                        )}
                    </Box>
                </CardContent>
            </CardActionArea>
            {onFavoriteClick && (
                <IconButton
                    sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}
                    onClick={(e) => { e.stopPropagation(); onFavoriteClick(); }}
                >
                    {isFavorited ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                </IconButton>
            )}
        </Card>
    );
}
