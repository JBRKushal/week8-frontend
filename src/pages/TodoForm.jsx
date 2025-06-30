import React, { useState } from 'react';
import { Plus, Calendar, FileText, Type } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const TodoForm = ({ onAdd, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      await onAdd({
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      });
      
      setFormData({
        title: '',
        description: '',
        dueDate: '',
      });
      setIsExpanded(false);
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Type className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onFocus={() => setIsExpanded(true)}
            className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Add a new task..."
            required
          />
        </div>

        {isExpanded && (
          <div className="space-y-4 animate-fadeIn">
            <div className="relative">
              <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Add a description (optional)..."
                rows="3"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center space-y-2 sm:space-y-0">
          {isExpanded && (
            <button
              type="button"
              onClick={() => {
                setIsExpanded(false);
                setFormData({ title: '', description: '', dueDate: '' });
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            disabled={loading || !formData.title.trim()}
            className={`flex items-center justify-center space-x-2 px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors ${
              !isExpanded ? 'w-full sm:w-auto sm:ml-auto' : ''
            }`}
          >
            {loading ? (
              <LoadingSpinner size="small" />
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TodoForm;