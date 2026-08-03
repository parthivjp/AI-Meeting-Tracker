import { createContext, useContext, useState, useCallback } from 'react';
import { MOCK_USERS, DEMO_CREDENTIALS } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('meetai_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 800));

    const found = MOCK_USERS.find((u) => u.email === email);
    if (found && (password === DEMO_CREDENTIALS.password || password.length >= 6)) {
      const userData = { ...found, email };
      setUser(userData);
      localStorage.setItem('meetai_user', JSON.stringify(userData));
      setLoading(false);
      return { success: true };
    }

    setError('Invalid email or password. Try sarah@meetai.com / demo1234');
    setLoading(false);
    return { success: false };
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    await new Promise((r) => setTimeout(r, 800));

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return { success: false };
    }

    const userData = {
      id: `u_${Date.now()}`,
      name,
      email,
      avatar: name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
    };
    setUser(userData);
    localStorage.setItem('meetai_user', JSON.stringify(userData));
    setLoading(false);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('meetai_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
