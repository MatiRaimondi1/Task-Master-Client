import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeProvider, useTheme } from '../../src/context/ThemeContext';

const ThemeTestComponent = () => {
    const { darkMode, toggleDarkMode } = useTheme();
    return (
        <div>
            <span data-testid="theme-status">{darkMode ? 'dark' : 'light'}</span>
            <button onClick={toggleDarkMode}>Toggle Theme</button>
        </div>
    );
};

describe('ThemeContext / ThemeProvider', () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.classList.remove('dark');
        vi.clearAllMocks();
    });

    it('should initialize with the correct theme based on localStorage (dark)', () => {
        localStorage.setItem('theme', 'dark');

        render(
            <ThemeProvider>
                <ThemeTestComponent />
            </ThemeProvider>
        );

        expect(screen.getByTestId('theme-status').textContent).toBe('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should initialize with the correct theme based on localStorage (light)', () => {
        localStorage.setItem('theme', 'light');

        render(
            <ThemeProvider>
                <ThemeTestComponent />
            </ThemeProvider>
        );

        expect(screen.getByTestId('theme-status').textContent).toBe('light');
        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should respect the system preference if there is nothing in localStorage', () => {
        window.matchMedia = vi.fn().mockImplementation(query => ({
            matches: query === '(prefers-color-scheme: dark)',
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
        }));

        render(
            <ThemeProvider>
                <ThemeTestComponent />
            </ThemeProvider>
        );

        expect(screen.getByTestId('theme-status').textContent).toBe('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should change the theme when calling toggleDarkMode', () => {
        render(
            <ThemeProvider>
                <ThemeTestComponent />
            </ThemeProvider>
        );

        const button = screen.getByText(/Toggle Theme/i);
        const status = screen.getByTestId('theme-status');

        const initialTheme = status.textContent;

        fireEvent.click(button);

        const newTheme = initialTheme === 'light' ? 'dark' : 'light';
        expect(status.textContent).toBe(newTheme);

        expect(localStorage.getItem('theme')).toBe(newTheme);

        if (newTheme === 'dark') {
            expect(document.documentElement.classList.contains('dark')).toBe(true);
        } else {
            expect(document.documentElement.classList.contains('dark')).toBe(false);
        }
    });

    it('should update the document class when the theme changes', () => {
        const { rerender } = render(
            <ThemeProvider>
                <ThemeTestComponent />
            </ThemeProvider>
        );

        fireEvent.click(screen.getByText(/Toggle Theme/i));
        expect(document.documentElement.className).not.toContain('dark');

        fireEvent.click(screen.getByText(/Toggle Theme/i));
        expect(document.documentElement.className).toContain('dark');
    });
});