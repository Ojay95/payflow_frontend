import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';

interface RequireAuthProps {
  children: React.ReactNode;
}

/**
 * RequireAuth Refactor:
 * Enforces a strict two-gate security model:
 * 1. Gate 1: Existence of a valid JWT (Identity)
 * 2. Gate 2: Completion of 2FA (Verification)
 */
const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { token, is2faVerified } = useStore();
  const location = useLocation();

  // gate 1: Check for JWT in store or persistent storage
  const hasToken = !!token || !!localStorage.getItem('payflow_token');

  if (!hasToken) {
    // No identity found; redirect to login and preserve the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Gate 2: Check if the backend has verified the 2FA code for this session
  if (!is2faVerified) {
    // Identity is known, but verification is incomplete.
    // Force the user to the 2FA screen.
    return <Navigate to="/2fa" state={{ from: location }} replace />;
  }

  // Both gates passed: User is fully authorized for production-level operations
  return <>{children}</>;
};

export default RequireAuth;