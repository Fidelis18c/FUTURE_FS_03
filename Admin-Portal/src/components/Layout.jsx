import { NavLink, Outlet } from 'react-router-dom';
import { Package, Tags, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Products', icon: Package, end: true },
  { to: '/categories', label: 'Categories', icon: Tags },
];

const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-white border-r border-gray-100 flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
          <img src="/HSMOBILESTORElogo.png" alt="HS Store" className="h-9 w-auto object-contain" />
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive ? 'bg-brand-dark text-white' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="px-4 mb-3">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Signed in as</p>
            <p className="text-sm font-semibold text-brand-dark truncate">{user?.full_name || user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
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
