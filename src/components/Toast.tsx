import React, { useEffect } from 'react';

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

/**
 * Toast Refactor:
 * Provides global feedback for API operations.
 * Optimized with high-contrast borders and backdrop-blur for visibility
 * over complex dashboard data.
 */
const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    // Standard 5-second visibility for production notifications
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Refined color palette aligned with our production theme
  const themeClasses = {
    success: 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-500/20',
    error: 'bg-red-600 border-red-400 text-white shadow-red-500/20',
    info: 'bg-primary border-primary/50 text-slate-900 shadow-primary/20'
  }[type];

  const icon = {
    success: 'check_circle',
    error: 'report',
    info: 'info'
  }[type];

  return (
      <div className={`fixed bottom-8 right-8 z-[300] flex items-center gap-4 px-6 py-4 rounded-2xl border-2 shadow-2xl backdrop-blur-md animate-in slide-in-from-right-10 duration-300 ${themeClasses}`}>
        <div className="flex items-center justify-center size-8 rounded-full bg-white/20">
        <span className="material-symbols-outlined text-xl font-bold">
          {icon}
        </span>
        </div>

        <div className="flex flex-col min-w-[200px]">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-0.5">
            System {type}
          </p>
          <p className="font-bold text-sm leading-tight">
            {message}
          </p>
        </div>

        <button
            onClick={onClose}
            className="ml-4 p-1 rounded-lg hover:bg-black/10 transition-colors shrink-0"
            aria-label="Close notification"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
  );
};

export default Toast;