import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { toast } from 'react-hot-toast';
import VerifyEmail from '../../src/components/VerifyEmail';

vi.mock('react-hot-toast', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe('VerifyEmail Component', () => {
    const mockOnVerifySuccess = vi.fn();
    const testEmail = "user@example.com";

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the email and form elements correctly', () => {
        render(<VerifyEmail email={testEmail} onVerifySuccess={mockOnVerifySuccess} />);

        expect(screen.getByText(testEmail)).toBeInTheDocument();
        expect(screen.getByPlaceholderText('000000')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Verify Account/i })).toBeInTheDocument();
    });

    it('should update the input value when the user types', () => {
        render(<VerifyEmail email={testEmail} onVerifySuccess={mockOnVerifySuccess} />);

        const input = screen.getByPlaceholderText('000000');
        fireEvent.change(input, { target: { value: '123456' } });

        expect(input.value).toBe('123456');
    });

    it('should call onVerifySuccess and show success toast when verification is successful', async () => {
        mockOnVerifySuccess.mockResolvedValueOnce();

        render(<VerifyEmail email={testEmail} onVerifySuccess={mockOnVerifySuccess} />);

        const input = screen.getByPlaceholderText('000000');
        const button = screen.getByRole('button', { name: /Verify Account/i });

        fireEvent.change(input, { target: { value: '654321' } });
        fireEvent.click(button);

        expect(mockOnVerifySuccess).toHaveBeenCalledWith(testEmail, '654321');

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith("Email verified successfully!");
        });
    });

    it('should show error toast when verification fails', async () => {
        const errorResponse = {
            response: {
                data: { message: "Error in server" }
            }
        };
        mockOnVerifySuccess.mockRejectedValueOnce(errorResponse);

        render(<VerifyEmail email={testEmail} onVerifySuccess={mockOnVerifySuccess} />);

        const input = screen.getByPlaceholderText('000000');
        fireEvent.change(input, { target: { value: '000000' } });
        fireEvent.click(screen.getByRole('button'));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Error in server");
        });
    });

    it('should show loader and disable button during loading', async () => {
        let resolvePromise;
        const slowPromise = new Promise((resolve) => {
            resolvePromise = resolve;
        });
        mockOnVerifySuccess.mockReturnValue(slowPromise);

        render(<VerifyEmail email={testEmail} onVerifySuccess={mockOnVerifySuccess} />);

        const input = screen.getByPlaceholderText('000000');
        const button = screen.getByRole('button');

        fireEvent.change(input, { target: { value: '111222' } });
        fireEvent.click(button);

        expect(button).toBeDisabled();
        expect(button.querySelector('.animate-spin')).toBeInTheDocument();

        await act(async () => {
            resolvePromise();
        });
    });
});