import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Landing from '../../src/pages/Landing';
import { AuthContext } from '../../src/context/AuthContext';

const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockedUsedNavigate,
    };
});

vi.mock('../../src/components/RevealOnScroll', () => ({
    default: ({ children }) => <div data-testid="reveal">{children}</div>
}));

const renderLanding = (user = null) => {
    const authContextValue = {
        user,
        logout: vi.fn(),
    };

    return render(
        <BrowserRouter>
            <AuthContext.Provider value={authContextValue}>
                <Landing />
            </AuthContext.Provider>
        </BrowserRouter>
    );
};

describe('Landing Page Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the landing page title and hero section', () => {
        renderLanding();
        expect(screen.getByText(/TaskMaster Pro/i)).toBeInTheDocument();
        expect(screen.getByText(/Master your day/i)).toBeInTheDocument();
    });

    it('should show "Sign In" and "Get Started" buttons when user is NOT logged in', () => {
        renderLanding(null);
        expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
        expect(screen.getByText(/Start for free — 0\$/i)).toBeInTheDocument();
    });

    it('should show "Sign Out" and "Go to Dashboard" when user IS logged in', () => {
        renderLanding({ name: 'John Doe' });
        expect(screen.getByText(/Sign Out/i)).toBeInTheDocument();
        expect(screen.getByText(/Go to Dashboard/i)).toBeInTheDocument();
    });

    it('should navigate to /login when clicking "Sign In"', () => {
        renderLanding(null);
        const signInBtn = screen.getByRole('button', { name: /Sign In/i });
        fireEvent.click(signInBtn);
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/login');
    });

    it('should navigate to /dashboard when clicking "Go to Dashboard" (Logged In)', () => {
        renderLanding({ name: 'John Doe' });
        const dashboardBtn = screen.getByText(/Go to Dashboard/i);
        fireEvent.click(dashboardBtn);
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/dashboard');
    });

    it('should call logout function when clicking "Sign Out"', () => {
        const logoutMock = vi.fn();
        render(
            <BrowserRouter>
                <AuthContext.Provider value={{ user: { name: 'John' }, logout: logoutMock }}>
                    <Landing />
                </AuthContext.Provider>
            </BrowserRouter>
        );

        const signOutBtn = screen.getByText(/Sign Out/i);
        fireEvent.click(signOutBtn);
        expect(logoutMock).toHaveBeenCalled();
    });

    it('should display feature cards with correct information', () => {
        renderLanding();
        expect(screen.getByText('Lightning Fast')).toBeInTheDocument();
        expect(screen.getByText('Safe & Private')).toBeInTheDocument();
        expect(screen.getByText('Dark Mode')).toBeInTheDocument();
    });

    it('should display the current year in the footer', () => {
        renderLanding();
        const currentYear = new Date().getFullYear().toString();
        expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
    });

    it('should have correct links to social media', () => {
        renderLanding();
        const githubLink = screen.getByLabelText(/GitHub/i);
        const linkedinLink = screen.getByLabelText(/LinkedIn/i);

        expect(githubLink).toHaveAttribute('href', 'https://github.com/MatiRaimondi1');
        expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/mat%C3%ADas-raimondi/');
    });
});