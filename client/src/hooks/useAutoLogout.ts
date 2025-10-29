import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { validateToken } from '../utils/tokenUtils';
import { getTokenCookie, areCookiesSupported, removeTokenCookie } from '../utils/cookieUtils';

/**
 * Hook to automatically logout user after 15 days of inactivity
 * Checks token expiration periodically and logs out if token is expired
 */
export const useAutoLogout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkTokenExpiration = () => {
      // Get token from cookie or localStorage
      let token: string | null = null;
      
      if (areCookiesSupported()) {
        token = getTokenCookie();
      }
      
      if (!token) {
        token = localStorage.getItem('token');
      }

      if (token) {
        // Validate token expiration (15 days check is in validateToken)
        const { isValid } = validateToken(token);
        
        if (!isValid) {
          // Token expired or invalid - logout user
          console.log('[AutoLogout] Token expired or invalid, logging out user');
          
          // Clear token from storage
          localStorage.removeItem('token');
          if (areCookiesSupported()) {
            removeTokenCookie();
          }
          
          // Dispatch logout action
          dispatch(logout());
          
          // Redirect to login page
          if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
            window.location.href = '/login?expired=true';
          }
        }
      }
    };

    // Check immediately on mount
    checkTokenExpiration();

    // Check every 5 minutes (to catch expiration without waiting for next API call)
    const intervalId = setInterval(checkTokenExpiration, 5 * 60 * 1000); // 5 minutes

    // Also check before page unload
    window.addEventListener('beforeunload', checkTokenExpiration);

    // Also check on visibility change (when user returns to tab)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        checkTokenExpiration();
      }
    });

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', checkTokenExpiration);
      document.removeEventListener('visibilitychange', checkTokenExpiration);
    };
  }, [dispatch]);
};

