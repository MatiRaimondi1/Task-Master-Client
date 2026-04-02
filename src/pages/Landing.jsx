import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Shield, Zap, LogOut, Layout, ArrowRight, CheckCircle, Github, Linkedin } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import RevealOnScroll from '../components/RevealOnScroll';

/**
 * Landing page component
 * @returns 
 */
export default function Landing() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 overflow-x-hidden relative">
            {/* Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-150 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[70%] rounded-full bg-blue-50/50 blur-[120px]" />
                <div className="absolute top-[10%] -right-[10%] w-[30%] h-[60%] rounded-full bg-indigo-50/50 blur-[100px]" />
            </div>

            {/* Navbar */}
            <nav className="flex justify-between items-center px-6 py-5 max-w-7xl mx-auto sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-100/50">
                <div
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => navigate('/')}
                >
                    <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                        <Layout size={20} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-600">
                        TaskMaster Pro
                    </h1>
                </div>

                <div className="flex items-center gap-6">
                    {user ? (
                        <button
                            onClick={logout}
                            className="group flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors"
                        >
                            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Sign Out
                        </button>
                    ) : (
                        <>
                            <button onClick={() => navigate('/login')} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
                                Sign In
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200 active:scale-95"
                            >
                                Get Started
                            </button>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
                <RevealOnScroll>
                    <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm mb-8 animate-fade-in">
                        <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">New: Dark mode</span>
                    </div>

                    <h2 className="text-6xl md:text-8xl font-extrabold mb-8 tracking-tight text-slate-950">
                        Master your day, <br />
                        <span className="bg-clip-text text-transparent bg-linear-to-br from-blue-600 via-indigo-500 to-violet-600">
                            conquer your goals.
                        </span>
                    </h2>

                    <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
                        The minimalist platform designed for developers looking to organize their workflow with speed, security and style.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        {user ? (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 group"
                            >
                                Go to Dashboard
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/register')}
                                className="w-full sm:w-auto bg-slate-950 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-2xl shadow-slate-300"
                            >
                                Start for free — 0$
                            </button>
                        )}
                        <div className="flex items-center gap-4 text-slate-400 text-sm font-medium ml-2">
                            <span className="flex items-center gap-1"><CheckCircle size={14} className="text-emerald-500" /> No credit card</span>
                            <span className="flex items-center gap-1"><CheckCircle size={14} className="text-emerald-500" /> Unlimited tasks</span>
                        </div>
                    </div>
                </RevealOnScroll>
            </header>

            {/* Features Grid */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-slate-50/50 -skew-y-3 origin-right -z-10" />

                <div className="max-w-7xl mx-auto px-6">
                    <RevealOnScroll y={15}>
                        <div className="text-center mb-20">
                            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Built for modern workflows</h3>
                            <div className="h-1.5 w-20 bg-blue-600 mx-auto rounded-full" />
                        </div>
                    </RevealOnScroll>

                    <div className="grid md:grid-cols-3 gap-8">
                        <RevealOnScroll delay={0.1}>
                            <FeatureCard
                                icon={<Zap size={24} />}
                                title="Lightning Fast"
                                desc="Optimized for speed and performance."
                                color="blue"
                            />
                        </RevealOnScroll>
                        <RevealOnScroll delay={0.2}>
                            <FeatureCard
                                icon={<Shield size={24} />}
                                title="Safe & Private"
                                desc="End-to-end encryption for your sensitive project data."
                                color="indigo"
                            />
                        </RevealOnScroll>
                        <RevealOnScroll delay={0.3}>
                            <FeatureCard
                                icon={<Moon size={24} />}
                                title="Dark Mode"
                                desc="Switch to dark mode for a more comfortable viewing experience."
                                color="emerald"
                            />
                        </RevealOnScroll>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-400 border-t border-slate-100">
                <p className="text-sm">© {new Date().getFullYear()} Matias Raimondi</p>
                <div className="flex items-center gap-6">
                    <a href="https://github.com/MatiRaimondi1" className="hover:text-slate-900 transition-colors" aria-label="GitHub">
                        <Github size={20}/>
                    </a>
                    <a href="https://www.linkedin.com/in/mat%C3%ADas-raimondi/" className="hover:text-slate-900 transition-colors" aria-label="LinkedIn">
                        <Linkedin size={20} />
                    </a>
                </div>
            </footer>
        </div>
    );
}

/**
 * Component for displaying a feature card
 * @param {*} param0 
 * @returns 
 */
function FeatureCard({ icon, title, desc, color }) {
    const colors = {
        blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600",
        indigo: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600",
        emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600",
    };

    return (
        <div className="bg-white p-8 rounded-4xl border border-slate-200/60 shadow-sm group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full">
            <div className={`${colors[color]} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:text-white transition-all duration-300`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">{title}</h3>
            <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
        </div>
    );
}