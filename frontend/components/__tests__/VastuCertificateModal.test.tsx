import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import VastuCertificateModal from '../VastuCertificateModal';

// Mock Web3
jest.mock('../context/Web3Context', () => ({
    useWeb3: () => ({
        address: '0x123',
        isConnected: true,
    }),
}));

describe('VastuCertificateModal Component', () => {
    const mockProperty = {
        id: '1',
        title: 'Vastu Villa',
        vastuScore: 95,
        vastuGrade: 'A+',
        entranceDirection: 'East',
    };

    const mockCertificate = {
        tokenId: 123,
        issuedAt: new Date('2024-01-01'),
        txHash: '0xabc',
        analysisHash: '0xdef',
    };

    it('renders certificate details', () => {
        render(<VastuCertificateModal isOpen={true} onClose={() => { }} property={mockProperty} certificate={mockCertificate} />);

        expect(screen.getByText('Vastu Certificate')).toBeInTheDocument();
        expect(screen.getByText('Vastu Villa')).toBeInTheDocument();
        expect(screen.getByText('95')).toBeInTheDocument(); // Score
        expect(screen.getByText('A+')).toBeInTheDocument(); // Grade
        expect(screen.getByText('Verified on Polygon')).toBeInTheDocument();
    });

    it('shows not minted state if no certificate provided', () => {
        render(<VastuCertificateModal isOpen={true} onClose={() => { }} property={mockProperty} />);

        expect(screen.getByText('This certificate has not been minted on-chain yet.')).toBeInTheDocument();
    });

    it('handles download action', () => {
        const consoleSpy = jest.spyOn(console, 'log');
        render(<VastuCertificateModal isOpen={true} onClose={() => { }} property={mockProperty} certificate={mockCertificate} />);

        const downloadButton = screen.getByText('Download');
        fireEvent.click(downloadButton);

        expect(consoleSpy).toHaveBeenCalledWith('Downloading certificate...');
        consoleSpy.mockRestore();
    });

    it('closes when close button clicked', () => {
        const handleClose = jest.fn();
        render(<VastuCertificateModal isOpen={true} onClose={handleClose} property={mockProperty} />);

        // The close button is usually an X icon. 
        // In the component: <button onClick={onClose} ...><X .../></button>
        // We can find it by role button and maybe filtering, or just assume it's the first button in header.
        // Actually, the component has multiple buttons.
        // Let's look for the one with the X icon or just use querySelector if needed, but testing-library prefers roles.
        // The X icon is from lucide-react.

        const buttons = screen.getAllByRole('button');
        // The close button is likely the first one in the DOM order (top right of header)
        fireEvent.click(buttons[0]);

        expect(handleClose).toHaveBeenCalled();
    });
});
