import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ToursPage from '../page';

describe('ToursPage', () => {
    it('renders page title', () => {
        render(<ToursPage />);
        expect(screen.getByText('My Property Tours')).toBeInTheDocument();
    });

    it('displays list of tours', () => {
        render(<ToursPage />);
        expect(screen.getByText('Vastu Villa Beverly Hills')).toBeInTheDocument();
        expect(screen.getByText('Spiritual Retreat Sedona')).toBeInTheDocument();
    });

    it('filters tours correctly', () => {
        render(<ToursPage />);

        // Initial state should show all (2 items)
        expect(screen.getAllByText(/upcoming/i)).toHaveLength(2); // Both mock items are upcoming

        // Click 'Completed' filter
        const completedFilter = screen.getByRole('button', { name: /completed/i });
        fireEvent.click(completedFilter);

        // Should show empty state or no items
        // Since mock data has no completed tours, it should show empty state
        expect(screen.getByText('No tours scheduled')).toBeInTheDocument();
        expect(screen.queryByText('Vastu Villa Beverly Hills')).not.toBeInTheDocument();

        // Click 'Upcoming' filter
        const upcomingFilter = screen.getByRole('button', { name: /upcoming/i });
        fireEvent.click(upcomingFilter);

        // Should show items again
        expect(screen.getByText('Vastu Villa Beverly Hills')).toBeInTheDocument();
    });

    it('displays agent contact options for upcoming tours', () => {
        render(<ToursPage />);

        expect(screen.getAllByText('Call Agent')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Email')[0]).toBeInTheDocument();
    });

    it('displays virtual tour join button for virtual tours', () => {
        render(<ToursPage />);

        // The second mock item is virtual
        expect(screen.getByText('Join Tour')).toBeInTheDocument();
    });
});
