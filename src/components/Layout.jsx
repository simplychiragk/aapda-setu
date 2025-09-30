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

  // Pages where nav shouldn't appear at all
  const hideNavigation = ['/entry', '/login', '/', '/not-authorized', '/not-found'].includes(location.pathname);

  const isStaffPage = location.pathname === '/staff';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      {/* Navigation */}
      {!hideNavigation && (
        <nav className="bg-[#0D47A1]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-[#FF6F00] to-[#FFA000] rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">🛡️</span>
                </div>
                <span className="text-xl font-bold text-white">
                  Aapda Setu
                </span>
              </motion.div>

              {/* Navigation Items */}
              <div className="hidden md:flex items-center space-x-1">
                {/* Back Button - Always visible except on staff pages */}
                {!isStaffPage && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-[#B0B0B0] hover:text-white hover:bg-white/5 transition-all duration-200 flex items-center space-x-2"
                    title="Go back to previous page"
                  >
                    <span>⬅️</span>
                    <span>Back</span>
                  </motion.button>
                )}

                {/* Show full nav only if NOT staff */}
                {!isStaffPage && (
                  <>
                    {navItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                          location.pathname === item.to
                            ? 'bg-gradient-to-r from-[#FF6F00] to-[#FFA000] text-white shadow-lg shadow-[#FF6F00]/25'
                            : 'text-[#B0B0B0] hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </>
                )}

                {/* Theme Toggle */}
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTheme(darkModeEnabled ? 'light' : 'dark')} 
                  className="ml-2 w-10 h-10 rounded-xl text-sm font-medium text-[#B0B0B0] hover:text-white hover:bg-white/5 transition-all duration-200 flex items-center justify-center" 
                  aria-label="Toggle dark mode"
                >
                  {darkModeEnabled ? '🌙' : '☀️'}
                </motion.button>
                
                {/* Logout Button */}
                {user && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="ml-1 px-4 py-2 rounded-xl text-sm font-medium text-[#B0B0B0] hover:text-white hover:bg-[#D50000]/20 transition-all duration-200"
                  >
                    Logout
                  </motion.button>
                )}
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
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-[#FF6F00] to-[#FFA000] text-white shadow-2xl hover:scale-110 active:scale-95 transition-transform focus:outline-none z-40"
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
                className="relative w-full sm:max-w-md bg-gray-800/95 backdrop-blur-xl rounded-t-2xl sm:rounded-2xl shadow-2xl border border-gray-700/50 p-4 m-0 sm:m-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#FF6F00] to-[#FFA000] rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🤖</span>
                    </div>
                    <div className="font-semibold text-white">AI Assistant</div>
                  </div>
                  <button 
                    onClick={() => setAssistantOpen(false)} 
                    className="text-[#B0B0B0] hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
                  >
                    ✖
                  </button>
                </div>
                
                <div className="h-72 overflow-y-auto rounded-lg border border-gray-700/50 p-3 bg-gray-700/30 mb-3" id="assistant-messages">
                  {assistantMessages.length === 0 && (
                    <div className="text-sm text-[#B0B0B0] mb-3">
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
                            ? 'bg-gradient-to-r from-[#FF6F00] to-[#FFA000] text-white rounded-br-none' 
                            : 'bg-gray-700/50 text-white rounded-bl-none border border-gray-600/50'
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
                      <div className="inline-block bg-gray-700/50 text-white p-2 rounded-lg rounded-bl-none border border-gray-600/50 text-sm">
                        <div className="flex items-center space-x-1">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-[#B0B0B0] rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-[#B0B0B0] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-[#B0B0B0] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-xs text-[#B0B0B0] ml-2">Assistant is typing...</span>
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
                      className="px-3 py-1 rounded-full bg-[#FF6F00]/20 text-[#FF6F00] text-xs font-medium hover:bg-[#FF6F00]/30 transition-colors disabled:opacity-50 border border-[#FF6F00]/30"
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
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-700/50 bg-gray-700/30 text-white placeholder-[#B0B0B0] focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent outline-none transition-all" 
                    placeholder="Ask me anything about safety..."
                    disabled={assistantTyping}
                  />
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={assistantTyping || !assistantInput.trim()}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#FFA000] text-white font-medium hover:from-[#FF8F00] hover:to-[#FFB300] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
