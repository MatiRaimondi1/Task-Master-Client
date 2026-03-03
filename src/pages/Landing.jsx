import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Shield, Zap, LogOut, Layout } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Landing() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
            {/* Navbar */}
            <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <h1 className="text-2xl font-black tracking-tighter text-blue-600 cursor-pointer" onClick={() => navigate('/')}>
                    TaskMaster Pro
                </h1>

                <div className="flex items-center gap-4">
                    {user ? (
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all"
                        >
                            <LogOut size={18} /> Exit
                        </button>
                    ) : (
                        <>
                            <button onClick={() => navigate('/login')} className="font-semibold text-slate-600 hover:text-blue-600 transition-colors">
                                Login
                            </button>
                            <button onClick={() => navigate('/register')} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                                Start Free
                            </button>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <header className="max-w-7xl mx-auto px-8 py-24 text-center">
                <span className="bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest mb-6 inline-block">
                    Productivity 2.0
                </span>
                <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight text-slate-950">
                    Manage your tasks <br />
                    <span className="text-blue-600 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                        without complications.
                    </span>
                </h2>
                <p className="text-slate-500 text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
                    The minimalist platform designed for developers looking to organize their workflow with speed, security and style.
                </p>

                <div className="flex justify-center">
                    {user ? (
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-blue-600 text-white px-12 py-4.5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 flex items-center gap-3"
                        >
                            Go to my Dashboard <Layout size={22} />
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/register')}
                            className="bg-slate-900 text-white px-10 py-4.5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200"
                        >
                            Create my free account
                        </button>
                    )}
                </div>
            </header>

            {/* Features Grid */}
            <section className="bg-white border-y border-slate-100 py-24">
                <div className="max-w-7xl mx-auto px-8">
                    <h3 className="text-4xl font-black text-center mb-16 tracking-tight">
                        Everything you need, <span className="text-blue-600">nothing more.</span>
                    </h3>

                    <div className="grid md:grid-cols-3 gap-10">
                        <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 shadow-sm group hover:border-blue-200 hover:shadow-blue-50 transition-all duration-300">
                            <div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:scale-110 transition-transform">
                                <Zap size={28} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-950">Extreme Speed</h3>
                            <p className="text-slate-600 text-lg leading-relaxed">Optimized interface with React and Vite for loading in milliseconds.</p>
                        </div>

                        <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 shadow-sm group hover:border-indigo-200 hover:shadow-indigo-50 transition-all duration-300">
                            <div className="bg-indigo-100 w-14 h-14 rounded-2xl flex items-center justify-center text-indigo-600 mb-8 group-hover:scale-110 transition-transform">
                                <Shield size={28} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-950">JWT Security</h3>
                            <p className="text-slate-600 text-lg leading-relaxed">Your tasks are only yours, protected with enterprise-level standards.</p>
                        </div>

                        <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 shadow-sm group hover:border-emerald-200 hover:shadow-emerald-50 transition-all duration-300">
                            <div className="bg-emerald-100 w-14 h-14 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 group-hover:scale-110 transition-transform">
                                <Rocket size={28} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-slate-950">Visual Progress</h3>
                            <p className="text-slate-600 text-lg leading-relaxed">Visualize the progress of your goals with our new dynamic progress bar.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="max-w-7xl mx-auto px-8 py-10 text-center text-slate-500 border-t border-slate-100">
                <p>&copy; {new Date().getFullYear()} TaskMaster Pro</p>
            </footer>
        </div>
    );
}