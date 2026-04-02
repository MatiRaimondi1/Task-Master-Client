import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TaskContext } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Loader2, ShieldCheck, Mail, Lock, User, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import api from '../api/axios';

/**
 * Authentication page component
 * @param {*} param0 tells to load either register or login form.
 * @returns 
 */
export default function Auth({ isLogin }) {
    const navigate = useNavigate();

    /**
     * State variables for managing the authentication form
     */
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [needsVerification, setNeedsVerification] = useState(false);

    /**
     * Context variables for authentication and task management
     */
    const { login, register, verifyEmail } = useContext(AuthContext);
    const { fetchTasks } = useContext(TaskContext);

    /**
     * Handles form submission for login or registration
     * @param {*} e 
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
                toast.success('Welcome back!');
                await fetchTasks();
                navigate('/dashboard');
            } else {
                await register(formData.name, formData.email, formData.password);
                setNeedsVerification(true);
                toast.success('Code sent to your email');
            }
        } catch (err) {
            if (err.response?.data?.message === "PENDING_VERIFICATION") {
                toast.error("Account not verified yet");
                setFormData(prev => ({ ...prev, email: err.response.data.email }));
                setNeedsVerification(true);
            } else {
                toast.error(err.response?.data?.message || 'Unexpected error');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white text-slate-900 font-sans">
            <button
                onClick={() => navigate('/')}
                className="absolute top-8 right-8 z-50 flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors group"
            >
                <div className="p-2 rounded-full group-hover:bg-slate-100 transition-colors">
                    <ArrowLeft size={20} />
                </div>
                <span className="hidden sm:inline">Back to Home</span>
            </button>

            {/* Left Column: Visual (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-indigo-900/40 z-10" />
                {/* Background Elements */}
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-500/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-500/30 rounded-full blur-[100px]" />

                <div className="relative z-20 p-12 max-w-lg">
                    <div className="mb-8 inline-flex p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
                        <Sparkles className="text-blue-400" size={32} />
                    </div>
                    <h2 className="text-5xl font-black text-white leading-tight mb-6">
                        Organize your work <br />
                        <span className="text-blue-400">with style.</span>
                    </h2>
                    <p className="text-slate-400 text-xl leading-relaxed">
                        Join thousands of professionals who trust TaskMaster Pro to keep their productivity at the highest level.
                    </p>

                    {/* Small Testimonial or Stat */}
                    <div className="mt-12 pt-12 border-t border-white/10">
                        <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map(i => <span key={i} className="text-yellow-400">★</span>)}
                        </div>
                        <p className="italic text-slate-300">"The best interface I've used in years."</p>
                    </div>
                </div>
            </div>

            {/* Right Column: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50/50">
                <div className="w-full max-w-md">
                    {needsVerification ? (
                        <div className="animate-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-blue-100 w-20 h-20 rounded-3xl flex items-center justify-center text-blue-600 mx-auto mb-8 rotate-3">
                                <ShieldCheck size={40} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-2 text-center">Verify your email</h2>
                            <p className="text-slate-500 mb-10 text-center">
                                Enter the code sent to <br />
                                <span className="font-bold text-slate-900">{formData.email}</span>
                            </p>

                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const code = e.target.code.value.trim();
                                    try {
                                        setLoading(true);
                                        await verifyEmail(formData.email, code);
                                        toast.success("Email verified! Welcome.");
                                        navigate('/dashboard');
                                    } catch (err) {
                                        toast.error(err.response?.data?.message || "Invalid code");
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                className="space-y-6"
                            >
                                <input
                                    name="code" type="text" maxLength="6" placeholder="000000" required
                                    className="w-full text-center text-5xl tracking-[1rem] font-black py-6 bg-white border-2 border-slate-200 rounded-3xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                />
                                <button
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 group"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <>Continue <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
                                </button>
                            </form>

                            <div className="mt-8 text-center">
                                <button
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
                                    className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    I didn't receive the code. Resend.
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in fade-in duration-700">
                            <div className="mb-10">
                                <h2 className="text-4xl font-black text-slate-900 mb-2">
                                    {isLogin ? 'Welcome back!' : 'Join for free.'}
                                </h2>
                                <p className="text-slate-500">
                                    {isLogin ? 'Enter your credentials to access.' : 'Start organizing your life today.'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {!isLogin && (
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            type="text" placeholder="Full name" required
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                )}
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="email" placeholder="Email" required
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="password" placeholder="Password" required
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>

                                <button
                                    disabled={loading}
                                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 mt-4"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={22} /> : (isLogin ? 'Sign in' : 'Create account')}
                                </button>
                            </form>

                            <div className="mt-8 text-center">
                                <p className="text-slate-500">
                                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                                    <button
                                        onClick={() => navigate(isLogin ? '/register' : '/login')}
                                        className="text-blue-600 font-bold hover:underline"
                                    >
                                        {isLogin ? 'Sign up here' : 'Sign in'}
                                    </button>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}