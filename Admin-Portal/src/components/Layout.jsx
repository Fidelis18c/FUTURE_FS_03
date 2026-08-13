import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, Package, Tags, LogOut, Sun, Moon, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/categories', label: 'Categories', icon: Tags },
];

const Layout = () => {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close the mobile drawer whenever the route changes
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const sidebarContent = (
    <>
      <div className="h-16 lg:h-20 flex items-center justify-between gap-2.5 px-6 border-b border-gray-100 dark:border-zinc-700 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <img src="/HSMOBILESTORElogo.png" alt="HS Store" className="h-8 lg:h-9 w-auto object-contain shrink-0" />
          <span className="text-sm font-bold text-brand-orange truncate">Admin Portal</span>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 shrink-0"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive ? 'bg-brand-orange text-white' : 'text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-zinc-700 space-y-3 shrink-0">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
        >
          <span className="flex items-center gap-3">
            {dark ? <Moon size={17} /> : <Sun size={17} />}
            {dark ? 'Dark Mode' : 'Light Mode'}
          </span>
          <span className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors shrink-0 ${dark ? 'bg-brand-orange justify-end' : 'bg-gray-300 justify-start'}`}>
            <span className="w-4 h-4 rounded-full bg-white block" />
          </span>
        </button>

        <p className="px-4 text-sm font-semibold text-brand-dark dark:text-zinc-100 truncate">{user?.full_name || user?.email}</p>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-zinc-900 lg:flex">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 h-16 bg-white dark:bg-zinc-800 border-b border-gray-100 dark:border-zinc-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img src="/HSMOBILESTORElogo.png" alt="HS Store" className="h-7 w-auto object-contain" />
          <span className="text-sm font-bold text-brand-orange">Admin Portal</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-gray-600 dark:text-zinc-300"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile drawer + backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/40 z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[80vw] bg-white dark:bg-zinc-800 flex flex-col"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-white dark:bg-zinc-800 border-r border-gray-100 dark:border-zinc-700 flex-col">
        {sidebarContent}
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
