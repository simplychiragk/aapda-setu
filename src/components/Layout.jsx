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
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTheme(darkModeEnabled ? 'light' : 'dark')} 
                  className="ml-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all duration-200" 
                  aria-label="Toggle dark mode"
                >
                  {darkModeEnabled ? '🌙' : '☀️'}
                </motion.button>
                
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
                      <div className="flex items-center justify-between px-2 py-1">
                        <div className="text-sm font-semibold">Notifications</div>
                        <button onClick={markAllRead} className="text-xs text-blue-600 hover:text-blue-700 transition-colors">Mark all read</button>
                      </div>
                      <div className="max-h-72 overflow-y-auto space-y-1">
                        {notifications.length === 0 ? (
                          <div className="text-xs text-slate-500 px-2 py-3 text-center">No notifications</div>
                        ) : notifications.map((n) => (
                          <motion.div 
                            key={n.id} 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 ${n.read ? 'bg-slate-50 dark:bg-slate-800' : 'bg-blue-50 dark:bg-slate-800/70 border-l-2 border-blue-500'}`}
                          >
                            <div className="flex items-center justify-between">
                              <div>{n.message}</div>
                              <div className="text-[10px] text-slate-500">{new Date(n.at).toLocaleTimeString()}</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </details>
                </div>

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
              <div className="md:hidden">
                <button className="p-2 rounded-lg text-gray-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all duration-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content with Page Transitions */}
      <main className="relative">
        <OfflineBanner />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
        <Toaster />

        {/* Floating Assistant Button */}
        {!hideNavigation && (
          <motion.button 
            onClick={() => setAssistantOpen(true)} 
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-2xl hover:scale-110 active:scale-95 transition-transform focus:outline-none z-40"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open assistant"
          >
            💬
          </motion.button>
        )}

        {/* Assistant Panel */}
        <AnimatePresence>
          {assistantOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            >
              <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setAssistantOpen(false)} />
              <motion.div 
                initial={{ scale: 0.8, opacity: 0, y: 100 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 100 }}
                className="relative w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 m-0 sm:m-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🤖</span>
                    </div>
                    <div className="font-semibold">AI Assistant</div>
                  </div>
                  <button 
                    onClick={() => setAssistantOpen(false)} 
                    className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    ✖
                  </button>
                </div>
                
                <div className="h-72 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-800 mb-3" id="assistant-messages">
                  {assistantMessages.length === 0 && (
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      <div className="mb-2">👋 Hi! I'm your safety assistant. How can I help you today?</div>
                      <div className="text-xs opacity-75">Try the quick actions below or ask me anything!</div>
                    </div>
                  )}
                  
                  <AnimatePresence>
                    {assistantMessages.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
                      >
                        <div className={`inline-block max-w-[80%] p-2 rounded-lg text-sm ${
                          msg.role === 'user' 
                            ? 'bg-blue-500 text-white rounded-br-none' 
                            : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-600'
                        }`}>
                          {msg.content}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {assistantTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-left mb-3"
                    >
                      <div className="inline-block bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 p-2 rounded-lg rounded-bl-none border border-slate-200 dark:border-slate-600 text-sm">
                        <div className="flex items-center space-x-1">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-xs text-slate-500 ml-2">Assistant is typing...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {quickActions.map((action) => (
                    <motion.button
                      key={action.key}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => sendAssistantMessage('', action.key)}
                      disabled={assistantTyping}
                      className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
                    >
                      <span className="mr-1">{action.icon}</span>
                      {action.label}
                    </motion.button>
                  ))}
                </div>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const message = assistantInput.trim();
                  if (!message || assistantTyping) return;
                  await sendAssistantMessage(message);
                }} className="flex gap-2">
                  <input 
                    value={assistantInput}
                    onChange={(e) => setAssistantInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                    placeholder="Ask me anything about safety..."
                    disabled={assistantTyping}
                  />
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={assistantTyping || !assistantInput.trim()}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium hover:from-blue-600 hover:to-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {assistantTyping ? '⏳' : 'Send'}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}