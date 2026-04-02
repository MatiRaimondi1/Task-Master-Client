import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../../src/pages/Dashboard';
import { TaskContext } from '../../src/context/TaskContext';
import { AuthContext } from '../../src/context/AuthContext';
import { ThemeContext } from '../../src/context/ThemeContext';

const mockTasks = [
    { _id: '1', title: 'Task 1', description: 'Desc 1', status: 'pending', priority: 'high' },
    { _id: '2', title: 'Task 2', description: 'Desc 2', status: 'completed', priority: 'low' },
];

const taskContextValue = {
    tasks: mockTasks,
    loading: false,
    deleteTask: vi.fn(),
    setEditingTask: vi.fn(),
    fetchTasks: vi.fn(),
    updateTask: vi.fn(),
};

const authContextValue = {
    logout: vi.fn(),
    user: { name: 'John Doe' },
};

const themeContextValue = {
    darkMode: false,
    toggleDarkMode: vi.fn(),
};

vi.mock('../../src/components/TaskForm', () => ({
    default: () => <div data-testid="task-form">Task Form Mock</div>
}));

const renderDashboard = (tContext = taskContextValue) => {
    return render(
        <BrowserRouter>
            <AuthContext.Provider value={authContextValue}>
                <ThemeContext.Provider value={themeContextValue}>
                    <TaskContext.Provider value={tContext}>
                        <Dashboard />
                    </TaskContext.Provider>
                </ThemeContext.Provider>
            </AuthContext.Provider>
        </BrowserRouter>
    );
};

describe('Dashboard Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should display the loading state initially', () => {
        renderDashboard({ ...taskContextValue, loading: true });
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should render the user name correctly', () => {
        renderDashboard();
        expect(screen.getByText(/John/i)).toBeInTheDocument();
    });

    it('should call fetchTasks when the component mounts', () => {
        renderDashboard();
        expect(taskContextValue.fetchTasks).toHaveBeenCalled();
    });

    it('should filter tasks by the search term', async () => {
        renderDashboard();
        const searchInput = screen.getByPlaceholderText(/Search tasks.../i);

        fireEvent.change(searchInput, { target: { value: 'Task 1' } });

        expect(screen.getByText('Task 1')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
        });
    });

    it('should call deleteTask when the delete button is clicked', () => {
        renderDashboard();
        const deleteBtn = screen.getAllByRole('button').find(btn =>
            btn.getAttribute('title')?.toLowerCase().includes('delete') ||
            btn.innerHTML.includes('trash')
        );

        if (deleteBtn) fireEvent.click(deleteBtn);
        expect(taskContextValue.deleteTask).toHaveBeenCalled();
    });

    it('should toggle the dark mode when the theme button is clicked', () => {
        renderDashboard();
        const themeBtn = screen.getByTitle(/Modo/i);
        fireEvent.click(themeBtn);
        expect(themeContextValue.toggleDarkMode).toHaveBeenCalled();
    });
});