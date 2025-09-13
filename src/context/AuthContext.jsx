import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authClient } from '../lib/api/authClient';

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
      const me = await authClient.me();
      setUser(me?.user || null);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async ({ userId, password, role }) => {
    const res = await authClient.login({ userId, password, role });
    if (res?.ok) {
      await refresh();
    }
    return res;
  }, [refresh]);

  const logout = useCallback(async () => {
    try {
      await authClient.logout?.();
    } catch {}
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, login, logout, refresh }), [user, loading, login, logout, refresh]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

