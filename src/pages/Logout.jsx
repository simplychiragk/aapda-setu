import React, { useEffect } from "react";
import useLogout from "../hooks/useLogout";

export default function Logout() {
  const handleLogout = useLogout();

  useEffect(() => {
    // Perform immediate secure logout
    const performLogout = async () => {
      try {
        await handleLogout();
      } catch (error) {
        console.error('Logout page error:', error);
        // Fallback: still redirect even if logout fails
        window.location.replace('/login');
      }
    };

    performLogout();
  }, [handleLogout]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 border border-slate-200 dark:border-slate-800">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
            Logging out...
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Please wait while we securely log you out and clear your session.
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
