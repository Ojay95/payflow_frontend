import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';

const Navigation: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useStore();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Approvals', path: '/payroll/approvals' },
    { label: 'Employees', path: '/employees' },
    { label: 'Payroll', path: '/payroll/history' },
    { label: 'Settings', path: '/settings' },
  ];

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 md:px-10 py-3 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-opacity-95 transition-colors">
      <div className="flex items-center gap-8">
        <Link to="/dashboard" className="flex items-center gap-3 text-primary">
          <div className="size-6">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
            </svg>
          </div>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">PayFlow</h2>
        </Link>
        <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg h-9 px-3 w-64 shadow-inner">
          <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
          <input 
            className="border-none bg-transparent focus:ring-0 text-sm text-slate-900 dark:text-slate-200 placeholder:text-slate-400 w-full ml-2" 
            placeholder="Search organizational data..." 
          />
        </div>
      </div>

      <div className="flex flex-1 justify-end items-center gap-4 md:gap-6">
        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors ${
                location.pathname.startsWith(item.path) ? 'text-primary font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-primary'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-4 lg:pl-6">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span className="material-symbols-outlined">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          <button 
            className="md:hidden text-slate-500 p-2 hover:text-slate-900 dark:hover:text-white transition-colors" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <Link to="/profile" className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 border border-slate-200 dark:border-slate-700 transition-transform hover:scale-105 active:scale-95 shadow-md shadow-black/10" 
               style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuC3igiVu2-hRnQLVLD58BNArgErIbUqR_G5m0fIVAKETT4RgcgBBq-xDiJjuuIkzps0X561qyEdvWNPd_l9L3hGb26Z3ZGagb3jipyKJTJy0ar2-iThiSUHmArBCU5X-enKvW0CAJWTGgmFvzxNSxwEu9TyfR18R8xNTw_gHMDvGHbausec5Q0E_yK9yJLydeYMTveFVk6-lnGJW9N5KAR7Kw3_KG5ELH3aFp8XxWAU6In3ay7T1WdGWQz6Xa7NuuoNK4gdP7RITc8")` }}
          />
        </div>
      </div>

      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 md:hidden flex flex-col gap-2 shadow-xl animate-fade-in">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={`text-sm font-bold py-3 px-4 rounded-xl ${location.pathname.startsWith(item.path) ? 'bg-primary/10 text-primary' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              {item.label}
            </Link>
          ))}
          <button 
            onClick={() => { toggleTheme(); setIsMenuOpen(false); }}
            className="flex items-center gap-3 text-sm font-bold py-3 px-4 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span className="material-symbols-outlined text-xl">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      )}
    </header>
  );
};

export default Navigation;