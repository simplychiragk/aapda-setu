import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Entry() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white/80 dark:bg-slate-900/60 backdrop-blur rounded-2xl p-8 shadow-xl border border-white/20">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-6">Who are you?</h1>
        <p className="text-slate-600 dark:text-slate-300 text-center mb-8">Select your role to continue</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button onClick={() => navigate('/login?role=student')} className="group h-28 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-2xl transition-all">
            <span className="text-xl">Student</span>
          </button>
          <button onClick={() => navigate('/login?role=staff')} className="group h-28 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
            <span className="text-xl">Staff</span>
          </button>
        </div>
      </div>
    </div>
  );
}

