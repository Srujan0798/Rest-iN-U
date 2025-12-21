'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface Photo {
    url: string;
    caption?: string;
}

interface PropertyGalleryProps {
    photos: Photo[];
}

export default function PropertyGallery({ photos }: PropertyGalleryProps) {
    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleOpen = (index: number) => {
        setCurrentIndex(index);
        setOpen(true);
    };

    const handlePrev = () => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
    const handleNext = () => setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));

    return (
        <>
            <Box sx={{ height: 400, overflow: 'hidden' }}>
                <ImageList cols={photos.length > 1 ? 3 : 1} gap={4} sx={{ height: '100%', m: 0 }}>
                    {photos.slice(0, 4).map((photo, index) => (
                        <ImageListItem
                            key={index}
                            cols={index === 0 ? 2 : 1}
                            rows={index === 0 ? 2 : 1}
                            sx={{ cursor: 'pointer', '&:hover': { opacity: 0.9 } }}
                            onClick={() => handleOpen(index)}
                        >
                            <img src={photo.url} alt={photo.caption || `Photo ${index + 1}`} style={{ height: '100%', objectFit: 'cover' }} />
                        </ImageListItem>
                    ))}
                </ImageList>
            </Box>

            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '90vw', maxWidth: 1200, bgcolor: 'black', borderRadius: 2, outline: 'none'
                }}>
                    <IconButton onClick={() => setOpen(false)} sx={{ position: 'absolute', top: 8, right: 8, color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
                        <IconButton onClick={handlePrev} sx={{ color: 'white' }}><ChevronLeftIcon fontSize="large" /></IconButton>
                        <Box sx={{ flex: 1, textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={photos[currentIndex]?.url} alt="" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                        </Box>
                        <IconButton onClick={handleNext} sx={{ color: 'white' }}><ChevronRightIcon fontSize="large" /></IconButton>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}
