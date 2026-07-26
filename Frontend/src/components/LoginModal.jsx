import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMail, FiLock, FiEye, FiEyeOff, FiPhone, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const LoginModal = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', phone_number: '', password: '' });
  const [localError, setLocalError] = useState('');
  const { login, register, loading } = useAuth();

  const handleChange = (e) => {
    setLocalError('');
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    let result;
    if (mode === 'login') {
      result = await login(form.email, form.password);
    } else {
      result = await register(form.full_name, form.email, form.phone_number, form.password);
    }
    if (result.success) {
      onClose();
    } else {
      setLocalError(result.error);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setLocalError('');
    setForm({ full_name: '', email: '', phone_number: '', password: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
          />

          {/* Card */}
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 pointer-events-auto relative">

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <FiX size={18} />
              </button>

              {/* Header */}
              <div className="mb-7 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {mode === 'login' ? 'Welcome back' : 'Create account'}
                </h2>
                <p className="text-sm text-gray-500">
                  {mode === 'login'
                    ? 'Sign in to your HS Store account'
                    : 'Join HS Store today'}
                </p>
              </div>

              {/* Error Message */}
              {localError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 text-center">
                  {localError}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide uppercase">
                        Full Name
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                        <input
                          type="text"
                          name="full_name"
                          value={form.full_name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                          className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-orange transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide uppercase">
                        Phone Number
                      </label>
                      <div className="relative">
                        <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                        <input
                          type="tel"
                          name="phone_number"
                          value={form.phone_number}
                          onChange={handleChange}
                          placeholder="+255 --- --- ---"
                          required
                          className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-orange transition-colors"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 tracking-wide uppercase">
                    Email
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-orange transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-600 tracking-wide uppercase">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        className="text-xs text-brand-orange hover:underline font-medium"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-brand-orange transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-orange text-white py-3 rounded-full text-sm font-bold tracking-wide hover:bg-orange-700 transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                </button>
              </form>

              {/* Toggle mode */}
              <p className="text-center text-sm text-gray-500 mt-6">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-brand-orange font-semibold hover:underline"
                >
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
