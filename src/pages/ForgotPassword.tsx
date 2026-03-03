
import React from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  return (
    <div className="bg-slate-900 min-h-screen flex flex-col font-display">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 px-10 py-4">
        <div className="flex items-center gap-4 text-primary">
          <div className="size-8">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">PayFlow</h2>
        </div>
        <Link to="/login" className="text-white/70 hover:text-primary transition-colors text-sm font-medium">Help Center</Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[480px] bg-slate-800 rounded-xl shadow-2xl border border-white/5 overflow-hidden">
          <div className="pt-10 pb-4 px-8 text-center">
            <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 mb-6">
              <span className="material-symbols-outlined text-primary text-4xl">lock_reset</span>
            </div>
            <h1 className="text-white text-3xl font-bold leading-tight mb-3">Forgot your password?</h1>
            <p className="text-slate-400 text-base font-normal leading-relaxed">
              No worries! Enter the email address associated with your PayFlow account and we'll send you a link to reset your password.
            </p>
          </div>

          <div className="px-8 pb-10">
            <form className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-slate-200 text-sm font-medium leading-none">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-500 text-xl">mail</span>
                  </div>
                  <input className="flex w-full min-w-0 rounded-lg text-white border border-slate-700 bg-slate-800/50 h-14 pl-12 pr-4 placeholder:text-slate-500 text-base font-normal" placeholder="e.g. name@company.com" required type="email" />
                </div>
              </div>
              <button className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary hover:bg-primary/90 text-white text-base font-bold transition-all shadow-lg shadow-primary/20">
                <span className="truncate">Send Reset Link</span>
              </button>
            </form>
            <div className="mt-8 flex justify-center">
              <Link to="/login" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-semibold transition-colors">
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Back to login
              </Link>
            </div>
          </div>
          <div className="bg-slate-800/80 px-8 py-4 border-t border-slate-700 flex justify-center items-center gap-2">
            <span className="material-symbols-outlined text-slate-400 text-sm">verified_user</span>
            <span className="text-slate-400 text-xs font-medium uppercase tracking-widest">Secure Fintech Infrastructure</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
