import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext';

const MAX_NOTIFICATIONS = 50; // Prevent memory issues
const TOAST_DURATION = 3500;

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
    try { 
      // Limit stored notifications to prevent localStorage overflow
      const limitedList = list.slice(0, MAX_NOTIFICATIONS);
      localStorage.setItem(getKey(userId), JSON.stringify(limitedList)); 
    } catch (error) {
      console.error('Failed to persist notifications:', error);
    }
  }, [userId]);

  const addNotification = useCallback((message, opts = {}) => {
    if (!message || typeof message !== 'string') {
      console.warn('Invalid notification message:', message);
      return;
    }
    
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
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== n.id)), TOAST_DURATION);
  }, [persist]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => { const next = prev.map((n) => ({ ...n, read: true })); persist(next); return next; });
  }, [persist]);

  const showToast = useCallback((message) => {
    if (!message) return;
    
    const id = `${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), TOAST_DURATION);
  }, []);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const value = useMemo(() => ({ notifications, unreadCount, addNotification, markAllRead, showToast, toasts }), [notifications, unreadCount, addNotification, markAllRead, showToast, toasts]);

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
}

