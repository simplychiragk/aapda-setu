import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';
import { NotificationContext } from '../context/NotificationContext';
import Toaster from './Toaster';
import OfflineBanner from './OfflineBanner';
import { AuthContext } from '../context/AuthContext';
import useLogout from '../hooks/useLogout';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { darkModeEnabled, setTheme } = React.useContext(ThemeContext);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantMessages, setAssistantMessages] = useState([]);
  const [assistantTyping, setAssistantTyping] = useState(false);
  const [assistantInput, setAssistantInput] = useState('');
  const { notifications, unreadCount, markAllRead } = React.useContext(NotificationContext);
  const { user } = React.useContext(AuthContext);
  const handleLogout = useLogout();

  // Track page visits for demo analytics
  useEffect(() => {
    const uid = user?.userId || 'guest';
    const key = `analytics:${uid}`;
    const raw = localStorage.getItem(key);
    const data = raw ? JSON.parse(raw) : { visits: [] };
    data.visits.push({ path: location.pathname, at: Date.now() });
    try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
  }, [location.pathname, user?.userId]);
  
  const navItems = [
    { to: "/dashboard", icon: "🏠", label: "Dashboard" },
    { to: "/alerts", icon: "🚨", label: "Alerts" },
    { to: "/drills", icon: "🧯", label: "Drills" },
    { to: "/videos", icon: "🎬", label: "Videos" },
    { to: "/quizzes", icon: "❓", label: "Quizzes" },
    { to: "/leaderboard", icon: "🏆", label: "Leaderboard" },
    { to: "/contacts", icon: "📞", label: "Contacts" },
    { to: "/safe-zones", icon: "🛡️", label: "Safe Zones" },
    { to: "/profile", icon: "👤", label: "Profile" },
    { to: "/settings", icon: "⚙️", label: "Settings" },
  ];

  const sendAssistantMessage = async (message, quickAction = null) => {
    if (!message.trim() && !quickAction) return;

    const userMessage = { role: 'user', content: message, timestamp: Date.now() };
    if (message.trim()) {
      setAssistantMessages(prev => [...prev, userMessage]);
    }
    setAssistantTyping(true);
    setAssistantInput('');

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: message.trim() ? [userMessage] : [],
          quickAction 
        })
      });

      const data = await response.json();
      const botMessage = { 
        role: 'assistant', 
        content: data.message || 'Sorry, I had trouble processing that.', 
        timestamp: Date.now() 
      };

      setAssistantMessages(prev => [...prev, botMessage]);
      
      // Auto-scroll to bottom
      setTimeout(() => {
        const messagesContainer = document.getElementById('assistant-messages');
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error('Assistant error:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: 'I\'m having trouble right now. Please try again! 🤖', 
        timestamp: Date.now() 
      };
      setAssistantMessages(prev => [...prev, errorMessage]);
    } finally {
      setAssistantTyping(false);
    }
  };

  const quickActions = [
    { key: 'alerts', label: 'Alerts', icon: '🚨' },
    { key: 'quizzes', label: 'Quizzes', icon: '🧠' },
    { key: 'drills', label: 'Drills', icon: '🧯' },
    { key: 'profile', label: 'Profile', icon: '👤' }
  ];

  // NEW: Check if the current page is the admin/staff dashboard
  const isAdminPage = location.pathname.startsWith('/admin');

  // Don't show navigation on entry and login pages
  const hideNavigation = ['/entry', '/login', '/', '/not-authorized', '/not-found'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      {/* Modern Navigation */}
      {!hideNavigation && (
        <nav className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border-b border-white/20 dark:border-slate-800 sticky top-0 z-50 shadow-lg shadow-blue-500/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">🛡️</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Aapda Setu
                </span>
              </motion.div>

              {/* Navigation Items */}
              <div className="hidden md:flex items-center space-x-1">
                {/* NEW: Conditional rendering block */}
                {!isAdminPage ? (
                  <>
                    {/* This is the regular user navigation */}
                    {navItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          location.pathname === item.to
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25'
                            : 'text-gray-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="mr-2">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  
                    <div className="relative ml-2">
                      <details className="group">
                        <summary className="list-none cursor-pointer px-3 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-all duration-200">
                          🔔 {unreadCount > 0 && (<span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full animate-pulse">{unreadCount}</span>)}
                        </summary>
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-50"
                        >
                          {/* ... notification content ... */}
                        </motion.div>
                      </details>
                    </div>
                  </>
                ) : null}

                {/* Theme Toggle (Always Visible) */}
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTheme(darkModeEnabled ? 'light' : 'dark')} 
                  className="ml-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all duration-200" 
                  aria-label="Toggle dark mode"
                >
                  {darkModeEnabled ? '🌙' : '☀️'}
                </motion.button>
                
                {/* Logout Button (Always Visible if logged in) */}
                {user && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="ml-2 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                  >
                    Logout
                  </motion.button>
                )}
              </div>

              {/* Mobile menu button */}
              {/* (Mobile logic would need similar conditional rendering) */}
            </div>
          </div>
        </nav>
      )}

      {/* ... rest of the component is unchanged ... */}
      <main className="relative">
        {/* ... */}
      </main>
    </div>
  );
}
