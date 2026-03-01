
import React, { useEffect } from 'react';

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgClass = {
    success: 'bg-emerald-500 border-emerald-400',
    error: 'bg-red-500 border-red-400',
    info: 'bg-primary border-blue-400'
  }[type];

  const icon = {
    success: 'check_circle',
    error: 'error',
    info: 'info'
  }[type];

  return (
    <div className={`fixed bottom-8 right-8 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl border-2 shadow-2xl animate-bounce-in text-white ${bgClass}`}>
      <span className="material-symbols-outlined">{icon}</span>
      <p className="font-bold text-sm">{message}</p>
      <button onClick={onClose} className="ml-4 opacity-70 hover:opacity-100 transition-opacity">
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
};

export default Toast;
