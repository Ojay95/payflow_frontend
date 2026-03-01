
import React from 'react';
import { Link } from 'react-router-dom';

const EmailVerification: React.FC = () => {
  return (
    <div className="bg-background-dark min-h-screen flex items-center justify-center p-6 selection:bg-primary selection:text-slate-900">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-mint-green"></div>
        
        <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 text-primary">
          <span className="material-symbols-outlined text-4xl font-bold animate-pulse">mark_email_unread</span>
        </div>
        
        <h1 className="text-white text-3xl font-black mb-4">Verify your email</h1>
        <p className="text-gray-400 mb-8 leading-relaxed font-medium">
          We've sent a verification link to <span className="text-white font-bold">jane@acme.com</span>. Please check your inbox and click the link to activate your account.
        </p>
        
        <div className="space-y-4">
          <Link to="/login" className="block w-full bg-primary text-slate-900 font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 transition-all">
            Go to Login
          </Link>
          <button className="text-sm font-bold text-gray-500 hover:text-white transition-colors">
            Didn't receive the email? <span className="text-primary cursor-pointer">Resend</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
