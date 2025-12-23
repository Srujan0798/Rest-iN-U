import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '../SearchBar';

describe('SearchBar Component', () => {
    it('renders input with placeholder', () => {
        render(<SearchBar onSearch={() => { }} />);
        expect(screen.getByPlaceholderText('Enter city, neighborhood, or ZIP')).toBeInTheDocument();
    });

    it('updates value on change', () => {
        render(<SearchBar onSearch={() => { }} />);
        const input = screen.getByLabelText('search location');
        fireEvent.change(input, { target: { value: 'New York' } });
        expect(input).toHaveValue('New York');
    });

    it('calls onSearch with input value on submit', () => {
        const handleSearch = jest.fn();
        render(<SearchBar onSearch={handleSearch} />);

        const input = screen.getByLabelText('search location');
        const button = screen.getByRole('button');

        fireEvent.change(input, { target: { value: 'Miami' } });
        fireEvent.click(button);

        expect(handleSearch).toHaveBeenCalledWith('Miami');
    });

    it('does not call onSearch if input is empty', () => {
        const handleSearch = jest.fn();
        render(<SearchBar onSearch={handleSearch} />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(handleSearch).not.toHaveBeenCalled();
    });
});
