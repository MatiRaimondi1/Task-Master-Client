import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskContext } from '../context/TaskContext';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import TaskForm from '../components/TaskForm';
import { Trash2, Edit3, Search, ChevronLeft, ChevronRight, LogOut, CheckCircle, Home, LayoutDashboard, Clock, AlertCircle, Sun, Moon } from 'lucide-react';

/**
 * Dashboard page component
 * @returns 
 */
export default function Dashboard() {
    const navigate = useNavigate();

    /**
     * Context variables for theme management and task management
     */
    const { darkMode, toggleDarkMode } = useTheme();
    const { tasks, loading, deleteTask, setEditingTask, fetchTasks, updateTask } = useContext(TaskContext);
    const { logout, user } = useContext(AuthContext);

    /**
     * State variables for managing the dashboard UI
     */
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("all");
    const tasksPerPage = 5;

    /**
     * Calculated values for task statistics
     */
    const completedCount = tasks.filter(t => t.status === 'completed').length;
    const pendingCount = tasks.filter(t => t.status === 'pending').length;
    const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
    const progressPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

    /**
     * Returns the details for a given task status
     * @param {*} status 
     * @returns 
     */
    const getStatusDetails = (status) => {
        const map = {
            'pending': { label: 'Pending', color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-500 dark:border-amber-800', next: 'in-progress' },
            'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800', next: 'completed' },
            'completed': { label: 'Completed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800', next: 'pending' }
        };
        return map[status] || map.pending;
    };

    /**
     * Filtered tasks based on search term and status filter
     */
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || task.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    /**
     * Current tasks for the active page
     */
    const currentTasks = filteredTasks.slice((currentPage - 1) * tasksPerPage, currentPage * tasksPerPage);
    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

    /**
     * Fetch tasks on component mount
     */
    useEffect(() => { fetchTasks(); }, []);

    if (loading) return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-slate-950">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Loading your space...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex flex-col lg:flex-row">

            {/* Sidebar */}
            <aside className="hidden lg:flex w-20 flex-col items-center py-8 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 sticky top-0 h-screen">
                <div className="bg-blue-600 p-2 rounded-xl mb-10 shadow-lg shadow-blue-200 dark:shadow-none">
                    <LayoutDashboard className="text-white" size={24} />
                </div>
                <nav className="flex flex-col gap-6 flex-1">
                    <button onClick={() => navigate('/')} className="p-3 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl group relative">
                        <Home size={24} />
                    </button>
                    <button className="p-3 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl"><Clock size={24} /></button>
                </nav>
                <div className="flex flex-col gap-4 mt-auto border-t border-slate-100 dark:border-slate-800 pt-6 w-full items-center">
                    {/* Theme change button */}
                    <button
                        onClick={toggleDarkMode}
                        className="p-3 text-slate-400 hover:text-amber-500 dark:hover:text-yellow-400 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-xl relative group"
                        title={darkMode ? "Modo Claro" : "Modo Oscuro"}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={darkMode ? 'sun' : 'moon'}
                                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                            >
                                {darkMode ? <Sun size={24} /> : <Moon size={24} />}
                            </motion.div>
                        </AnimatePresence>
                    </button>

                    {/* Logout button */}
                    <button
                        onClick={logout}
                        className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                        title="Logout"
                    >
                        <LogOut size={24} />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">

                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Dashboard</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
                            Welcome, <span className="text-blue-600 dark:text-blue-400">{user?.name ? user.name.split(' ')[0] : 'User'}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-72">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/5 focus:border-blue-500 shadow-sm"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                        </div>
                        {/* Theme change button for Mobile */}
                        <button onClick={toggleDarkMode} className="lg:hidden p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400">
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                </header>

                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    <StatCard label="In Progress" value={`${progressPercentage}%`} sub={`In ${tasks.length} tasks`} progress={progressPercentage} color="blue" />
                    <StatCard label="Pending" value={pendingCount} sub="To do" icon={<AlertCircle className="text-amber-500" />} />
                    <StatCard label="In Progress" value={inProgressCount} sub="Active" icon={<Clock className="text-blue-500" />} />
                    <StatCard label="Completed" value={completedCount} sub="Finished" icon={<CheckCircle className="text-emerald-500" />} />
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 order-2 lg:order-1">
                        <div className="sticky top-8">
                            <TaskForm />
                        </div>
                    </div>

                    <div className="lg:col-span-8 order-1 lg:order-2">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                            <div className="flex p-1 bg-slate-200/50 dark:bg-slate-900 rounded-2xl w-full sm:w-auto">
                                {['all', 'pending', 'in-progress', 'completed'].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => { setStatusFilter(f); setCurrentPage(1); }}
                                        className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider ${statusFilter === f
                                            ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                            }`}
                                    >
                                        {f === 'all' ? 'All' : f.replace('-', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence mode='popLayout'>
                                {currentTasks.length > 0 ? (
                                    currentTasks.map((task) => (
                                        <TaskRow
                                            key={task._id}
                                            task={task}
                                            details={getStatusDetails(task.status)}
                                            onToggle={() => updateTask(task._id, { status: getStatusDetails(task.status).next })}
                                            onDelete={() => deleteTask(task._id)}
                                            onEdit={() => { setEditingTask(task); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                        />
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="text-center py-20 bg-white dark:bg-slate-900 rounded-4xl border-2 border-dashed border-slate-200 dark:border-slate-800"
                                    >
                                        <Search className="text-slate-300 dark:text-slate-700 mx-auto mb-4" size={48} />
                                        <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">No tasks found</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-3 mt-10">
                                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-30 shadow-sm">
                                    <ChevronLeft size={20} />
                                </button>
                                <div className="flex gap-2">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-11 h-11 rounded-xl font-bold  ${currentPage === i + 1
                                                ? 'bg-blue-600 text-white shadow-lg dark:shadow-none'
                                                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-30  shadow-sm">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

/**
 * Component for displaying a stat card
 * @param {*} param0 
 * @returns 
 */
function StatCard({ label, value, sub, icon, progress, color }) {
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-4xl border border-slate-200 dark:border-slate-800 shadow-sm ">
            <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</span>
                {icon}
            </div>
            <div className="flex items-end gap-2">
                <h4 className="text-3xl font-black text-slate-900 dark:text-white">{value}</h4>
                <span className="text-slate-400 dark:text-slate-500 text-xs font-medium mb-1.5">{sub}</span>
            </div>
            {progress !== undefined && (
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-4 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                        className={`h-full ${color === 'blue' ? 'bg-blue-600' : 'bg-slate-600'}`}
                    />
                </div>
            )}
        </div>
    );
}

/**
 * Component for displaying a task row
 * @param {*} param0 
 * @returns 
 */
function TaskRow({ task, details, onToggle, onDelete, onEdit }) {
    const priorityColors = {
        high: "text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400",
        medium: "text-amber-500 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400",
        low: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400"
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`group bg-white dark:bg-slate-900 p-5 rounded-3xl border  flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${task.status === 'completed'
                ? 'border-slate-100 dark:border-slate-800 opacity-60'
                : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-lg dark:hover:shadow-none'
                }`}
        >
            <div className="flex items-start gap-4 flex-1 w-full">
                <button
                    onClick={onToggle}
                    className={`mt-1  active:scale-75 ${task.status === 'completed' ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-700 hover:text-blue-500'}`}
                >
                    <CheckCircle size={28} className={task.status === 'completed' ? 'text-emerald-500 dark:text-emerald-400' : ''} />
                </button>

                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className={`font-bold text-lg truncate ${task.status === 'completed' ? 'text-slate-400 dark:text-slate-600 line-through' : 'text-slate-800 dark:text-slate-100'}`}>
                            {task.title}
                        </h3>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase border ${details.color}`}>
                            {details.label}
                        </span>
                        {task.priority && (
                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase ${priorityColors[task.priority]}`}>
                                {task.priority}
                            </span>
                        )}
                    </div>
                    <p className={`text-sm leading-relaxed truncate max-w-md ${task.status === 'completed' ? 'text-slate-400 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'}`}>
                        {task.description}
                    </p>
                </div>
            </div>

            <div className="flex gap-1 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                <button onClick={onEdit} className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl " disabled={task.status === 'completed'}>
                    <Edit3 size={18} />
                </button>
                <button onClick={onDelete} className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800 rounded-xl ">
                    <Trash2 size={18} />
                </button>
            </div>
        </motion.div>
    );
}