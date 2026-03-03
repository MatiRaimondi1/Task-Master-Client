import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser({ token });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const register = async (name, email, password) => {
        await api.post('/auth/register', { name, email, password });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const verifyEmail = async (email, code) => {
        try {
            const res = await api.post('/auth/verify', { email, code });
            setUser(res.data.user);
            localStorage.setItem('token', res.data.token);
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