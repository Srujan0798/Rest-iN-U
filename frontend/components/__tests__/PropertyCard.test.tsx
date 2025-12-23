import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PropertyCard from '../PropertyCard';

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

    it('renders property details correctly', () => {
        render(<PropertyCard property={mockProperty} />);

        expect(screen.getByText('$500,000')).toBeInTheDocument();
        expect(screen.getByText('123 Main St, City, ST')).toBeInTheDocument();
        expect(screen.getByText('3 beds')).toBeInTheDocument();
        expect(screen.getByText('2 baths')).toBeInTheDocument();
        expect(screen.getByText('2,000 sqft')).toBeInTheDocument();
    });

    it('handles string address format', () => {
        const propWithStringAddress = { ...mockProperty, address: '456 String St' };
        render(<PropertyCard property={propWithStringAddress} />);
        expect(screen.getByText('456 String St')).toBeInTheDocument();
    });

    it('shows "New" badge for fresh listings', () => {
        const newProp = { ...mockProperty, days_on_market: 2 };
        render(<PropertyCard property={newProp} />);
        expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('shows "Pending" badge', () => {
        const pendingProp = { ...mockProperty, status: 'PENDING' };
        render(<PropertyCard property={pendingProp} />);
        expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        const handleClick = jest.fn();
        render(<PropertyCard property={mockProperty} onClick={handleClick} />);

        fireEvent.click(screen.getByText('$500,000'));
        expect(handleClick).toHaveBeenCalled();
    });

    it('calls onFavoriteClick when heart is clicked', () => {
        const handleFavorite = jest.fn();
        render(<PropertyCard property={mockProperty} onFavoriteClick={handleFavorite} />);

        const heartButton = screen.getByRole('button');
        fireEvent.click(heartButton);
        expect(handleFavorite).toHaveBeenCalled();
    });
});
