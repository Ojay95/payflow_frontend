import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from '@/src/components/Layout.tsx';
import RequireAuth from '@/src/components/RequireAuth.tsx';
import { useStore } from '@/src/store/useStore.ts';

import LandingPage from '@/src/pages/LandingPage.tsx';
import LoginPage from '@/src/pages/LoginPage.tsx';
import SignUpPage from '@/src/pages/SignUpPage.tsx';
import Dashboard from '@/src/pages/Dashboard.tsx';
import EmployeeListing from '@/src/pages/EmployeeListing.tsx';
import PayrollRunDetail from '@/src/pages/PayrollRunDetail.tsx';
import PayrollApprovals from '@/src/pages/PayrollApprovals.tsx';
import PaymentHistory from '@/src/pages/PaymentHistory.tsx';
import Settings from '@/src/pages/Settings.tsx';
import CadreManagement from '@/src/pages/CadreManagement.tsx';
import ForgotPassword from '@/src/pages/ForgotPassword.tsx';
import EmailVerification from '@/src/pages/EmailVerification.tsx';
import TwoFactorAuth from '@/src/pages/TwoFactorAuth.tsx';
import AuditLogs from '@/src/pages/AuditLogs.tsx';
import ProfilePage from '@/src/pages/ProfilePage.tsx';
import PricingPage from '@/src/pages/PricingPage.tsx';
import LegalPage from '@/src/pages/LegalPage.tsx';
import ContactPage from '@/src/pages/ContactPage.tsx';

/**
 * PublicRoute Refactor:
 * Ensures that authenticated users are redirected away from login/signup.
 * Crucially, it checks for 2FA completion to decide the redirect destination.
 */
const PublicRoute = ({ children }: { children?: React.ReactNode }) => {
    const { token, is2faVerified } = useStore();
    const isAuthenticated = !!token || !!localStorage.getItem('payflow_token');

    if (isAuthenticated) {
        // If they have a token but haven't passed 2FA, send them to 2FA
        if (!is2faVerified) {
            return <Navigate to="/2fa" replace />;
        }
        // Fully authenticated users go to the dashboard
        return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
};

const AppContent: React.FC = () => {
    const theme = useStore(state => state.theme);
    const location = useLocation();

    useEffect(() => {
        // Sync global theme class for Tailwind dark mode
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    // Force scroll to top on every route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <Routes>
            {/* --- Marketing & Public Routes --- */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/legal" element={<LegalPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* --- Auth Entry Points --- */}
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignUpPage /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

            {/* 2FA Special Gate:
    Only accessible if we have a token but haven't verified 2FA yet.
*/}
            <Route path="/2fa" element={
                (() => {
                    const { token, is2faVerified } = useStore.getState();
                    const hasToken = !!token || !!localStorage.getItem('payflow_token');

                    if (!hasToken) return <Navigate to="/login" replace />;
                    if (is2faVerified) return <Navigate to="/dashboard" replace />;
                    return <TwoFactorAuth />;
                })()
            } />
            {/* --- Private App Command Center (Requires JWT + 2FA) --- */}
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