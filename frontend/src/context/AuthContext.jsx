import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('institute_hub_admin');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('institute_hub_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then((res) => {
        setAdmin(res.data.admin);
        localStorage.setItem('institute_hub_admin', JSON.stringify(res.data.admin));
      })
      .catch(() => {
        localStorage.removeItem('institute_hub_token');
        localStorage.removeItem('institute_hub_admin');
        setAdmin(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('institute_hub_token', res.data.token);
    localStorage.setItem('institute_hub_admin', JSON.stringify(res.data.admin));
    setAdmin(res.data.admin);
    return res.data;
  }

  function logout() {
    localStorage.removeItem('institute_hub_token');
    localStorage.removeItem('institute_hub_admin');
    setAdmin(null);
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
