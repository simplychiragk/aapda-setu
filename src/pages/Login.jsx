import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function Login() {
  const navigate = useNavigate();
  const query = useQuery();
  const roleParam = (query.get('role') || 'student').toLowerCase();
  const { login, user } = React.useContext(AuthContext);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(roleParam);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => setRole(roleParam), [roleParam]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const redirectTo = user.role === 'staff' ? '/admin' : '/dashboard';
      navigate(redirectTo, { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!userId.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }
    
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 -z-10 blur-2xl opacity-40 bg-gradient-to-tr from-blue-300 to-indigo-300 rounded-[24px] animate-[fadeIn_1s_ease-in-out]" />
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full bg-white/80 dark:bg-slate-900/60 backdrop-blur rounded-2xl p-8 shadow-xl border border-white/20"
        >
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span className="text-2xl">🛡️</span>
            </motion.div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome to Aapda Setu
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Sign in as {role === 'staff' ? 'Staff' : 'Student'}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-lg border border-red-200 text-red-700 bg-red-50 px-3 py-2 text-sm flex items-center gap-2"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Username
              </label>
              <input 
                value={userId} 
                onChange={(e) => setUserId(e.target.value)} 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                placeholder={role === 'staff' ? 'admin' : 'student'}
                required 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  placeholder={role === 'staff' ? 'admin' : 'student'}
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Role
              </label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)} 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="student">Student</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading} 
              className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-lg hover:shadow-2xl transition-all disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.98] relative overflow-hidden focus:ring-4 focus:ring-blue-500/25"
            >
              {loading && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 bg-white/20 rounded-xl animate-pulse"
                />
              )}
              <span className="inline-flex items-center gap-2 relative z-10">
                {loading && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full"
                  />
                )}
                {loading ? 'Signing in…' : 'Sign In'}
              </span>
            </motion.button>
          </form>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="text-center text-sm text-blue-700 dark:text-blue-300 font-medium mb-2">
              Demo Credentials
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
              <div><strong>Student:</strong> username: student, password: student</div>
              <div><strong>Staff:</strong> username: admin, password: admin</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}