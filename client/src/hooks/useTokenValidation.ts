import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { validateTokenAndLogout } from '../redux/slices/authSlice';

export const useTokenValidation = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Only validate if user appears to be authenticated
    if (isAuthenticated && token) {
      dispatch(validateTokenAndLogout());
    }
  }, [dispatch, isAuthenticated, token]);

  return { isAuthenticated, token };
};
