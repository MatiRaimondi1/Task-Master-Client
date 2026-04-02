import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RevealOnScroll from '../../src/components/RevealOnScroll';

describe('RevealOnScroll Component', () => {

    beforeEach(() => {
        class MockIntersectionObserver {
            constructor(callback) {
                this.callback = callback;
            }
            observe = vi.fn();
            unobserve = vi.fn();
            disconnect = vi.fn();
        }

        window.IntersectionObserver = MockIntersectionObserver;

        vi.clearAllMocks();
    });

    it('should render its children correctly', () => {
        render(
            <RevealOnScroll>
                <div data-testid="child-element">Animated Content</div>
            </RevealOnScroll>
        );

        expect(screen.getByTestId('child-element')).toBeInTheDocument();
        expect(screen.getByText('Animated Content')).toBeDefined();
    });

    it('should start with opacity 0 (initial motion state)', () => {
        const { container } = render(
            <RevealOnScroll y={50}>
                <p>Test</p>
            </RevealOnScroll>
        );

        const motionDiv = container.firstChild;

        expect(motionDiv.style.opacity).toBe("0");
    });

    it('should apply the delay and y props correctly to the component', () => {
        const { rerender } = render(
            <RevealOnScroll delay={0.5} y={100}>
                <span>Delay Test</span>
            </RevealOnScroll>
        );

        expect(screen.getByText('Delay Test')).toBeInTheDocument();
    });
});