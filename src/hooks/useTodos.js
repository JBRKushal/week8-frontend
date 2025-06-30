import { useState, useEffect } from 'react';
import api from '../api';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getTodos();
      setTodos(response.todos || response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (todoData) => {
    try {
      const response = await api.createTodo(todoData);
      setTodos(prev => [response.todo || response, ...prev]);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTodo = async (id, todoData) => {
    try {
      const response = await api.updateTodo(id, todoData);
      setTodos(prev => prev.map(todo => 
        todo.id === id ? { ...todo, ...response.todo || response } : todo
      ));
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTodo = async (id) => {
    try {
      await api.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const toggleTodo = async (id) => {
    try {
      const response = await api.toggleTodo(id);
      setTodos(prev => prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ));
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return {
    todos,
    loading,
    error,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
  };
};