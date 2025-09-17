import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

const AUTH_STORAGE_KEY = 'auth_user';

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
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      
      // Validate user object structure
      if (parsed && (!parsed.userId || !parsed.role)) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setUser(null);
        return;
      }
      
      setUser(parsed);
    } catch (error) {
      console.error('Auth refresh error:', error);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async ({ userId, password }) => {
    const uid = String(userId || '').trim();
    const pwd = String(password || '').trim();
    
    if (!uid || !pwd) {
      throw new Error('Please enter both username and password');
    }

    // Use API to establish server session (JWT cookie)
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: uid, password: pwd, role: 'auto' })
    });
    if (!res.ok) {
      const text = await res.text().catch(() => 'Login failed');
      throw new Error(text || 'Login failed');
    }
    await res.json();
    const meRes = await fetch('/api/auth/me', { credentials: 'include' });
    const me = meRes.ok ? await meRes.json() : { user: null };
    if (!me.user) throw new Error('Failed to load user');

    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(me.user));
    } catch (error) {
      console.error('Failed to save auth data:', error);
      throw new Error('Failed to save login session');
    }

    setUser(me.user);
    toast.success(`Welcome back, ${me.user.displayName || me.user.userId}! 🎉`);
    return { ok: true, role: me.user.role, redirectTo: me.user.role === 'staff' ? '/admin' : '/dashboard' };
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      localStorage.removeItem(AUTH_STORAGE_KEY);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, login, logout, refresh }), [user, loading, login, logout, refresh]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}