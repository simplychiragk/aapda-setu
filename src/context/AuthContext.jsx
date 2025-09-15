import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

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
    
    if (!uid || !pwd) {
      throw new Error('Please enter both username and password');
    }

    // Demo credentials validation
    let isValid = false;
    let assignedRole = 'student';
    
    if (uid.toLowerCase() === 'student' && pwd === 'student') {
      isValid = true;
      assignedRole = 'student';
    } else if (uid.toLowerCase() === 'admin' && pwd === 'admin') {
      isValid = true;
      assignedRole = 'staff';
    }
    
    if (!isValid) {
      throw new Error('Invalid credentials. Use student/student or admin/admin');
    }

    const nextUser = { 
      userId: uid, 
      role: assignedRole, 
      displayName: uid.charAt(0).toUpperCase() + uid.slice(1),
      email: `${uid}@example.com`
    };
    
    localStorage.setItem('auth_user', JSON.stringify(nextUser));
    setUser(nextUser);
    
    toast.success(`Welcome back, ${nextUser.displayName}! 🎉`);
    
    return { 
      ok: true, 
      role: assignedRole, 
      redirectTo: assignedRole === 'staff' ? '/admin' : '/dashboard' 
    };
  }, []);

  const logout = useCallback(async () => {
    try {
      localStorage.removeItem('auth_user');
      toast.success('Logged out successfully');
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