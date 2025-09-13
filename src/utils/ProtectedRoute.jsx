import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children, allow, redirectTo = '/login' }) {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) return <Navigate to={redirectTo} replace />;
  if (allow && !allow.includes(user.role)) return <Navigate to="/not-authorized" replace />;
  return children;
}

