import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingTask, setEditingTask] = useState(null);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
    };

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

    const addTask = async (taskObject) => {
        try {
            const res = await api.post('/tasks', taskObject, getAuthHeaders());
            setTasks((prevTasks) => [res.data, ...prevTasks]);
            toast.success("Task created successfully");
        } catch (err) {
            toast.error("Error creating task");
        }
    }

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

    const deleteTask = async (id) => {
        try {
            await api.delete(`/tasks/${id}`, getAuthHeaders());
            setTasks(tasks.filter(t => t._id !== id));
            toast.success("Task deleted", { icon: '🗑️' });
        } catch (err) {
            toast.error("Error deleting task");
        }
    };

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