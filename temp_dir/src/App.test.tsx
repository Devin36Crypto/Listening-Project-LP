import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import App from './App';

// Basic mock for the App component parts if needed
// The vitest-setup.ts already handles most browser environment mocks.

test('renders hero section', () => {
    render(<App />);
    const linkElement = screen.getByText(/Hear More./i);
    expect(linkElement).toBeDefined();
});
