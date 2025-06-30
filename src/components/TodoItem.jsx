import React, { useState } from 'react';
import { Check, Edit3, Trash2, Calendar, X, Save } from 'lucide-react';
import { format } from 'date-fns';

const TodoItem = ({ todo, onToggle, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editDueDate, setEditDueDate] = useState(
    todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : ''
  );

  const handleSave = async () => {
    try {
      await onUpdate(todo.id, {
        title: editTitle,
        description: editDescription,
        dueDate: editDueDate ? new Date(editDueDate).toISOString() : null,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditDueDate(todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '');
    setIsEditing(false);
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Task title"
        />
        
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Task description (optional)"
          rows="2"
        />
        
        <input
          type="date"
          value={editDueDate}
          onChange={(e) => setEditDueDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            onClick={handleCancel}
            className="flex items-center justify-center space-x-1 px-3 py-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
          
          <button
            onClick={handleSave}
            className="flex items-center justify-center space-x-1 px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md ${
      todo.completed ? 'border-green-200 bg-green-50' : 
      isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200'
    } p-4`}>
      <div className="flex items-start space-x-3">
        <button
          onClick={() => onToggle(todo.id)}
          className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            todo.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-green-400'
          }`}
        >
          {todo.completed && <Check className="w-3 h-3" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium transition-all break-words ${
            todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'
          }`}>
            {todo.title}
          </h3>
          
          {todo.description && (
            <p className={`mt-1 text-sm transition-all break-words ${
              todo.completed ? 'text-gray-400 line-through' : 'text-gray-600'
            }`}>
              {todo.description}
            </p>
          )}
          
          {todo.dueDate && (
            <div className={`flex items-center space-x-1 mt-2 text-xs ${
              isOverdue ? 'text-red-600' : todo.completed ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Calendar className="w-3 h-3 flex-shrink-0" />
              <span>Due: {format(new Date(todo.dueDate), 'MMM dd, yyyy')}</span>
              {isOverdue && <span className="font-medium">(Overdue)</span>}
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-1">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Edit task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;