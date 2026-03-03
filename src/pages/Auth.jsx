import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TaskContext } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Loader2, ShieldCheck } from 'lucide-react';
import api from '../api/axios';

export default function Auth({ isLogin }) {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const { login, register, verifyEmail } = useContext(AuthContext);
    const { fetchTasks } = useContext(TaskContext);
    const [loading, setLoading] = useState(false);
    const [needsVerification, setNeedsVerification] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
                toast.success('Login successful!');
                await fetchTasks();
                navigate('/dashboard');
            } else {
                await register(formData.name, formData.email, formData.password);
                setNeedsVerification(true);
                toast.success('Code sent to your email');
            }
        } catch (err) {
            if (err.response?.data?.message === "PENDING_VERIFICATION") {
                toast.error("Your account is not yet verified");
                setFormData(prev => ({ ...prev, email: err.response.data.email }));
                setNeedsVerification(true);
            } else {
                const errorMessage = err.response?.data?.message || 'Unexpected error occurred';
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-200">
                {needsVerification ? (
                    /* --- Email Verification View --- */
                    <div className="animate-in fade-in zoom-in duration-300">
                        <div className="bg-blue-50 w-20 h-20 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-6">
                            <ShieldCheck size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-2 text-center">Verify your email</h2>
                        <p className="text-slate-500 mb-8 text-center px-4">
                            We've sent a code to <br />
                            <span className="font-bold text-slate-900">{formData.email}</span>
                        </p>

                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const code = e.target.code.value.trim();
                                try {
                                    setLoading(true);
                                    await verifyEmail(formData.email, code);
                                    toast.success("Email verified successfully! Welcome.");
                                    navigate('/dashboard');
                                } catch (err) {
                                    toast.error(err.response?.data?.message || "Invalid code");
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            className="space-y-4"
                        >
                            <input
                                name="code"
                                type="text"
                                maxLength="6"
                                placeholder="000000"
                                required
                                className="w-full text-center text-4xl tracking-[0.75rem] font-black py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                            <button
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : "Verify and Continue"}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                            <p className="text-slate-500 text-sm font-medium">
                                You didn't receive the code?{" "}
                                <button
                                    type="button"
                                    className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
                                    onClick={async () => {
                                        if (!formData.email) {
                                            return toast.error("No email found");
                                        }

                                        try {
                                            toast.loading("Sending new code...");
                                            await api.post('/auth/resend-code', {
                                                email: formData.email
                                            });
                                            toast.dismiss();
                                            toast.success("Code resent. Check your inbox.");
                                        } catch (err) {
                                            toast.dismiss();
                                            toast.error("Error resending code. Try again later.");
                                        }
                                    }}
                                >
                                    Resend code
                                </button>
                            </p>
                        </div>

                        <button
                            onClick={() => setNeedsVerification(false)}
                            className="w-full mt-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            Go back
                        </button>
                    </div>
                ) : (
                    /* --- Login and Register Views --- */
                    <>
                        <h2 className="text-3xl font-black text-slate-900 mb-6 text-center">
                            {isLogin ? 'Welcome back!' : 'Create your account'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <input
                                    type="text" placeholder="Your name" required
                                    className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            )}
                            <input
                                type="email" placeholder="Email" required
                                className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                            <input
                                type="password" placeholder="Password" required
                                className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Enter' : 'Register')}
                            </button>
                        </form>
                        <p className="mt-6 text-center text-slate-500">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button onClick={() => navigate(isLogin ? '/register' : '/login')} className="text-blue-600 font-bold hover:underline">
                                {isLogin ? 'Sign up' : 'Log in'}
                            </button>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}