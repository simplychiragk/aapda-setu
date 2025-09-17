import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import OfflineBanner from './OfflineBanner';

export default function Layout({ children }) {
  const location = useLocation();
  const nav = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/alerts', label: 'Alerts' },
    { to: '/quizzes', label: 'Quizzes' },
    { to: '/drills', label: 'Drills' },
    { to: '/videos', label: 'Videos' },
    { to: '/contacts', label: 'Contacts' },
    { to: '/leaderboard', label: 'Leaderboard' },
    { to: '/safe-zones', label: 'Safe Zones' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <OfflineBanner />
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/70 backdrop-blur border-b border-slate-200/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link to="/" className="font-extrabold text-slate-900 dark:text-white">Aapda Setu</Link>
          <nav className="hidden md:flex items-center gap-4 text-sm">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`px-3 py-1.5 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${location.pathname === n.to ? 'text-primary-600' : 'text-slate-600 dark:text-slate-300'}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/settings" className="px-3 py-1.5 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">Settings</Link>
            <Link to="/logout" className="px-3 py-1.5 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">Logout</Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 py-4 text-center">
        Built for preparedness • Stay safe
      </footer>
    </div>
  );
}

 