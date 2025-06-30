import { useState, useEffect, createContext, useContext } from 'react';
import { isAuthenticated, getUserFromToken, setToken, removeToken } from '../utils/auth';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (isAuthenticated()) {
        const userData = getUserFromToken();
        setUser(userData);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const response = await api.login(credentials);
    setToken(response.token);
    setUser(response.user);
    return response;
  };

  const register = async (userData) => {
    return await api.register(userData);
  };

  const verifyEmail = async (code, email) => {
    return await api.verifyEmail(code, email);
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    verifyEmail,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};