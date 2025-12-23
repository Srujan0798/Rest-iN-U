import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AgentChat from '../AgentChat';

// Mock scrollIntoView since it's not implemented in JSDOM
window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('AgentChat Component', () => {
    const mockAgent = {
        id: 'agent-123',
        name: 'John Doe',
        title: 'Senior Agent',
        image: '/agents/john.jpg',
    };

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it('renders agent details correctly', () => {
        render(<AgentChat agent={mockAgent} />);

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Senior Agent • Online')).toBeInTheDocument();
    });

    it('displays initial greeting message', () => {
        render(<AgentChat agent={mockAgent} />);

        expect(screen.getByText(/Hi! I'm John Doe. How can I help you today?/i)).toBeInTheDocument();
    });

    it('allows user to send a message', async () => {
        render(<AgentChat agent={mockAgent} />);

        const input = screen.getByPlaceholderText('Type a message...');
        const sendButton = screen.getByRole('button', { name: '' }); // Send icon button might not have text

        fireEvent.change(input, { target: { value: 'Hello agent' } });
        fireEvent.click(sendButton); // Assuming the button with Send icon is the submit trigger

        // Check if user message appears
        expect(screen.getByText('Hello agent')).toBeInTheDocument();

        // Input should be cleared
        expect(input).toHaveValue('');
    });

    it('displays agent response after delay', async () => {
        render(<AgentChat agent={mockAgent} />);

        const input = screen.getByPlaceholderText('Type a message...');
        fireEvent.change(input, { target: { value: 'Is this available?' } });
        fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

        // Fast-forward time
        act(() => {
            jest.advanceTimersByTime(1500);
        });

        await waitFor(() => {
            expect(screen.getByText(/Yes, this property is still available!/i)).toBeInTheDocument();
        });
    });

    it('sends message when clicking quick reply', () => {
        render(<AgentChat agent={mockAgent} />);

        const quickReplyButton = screen.getByText('Is this property still available?');
        fireEvent.click(quickReplyButton);

        expect(screen.getByText('Is this property still available?')).toBeInTheDocument();
    });
});
