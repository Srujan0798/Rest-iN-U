import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactForm from '../ContactForm';

describe('ContactForm Component', () => {
    it('renders form fields', () => {
        render(<ContactForm agentId="1" propertyId="1" />);

        expect(screen.getByPlaceholderText('Your Name *')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email *')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Phone')).toBeInTheDocument();
        expect(screen.getByPlaceholderText("I'm interested in this property...")).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Contact Agent' })).toBeInTheDocument();
    });

    it('submits form successfully', async () => {
        render(<ContactForm agentId="1" propertyId="1" />);

        fireEvent.change(screen.getByPlaceholderText('Your Name *'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText('Email *'), { target: { value: 'john@example.com' } });
        fireEvent.click(screen.getByRole('button', { name: 'Contact Agent' }));

        // Check loading state
        expect(screen.getByText('Sending...')).toBeInTheDocument();

        // Check success message
        await waitFor(() => {
            expect(screen.getByText(/Your message has been sent!/i)).toBeInTheDocument();
        });
    });

    it('requires mandatory fields', () => {
        render(<ContactForm agentId="1" propertyId="1" />);

        const nameInput = screen.getByPlaceholderText('Your Name *');
        const emailInput = screen.getByPlaceholderText('Email *');

        expect(nameInput).toBeRequired();
        expect(emailInput).toBeRequired();
    });
});
