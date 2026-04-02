import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskContext } from '../../src/context/TaskContext';
import TaskForm from '../../src/components/TaskForm';

describe('TaskForm Component', () => {
    const mockContext = {
        addTask: vi.fn(),
        updateTask: vi.fn(),
        setEditingTask: vi.fn(),
        editingTask: null
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderWithContext = (contextValue = mockContext) => {
        return render(
            <TaskContext.Provider value={contextValue}>
                <TaskForm />
            </TaskContext.Provider>
        );
    };

    it('should render the task form in "Creation" mode by default', () => {
        renderWithContext();
        expect(screen.getByText(/New Task/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Create Task/i })).toBeInTheDocument();
    });

    it('should not call addTask if the title is empty', () => {
        renderWithContext();
        const submitButton = screen.getByRole('button', { name: /Create Task/i });

        fireEvent.click(submitButton);

        expect(mockContext.addTask).not.toHaveBeenCalled();
    });

    it('should call addTask with the form data and clear the fields', () => {
        renderWithContext();

        const titleInput = screen.getByPlaceholderText(/What needs to be done/i);
        const descInput = screen.getByPlaceholderText(/Add a description/i);
        const submitButton = screen.getByRole('button', { name: /Create Task/i });

        fireEvent.change(titleInput, { target: { value: 'Buy milk' } });
        fireEvent.change(descInput, { target: { value: 'Lactose-free' } });
        fireEvent.click(submitButton);

        expect(mockContext.addTask).toHaveBeenCalledWith({
            title: 'Buy milk',
            description: 'Lactose-free',
            priority: 'medium'
        });

        expect(titleInput.value).toBe('');
        expect(descInput.value).toBe('');
    });

    it('should enter "Edit" mode when editingTask exists', () => {
        const editingTask = {
            _id: '123',
            title: 'Task to edit',
            description: 'Old note',
            priority: 'high'
        };

        renderWithContext({ ...mockContext, editingTask });

        expect(screen.getByText(/Edit Task/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue('Task to edit')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Update Task/i })).toBeInTheDocument();
    });

    it('should call updateTask when editing and then clear the edit mode', () => {
        const editingTask = {
            _id: '123',
            title: 'Original Task',
            description: '',
            priority: 'low'
        };

        renderWithContext({ ...mockContext, editingTask });

        const titleInput = screen.getByPlaceholderText(/What needs to be done/i);
        fireEvent.change(titleInput, { target: { value: 'Modified Task' } });

        const submitButton = screen.getByRole('button', { name: /Update Task/i });
        fireEvent.click(submitButton);

        expect(mockContext.updateTask).toHaveBeenCalledWith('123', expect.objectContaining({
            title: 'Modified Task'
        }));

        expect(mockContext.setEditingTask).toHaveBeenCalledWith(null);
    });

    it('should allow canceling the edit', () => {
        const editingTask = { _id: '123', title: 'Editing', priority: 'medium' };
        renderWithContext({ ...mockContext, editingTask });

        const cancelButton = screen.getByRole('button', { name: /Cancel Edit/i });
        fireEvent.click(cancelButton);

        expect(mockContext.setEditingTask).toHaveBeenCalledWith(null);
        expect(screen.getByPlaceholderText(/What needs to be done/i).value).toBe('');
    });
});