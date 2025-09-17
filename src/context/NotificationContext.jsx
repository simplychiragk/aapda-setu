import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAllRead: () => {},
  showToast: () => {},
});

function getKey(userId) {
  return `notifications:${userId || 'guest'}`;
}

export function NotificationProvider({ children }) {
  const { user } = React.useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);

  const userId = user?.userId || 'guest';

  useEffect(() => {
    try {
      const raw = localStorage.getItem(getKey(userId));
      setNotifications(raw ? JSON.parse(raw) : []);
    } catch {
      setNotifications([]);
    }
  }, [userId]);

  const persist = useCallback((list) => {
    try { localStorage.setItem(getKey(userId), JSON.stringify(list)); } catch {}
  }, [userId]);

  const addNotification = useCallback((message, opts = {}) => {
    const n = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
      message,
      type: opts.type || 'info',
      read: false,
      at: new Date().toISOString(),
    };
    setNotifications((prev) => { const next = [n, ...prev]; persist(next); return next; });
    // also toast
    setToasts((prev) => [...prev, { id: n.id, message: n.message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== n.id)), 3500);
  }, [persist]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => { const next = prev.map((n) => ({ ...n, read: true })); persist(next); return next; });
  }, [persist]);

  const showToast = useCallback((message) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const value = useMemo(() => ({ notifications, unreadCount, addNotification, markAllRead, showToast, toasts }), [notifications, unreadCount, addNotification, markAllRead, showToast, toasts]);

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
}

