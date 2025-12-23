import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AgentAnalytics from '../AgentAnalytics';

// Mock Recharts to avoid rendering issues in JSDOM
jest.mock('recharts', () => ({
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    BarChart: () => <div data-testid="bar-chart">BarChart</div>,
    Bar: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
    Legend: () => null,
    LineChart: () => <div data-testid="line-chart">LineChart</div>,
    Line: () => null,
}));

describe('AgentAnalytics Component', () => {
    it('renders title', () => {
        render(<AgentAnalytics />);
        expect(screen.getByText('Performance Analytics')).toBeInTheDocument();
    });

    it('renders all metric cards', () => {
        render(<AgentAnalytics />);

        // Check titles
        expect(screen.getByText('Total Views')).toBeInTheDocument();
        expect(screen.getByText('Inquiries')).toBeInTheDocument();
        expect(screen.getByText('Conversion Rate')).toBeInTheDocument();
        expect(screen.getByText('Active Leads')).toBeInTheDocument();

        // Check values
        expect(screen.getByText('1,955')).toBeInTheDocument();
        expect(screen.getByText('303')).toBeInTheDocument();
        expect(screen.getByText('3.5%')).toBeInTheDocument();
        expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('renders charts', () => {
        render(<AgentAnalytics />);

        expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('renders chart titles', () => {
        render(<AgentAnalytics />);

        expect(screen.getByText(/Views vs Inquiries/i)).toBeInTheDocument();
        expect(screen.getByText('Conversion Rate Trend')).toBeInTheDocument();
    });
});
