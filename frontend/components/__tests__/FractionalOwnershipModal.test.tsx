import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FractionalOwnershipModal from '../FractionalOwnershipModal';

// Mock Web3 Context
jest.mock('../context/Web3Context', () => ({
    useWeb3: () => ({
        address: '0x123',
        isConnected: true,
        connect: jest.fn(),
        chainId: 137, // Polygon
    }),
}));

describe('FractionalOwnershipModal Component', () => {
    const mockProperty = {
        id: '1',
        title: 'Luxury Villa',
        price: 1000000,
        vastuScore: 95,
        totalShares: 1000,
        availableShares: 500,
        pricePerShare: 1000,
    };

    it('renders nothing when closed', () => {
        render(<FractionalOwnershipModal isOpen={false} onClose={() => { }} property={mockProperty} />);
        expect(screen.queryByText('Fractional Ownership')).not.toBeInTheDocument();
    });

    it('renders modal content when open', () => {
        render(<FractionalOwnershipModal isOpen={true} onClose={() => { }} property={mockProperty} />);

        expect(screen.getByText('Fractional Ownership')).toBeInTheDocument();
        expect(screen.getByText('Luxury Villa')).toBeInTheDocument();
        expect(screen.getByText('$1.00M')).toBeInTheDocument();
        expect(screen.getByText('500/1000')).toBeInTheDocument(); // Available shares
    });

    it('calculates cost based on shares', () => {
        render(<FractionalOwnershipModal isOpen={true} onClose={() => { }} property={mockProperty} />);

        // Default 1 share = $1,000
        expect(screen.getByText('Buy 1 Share for $1,000')).toBeInTheDocument();

        // Increase shares to 2
        const plusButton = screen.getByText('+');
        fireEvent.click(plusButton);

        expect(screen.getByText('Buy 2 Shares for $2,000')).toBeInTheDocument();
    });

    it('handles quick select buttons', () => {
        render(<FractionalOwnershipModal isOpen={true} onClose={() => { }} property={mockProperty} />);

        const fiveSharesBtn = screen.getByText('5 Shares');
        fireEvent.click(fiveSharesBtn);

        expect(screen.getByText('Buy 5 Shares for $5,000')).toBeInTheDocument();
    });

    it('simulates purchase transaction', async () => {
        render(<FractionalOwnershipModal isOpen={true} onClose={() => { }} property={mockProperty} />);

        const buyButton = screen.getByText(/Buy 1 Share/);
        fireEvent.click(buyButton);

        expect(screen.getByText('Processing...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Transaction Successful!')).toBeInTheDocument();
        });
    });
});
