import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function ProtectedRoute({ children, allow, redirectTo = '/login' }) {
  const { user, loading } = React.useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent"
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`${redirectTo}?from=${encodeURIComponent(location.pathname)}`} replace />;
  }
  
  if (allow && !allow.includes(user.role)) {
    return <Navigate to="/not-authorized" replace />;
  }
  
  return children;
}