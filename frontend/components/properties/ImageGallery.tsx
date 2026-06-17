import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface Photo {
  url: string;
  caption?: string;
}

interface ImageGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  photos: Photo[];
  initialIndex?: number;
}

export function ImageGallery({ isOpen, onClose, photos, initialIndex = 0 }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialIndex]);

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, nextImage, prevImage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10 p-2"
      >
        <X size={32} />
      </button>

      {/* Main Image Container */}
      <div className="relative w-full h-full flex flex-col items-center justify-center p-4 sm:p-12">
        <div className="relative max-w-full max-h-[85vh] flex items-center justify-center">
          <img
            src={photos[currentIndex].url}
            alt={photos[currentIndex].caption || `Photo ${currentIndex + 1}`}
            className="max-w-full max-h-[80vh] object-contain shadow-2xl"
          />

          {/* Navigation Arrows (Desktop) */}
          {photos.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-0 -ml-12 md:-ml-16 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors hidden sm:block p-2"
              >
                <ChevronLeft size={48} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-0 -mr-12 md:-mr-16 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors hidden sm:block p-2"
              >
                <ChevronRight size={48} />
              </button>
            </>
          )}
        </div>

        {/* Caption and Counter */}
        <div className="mt-4 text-center">
          <p className="text-white text-lg font-medium">
            {photos[currentIndex].caption}
          </p>
          <p className="text-white/60 text-sm mt-1">
            {currentIndex + 1} / {photos.length}
          </p>
        </div>

        {/* Thumbnails Strip */}
        <div className="absolute bottom-4 left-0 right-0 overflow-x-auto px-4 pb-2 scrollbar-hide">
          <div className="flex justify-center gap-2 min-w-max">
            {photos.map((photo, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-16 h-12 rounded-md overflow-hidden transition-all duration-200 border-2 ${
                  idx === currentIndex ? 'border-amber-500 scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={photo.url}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
