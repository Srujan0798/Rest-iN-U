import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserManagement from '../UserManagement';

describe('UserManagement Component', () => {
    it('renders title and table headers', () => {
        render(<UserManagement />);

        expect(screen.getByText('User Management')).toBeInTheDocument();
        expect(screen.getByText('User')).toBeInTheDocument();
        expect(screen.getByText('Role')).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();
        expect(screen.getByText('Joined')).toBeInTheDocument();
    });

    it('displays initial users', () => {
        render(<UserManagement />);

        expect(screen.getByText('Admin User')).toBeInTheDocument();
        expect(screen.getByText('Sarah Agent')).toBeInTheDocument();
    });

    it('filters users by search term', () => {
        render(<UserManagement />);

        const searchInput = screen.getByPlaceholderText('Search users...');
        fireEvent.change(searchInput, { target: { value: 'Sarah' } });

        expect(screen.getByText('Sarah Agent')).toBeInTheDocument();
        expect(screen.queryByText('Admin User')).not.toBeInTheDocument();
    });

    it('allows editing user role', () => {
        render(<UserManagement />);

        // Find edit button for John Buyer (Role: USER)
        const row = screen.getByText('John Buyer').closest('tr');
        const editButton = row?.querySelector('button svg.lucide-edit-2')?.closest('button');

        if (!editButton) throw new Error('Edit button not found');
        fireEvent.click(editButton);

        // Change role to AGENT
        // The select for role is the first select in the row
        const selects = screen.getAllByRole('combobox');
        const roleSelect = selects[0]; // Assuming role is first, status is second
        fireEvent.change(roleSelect, { target: { value: 'AGENT' } });

        // Click save (Check icon)
        const saveButton = row?.querySelector('button svg.lucide-check')?.closest('button');
        if (!saveButton) throw new Error('Save button not found');
        fireEvent.click(saveButton);

        // Verify badge update
        // Should now see "Agent" badge for John Buyer
        // Since "John Buyer" text is still there, look for the badge in the same row
        const updatedRow = screen.getByText('John Buyer').closest('tr');
        expect(updatedRow).toHaveTextContent('Agent');
    });

    it('deletes user on confirmation', () => {
        // Mock confirm
        window.confirm = jest.fn(() => true);

        render(<UserManagement />);

        const userToDelete = 'Mike Spammer';
        expect(screen.getByText(userToDelete)).toBeInTheDocument();

        const row = screen.getByText(userToDelete).closest('tr');
        const deleteButton = row?.querySelector('button svg.lucide-trash-2')?.closest('button');

        if (!deleteButton) throw new Error('Delete button not found');
        fireEvent.click(deleteButton);

        expect(window.confirm).toHaveBeenCalled();
        expect(screen.queryByText(userToDelete)).not.toBeInTheDocument();
    });
});
