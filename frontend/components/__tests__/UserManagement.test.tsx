import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserManagement from '../UserManagement';

describe('UserManagement Component', () => {
    it('renders title and table headers', () => {
        render(<UserManagement />);

        expect(screen.getByText('User Management')).toBeInTheDocument();
        // Use getAllByText for headers because they might appear in other contexts (e.g. tooltips or status text)
        expect(screen.getAllByText('User')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Role')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Status')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Joined')[0]).toBeInTheDocument();
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
        // Because we are using lucide-react, the svg has a class 'lucide-edit-2' but querySelector might fail if the class name isn't exactly rendered or if JSDOM doesn't support classList on SVG perfectly or if it is compiled differently.
        // A more robust way is to find the button by role or by looking for the icon component if mocked.
        // However, here we can search for the button inside the row.
        const buttons = row?.querySelectorAll('button');
        const editButton = buttons ? buttons[0] : null; // First button is edit, second is delete

        if (!editButton) throw new Error('Edit button not found');
        fireEvent.click(editButton);

        // Change role to AGENT
        // The select for role is the first select in the row
        const selects = screen.getAllByRole('combobox');
        const roleSelect = selects[0]; // Assuming role is first, status is second
        fireEvent.change(roleSelect, { target: { value: 'AGENT' } });

        // Click save (Check icon)
        // After clicking edit, the buttons change to check and X.
        const actionButtons = row?.querySelectorAll('button');
        const saveButton = actionButtons ? actionButtons[0] : null; // First is save

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
        const buttons = row?.querySelectorAll('button');
        const deleteButton = buttons ? buttons[1] : null; // Second button is delete

        if (!deleteButton) throw new Error('Delete button not found');
        fireEvent.click(deleteButton);

        expect(window.confirm).toHaveBeenCalled();
        expect(screen.queryByText(userToDelete)).not.toBeInTheDocument();
    });
});
