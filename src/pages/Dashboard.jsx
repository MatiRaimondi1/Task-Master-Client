import { useContext, useState, useEffect } from 'react';
import { TaskContext } from '../context/TaskContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import { Trash2, Edit3, Search, X, ChevronLeft, ChevronRight, LogOut, CheckCircle, Home } from 'lucide-react';

export default function Dashboard() {
    const { tasks, loading, deleteTask, setEditingTask, fetchTasks, updateTask } = useContext(TaskContext);
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("all");
    const tasksPerPage = 5;

    const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
    const progressPercentage = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

    const getStatusDetails = (status) => {
        switch (status) {
            case 'pending':
                return { label: 'Pending', color: 'bg-slate-100 text-slate-600', next: 'in-progress' };
            case 'in-progress':
                return { label: 'In Progress', color: 'bg-blue-100 text-blue-600', next: 'completed' };
            case 'completed':
                return { label: 'Completed', color: 'bg-emerald-100 text-emerald-600', next: 'pending' };
            default:
                return { label: 'Pending', color: 'bg-slate-100 text-slate-600', next: 'in-progress' };
        }
    };

    const handleToggleStatus = (id, currentStatus) => {
        const { next } = getStatusDetails(currentStatus);
        updateTask(id, { status: next });
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || task.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    if (loading) return <div className="flex h-screen items-center justify-center font-bold text-slate-500">Loading TaskMaster...</div>;

    return (
        <div className="min-h-screen w-full bg-slate-50 p-4 md:p-10">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                    <div className="flex justify-between items-center w-full md:w-auto gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="p-2.5 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm group"
                                title="Go to Landing Page"
                            >
                                <Home size={20} className="group-hover:scale-110 transition-transform" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none">TaskMaster Pro</h1>
                                <p className="text-slate-500 font-medium mt-1 text-sm">
                                    Hello, <span className="text-blue-600">{user?.name || 'User'}</span>
                                </p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="md:hidden p-2.5 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                            <LogOut size={24} />
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-2xl outline-none shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            {searchTerm && (
                                <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
                        >
                            <LogOut size={18} /> Exit
                        </button>
                    </div>
                </header>

                {/* Progress bar */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 mb-8 shadow-sm">
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <p className="text-slate-500 text-xs font-black uppercase tracking-widest">General Progress</p>
                            <h4 className="text-2xl font-bold text-slate-800">{progressPercentage}% Completed</h4>
                        </div>
                        <p className="text-slate-400 text-sm font-medium">{completedTasksCount} of {tasks.length} tasks</p>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4">
                        <TaskForm />
                    </div>

                    <div className="lg:col-span-8">
                        {/* Filters bar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <div className="flex p-1 bg-slate-200/50 rounded-2xl w-full sm:w-auto overflow-x-auto">
                                {[
                                    { id: 'all', label: 'All' },
                                    { id: 'pending', label: 'Pending' },
                                    { id: 'in-progress', label: 'In Progress' },
                                    { id: 'completed', label: 'Completed' }
                                ].map((filter) => (
                                    <button
                                        key={filter.id}
                                        onClick={() => { setStatusFilter(filter.id); setCurrentPage(1); }}
                                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${statusFilter === filter.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                            <span className="text-xs font-bold text-slate-400 px-3 shrink-0">
                                {filteredTasks.length} tasks found
                            </span>
                        </div>

                        <div className="grid gap-4">
                            {currentTasks.length > 0 ? (
                                currentTasks.map(task => {
                                    const { label, color } = getStatusDetails(task.status);
                                    return (
                                        <div key={task._id} className={`bg-white p-5 rounded-2xl shadow-sm border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${task.status === 'completed' ? 'opacity-70 border-slate-100 bg-slate-50/50' : 'border-slate-200 hover:border-blue-200'
                                            }`}>
                                            <div className="flex items-start gap-4 flex-1">
                                                <button
                                                    onClick={() => handleToggleStatus(task._id, task.status)}
                                                    className={`mt-1 transition-transform active:scale-90 ${task.status === 'completed' ? 'text-emerald-500' : 'text-slate-300 hover:text-blue-500'}`}
                                                >
                                                    <CheckCircle size={24} fill={task.status === 'completed' ? 'currentColor' : 'none'} className={task.status === 'completed' ? 'fill-emerald-100' : ''} />
                                                </button>

                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                        <h3 className={`font-bold text-lg leading-none ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                                            {task.title}
                                                        </h3>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-black uppercase tracking-wider ${color}`}>
                                                            {label}
                                                        </span>
                                                        <span className={`text-[10px] font-bold uppercase ${task.priority === 'high' ? 'text-red-500' : 'text-slate-400'}`}>
                                                            • {task.priority}
                                                        </span>
                                                    </div>
                                                    <p className={`text-sm ${task.status === 'completed' ? 'text-slate-400' : 'text-slate-500'}`}>
                                                        {task.description}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                                                <button onClick={() => { setEditingTask(task); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-2 text-slate-400 hover:text-blue-600" disabled={task.status === 'completed'}>
                                                    <Edit3 size={18} />
                                                </button>
                                                <button onClick={() => deleteTask(task._id)} className="p-2 text-slate-400 hover:text-red-600">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
                                    <p className="text-lg font-medium">No tasks found</p>
                                    <p className="text-sm">Try adjusting the filters or the search.</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-10">
                                <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2.5 rounded-xl bg-white border border-slate-200 disabled:opacity-30">
                                    <ChevronLeft size={20} />
                                </button>
                                <div className="flex gap-1.5">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border border-slate-200'}`}>
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2.5 rounded-xl bg-white border border-slate-200 disabled:opacity-30">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}