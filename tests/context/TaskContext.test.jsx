import { render, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskProvider, TaskContext } from '../../src/context/TaskContext';
import api from '../../src/api/axios';
import { useContext } from 'react';
import { toast } from 'react-hot-toast';

vi.mock('../../src/api/axios', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

vi.mock('react-hot-toast', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

const TaskTestComponent = () => {
    const { tasks, addTask, updateTask, deleteTask, updateTaskStatus } = useContext(TaskContext);
    return (
        <div>
            <div data-testid="task-count">{tasks.length}</div>
            <ul>
                {tasks.map(t => (
                    <li key={t._id} data-testid={`task-${t._id}`}>
                        {t.title} - {t.status}
                    </li>
                ))}
            </ul>
            <button onClick={() => addTask({ title: 'New' })}>Add</button>
            <button onClick={() => updateTask('1', { title: 'Updated' })}>Update</button>
            <button onClick={() => deleteTask('1')}>Delete</button>
            <button onClick={() => updateTaskStatus('2', 'completed')}>Complete</button>
        </div>
    );
};

describe('TaskContext / TaskProvider', () => {
    const mockTasks = [
        { _id: '1', title: 'Task 1', status: 'pending' },
        { _id: '2', title: 'Task 2', status: 'pending' }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.setItem('token', 'valid-token');
        api.get.mockResolvedValue({ data: mockTasks });
    });

    it('should load tasks on mount if token is present', async () => {
        const { getByTestId } = render(
            <TaskProvider>
                <TaskTestComponent />
            </TaskProvider>
        );

        await waitFor(() => {
            expect(getByTestId('task-count').textContent).toBe('2');
        });
        expect(api.get).toHaveBeenCalledWith('/tasks', expect.objectContaining({
            headers: { Authorization: 'Bearer valid-token' }
        }));
    });

    it('should add a task to the beginning of the list', async () => {
        const newTask = { _id: '3', title: 'Task 3', status: 'pending' };
        api.post.mockResolvedValueOnce({ data: newTask });

        const { getByText, getByTestId } = render(
            <TaskProvider>
                <TaskTestComponent />
            </TaskProvider>
        );

        await act(async () => {
            getByText('Add').click();
        });

        expect(getByTestId('task-count').textContent).toBe('3');
        expect(toast.success).toHaveBeenCalledWith("Task created successfully");
    });

    it('should update an existing task in the state', async () => {
        const updatedTask = { _id: '1', title: 'Updated Task', status: 'pending' };
        api.put.mockResolvedValueOnce({ data: updatedTask });

        const { getByText, getByTestId } = render(
            <TaskProvider>
                <TaskTestComponent />
            </TaskProvider>
        );

        await waitFor(() => expect(getByTestId('task-count').textContent).toBe('2'));

        await act(async () => {
            getByText('Update').click();
        });

        expect(getByTestId('task-1').textContent).toContain('Updated Task');
    });

    it('should delete a task from the state', async () => {
        api.delete.mockResolvedValueOnce({});

        const { getByText, getByTestId } = render(
            <TaskProvider>
                <TaskTestComponent />
            </TaskProvider>
        );

        await waitFor(() => expect(getByTestId('task-count').textContent).toBe('2'));

        await act(async () => {
            getByText('Delete').click();
        });

        expect(getByTestId('task-count').textContent).toBe('1');
        expect(toast.success).toHaveBeenCalledWith("Task deleted", expect.anything());
    });

    it('should update only the status of a task', async () => {
        const statusUpdatedTask = { _id: '2', title: 'Task 2', status: 'completed' };
        api.put.mockResolvedValueOnce({ data: statusUpdatedTask });

        const { getByText, getByTestId } = render(
            <TaskProvider>
                <TaskTestComponent />
            </TaskProvider>
        );

        await waitFor(() => expect(getByTestId('task-count').textContent).toBe('2'));

        await act(async () => {
            getByText('Complete').click();
        });

        expect(getByTestId('task-2').textContent).toContain('completed');
    });

    it('should show an error if fetching tasks fails', async () => {
        api.get.mockRejectedValueOnce(new Error('API Error'));

        render(
            <TaskProvider>
                <TaskTestComponent />
            </TaskProvider>
        );

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Failed to fetch tasks");
        });
    });
});