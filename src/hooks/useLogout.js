import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook for secure user logout
 * 
 * This hook provides a complete logout function that:
 * 1. Resets application state immediately (prevents flash of logged-in content)
 * 2. Clears all browser storage (localStorage and sessionStorage)
 * 3. Redirects securely using replace: true (prevents back navigation to protected routes)
 * 
 * SECURITY NOTE: This is client-side logout only.
 * For high-security applications, also implement server-side token invalidation.
 * 
 * @returns {Function} handleLogout - Async function to perform secure logout
 */
export function useLogout() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Step 1 & 2: Reset state and clear storage (handled in AuthContext)
      await logout();
      
      // Step 3: Secure redirect - replace: true prevents back navigation
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout hook error:', error);
      // Ensure navigation happens even if logout fails
      navigate('/login', { replace: true });
    }
  };

  return handleLogout;
}

export default useLogout;