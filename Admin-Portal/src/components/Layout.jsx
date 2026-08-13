import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, Tags, LogOut, Sun, Moon } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-zinc-900 flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-white dark:bg-zinc-800 border-r border-gray-100 dark:border-zinc-700 flex flex-col">
        <div className="h-20 flex items-center gap-2.5 px-6 border-b border-gray-100 dark:border-zinc-700">
          <img src="/HSMOBILESTORElogo.png" alt="HS Store" className="h-9 w-auto object-contain" />
          <span className="text-sm font-bold text-brand-orange">Admin Portal</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
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

        <div className="p-4 border-t border-gray-100 dark:border-zinc-700 space-y-3">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
          >
            <span className="flex items-center gap-3">
              {dark ? <Moon size={17} /> : <Sun size={17} />}
              {dark ? 'Dark Mode' : 'Light Mode'}
            </span>
            <span className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${dark ? 'bg-brand-orange justify-end' : 'bg-gray-300 justify-start'}`}>
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
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
