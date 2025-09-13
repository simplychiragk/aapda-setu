import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function Login() {
  const navigate = useNavigate();
  const query = useQuery();
  const roleParam = (query.get('role') || 'student').toLowerCase();
  const { login } = React.useContext(AuthContext);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(roleParam);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => setRole(roleParam), [roleParam]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login({ userId, password, role });
      const redirect = res?.redirectTo || (res?.role === 'staff' ? '/admin' : '/dashboard');
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 -z-10 blur-2xl opacity-40 bg-gradient-to-tr from-blue-300 to-indigo-300 rounded-[24px] animate-[fadeIn_1s_ease-in-out]" />
        <div className="w-full bg-white/80 dark:bg-slate-900/60 backdrop-blur rounded-2xl p-8 shadow-xl border border-white/20 animate-[slideInFromTop_0.4s_ease-out]">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-6">Login ({role === 'staff' ? 'Staff' : 'Student'})</h1>
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 text-red-700 bg-red-50 px-3 py-2 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">User ID</label>
            <input value={userId} onChange={(e) => setUserId(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
              <option value="student">Student</option>
              <option value="staff">Staff</option>
            </select>
          </div>
          <button disabled={loading} className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-2xl transition-all disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.98]">
            <span className="inline-flex items-center gap-2">
              {loading && <span className="inline-block h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Signing in…' : 'Sign In'}
            </span>
          </button>
        </form>
        <div className="mt-4 text-center text-xs text-slate-500">Prototype login: any credentials will sign you in. Choose role above for Staff vs Student.</div>
        </div>
      </div>
    </div>
  );
}

