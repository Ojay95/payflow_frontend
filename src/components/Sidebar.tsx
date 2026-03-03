import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore.ts';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  activeItem?: string; // Added to support programmatic highlighting
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeItem }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useStore();

  /**
   * Production Navigation Schema:
   * Aligned with the specialized handlers in the Go backend (Cadre, Employee, Payroll).
   */
  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: 'grid_view' },
    { label: 'Workforce', path: '/employees', icon: 'group' },
    { label: 'Approvals', path: '/payroll/approvals', icon: 'verified' },
    { label: 'Disbursements', path: '/payroll/history', icon: 'history' },
    { label: 'Salary Cadres', path: '/settings/cadres', icon: 'account_tree' },
    { label: 'Audit Trail', path: '/audit-logs', icon: 'receipt_long' },
    { label: 'Settings', path: '/settings', icon: 'settings' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  const handleLogout = () => {
    logout(); // Resets token and is2faVerified in useStore
    navigate('/login');
  };

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-[150] w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
    transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block
    ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
  `;

  return (
      <>
        {/* Mobile Overlay: Production UX requirement for focus management */}
        {isOpen && (
            <div
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[140] lg:hidden"
                onClick={onClose}
            />
        )}

        <aside className={sidebarClasses}>
          <div className="flex flex-col h-full py-6">
            <div className="flex flex-col gap-6 flex-1">
              {/* Branding Section */}
              <div className="flex items-center justify-between px-8 text-primary">
                <Link to="/dashboard" className="flex items-center gap-3 group" onClick={onClose}>
                  <div className="size-9 bg-primary text-white flex items-center justify-center rounded-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined font-bold text-xl">account_balance_wallet</span>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-slate-900 dark:text-white text-lg font-black tracking-tight leading-none">PayFlow</h2>
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">Admin Console</span>
                  </div>
                </Link>
                <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-2">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Production Navigation Menu */}
              <nav className="flex flex-col gap-1 px-4 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path || activeItem === item.label;
                  return (
                      <button
                          key={item.path}
                          onClick={() => handleNavClick(item.path)}
                          className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all group text-left border ${
                              isActive
                                  ? 'bg-primary border-primary text-white font-black shadow-xl shadow-primary/20'
                                  : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                      >
                    <span className={`material-symbols-outlined text-[22px] ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary transition-colors'}`}>
                      {item.icon}
                    </span>
                        <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                      </button>
                  );
                })}
              </nav>
            </div>

            {/* User Session Footer: Logic tied to production AuthUser state */}
            <div className="px-4 mt-auto">
              <div className="bg-slate-50 dark:bg-white/[0.02] rounded-[2rem] p-5 border border-slate-200 dark:border-white/5 shadow-inner">
                <div className="flex items-center gap-3 mb-5">
                  <div className="size-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-sm uppercase shrink-0">
                    {user?.name?.[0] || 'A'}
                  </div>
                  <div className="flex flex-col min-w-0">
                  <span className="text-sm font-black text-slate-900 dark:text-white truncate">
                    {user?.name?.split(' ')[0] || 'Administrator'}
                  </span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate">
                    {user?.role || 'User'}
                  </span>
                  </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full py-3 rounded-xl border border-red-500/20 text-red-600 dark:text-red-500 text-[10px] font-black hover:bg-red-500/10 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                  <span className="material-symbols-outlined text-sm font-bold">logout</span>
                  Secure Sign Out
                </button>
              </div>
            </div>
          </div>
        </aside>
      </>
  );
};

export default Sidebar;