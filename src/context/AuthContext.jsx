import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

export const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  refresh: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const raw = localStorage.getItem('auth_user');
      const parsed = raw ? JSON.parse(raw) : null;
      setUser(parsed);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async ({ userId, password, role }) => {
    const uid = String(userId || '').trim();
    const pwd = String(password || '').trim();
    if (!uid || !pwd) throw new Error('Enter credentials');
    const assignedRole = (String(role || '').toLowerCase() === 'staff' || uid.toLowerCase() === 'admin') ? 'staff' : 'student';
    const nextUser = { userId: uid, role: assignedRole, displayName: uid.charAt(0).toUpperCase() + uid.slice(1) };
    localStorage.setItem('auth_user', JSON.stringify(nextUser));
    setUser(nextUser);
    return { ok: true, role: assignedRole, redirectTo: assignedRole === 'staff' ? '/admin' : '/dashboard' };
  }, []);

  const logout = useCallback(async () => {
    try {
      localStorage.removeItem('auth_user');
    } catch { /* ignore */ }
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, login, logout, refresh }), [user, loading, login, logout, refresh]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

