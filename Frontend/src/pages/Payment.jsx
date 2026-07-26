import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { FiCheckCircle, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { ChevronLeft } from 'lucide-react';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart, fetchCart } = useCart();
  const { user, token, register } = useAuth();
  
  // Get data passed from Checkout page
  const checkoutData = location.state?.checkoutData;
  const selectedAddressId = location.state?.selectedAddressId;

  const [paymentNumber, setPaymentNumber] = useState(checkoutData?.phone || '');
  const [createAccount, setCreateAccount] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOrdered, setIsOrdered] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // If someone navigates here directly without checkout data, send them back
  if (!checkoutData && cart.length > 0 && !isOrdered) {
    navigate('/checkout');
    return null;
  }

  // Generate a random password for guests who don't want to create an account explicitly
  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) + "!";
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let currentToken = token;
      
      // 1. If not logged in, we must register them (backend requires user)
      if (!currentToken) {
        const passToUse = createAccount && password ? password : generateRandomPassword();
        
        // This will set the token in AuthContext and api headers internally
        const regResult = await register(
          checkoutData.fullName, 
          checkoutData.email, 
          checkoutData.phone, 
          passToUse
        );
        
        if (!regResult.success) {
          throw new Error(regResult.error || "Failed to create account. Email or phone might already be in use.");
        }
        
        // Re-fetch token from localStorage since context might not have updated instantly
        currentToken = localStorage.getItem('hs_token');
        if (!currentToken) throw new Error("Authentication failed after registration.");
        
        // Ensure API uses new token immediately for this flow
        api.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
      }
        
      // Ensure cart items are synced to backend database for the authenticated user
      for (const item of cart) {
        const variantId = item.variant_id || item.id;
        if (variantId) {
          try {
            await api.post('/cart', { variant_id: variantId, quantity: item.quantity });
          } catch (cartErr) {
            console.warn('Cart sync note:', variantId, cartErr.response?.data?.error);
          }
        }
      }

      let addressId = selectedAddressId;

      // 2. Save Address if it's new
      if (!addressId) {
        const { data: addrData } = await api.post('/user/addresses', {
          full_name: checkoutData.fullName,
          phone_number: checkoutData.phone,
          region: checkoutData.region,
          city: checkoutData.city,
          street: checkoutData.street,
          is_default: checkoutData.is_default || true,
        });
        addressId = addrData.id;
      }

      // 3. Create Order
      const { data: orderData } = await api.post('/orders', {
        address_id: addressId,
        payment_phone: paymentNumber,
      });

      setOrderId(orderData.orderId);
      clearCart();
      setIsOrdered(true);
      window.scrollTo(0, 0);

    } catch (err) {
      console.error('Payment Submission Error:', err.response?.data || err);
      const serverMsg = err.response?.data?.error || err.response?.data?.message || err.message;
      setError(serverMsg || 'Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isOrdered) {
    return (
      <div className="bg-white min-h-[60vh] flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-6">
          <div className="flex justify-center">
            <FiCheckCircle size={80} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-brand-dark tracking-tighter">Order Confirmed!</h2>
          {orderId && (
            <p className="text-sm font-mono text-gray-400">Order ID: #{String(orderId).slice(0, 8).toUpperCase()}</p>
          )}
          <p className="text-gray-500">
            Thank you for your purchase. A payment prompt has been sent to your phone ({paymentNumber}). Please confirm the payment on your device.
          </p>
          {createAccount && (
            <p className="text-sm text-brand-dark font-medium mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
              Your account has been created! You can now log in using your email and password to track this order.
            </p>
          )}
          <div className="pt-6">
            <Link
              to="/"
              className="inline-block px-10 py-4 bg-brand-dark text-white text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-all rounded-full"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && !isOrdered) {
    return (
      <div className="bg-white py-20 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/" className="text-brand-dark underline font-bold">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <button onClick={() => navigate(-1)} className="flex items-center text-sm text-gray-500 hover:text-brand-dark mb-6">
            <ChevronLeft className="mr-1" /> Back to shipping
          </button>
          <h1 className="text-4xl font-bold text-brand-dark tracking-tighter">Payment</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-12">
            <form id="payment-form" onSubmit={handlePaymentSubmit} className="space-y-10">

              <section>
                <h2 className="text-xl font-bold text-brand-dark mb-8 pb-4 border-b border-gray-100">Payment Method</h2>
                <div className="p-6 bg-gray-50 border border-gray-100 rounded-xl">
                  <div className="flex items-center mb-6">
                    <input type="radio" checked readOnly className="mr-3 text-brand-dark focus:ring-brand-dark" />
                    <span className="text-sm font-bold text-brand-dark">Mobile Money (M-Pesa / Tigo Pesa / Airtel Money)</span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Payment Phone Number</label>
                    <input
                      type="tel"
                      value={paymentNumber}
                      onChange={(e) => setPaymentNumber(e.target.value)}
                      required
                      className="w-full border border-gray-200 py-3 px-4 rounded-lg focus:border-brand-dark focus:outline-none text-sm"
                      placeholder="07-- --- ---"
                    />
                    <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-wider">
                      A payment prompt will be sent instantly to this number once you confirm.
                    </p>
                  </div>
                </div>
              </section>

              {/* Guest Account Creation */}
              {!token && (
                <section>
                  <div className="p-6 border border-gray-200 rounded-xl">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={createAccount}
                        onChange={(e) => setCreateAccount(e.target.checked)}
                        className="w-5 h-5 border-gray-300 text-brand-dark focus:ring-brand-dark rounded mr-3"
                      />
                      <span className="text-sm font-bold text-brand-dark">Save my info & create an account</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-2 ml-8">
                      Create a password to track your order and checkout faster next time.
                    </p>
                    
                    {createAccount && (
                      <div className="mt-5 ml-8 max-w-sm">
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Password</label>
                        <div className="relative">
                          <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a secure password"
                            required
                            minLength={6}
                            className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-brand-dark transition-colors"
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
                    )}
                  </div>
                </section>
              )}

            </form>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 p-8 sticky top-28 shadow-sm rounded-xl">
              <h2 className="text-lg font-bold text-brand-dark mb-8 uppercase tracking-widest text-center">Order Summary</h2>

              <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.variant}`} className="flex justify-between items-start">
                    <div className="flex space-x-3">
                      <div className="w-12 h-12 bg-gray-50 flex-shrink-0 p-1 flex items-center justify-center rounded">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-brand-dark leading-tight">{item.name}</h4>
                        <p className="text-[10px] text-gray-400 uppercase mt-1">{item.variant} x {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold">Tshs {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-100">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>Tshs {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-brand-dark pt-3 border-t border-gray-100 mt-3">
                  <span>Total</span>
                  <span>Tshs {cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                form="payment-form"
                disabled={loading}
                className="w-full mt-10 py-4 bg-brand-dark text-white font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition-all shadow-lg rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? 'Processing...' : `Pay Tshs ${cartTotal.toLocaleString()}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
