import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth';
import { useStore } from './store/useStore';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
import EmployeeListing from './pages/EmployeeListing';
import PayrollRunDetail from './pages/PayrollRunDetail';
import PayrollApprovals from './pages/PayrollApprovals';
import PaymentHistory from './pages/PaymentHistory';
import Settings from './pages/Settings';
import CadreManagement from './pages/CadreManagement';
import ForgotPassword from './pages/ForgotPassword';
import EmailVerification from './pages/EmailVerification';
import TwoFactorAuth from './pages/TwoFactorAuth';
import AuditLogs from './pages/AuditLogs';
import ProfilePage from './pages/ProfilePage';
import PricingPage from './pages/PricingPage';
import LegalPage from './pages/LegalPage';
import ContactPage from './pages/ContactPage';

// Helper to redirect logged-in users away from Auth pages
const PublicRoute = ({ children }: { children?: React.ReactNode }) => {
  const token = useStore(state => state.token);
  const isAuthenticated = !!token || !!localStorage.getItem('payflow_token');
  
  if (isAuthenticated) {
    // If authenticated, we allow landing page but redirect login/signup/2fa to dashboard
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const theme = useStore(state => state.theme);
  const location = useLocation();

  useEffect(() => {
    // Synchronize global theme class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Force scroll to top on every route change for a professional "page-load" feel
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      {/* 
          Marketing/Public Hub: 
          LANDING PAGE IS THE ROOT. 
          It is NOT wrapped in PublicRoute so users can always view it.
      */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/legal" element={<LegalPage />} />
      <Route path="/contact" element={<ContactPage />} />
      
      {/* 
          Auth Entry Points: 
          These use PublicRoute to prevent logged-in users from seeing them.
      */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignUpPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/2fa" element={<TwoFactorAuth />} />
      <Route path="/verify-email" element={<EmailVerification />} />
      
      {/* 
          Private App Command Center: 
          Protected by RequireAuth.
      */}
      <Route path="/dashboard" element={<RequireAuth><Layout><Dashboard /></Layout></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><Layout><ProfilePage /></Layout></RequireAuth>} />
      <Route path="/employees" element={<RequireAuth><Layout><EmployeeListing /></Layout></RequireAuth>} />
      <Route path="/payroll/run/:id" element={<RequireAuth><Layout><PayrollRunDetail /></Layout></RequireAuth>} />
      <Route path="/payroll/approvals" element={<RequireAuth><Layout><PayrollApprovals /></Layout></RequireAuth>} />
      <Route path="/payroll/history" element={<RequireAuth><Layout><PaymentHistory /></Layout></RequireAuth>} />
      <Route path="/audit-logs" element={<RequireAuth><Layout><AuditLogs /></Layout></RequireAuth>} />
      <Route path="/settings" element={<RequireAuth><Layout><Settings /></Layout></RequireAuth>} />
      <Route path="/settings/cadres" element={<RequireAuth><Layout><CadreManagement /></Layout></RequireAuth>} />
      
      {/* Catch-all Redirect to Landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;