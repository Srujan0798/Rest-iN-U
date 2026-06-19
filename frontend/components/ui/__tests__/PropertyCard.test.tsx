import React from 'react';
import { render, screen } from '@testing-library/react';
import PropertyCard from '../PropertyCard';

describe('PropertyCard', () => {
    const mockProperty = {
        id: '1',
        title: 'Test Property',
        streetAddress: '123 Test St',
        city: 'Test City',
        state: 'TS',
        price: 500000,
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 2000,
        photos: [{ url: 'http://test.com/photo.jpg' }],
        vastuAnalysis: { overallScore: 85 }
    };

    it('renders property details correctly', () => {
        render(<PropertyCard property={mockProperty} />);

        expect(screen.getByText('Test Property')).toBeInTheDocument();
        expect(screen.getByText('$500k')).toBeInTheDocument();
        expect(screen.getByText('123 Test St, Test City, TS')).toBeInTheDocument();
        expect(screen.getByText('3 Beds')).toBeInTheDocument();
        expect(screen.getByText('2 Baths')).toBeInTheDocument();
        expect(screen.getByText('2000 sqft')).toBeInTheDocument();
        expect(screen.getByText('Vastu: 85%')).toBeInTheDocument();
    });

    it('renders placeholder image when no photos provided', () => {
        const propertyNoPhotos = { ...mockProperty, photos: [] };
        render(<PropertyCard property={propertyNoPhotos} />);
        expect(screen.getByText('🏠')).toBeInTheDocument();
    });
});
