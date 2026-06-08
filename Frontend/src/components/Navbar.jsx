import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiMenu, FiX, FiChevronDown, FiUser } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const navLinks = [
    {
      name: 'Phones',
      path: '/phones',
      dropdown: [
        { name: 'iPhones', path: '/phones/iphone' },
        { name: 'Samsung', path: '/phones/samsung' },
        { name: 'Pixel', path: '/phones/pixel' },
      ],
    },
    {
      name: 'Pods & Audio',
      path: '/audio',
      dropdown: [
        { name: 'Oraimo Pods', path: '/audio/oraimo' },
        { name: 'iPhone Pods', path: '/audio/iphone' },
        { name: 'JBL', path: '/audio/jbl' },
        { name: 'Speakers', path: '/audio/speakers' },
      ],
    },
    {
      name: 'Tablets',
      path: '/tablets',
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
    <nav className="navbar-glass sticky top-0 z-50 py-0 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/src/assets/HSSTORELOGO.png" alt="HS STORE" className="h-15 w-15 md:h-40 md:w-40 object-contain" />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group">
              <Link
                to={link.path}
                className="flex items-center text-sm font-semibold text-black hover:text-brand-orange transition-colors relative"
              >
                {link.name}
                <FiChevronDown className="ml-1 text-xs transition-transform group-hover:rotate-180" />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-orange transition-all duration-300 group-hover:w-full"></span>
              </Link>

              {/* Dropdown */}
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100">
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
              <FiSearch />
            </button>
          </form>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-gray-600 hover:text-brand-dark transition-colors"
          >
            <FiShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-brand-dark text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          <Link to="/login" className="hidden md:flex items-center space-x-1 bg-brand-orange text-white px-5 py-2 text-sm font-medium hover:bg-orange-700 transition-colors rounded-full">
            <FiUser />
            <span>Login</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
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
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
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
                <button type="submit"><FiSearch /></button>
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

              <Link
                to="/login"
                className="block text-center bg-brand-orange text-white py-3 rounded-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
