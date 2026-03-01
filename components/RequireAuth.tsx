import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { user, token } = useStore();
  const location = useLocation();

  // Check both store and localStorage
  const isAuthenticated = !!token || !!localStorage.getItem('payflow_token');

  if (!isAuthenticated) {
    // Redirect to login but save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated but visiting a protected route, we assume they passed 2FA
  // In a production app, we would have a specific "is2FAVerified" flag in the store
  return <>{children}</>;
};

export default RequireAuth;