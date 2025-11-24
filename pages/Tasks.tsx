import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  CheckSquare, 
  Calendar, 
  Flag, 
  MoreHorizontal, 
  Trash2, 
  Edit2, 
  X, 
  Save, 
  CheckCircle2,
  Circle
} from 'lucide-react';
import { storage } from '../services/storage';
import { Task, TaskStatus } from '../types';

export const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => storage.getTasks());
  const [filterStatus, setFilterStatus] = useState<'all' | TaskStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const saveToStorage = (newTasks: Task[]) => {
    setTasks(newTasks);
    storage.saveTasks(newTasks);
  };

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    due_date: '',
    status: TaskStatus.TODO,
    priority: 'medium' as 'low' | 'medium' | 'high',
    assigned_to: 101 // Default to current user
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-100';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-100';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.DONE: return 'text-green-600 bg-green-50 border-green-100';
      case TaskStatus.IN_PROGRESS: return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const resetForm = () => {
    setFormData({
      title: '',
      due_date: new Date().toISOString().split('T')[0],
      status: TaskStatus.TODO,
      priority: 'medium',
      assigned_to: 101
    });
    setEditingId(null);
  };

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingId(task.id);
      setFormData({
        title: task.title,
        due_date: task.due_date === 'Today' || task.due_date === 'Tomorrow' ? new Date().toISOString().split('T')[0] : task.due_date,
        status: task.status,
        priority: task.priority,
        assigned_to: task.assigned_to
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      const updated = tasks.map(t => 
        t.id === editingId ? { ...t, ...formData } : t
      );
      saveToStorage(updated);
    } else {
      const newTask: Task = {
        id: Date.now(),
        ...formData
      };
      saveToStorage([newTask, ...tasks]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')||true) {
      const updated = tasks.filter(t => t.id !== id);
      saveToStorage(updated);
    }
  };

  const toggleTaskStatus = (id: number, currentStatus: TaskStatus) => {
    const newStatus = currentStatus === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE;
    const updated = tasks.map(t => 
      t.id === id ? { ...t, status: newStatus } : t
    );
    saveToStorage(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-500">Manage your daily to-dos and priorities.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} />
          Add Task
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-2 w-full sm:w-auto">
             <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
             <button 
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filterStatus === 'all' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
             >
                All Tasks
             </button>
             <button 
                onClick={() => setFilterStatus(TaskStatus.TODO)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filterStatus === TaskStatus.TODO ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
             >
                To Do
             </button>
             <button 
                onClick={() => setFilterStatus(TaskStatus.IN_PROGRESS)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filterStatus === TaskStatus.IN_PROGRESS ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
             >
                In Progress
             </button>
             <button 
                onClick={() => setFilterStatus(TaskStatus.DONE)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filterStatus === TaskStatus.DONE ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
             >
                Completed
             </button>
          </div>
        </div>

        {/* Task List */}
        <div className="divide-y divide-gray-100">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <div 
                key={task.id} 
                className={`p-4 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center gap-4 group ${task.status === TaskStatus.DONE ? 'bg-gray-50/50' : 'bg-white'}`}
              >
                {/* Checkbox & Title */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button 
                    onClick={() => toggleTaskStatus(task.id, task.status)}
                    className={`mt-1 flex-shrink-0 w-5 h-5 rounded border transition-colors flex items-center justify-center
                      ${task.status === TaskStatus.DONE 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-gray-300 text-transparent hover:border-indigo-500'}`}
                  >
                    <CheckCircle2 size={14} fill="currentColor" className={task.status === TaskStatus.DONE ? 'opacity-100' : 'opacity-0'} />
                  </button>
                  
                  <div className="min-w-0">
                    <h3 className={`font-medium text-sm truncate ${task.status === TaskStatus.DONE ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {task.due_date}
                      </span>
                      {task.status !== TaskStatus.DONE && (
                        <span className={`px-1.5 py-0.5 rounded border ${getPriorityColor(task.priority)} text-[10px] uppercase font-bold tracking-wide`}>
                          {task.priority}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Meta & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-4 pl-8 sm:pl-0">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                    {task.status === TaskStatus.TODO ? 'To Do' : task.status === TaskStatus.IN_PROGRESS ? 'In Progress' : 'Done'}
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleOpenModal(task)}
                      className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(task.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                <CheckSquare size={24} className="text-gray-400" />
              </div>
              <p>No tasks found.</p>
            </div>
          )}
        </div>
      </div>

       {/* Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {editingId ? 'Edit Task' : 'New Task'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Description</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                  placeholder="e.g. Call client about..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                   <input 
                      type="date" 
                      required
                      value={formData.due_date}
                      onChange={e => setFormData({...formData, due_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                   <select
                      value={formData.priority}
                      onChange={e => setFormData({...formData, priority: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                   >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                   </select>
                </div>
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                 <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as TaskStatus})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
                 >
                    <option value={TaskStatus.TODO}>To Do</option>
                    <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                    <option value={TaskStatus.DONE}>Done</option>
                 </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                  <Save size={16} />
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};