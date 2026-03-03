import { useState, useContext, useEffect } from 'react';
import { TaskContext } from '../context/TaskContext';

export default function TaskForm() {
    const { addTask, updateTask, editingTask, setEditingTask } = useContext(TaskContext);
    const [formData, setFormData] = useState({ title: '', description: '', priority: 'medium' });

    useEffect(() => {
        if (editingTask) {
            setFormData({
                title: editingTask.title,
                description: editingTask.description || '',
                priority: editingTask.priority
            });
        }
    }, [editingTask]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        if (editingTask) {
            updateTask(editingTask._id, formData);
        } else {
            addTask(formData);
        }

        setFormData({ title: '', description: '', priority: 'medium' });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <h2 className="text-lg font-bold mb-4 text-slate-800">
                {editingTask ? 'Editing task' : 'New task'}
            </h2>
            <div className="grid gap-4">
                <input
                    type="text"
                    placeholder="Task title"
                    className="w-full p-2 border-b-2 border-slate-100 focus:border-blue-500 outline-none text-lg font-semibold"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />

                <textarea
                    placeholder="Task description (optional)"
                    className="w-full p-2 bg-slate-50 rounded-lg outline-none resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />

                <div className="flex items-center justify-between">
                    <select
                        className="p-2 bg-slate-100 rounded-md outline-none text-sm"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700">
                        {editingTask ? 'Save Changes' : 'Create Task'}
                    </button>
                    {editingTask && (
                        <button
                            type="button"
                            onClick={() => { setEditingTask(null); setFormData({ title: '', description: '', priority: 'medium' }); }}
                            className="bg-slate-200 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-300"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
}