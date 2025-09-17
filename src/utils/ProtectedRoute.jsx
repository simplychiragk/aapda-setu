import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProtectedRoute({ children, allow, redirectTo = '/login' }) {
  const { user, loading } = React.useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner message="Checking authentication..." />
      </div>
    );
  }

  if (!user) {
    const searchParams = new URLSearchParams();
    searchParams.set('from', location.pathname);
    return <Navigate to={`${redirectTo}?${searchParams.toString()}`} replace />;
  }
  
  if (allow && Array.isArray(allow) && !allow.includes(user.role)) {
    return <Navigate to="/not-authorized" replace />;
  }
  
  return children;
}