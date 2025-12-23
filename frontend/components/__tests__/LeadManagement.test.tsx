import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LeadManagement from '../LeadManagement';

describe('LeadManagement Component', () => {
    it('renders title and columns', () => {
        render(<LeadManagement />);

        expect(screen.getByText('Lead Management')).toBeInTheDocument();
        expect(screen.getByText('New')).toBeInTheDocument();
        expect(screen.getByText('Contacted')).toBeInTheDocument();
        expect(screen.getByText('Qualified')).toBeInTheDocument();
        expect(screen.getByText('Closed')).toBeInTheDocument();
    });

    it('displays initial leads', () => {
        render(<LeadManagement />);

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('moves lead when dropped', () => {
        render(<LeadManagement />);

        // Find the lead card
        const leadCard = screen.getByText('John Doe').closest('div[draggable="true"]');
        expect(leadCard).toBeInTheDocument();

        // Find the destination column (e.g., Contacted)
        // The column has an h3 with text "Contacted"
        const contactedColumnHeader = screen.getByRole('heading', { name: 'Contacted' });
        const contactedColumn = contactedColumnHeader.closest('div[class*="flex-col"]'); // Adjust selector based on structure

        if (!leadCard || !contactedColumn) {
            throw new Error('Could not find lead card or column');
        }

        // Simulate Drag and Drop
        fireEvent.dragStart(leadCard, { dataTransfer: { setData: jest.fn(), getData: () => '1' } });
        fireEvent.dragOver(contactedColumn);
        fireEvent.drop(contactedColumn, { dataTransfer: { getData: () => '1' } });

        // Verify John Doe is now in Contacted column
        // Since we can't easily check visual position, we can check if the status badge changed?
        // Wait, the component doesn't update the badge text based on column, it updates the state which re-renders it in the new column.
        // But the badge inside the card DOES use `getStatusColor(lead.status)`.
        // And `lead.propertyInterest` is displayed in the badge.
        // Let's check if the lead is rendered within the Contacted column container.

        // A better way: The "New" column should have 0 items (John Doe moved out)
        // The "Contacted" column should have 2 items (Jane Smith + John Doe)

        // We can check the counts displayed in the headers
        // "New" count
        const newCount = screen.getByRole('heading', { name: 'New' }).nextElementSibling;
        expect(newCount).toHaveTextContent('0');

        // "Contacted" count
        const contactedCount = screen.getByRole('heading', { name: 'Contacted' }).nextElementSibling;
        expect(contactedCount).toHaveTextContent('2');
    });
});
