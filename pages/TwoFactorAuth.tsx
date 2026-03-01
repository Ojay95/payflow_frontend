import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const TwoFactorAuth: React.FC = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const navigate = useNavigate();
  const token = useStore(state => state.token);

  // If someone lands here without having just logged in, send them to login
  useEffect(() => {
    const hasToken = !!token || !!localStorage.getItem('payflow_token');
    if (!hasToken) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate verification success
    navigate('/dashboard');
  };

  return (
    <div className="bg-slate-50 dark:bg-background-dark min-h-screen flex items-center justify-center p-6 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 p-10 shadow-xl dark:shadow-2xl">
        <div className="text-center mb-10">
          <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary border border-primary/20">
            <span className="material-symbols-outlined text-3xl font-bold">shield_person</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 transition-colors">Two-Factor Auth</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors">Enter the 6-digit code from your authenticator app.</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-8">
          <div className="flex justify-between gap-2">
            {code.map((digit, idx) => (
              <input
                key={idx}
                id={`code-${idx}`}
                type="text"
                maxLength={1}
                value={digit}
                autoFocus={idx === 0}
                onChange={(e) => handleChange(idx, e.target.value)}
                className="size-12 md:size-14 text-center text-xl font-black bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-primary focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all outline-none"
              />
            ))}
          </div>

          <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all">
            Verify & Continue
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/login')}
            className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest hover:text-primary transition-colors"
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;