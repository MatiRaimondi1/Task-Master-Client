import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthContext } from '../../src/context/AuthContext';
import { TaskContext } from '../../src/context/TaskContext';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Auth from '../../src/pages/Auth';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('react-hot-toast', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
        loading: vi.fn(),
        dismiss: vi.fn(),
    },
}));

vi.mock('../../src/api/axios', () => ({
    default: { post: vi.fn() }
}));

describe('Auth Page (Login & Register)', () => {
    const mockAuthContext = {
        login: vi.fn(),
        register: vi.fn(),
        verifyEmail: vi.fn(),
    };

    const mockTaskContext = {
        fetchTasks: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderAuth = (isLogin = true) => {
        return render(
            <BrowserRouter>
                <AuthContext.Provider value={mockAuthContext}>
                    <TaskContext.Provider value={mockTaskContext}>
                        <Auth isLogin={isLogin} />
                    </TaskContext.Provider>
                </AuthContext.Provider>
            </BrowserRouter>
        );
    };

    it('should display the Login form correctly', () => {
        renderAuth(true);
        expect(screen.getByText(/Welcome back!/i)).toBeInTheDocument();
        expect(screen.queryByPlaceholderText(/Full name/i)).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
    });

    it('should display the Register form correctly', () => {
        renderAuth(false);
        expect(screen.getByText(/Join for free/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Full name/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Create account/i })).toBeInTheDocument();
    });

    it('should log the user in, fetch tasks, and navigate to the dashboard', async () => {
        mockAuthContext.login.mockResolvedValueOnce();
        mockTaskContext.fetchTasks.mockResolvedValueOnce();

        renderAuth(true);

        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));

        await waitFor(() => {
            expect(mockAuthContext.login).toHaveBeenCalledWith('test@test.com', 'password123');
            expect(mockTaskContext.fetchTasks).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
            expect(toast.success).toHaveBeenCalledWith('Welcome back!');
        });
    });

    it('should display the verification form after a successful registration', async () => {
        mockAuthContext.register.mockResolvedValueOnce();

        renderAuth(false);

        fireEvent.change(screen.getByPlaceholderText(/Full name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'john@test.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /Create account/i }));

        await waitFor(() => {
            expect(screen.getByText(/Verify your email/i)).toBeInTheDocument();
            expect(toast.success).toHaveBeenCalledWith('Code sent to your email');
        });
    });

    it('should handle the PENDING_VERIFICATION error during login', async () => {
        const pendingError = {
            response: {
                data: { message: "PENDING_VERIFICATION", email: "pending@test.com" }
            }
        };
        mockAuthContext.login.mockRejectedValueOnce(pendingError);

        renderAuth(true);

        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'pending@test.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));

        await waitFor(() => {
            expect(screen.getByText(/Verify your email/i)).toBeInTheDocument();
            expect(toast.error).toHaveBeenCalledWith("Account not verified yet");
        });
    });

    it('should navigate to the Home page when clicking the "Back to Home" button', () => {
        renderAuth(true);
        const backBtn = screen.getByText(/Back to Home/i);
        fireEvent.click(backBtn);
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});