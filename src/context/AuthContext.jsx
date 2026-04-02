import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

/**
 * AuthProvider component to manage authentication state
 * @param {*} param0 
 * @returns 
 */
export const AuthProvider = ({ children }) => {
    /**
     * State for the authenticated user and loading status
     */
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /**
     * Initialize authentication state
     */
    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    /**
     * Log in a user
     * @param {*} email 
     * @param {*} password 
     * @returns 
     */
    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        return res.data;
    };

    /**
     * Register a new user
     * @param {*} name 
     * @param {*} email 
     * @param {*} password 
     */
    const register = async (name, email, password) => {
        await api.post('/auth/register', { name, email, password });
    };

    /**
     * Log out the current user
     */
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    /**
     * Verify the user's email
     * @param {*} email 
     * @param {*} code 
     * @returns 
     */
    const verifyEmail = async (email, code) => {
        try {
            const res = await api.post('/auth/verify', { email, code });
            setUser(res.data.user);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            return true;
        } catch (err) {
            throw err;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, verifyEmail }}>
            {children}
        </AuthContext.Provider>
    );
};