import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import LoginModal from './LoginModal';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    {
      name: 'Phones',
      dropdown: [
        { name: 'iPhones', path: '/phones/iphone' },
        { name: 'Samsung', path: '/phones/samsung' },
        { name: 'Pixel', path: '/phones/pixel' },
      ],
    },
    {
      name: 'Pods & Audio',
      dropdown: [
        { name: 'Oraimo Pods', path: '/audio/oraimo' },
        { name: 'iPhone Pods', path: '/audio/iphone' },
        { name: 'JBL', path: '/audio/jbl' },
        { name: 'Speakers', path: '/audio/speakers' },
      ],
    },
    {
      name: 'Tablets',
      dropdown: [
        { name: 'iPads', path: '/tablets/ipad' },
        { name: 'Samsung Tablets', path: '/tablets/samsung' },
      ],
    },


  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  return (
    <>
    <nav className="sticky top-3 z-50 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
      <div className="navbar-glass flex items-center justify-between rounded-2xl shadow-lg shadow-black/5 px-5 md:px-8 h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/HSMOBILESTORElogo.png" alt="HS MOBILE STORE" className="h-8 md:h-10 w-auto object-contain" />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group">
              <button
                type="button"
                className="flex items-center text-sm font-semibold text-black hover:text-brand-orange transition-colors relative cursor-default"
              >
                {link.name}
                <ChevronDown size={13} className="ml-1 transition-transform group-hover:rotate-180" />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-orange transition-all duration-300 group-hover:w-full"></span>
              </button>

              {/* Dropdown */}
              <div className="absolute top-full left-0 mt-6 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100">
                <div className="py-2">
                  {link.dropdown.map((sub) => (
                    <Link
                      key={sub.name}
                      to={sub.path}
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-brand-dark"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Icons */}
        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="hidden md:flex items-center bg-white rounded-full px-4 py-1.5 border border-black/30 focus-within:border-black transition-all">
            <input
              type="text"
              placeholder="Search products..."
              className="bg-transparent border-none focus:outline-none text-sm font-light text-black placeholder:text-gray-400 placeholder:font-light w-40 lg:w-60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="text-gray-500 hover:text-brand-dark">
              <Search />
            </button>
          </form>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-gray-600 hover:text-brand-dark transition-colors"
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-brand-dark text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm font-semibold text-brand-dark">{user.full_name?.split(' ')[0]}</span>
              <button
                onClick={logout}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors px-3 py-2 rounded-full hover:bg-red-50"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center space-x-1 bg-blue-600 text-white px-5 py-2 text-sm font-medium hover:bg-orange-700 transition-colors rounded-full"
            >
              <User />
              <span>Login</span>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden navbar-glass rounded-2xl shadow-lg shadow-black/5 mt-2 overflow-hidden"
          >
            <div className="py-4 space-y-4 px-6">
              <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none focus:outline-none text-sm w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit"><Search /></button>
              </form>

              {navLinks.map((link) => (
                <div key={link.name} className="space-y-2">
                  <div className="font-bold text-gray-800">{link.name}</div>
                  <div className="pl-4 space-y-2">
                    {link.dropdown.map((sub) => (
                      <Link
                        key={sub.name}
                        to={sub.path}
                        className="block text-sm text-gray-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {user ? (
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-bold text-brand-dark">{user.full_name}</span>
                  <button
                    onClick={() => { logout(); setIsMenuOpen(false); }}
                    className="text-sm text-red-500 font-semibold"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  className="w-full text-center bg-blue-600 text-white py-3 rounded-lg font-medium"
                  onClick={() => { setIsMenuOpen(false); setIsLoginOpen(true); }}
                >
                  Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </nav>

    <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default Navbar;
