'use client';
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

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
            <div className="h-96 overflow-hidden">
                <div className={`grid gap-1 h-full ${photos.length > 1 ? 'grid-cols-3' : 'grid-cols-1'}`}>
                    {photos.slice(0, 4).map((photo, index) => (
                        <div
                            key={index}
                            onClick={() => handleOpen(index)}
                            className={`cursor-pointer hover:opacity-90 transition-opacity overflow-hidden ${index === 0 ? 'col-span-2 row-span-2' : ''
                                }`}
                        >
                            <img
                                src={photo.url}
                                alt={photo.caption || `Photo ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox Modal */}
            {open && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
                    <button
                        onClick={() => setOpen(false)}
                        className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <button
                        onClick={handlePrev}
                        className="absolute left-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>

                    <div className="max-w-5xl max-h-[80vh] flex items-center justify-center">
                        <img
                            src={photos[currentIndex]?.url}
                            alt=""
                            className="max-h-[80vh] max-w-full object-contain"
                        />
                    </div>

                    <button
                        onClick={handleNext}
                        className="absolute right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
                        {currentIndex + 1} / {photos.length}
                    </div>
                </div>
            )}
        </>
    );
}
