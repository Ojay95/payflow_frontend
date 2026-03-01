import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useStore();

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: 'grid_view' },
    { label: 'Workforce', path: '/employees', icon: 'group' },
    { label: 'Payroll Cycles', path: '/payroll/history', icon: 'event_repeat' },
    { label: 'Approvals', path: '/payroll/approvals', icon: 'verified' },
    { label: 'Cadres', path: '/settings/cadres', icon: 'account_tree' },
    { label: 'Audit Trail', path: '/audit-logs', icon: 'receipt_long' },
    { label: 'Settings', path: '/settings', icon: 'settings' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-[150] w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
    transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block
    ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[140] lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="flex flex-col h-full py-6">
          <div className="flex flex-col gap-8 flex-1">
            <div className="flex items-center justify-between px-8 text-primary">
              <Link to="/dashboard" className="flex items-center gap-3" onClick={onClose}>
                <div className="size-8">
                  <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
                  </svg>
                </div>
                <h2 className="text-slate-900 dark:text-white text-xl font-black tracking-tight">PayFlow</h2>
              </Link>
              <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <nav className="flex flex-col gap-1 px-4 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group text-left ${
                      isActive 
                        ? 'bg-primary text-white font-bold shadow-md shadow-primary/10' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[22px] ${isActive ? 'fill-1 text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors'}`}>
                      {item.icon}
                    </span>
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="px-4 mt-auto">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-inner">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-full bg-primary/10 dark:bg-slate-700 flex items-center justify-center text-primary font-black border border-primary/20 dark:border-slate-700 shrink-0">
                  {user?.name?.[0] || 'M'}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name || 'Maria Rodriguez'}</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{user?.role || 'Admin'}</span>
                </div>
              </div>
              <button 
                onClick={() => { logout(); navigate('/login'); }}
                className="w-full py-2.5 rounded-xl border border-red-500/20 text-red-600 dark:text-red-500 text-[11px] font-bold hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2 uppercase tracking-widest"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;