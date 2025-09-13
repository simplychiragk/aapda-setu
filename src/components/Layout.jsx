import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { NotificationContext } from '../context/NotificationContext';
import Toaster from './Toaster';
import OfflineBanner from './OfflineBanner';

export default function Layout({ children }) {
  const location = useLocation();
  const { darkModeEnabled, setTheme } = React.useContext(ThemeContext);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const { notifications, unreadCount, markAllRead } = React.useContext(NotificationContext);
  
  const navItems = [
    { to: "/", icon: "🏠", label: "Dashboard" },
    { to: "/alerts", icon: "🚨", label: "Alerts" },
    { to: "/drills", icon: "🧯", label: "Drills" },
    { to: "/videos", icon: "🎬", label: "Videos" },
    { to: "/quizzes", icon: "❓", label: "Quizzes" },
    { to: "/leaderboard", icon: "🏆", label: "Leaderboard" },
    { to: "/contacts", icon: "📞", label: "Contacts" },
    { to: "/game", icon: "🎮", label: "Game" },
    { to: "/profile", icon: "👤", label: "Profile" },
    { to: "/settings", icon: "⚙️", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      {/* Modern Navigation */}
      <nav className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border-b border-white/20 dark:border-slate-800 sticky top-0 z-50 shadow-lg shadow-blue-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">🛡️</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Aapda Setu
              </span>
            </div>

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
              <button onClick={() => setTheme(darkModeEnabled ? 'light' : 'dark')} className="ml-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800" aria-label="Toggle dark mode">{darkModeEnabled ? '🌙' : '☀️'}</button>
              <div className="relative ml-2">
                <details className="group">
                  <summary className="list-none cursor-pointer px-3 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-2">
                    🔔 {unreadCount > 0 && (<span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">{unreadCount}</span>)}
                  </summary>
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-50">
                    <div className="flex items-center justify-between px-2 py-1">
                      <div className="text-sm font-semibold">Notifications</div>
                      <button onClick={markAllRead} className="text-xs text-blue-600">Mark all read</button>
                    </div>
                    <div className="max-h-72 overflow-y-auto space-y-1">
                      {notifications.length === 0 ? (
                        <div className="text-xs text-slate-500 px-2 py-3">No notifications</div>
                      ) : notifications.map((n) => (
                        <div key={n.id} className={`px-3 py-2 rounded-lg text-sm ${n.read ? 'bg-slate-50 dark:bg-slate-800' : 'bg-blue-50 dark:bg-slate-800/70'}`}>
                          <div className="flex items-center justify-between">
                            <div>{n.message}</div>
                            <div className="text-[10px] text-slate-500">{new Date(n.at).toLocaleTimeString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="p-2 rounded-lg text-gray-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative">
        <OfflineBanner />
        {children}
        <Toaster />

        {/* Floating Assistant Button */}
        <button onClick={() => setAssistantOpen(true)} className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-2xl hover:scale-110 active:scale-95 transition-transform focus:outline-none" aria-label="Open assistant">💬</button>

        {/* Assistant Panel */}
        {assistantOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/30" onClick={() => setAssistantOpen(false)} />
            <div className="relative w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 m-0 sm:m-4 animate-[slideInFromTop_0.25s_ease-out]">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">Assistant</div>
                <button onClick={() => setAssistantOpen(false)} className="text-slate-500 hover:text-slate-700">✖</button>
              </div>
              <div className="h-72 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 mb-3" id="assistant-messages">
                <div className="text-sm opacity-80 mb-2">Assistant is ready. Try quick prompts:</div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {['Emergency steps for earthquake', 'Flood checklist', 'Fire evacuation plan'].map((q) => (
                    <button key={q} onClick={() => { const input = document.getElementById('assistant-input'); if (input) input.value = q; }} className="px-2 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs">{q}</button>
                  ))}
                </div>
              </div>
              <form onSubmit={async (e) => { e.preventDefault(); const messagesEl = document.getElementById('assistant-messages'); const input = document.getElementById('assistant-input'); const text = input.value.trim(); if (!text) return; const userBubble = document.createElement('div'); userBubble.className = 'mb-2 text-right'; userBubble.textContent = text; messagesEl.appendChild(userBubble); input.value = ''; try { const res = await fetch('/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'user', content: text }] }) }); const data = await res.json().catch(() => null); const reply = data?.message || 'Please configure assistant in Settings or env.'; const bot = document.createElement('div'); bot.className = 'mb-2 text-left opacity-90'; bot.textContent = reply; messagesEl.appendChild(bot); messagesEl.scrollTop = messagesEl.scrollHeight; } catch { const errEl = document.createElement('div'); errEl.className = 'mb-2 text-left text-red-600'; errEl.textContent = 'Error contacting assistant'; messagesEl.appendChild(errEl); } }} className="flex gap-2">
                <input id="assistant-input" className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" placeholder="Ask something…" />
                <button className="px-4 py-2 rounded-xl bg-blue-600 text-white">Send</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
