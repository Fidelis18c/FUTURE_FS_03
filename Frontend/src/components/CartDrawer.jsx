import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center">
                <FiShoppingBag className="mr-2" /> Your Cart
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <FiShoppingBag size={32} className="text-gray-300" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Your cart is empty</h3>
                  <p className="text-gray-500 mt-2">Looks like you haven't added anything yet.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-8 px-8 py-3 bg-brand-dark text-white font-bold text-sm uppercase tracking-widest"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.id}-${item.variant}-${item.color}`} className="flex space-x-4">
                    <div className="w-24 h-24 bg-brand-gray flex-shrink-0 flex items-center justify-center p-2">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-bold text-brand-dark">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.id, item.variant, item.color)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.variant} {item.color && `| ${item.color}`}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-gray-200">
                          <button
                            onClick={() => updateQuantity(item.id, item.variant, item.color, item.quantity - 1)}
                            className="p-1 hover:bg-gray-50"
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.variant, item.color, item.quantity + 1)}
                            className="p-1 hover:bg-gray-50"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                        <span className="text-sm font-bold">${(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="text-xl font-bold text-brand-dark">${cartTotal.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <Link
                    to="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full py-4 bg-brand-dark text-white text-center text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                  >
                    Checkout
                  </Link>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-full py-4 bg-white border border-brand-dark text-brand-dark text-sm font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
