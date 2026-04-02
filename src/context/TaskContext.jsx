import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';

export const TaskContext = createContext();

/**
 * TaskProvider component to manage task state
 * @param {*} param0 
 * @returns 
 */
export const TaskProvider = ({ children }) => {
    /**
     * State for the tasks, loading status, and editing task
     */
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingTask, setEditingTask] = useState(null);

    /**
     * Get authentication headers for API requests
     * @returns 
     */
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
    };

    /**
     * Fetch all tasks from the API
     */
    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await api.get('/tasks', getAuthHeaders());
            setTasks(res.data);
        } catch (err) {
            toast.error("Failed to fetch tasks");
        } finally {
            setLoading(false);
        }
    }

    /**
     * Add a new task
     * @param {*} taskObject 
     */
    const addTask = async (taskObject) => {
        try {
            const res = await api.post('/tasks', taskObject, getAuthHeaders());
            setTasks((prevTasks) => [res.data, ...prevTasks]);
            toast.success("Task created successfully");
        } catch (err) {
            toast.error("Error creating task");
        }
    }

    /**
     * Update a task
     * @param {*} id 
     * @param {*} updatedTask 
     */
    const updateTask = async (id, updatedTask) => {
        try {
            const res = await api.put(`/tasks/${id}`, updatedTask, getAuthHeaders());
            setTasks(tasks.map(t => t._id === id ? res.data : t));
            setEditingTask(null);
            toast.success("Task updated successfully");
        } catch (err) {
            toast.error("Error updating task");
        }
    }

    /**
     * Delete a task
     * @param {*} id 
     */
    const deleteTask = async (id) => {
        try {
            await api.delete(`/tasks/${id}`, getAuthHeaders());
            setTasks(tasks.filter(t => t._id !== id));
            toast.success("Task deleted", { icon: '🗑️' });
        } catch (err) {
            toast.error("Error deleting task");
        }
    };

    /**
     * Update the status of a task
     * @param {*} id 
     * @param {*} nextStatus 
     */
    const updateTaskStatus = async (id, nextStatus) => {
        try {
            const res = await api.put(
                `/tasks/${id}`,
                { status: nextStatus },
                getAuthHeaders()
            );
            setTasks(tasks.map(t => t._id === id ? res.data : t));
        } catch (err) {
            toast.error("Error updating task status");
        }
    };

    /**
     * Initialize task state
     */
    useEffect(() => {
        if (localStorage.getItem('token')) {
            fetchTasks();
        }
    }, []);

    return (
        <TaskContext.Provider value={{ tasks, loading, addTask, updateTask, deleteTask, updateTaskStatus, editingTask, setEditingTask, fetchTasks }}>
            {children}
        </TaskContext.Provider>
    );
};