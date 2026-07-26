import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cart, cartTotal } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone_number || '',
    region: '',
    city: '',
    street: '',
    is_default: true,
  });
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(true);

  // Fetch saved addresses if logged in
  useEffect(() => {
    if (token) {
      api.get('/user/addresses')
        .then(({ data }) => {
          if (data && data.length > 0) {
            setAddresses(data);
            const defaultAddr = data.find((a) => a.is_default) || data[0];
            setSelectedAddressId(defaultAddr.id);
            setUseNewAddress(false);
            setFormData((prev) => ({
              ...prev,
              fullName: defaultAddr.full_name || user?.full_name || prev.fullName,
              email: user?.email || prev.email,
              phone: defaultAddr.phone_number || user?.phone_number || prev.phone,
              region: defaultAddr.region || prev.region,
              city: defaultAddr.city || prev.city,
              street: defaultAddr.street || prev.street,
            }));
          }
        })
        .catch(() => {});
    }
  }, [token, user]);

  const handleSelectAddress = (addr) => {
    setSelectedAddressId(addr.id);
    setUseNewAddress(false);
    setFormData((prev) => ({
      ...prev,
      fullName: addr.full_name || prev.fullName,
      phone: addr.phone_number || prev.phone,
      region: addr.region || prev.region,
      city: addr.city || prev.city,
      street: addr.street || prev.street,
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate email if not logged in
    if (!token && !formData.email) {
      alert("Please provide an email address.");
      return;
    }

    // Pass data to payment page
    navigate('/payment', { 
      state: { 
        checkoutData: formData, 
        selectedAddressId: useNewAddress ? null : selectedAddressId 
      } 
    });
  };

  if (cart.length === 0) {
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
          <Link to="/" className="flex items-center text-sm text-gray-500 hover:text-brand-dark mb-6">
            <ChevronLeft className="mr-1" /> Back to store
          </Link>
          <h1 className="text-4xl font-bold text-brand-dark tracking-tighter">Checkout</h1>
        </div>

        {/* Existing User Sign-In Banner */}
        {!token && (
          <div className="mb-10 p-5 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <h4 className="text-sm font-bold text-brand-dark">Already have an account?</h4>
              <p className="text-xs text-gray-600 mt-0.5">Sign in to your account to use pre-filled saved addresses.</p>
            </div>
            <Link
              to="/login?redirect=/checkout"
              className="px-6 py-2.5 bg-brand-dark text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-gray-800 transition-colors text-center shrink-0 shadow"
            >
              Sign In to Checkout
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Form */}
          <div className="lg:col-span-2 space-y-12">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-10">

              {/* Saved Addresses */}
              {addresses.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-brand-dark mb-6 pb-4 border-b border-gray-100">Saved Addresses</h2>
                  <div className="space-y-3 mb-4">
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        onClick={() => handleSelectAddress(addr)}
                        className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${selectedAddressId === addr.id && !useNewAddress ? 'border-brand-dark bg-gray-50 ring-1 ring-brand-dark' : 'border-gray-200'}`}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === addr.id && !useNewAddress}
                          onChange={() => handleSelectAddress(addr)}
                          className="mt-1 text-brand-dark focus:ring-brand-dark"
                        />
                        <div className="text-sm">
                          <p className="font-bold text-brand-dark">{addr.full_name}</p>
                          <p className="text-gray-500">{addr.street}, {addr.city}, {addr.region}</p>
                          <p className="text-gray-400">{addr.phone_number}</p>
                        </div>
                      </label>
                    ))}
                    <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${useNewAddress ? 'border-brand-dark bg-gray-50' : 'border-gray-200'}`}>
                      <input
                        type="radio"
                        name="address"
                        checked={useNewAddress}
                        onChange={() => setUseNewAddress(true)}
                      />
                      <span className="text-sm font-semibold text-brand-dark">+ Add a new address</span>
                    </label>
                  </div>
                </section>
              )}

              {/* New Address / Contact Form */}
              {(useNewAddress || addresses.length === 0) && (
                <section>
                  <h2 className="text-xl font-bold text-brand-dark mb-8 pb-4 border-b border-gray-100">
                    Contact & Shipping
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Full Name</label>
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full border border-gray-200 py-3 px-4 rounded-lg focus:border-brand-dark focus:outline-none text-sm" placeholder="John Doe" />
                    </div>
                    {!token && (
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border border-gray-200 py-3 px-4 rounded-lg focus:border-brand-dark focus:outline-none text-sm" placeholder="john@example.com" />
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Phone Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full border border-gray-200 py-3 px-4 rounded-lg focus:border-brand-dark focus:outline-none text-sm" placeholder="+255 --- --- ---" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Region</label>
                      <input type="text" name="region" value={formData.region} onChange={handleChange} required className="w-full border border-gray-200 py-3 px-4 rounded-lg focus:border-brand-dark focus:outline-none text-sm" placeholder="Dar es Salaam" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">City</label>
                      <input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full border border-gray-200 py-3 px-4 rounded-lg focus:border-brand-dark focus:outline-none text-sm" placeholder="Ilala" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Street Address</label>
                      <input type="text" name="street" value={formData.street} onChange={handleChange} required className="w-full border border-gray-200 py-3 px-4 rounded-lg focus:border-brand-dark focus:outline-none text-sm" placeholder="123 Smart St, Block 4" />
                    </div>
                    {token && (
                      <div className="md:col-span-2 flex items-center">
                        <input type="checkbox" name="is_default" checked={formData.is_default} onChange={handleChange} className="mr-3 border-gray-300 text-brand-dark focus:ring-brand-dark" />
                        <span className="text-sm text-gray-600">Set as default address</span>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </form>
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
                form="checkout-form"
                className="w-full mt-10 py-4 bg-brand-dark text-white font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition-all shadow-lg"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
