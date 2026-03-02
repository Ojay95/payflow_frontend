import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { api } from '../api';
import Toast from '../components/Toast';

const TwoFactorAuth: React.FC = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { token, set2faVerified } = useStore();

  // Route Guard: Ensure identity exists before allowing 2FA attempt
  useEffect(() => {
    const hasToken = !!token || !!localStorage.getItem('payflow_token');
    if (!hasToken) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleChange = (index: number, value: string) => {
    // Only allow numeric input for 2FA codes
    if (!/^\d*$/.test(value)) return;
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus logic for better UX
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');

    if (fullCode.length !== 6) {
      setToast({ message: "Please enter a valid 6-digit code.", type: 'error' });
      return;
    }

    setLoading(true);
    // Interface with production backend: POST /v1/auth/verify-2fa
    const res = await api.auth.verify2FA(fullCode);

    if (res.success) {
      set2faVerified(true); // Unlock Gate 2 in RequireAuth

      // Redirect to attempted location or default to dashboard
      const origin = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(origin, { replace: true });
    } else {
      setToast({ message: res.error || "Invalid verification code.", type: 'error' });
      // Clear code on failure for security
      setCode(['', '', '', '', '', '']);
      document.getElementById('code-0')?.focus();
    }
    setLoading(false);
  };

  return (
      <div className="bg-slate-50 dark:bg-background-dark min-h-screen flex items-center justify-center p-6 transition-colors duration-300">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 p-10 shadow-xl dark:shadow-2xl">
          <div className="text-center mb-10">
            <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary border border-primary/20">
              {loading ? (
                  <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              ) : (
                  <span className="material-symbols-outlined text-3xl font-bold">shield_person</span>
              )}
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 transition-colors">Security Verification</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors">
              Enter the 6-digit code from your authenticator app to authorize this session.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-8">
            <div className="flex justify-between gap-2">
              {code.map((digit, idx) => (
                  <input
                      key={idx}
                      id={`code-${idx}`}
                      type="text"
                      inputMode="numeric"
                      pattern="\d*"
                      maxLength={1}
                      value={digit}
                      autoFocus={idx === 0}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onChange={(e) => handleChange(idx, e.target.value)}
                      className="size-12 md:size-14 text-center text-xl font-black bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-primary focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all outline-none"
                  />
              ))}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
                onClick={() => {
                  useStore.getState().logout(); // Clear identity on explicit exit
                  navigate('/login');
                }}
                className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest hover:text-primary transition-colors"
            >
              Cancel & Back to login
            </button>
          </div>
        </div>
      </div>
  );
};

export default TwoFactorAuth;