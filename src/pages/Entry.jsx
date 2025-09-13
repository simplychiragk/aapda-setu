import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Entry() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="relative w-full max-w-xl">
        <div className="absolute inset-0 -z-10 blur-2xl opacity-50 bg-gradient-to-r from-indigo-300 to-blue-300 rounded-[24px] animate-pulse"></div>
        <div className="w-full bg-white/80 dark:bg-slate-900/60 backdrop-blur rounded-2xl p-8 shadow-xl border border-white/20 transition-transform duration-300">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-2">Who are you?</h1>
          <p className="text-slate-600 dark:text-slate-300 text-center mb-8">Select your role to continue</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button onClick={() => navigate('/login?role=student')} className="group h-28 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
              <span className="text-xl">Student</span>
              <span className="block text-xs opacity-80 mt-1">user: student / pass: student</span>
            </button>
            <button onClick={() => navigate('/login?role=staff')} className="group h-28 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all transform hover:-translate-y-1">
              <span className="text-xl">Staff</span>
              <span className="block text-xs opacity-70 mt-1">user: admin / pass: admin</span>
            </button>
          </div>
          <div className="mt-6 text-center text-xs text-slate-500">Demo mode enabled</div>
        </div>
      </div>
    </div>
  );
}

