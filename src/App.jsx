import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Landing from './pages/Landing';
import { Toaster } from 'react-hot-toast';

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
        <AuthProvider>
            <TaskProvider>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#ffffff',
                            color: '#1e293b',
                            borderRadius: '16px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        },
                        success: {
                            iconTheme: {
                                primary: '#2563eb',
                                secondary: '#fff',
                            },
                        },
                    }}
                />

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
    );
}

export default App;