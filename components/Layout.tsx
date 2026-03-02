import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useStore } from '../store/useStore';

/**
 * GlobalProgress Component:
 * Indeterminate progress bar that appears at the top of the viewport
 * during any active API request.
 */
const GlobalProgress: React.FC = () => {
  const isGlobalLoading = useStore((state) => state.isGlobalLoading);

  if (!isGlobalLoading) return null;

  return (
      <div className="fixed top-0 left-0 right-0 z-[1000] h-1 bg-primary/20 overflow-hidden">
        <div className="h-full bg-primary shadow-[0_0_10px_#00E5FF] animate-progress-loop w-1/2"></div>
        <style>{`
        @keyframes progress-loop {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(-10%); }
          100% { transform: translateX(200%); }
        }
        .animate-progress-loop {
          animation: progress-loop 1.2s infinite linear;
        }
      `}</style>
      </div>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-background-dark transition-colors duration-300 font-display">
        <GlobalProgress />

        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Mobile Top Header */}
          <header className="lg:hidden h-16 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-[130] backdrop-blur-xl transition-all">
            <div className="flex items-center gap-3 text-primary group">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-xl font-bold">account_balance_wallet</span>
              </div>
              <h2 className="text-slate-900 dark:text-white text-lg font-black tracking-tight uppercase">PayFlow</h2>
            </div>

            <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -mr-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors active:scale-90"
            >
              <span className="material-symbols-outlined text-3xl">menu_open</span>
            </button>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="min-h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
  );
};

export default Layout;