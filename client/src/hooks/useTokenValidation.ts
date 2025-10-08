import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { validateTokenAndLogout, fetchUserProfile, logout } from '../redux/slices/authSlice';

export const useTokenValidation = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, token, user } = useAppSelector((state) => state.auth);

  // If state says authenticated but there's no token, force logout to clean state
  useEffect(() => {
    if (!token && isAuthenticated) {
      dispatch(logout());
    }
  }, [dispatch, token, isAuthenticated]);

  // Always validate if a token exists
  useEffect(() => {
    if (token) {
      dispatch(validateTokenAndLogout());
    }
  }, [dispatch, token]);

  // Fetch profile when we have a token and user not loaded yet
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, token, user]);

  return { isAuthenticated, token };
};
