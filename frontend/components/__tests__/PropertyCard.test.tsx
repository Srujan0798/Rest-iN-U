import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PropertyCard from '../PropertyCard';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
    Bed: () => <span data-testid="bed-icon">Bed</span>,
    Bath: () => <span data-testid="bath-icon">Bath</span>,
    Ruler: () => <span data-testid="ruler-icon">Ruler</span>,
    Heart: () => <span data-testid="heart-icon">Heart</span>,
}));

describe('PropertyCard Component', () => {
    const mockProperty = {
        property_id: '123',
        address: { street: '123 Main St', city: 'City', state: 'ST', zip: '12345' },
        price: 500000,
        bedrooms: 3,
        bathrooms: 2,
        square_feet: 2000,
        primary_photo: 'http://example.com/photo.jpg',
        status: 'ACTIVE',
        days_on_market: 10
    };

    it('renders property price correctly', () => {
        render(<PropertyCard property={mockProperty} />);
        expect(screen.getByText('$500,000')).toBeInTheDocument();
    });

    it('renders property address correctly', () => {
        render(<PropertyCard property={mockProperty} />);
        expect(screen.getByText('123 Main St, City, ST')).toBeInTheDocument();
    });

    it('renders bedroom count', () => {
        render(<PropertyCard property={mockProperty} />);
        expect(screen.getByText('3 beds')).toBeInTheDocument();
    });

    it('renders bathroom count', () => {
        render(<PropertyCard property={mockProperty} />);
        expect(screen.getByText('2 baths')).toBeInTheDocument();
    });

    it('renders square feet', () => {
        render(<PropertyCard property={mockProperty} />);
        expect(screen.getByText('2,000 sqft')).toBeInTheDocument();
    });

    it('handles string address format', () => {
        const propWithStringAddress = { ...mockProperty, address: '456 String St' };
        render(<PropertyCard property={propWithStringAddress} />);
        expect(screen.getByText('456 String St')).toBeInTheDocument();
    });
});
