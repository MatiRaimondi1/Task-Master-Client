import { useState, useContext, useEffect } from 'react';
import { TaskContext } from '../context/TaskContext';
import { Plus, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * TaskForm component for adding or editing tasks
 * @returns 
 */
export default function TaskForm() {
    /**
     * Context variables for task management
     */
    const { addTask, updateTask, editingTask, setEditingTask } = useContext(TaskContext);
    const [formData, setFormData] = useState({ title: '', description: '', priority: 'medium' });

    /**
     * Initialize form data when editing a task
     */
    useEffect(() => {
        if (editingTask) {
            setFormData({
                title: editingTask.title,
                description: editingTask.description || '',
                priority: editingTask.priority
            });
        }
    }, [editingTask]);

    /**
     * Handle form submission
     * @param {*} e 
     * @returns 
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        if (editingTask) {
            updateTask(editingTask._id, formData);
        } else {
            addTask(formData);
        }

        setFormData({ title: '', description: '', priority: 'medium' });
        setEditingTask(null);
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{ transition: 'none' }}
            className="bg-white dark:bg-slate-900 p-6 rounded-4xl shadow-sm border border-slate-200 dark:border-slate-800"
        >
            <motion.div
                key={editingTask ? editingTask._id : 'new-task'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
            >
                <h3 className="text-lg font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
                    {editingTask ? (
                        <>
                            <Edit3 size={20} className="text-amber-500" />
                            <span>Edit Task</span>
                        </>
                    ) : (
                        <>
                            <Plus size={20} className="text-blue-600" />
                            <span>New Task</span>
                        </>
                    )}
                </h3>

                <div className="grid gap-5">
                    <input
                        type="text"
                        placeholder="What needs to be done?"
                        style={{ transition: 'none' }}
                        className="w-full py-2 bg-transparent border-b-2 border-slate-100 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-400 outline-none text-lg font-semibold text-slate-800 dark:text-white placeholder:text-slate-400"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />

                    <textarea
                        placeholder="Add a description..."
                        rows="3"
                        style={{ transition: 'none' }}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-blue-500/10 rounded-2xl outline-none resize-none text-slate-600 dark:text-slate-300 placeholder:text-slate-400"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">
                            Priority
                        </label>
                        <select
                            style={{ transition: 'none' }}
                            className="w-full p-3 bg-slate-100 dark:bg-slate-800 rounded-xl outline-none text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer border border-transparent"
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        >
                            <option value="low">🟢 Low</option>
                            <option value="medium">🟡 Medium</option>
                            <option value="high">🔴 High</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                        <button
                            type="submit"
                            style={{ transition: 'none' }}
                            className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-widest ${editingTask
                                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-200 dark:shadow-none'
                                    : 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none'
                                }`}
                        >
                            {editingTask ? 'Update Task' : 'Create Task'}
                        </button>

                        <AnimatePresence>
                            {editingTask && (
                                <motion.button
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.1 }}
                                    type="button"
                                    onClick={() => {
                                        setEditingTask(null);
                                        setFormData({ title: '', description: '', priority: 'medium' });
                                    }}
                                    className="w-full py-3 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-slate-600 dark:hover:text-slate-300 overflow-hidden"
                                >
                                    Cancel Edit
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </form>
    );
}