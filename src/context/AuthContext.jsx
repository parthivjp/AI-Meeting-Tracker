import { createContext, useContext, useState, useCallback } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/api';

const AuthContext = createContext(null);

function enrichUser(user) {
  if (!user) return null;
  const avatar =
    user.avatar ||
    (user.name || 'U')
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  return { ...user, avatar };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const saved = localStorage.getItem('meetai_user');
    if (!token || !saved) return null;
    try {
      return enrichUser(JSON.parse(saved));
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiLogin({ email, password });
      const userData = enrichUser(data.user);
      setUser(userData);
      localStorage.setItem('meetai_user', JSON.stringify(userData));
      localStorage.setItem('token', data.token);
      setLoading(false);
      return { success: true };
    } catch (err) {
      const message = err.message || 'Invalid email or password';
      setError(message);
      setLoading(false);
      return { success: false };
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiRegister({ name, email, password });
      const userData = enrichUser(data.user || { name, email });
      setUser(userData);
      localStorage.setItem('meetai_user', JSON.stringify(userData));
      localStorage.setItem('token', data.token);
      setLoading(false);
      return { success: true };
    } catch (err) {
      const message = err.message || 'Registration failed';
      setError(message);
      setLoading(false);
      return { success: false };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('meetai_user');
    localStorage.removeItem('token');
  }, []);

  const updateUser = useCallback((userData) => {
    const enriched = enrichUser(userData);
    setUser(enriched);
    localStorage.setItem('meetai_user', JSON.stringify(enriched));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateUser, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
