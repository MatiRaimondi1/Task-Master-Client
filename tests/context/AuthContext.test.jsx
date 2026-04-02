import { render, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, AuthContext } from '../../src/context/AuthContext';
import api from '../../src/api/axios';
import { useContext } from 'react';

vi.mock('../../src/api/axios', () => ({
    default: {
        post: vi.fn(),
    },
}));

const TestComponent = () => {
    const { user, login, logout, register, verifyEmail, loading } = useContext(AuthContext);
    return (
        <div>
            <div data-testid="user">{user ? user.name : 'no-user'}</div>
            <div data-testid="loading">{loading ? 'true' : 'false'}</div>
            <button onClick={() => login('test@test.com', '123')}>Login</button>
            <button onClick={logout}>Logout</button>
            <button onClick={() => register('Name', 'test@test.com', '123')}>Register</button>
            <button onClick={() => verifyEmail('test@test.com', '123456')}>Verify</button>
        </div>
    );
};

describe('AuthContext / AuthProvider', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('should initialize with loading false and no user', async () => {
        const { getByTestId } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(getByTestId('loading').textContent).toBe('false');
        expect(getByTestId('user').textContent).toBe('no-user');
    });

    it('should retrieve the user from localStorage when mounting', () => {
        const fakeUser = { name: 'Joe' };
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('user', JSON.stringify(fakeUser));

        const { getByTestId } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(getByTestId('user').textContent).toBe('Joe');
    });

    it('should update the state and localStorage after a successful login', async () => {
        const mockResponse = {
            data: {
                token: 'new-token',
                user: { name: 'Admin User' }
            }
        };
        api.post.mockResolvedValueOnce(mockResponse);

        const { getByText, getByTestId } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await act(async () => {
            getByText('Login').click();
        });

        expect(api.post).toHaveBeenCalledWith('/auth/login', {
            email: 'test@test.com',
            password: '123'
        });
        expect(localStorage.getItem('token')).toBe('new-token');
        expect(getByTestId('user').textContent).toBe('Admin User');
    });

    it('should clear the state and localStorage when logging out', () => {
        localStorage.setItem('token', 'token-to-delete');
        localStorage.setItem('user', JSON.stringify({ name: 'User' }));

        const { getByText, getByTestId } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        act(() => {
            getByText('Logout').click();
        });

        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
        expect(getByTestId('user').textContent).toBe('no-user');
    });

    it('should call the registration API correctly', async () => {
        api.post.mockResolvedValueOnce({ data: {} });

        const { getByText } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await act(async () => {
            getByText('Register').click();
        });

        expect(api.post).toHaveBeenCalledWith('/auth/register', expect.any(Object));
    });

    it('should handle email verification and update the user', async () => {
        const mockRes = {
            data: { token: 'v-token', user: { name: 'Verified' } }
        };
        api.post.mockResolvedValueOnce(mockRes);

        const { getByText, getByTestId } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await act(async () => {
            await getByText('Verify').click();
        });

        expect(getByTestId('user').textContent).toBe('Verified');
        expect(localStorage.getItem('token')).toBe('v-token');
    });
});