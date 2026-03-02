import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme, user, logout } = useStore();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'grid_view' },
    { label: 'Approvals', path: '/payroll/approvals', icon: 'verified' },
    { label: 'Employees', path: '/employees', icon: 'badge' },
    { label: 'History', path: '/payroll/history', icon: 'history' },
    { label: 'Settings', path: '/settings', icon: 'settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-10 py-3 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-opacity-95 transition-colors">
        <div className="flex items-center gap-6 lg:gap-10">
          <Link to="/dashboard" className="flex items-center gap-3 text-primary group">
            <div className="size-8 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined font-bold">account_balance_wallet</span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-slate-900 dark:text-white text-base font-black leading-tight tracking-tight">PayFlow</h2>
              <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest truncate max-w-[100px]">
              {user?.business_name || 'Enterprise'}
            </span>
            </div>
          </Link>

          <div className="hidden xl:flex items-center bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl h-10 px-4 w-72 shadow-inner focus-within:border-primary/50 transition-all">
            <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
            <input
                className="border-none bg-transparent focus:ring-0 text-sm text-slate-900 dark:text-slate-200 placeholder:text-slate-400 w-full ml-2 outline-none"
                placeholder="Search records..."
            />
          </div>
        </div>

        <div className="flex flex-1 justify-end items-center gap-3 md:gap-6">
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all ${
                        location.pathname.startsWith(item.path)
                            ? 'bg-primary/10 text-primary'
                            : 'text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                  {item.label}
                </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-4 lg:pl-6">
            <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
                title="Toggle Appearance"
            >
            <span className="material-symbols-outlined text-xl">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
            </button>

            <div className="relative group">
              <button className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                <div className="size-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-sm uppercase">
                  {user?.name?.[0] || 'A'}
                </div>
              </button>

              {/* Desktop Profile Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                  <p className="text-sm font-black text-slate-900 dark:text-white truncate">{user?.name}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{user?.role}</p>
                </div>
                <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <span className="material-symbols-outlined text-lg">person_outline</span> Account Settings
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors mt-2"
                >
                  <span className="material-symbols-outlined text-lg">logout</span> Sign Out
                </button>
              </div>
            </div>

            <button
                className="md:hidden text-slate-500 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Sidebar/Menu */}
        {isMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 md:hidden flex flex-col gap-1 shadow-2xl animate-in slide-in-from-top duration-200">
              {navItems.map((item) => (
                  <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-4 text-xs font-black uppercase tracking-widest py-4 px-5 rounded-2xl ${
                          location.pathname.startsWith(item.path)
                              ? 'bg-primary/10 text-primary'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                  >
                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                    {item.label}
                  </Link>
              ))}
              <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>
              <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 text-xs font-black uppercase tracking-widest py-4 px-5 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <span className="material-symbols-outlined text-xl">logout</span>
                Sign Out
              </button>
            </div>
        )}
      </header>
  );
};

export default Navigation;