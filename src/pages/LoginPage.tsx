import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.ts';
import { useStore } from '../store/useStore.ts';
import Toast from '../components/Toast.tsx';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useStore((state) => state.setAuth);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    // Call production backend: POST /v1/auth/login
    const res = await api.auth.login(formData);

    if (res.success && res.data?.token) {
      /**
       * Gate 1 Success: Identity Verified
       * Store JWT and user metadata (including business_id) in global state.
       * The setAuth action also persists the token to localStorage for the API interceptor.
       */
      setAuth(res.data.user, res.data.token);

      /**
       * Multi-Stage Auth Logic:
       * Per backend specs, if the user has 2FA enabled, they must be routed to verification.
       * Otherwise, they proceed to the secure command center.
       */
      if (res.data.requires_2fa) {
        navigate('/2fa');
      } else {
        // Fallback for users without 2FA, though production defaults to enabled
        useStore.getState().set2faVerified(true);
        navigate('/dashboard');
      }
    } else {
      setToast({
        message: res.error || 'Authentication failed. Please check your credentials.',
        type: 'error'
      });
    }
    setLoading(false);
  };

  return (
      <div className="bg-slate-50 dark:bg-background-dark min-h-screen flex flex-col font-display transition-colors duration-300">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <header className="flex items-center justify-center pt-16 pb-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="size-11 bg-primary text-white flex items-center justify-center rounded-xl shadow-lg">
              <span className="material-symbols-outlined text-2xl font-bold">account_balance_wallet</span>
            </div>
            <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight transition-colors">PayFlow</h1>
          </Link>
        </header>

        <main className="flex-grow flex items-center justify-center px-4 pb-20">
          <div className="w-full max-w-[460px] bg-white dark:bg-slate-900 rounded-2xl shadow-xl dark:shadow-2xl border border-slate-200 dark:border-white/10 p-8 md:p-12 transition-all">
            <div className="text-center mb-10">
              <h2 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">Welcome back</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm">Access your secure payroll command center.</p>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-slate-200 text-sm font-medium ml-1">Email Address</label>
                <input
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all"
                    placeholder="admin@techcorp.com"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-slate-700 dark:text-slate-200 text-sm font-medium">Password</label>
                  <Link to="/forgot-password" core-link="true" className="text-primary text-xs font-semibold hover:underline transition-colors">Forgot password?</Link>
                </div>
                <input
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all"
                    placeholder="••••••••"
                    type="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                />
              </div>

              <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:brightness-110 text-white font-bold h-12 py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Sign In'}
                {!loading && <span className="material-symbols-outlined text-lg">arrow_forward</span>}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                New to PayFlow?
                <Link to="/signup" className="text-primary font-bold hover:underline ml-1">Create an account</Link>
              </p>
            </div>
          </div>
        </main>
      </div>
  );
};

export default LoginPage;