import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Landing from './pages/Landing';
import { Toaster } from 'react-hot-toast';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

/**
 * Toaster component with theme support
 * @returns 
 */
const ToasterWithTheme = () => {
    const { darkMode } = useTheme();

    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 3000,
                style: {
                    background: darkMode ? '#0f172a' : '#ffffff',
                    color: darkMode ? '#f1f5f9' : '#1e293b',
                    border: darkMode ? '1px solid #1e293b' : '1px solid #e2e8f0',

                    borderRadius: '16px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    boxShadow: darkMode
                        ? '0 10px 15px -3px rgba(0, 0, 0, 0.4)'
                        : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                },
                success: {
                    iconTheme: {
                        primary: darkMode ? '#60a5fa' : '#2563eb',
                        secondary: darkMode ? '#0f172a' : '#fff',
                    },
                },
                error: {
                    iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                    },
                },
            }}
        />
    );
};

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return null;
    return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return null;
    if (user) {
        return <Navigate to="/dashboard" />;
    }
    return children;
};

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <TaskProvider>
                    <ToasterWithTheme />

                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Landing />} />

                            <Route path="/login" element={
                                <PublicRoute><Auth isLogin={true} /></PublicRoute>
                            } />
                            <Route path="/register" element={
                                <PublicRoute><Auth isLogin={false} /></PublicRoute>
                            } />

                            <Route path="/dashboard" element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            } />

                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </BrowserRouter>
                </TaskProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;