import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-[#1a1a1a] to-[#2d1b0f]">
      {/* Left Column - Branding & Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-transparent" />
        
        <div className="relative z-10 flex flex-col justify-center px-16 py-12 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-md"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF6F00] to-[#FF8C00] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">🛡️</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Aapda Setu</h1>
            </div>
            
            <h2 className="text-5xl font-bold text-white leading-tight mb-6">
              Your Shield Against The Storm
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Stay Prepared. Stay Safe. Your trusted companion in emergency management and disaster preparedness.
            </p>
            
            <div className="flex items-center gap-4 text-gray-400">
              <div className="w-2 h-2 bg-[#FF6F00] rounded-full"></div>
              <span>24/7 Emergency Monitoring</span>
            </div>
            <div className="flex items-center gap-4 text-gray-400 mt-2">
              <div className="w-2 h-2 bg-[#FF6F00] rounded-full"></div>
              <span>Real-time Disaster Alerts</span>
            </div>
            <div className="flex items-center gap-4 text-gray-400 mt-2">
              <div className="w-2 h-2 bg-[#FF6F00] rounded-full"></div>
              <span>Secure & Reliable</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Glassmorphism Card */}
          <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-br from-[#FF6F00] to-[#FF8C00] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <span className="text-2xl">🔐</span>
                </motion.div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Welcome Back
                </h1>
                <p className="text-gray-400">
                  Sign in to continue to Aapda Setu
                </p>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 rounded-xl border border-red-500/30 text-red-300 bg-red-500/10 px-4 py-3 text-sm backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}

              <form onSubmit={onSubmit} className="space-y-6">
                {/* Username Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">👤</span>
                    </div>
                    <input 
                      value={userId} 
                      onChange={(e) => setUserId(e.target.value)} 
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent transition-all duration-300" 
                      placeholder={role === 'staff' ? 'admin' : 'student'}
                      required 
                    />
                  </div>
                </motion.div>
                
                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">🔒</span>
                    </div>
                    <input 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent transition-all duration-300" 
                      placeholder="Enter your password"
                      required 
                    />
                  </div>
                </motion.div>
                
                {/* Role Dropdown */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Role
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">🎯</span>
                    </div>
                    <select 
                      value={role} 
                      onChange={(e) => setRole(e.target.value)} 
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-600 bg-gray-700/50 text-white outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent transition-all duration-300 appearance-none"
                    >
                      <option value="student">Student</option>
                      <option value="staff">Staff</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">▼</span>
                    </div>
                  </div>
                </motion.div>
                
                {/* Sign In Button */}
                <motion.button 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading} 
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#FF6F00] to-[#FF8C00] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  {loading && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 bg-white/20 rounded-xl"
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
                  
                  {/* Button shine effect */}
                  <div className="absolute inset-0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </motion.button>
              </form>
              
              {/* Demo Credentials */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 p-4 bg-gray-700/30 rounded-xl border border-gray-600/30 backdrop-blur-sm"
              >
                <div className="text-center text-sm text-gray-300 font-medium mb-3">
                  Demo Credentials
                </div>
                <div className="text-xs text-gray-400 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Student:</span>
                    <span>username: <code className="bg-gray-600/50 px-2 py-1 rounded">student</code></span>
                    <span>password: <code className="bg-gray-600/50 px-2 py-1 rounded">student</code></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Staff:</span>
                    <span>username: <code className="bg-gray-600/50 px-2 py-1 rounded">admin</code></span>
                    <span>password: <code className="bg-gray-600/50 px-2 py-1 rounded">admin</code></span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
