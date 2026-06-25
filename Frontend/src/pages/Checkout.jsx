import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { FiCheckCircle } from 'react-icons/fi';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const { cart, cartTotal } = useCart();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    country: 'Tanzania',
    region: '',
    city: '',
    street: '',
    postalCode: '',
    isDefault: true,
    paymentMethod: 'Mobile Money',
    paymentNumber: ''
  });

  const [isOrdered, setIsOrdered] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsOrdered(true);
    window.scrollTo(0, 0);
  };

  if (isOrdered) {
    return (
      <div className="bg-white min-h-[60vh] flex flex-center items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-6">
          <div className="flex justify-center">
            <FiCheckCircle size={80} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-brand-dark tracking-tighter">Order Confirmed!</h2>
          <p className="text-gray-500">Thank you for your purchase. We've sent a confirmation email to you and will notify you when your order is out for delivery.</p>
          <div className="pt-6">
            <Link to="/" className="inline-block px-10 py-4 bg-brand-dark text-white text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-all">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Form */}
          <div className="lg:col-span-2 space-y-12">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-10">
              {/* Address Section */}
              <section>
                <h2 className="text-xl font-bold text-brand-dark mb-8 pb-4 border-b border-gray-100">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full border-gray-200 py-3 focus:border-brand-dark focus:ring-0 text-sm" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full border-gray-200 py-3 focus:border-brand-dark focus:ring-0 text-sm" placeholder="+255 --- --- ---" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Country</label>
                    <input type="text" name="country" value={formData.country} readOnly className="w-full border-gray-100 bg-gray-50 py-3 focus:ring-0 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Region</label>
                    <input type="text" name="region" value={formData.region} onChange={handleChange} required className="w-full border-gray-200 py-3 focus:border-brand-dark focus:ring-0 text-sm" placeholder="Dar es Salaam" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full border-gray-200 py-3 focus:border-brand-dark focus:ring-0 text-sm" placeholder="Ilala" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Street Address</label>
                    <input type="text" name="street" value={formData.street} onChange={handleChange} required className="w-full border-gray-200 py-3 focus:border-brand-dark focus:ring-0 text-sm" placeholder="123 Smart St, Block 4" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Postal Code</label>
                    <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className="w-full border-gray-200 py-3 focus:border-brand-dark focus:ring-0 text-sm" placeholder="11101" />
                  </div>
                  <div className="md:col-span-2 flex items-center">
                    <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleChange} className="mr-3 border-gray-300 text-brand-dark focus:ring-brand-dark" />
                    <span className="text-sm text-gray-600">Set as default address</span>
                  </div>
                </div>
              </section>

              {/* Payment Section */}
              <section>
                <h2 className="text-xl font-bold text-brand-dark mb-8 pb-4 border-b border-gray-100">Payment Method</h2>
                <div className="p-6 bg-gray-50 border border-gray-100 rounded-sm">
                  <div className="flex items-center mb-6">
                    <input type="radio" checked readOnly className="mr-3 text-brand-dark focus:ring-brand-dark" />
                    <span className="text-sm font-bold text-brand-dark">Mobile Money (M-Pesa / Tigo Pesa)</span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Payment Number</label>
                    <input type="tel" name="paymentNumber" value={formData.paymentNumber} onChange={handleChange} required className="w-full border-gray-200 py-3 focus:border-brand-dark focus:ring-0 text-sm" placeholder="07-- --- ---" />
                    <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-wider">A payment prompt will be sent to this number.</p>
                  </div>
                </div>
              </section>
            </form>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 p-8 sticky top-28 shadow-sm">
              <h2 className="text-lg font-bold text-brand-dark mb-8 uppercase tracking-widest text-center">Order Summary</h2>
              
              <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.variant}`} className="flex justify-between items-start">
                    <div className="flex space-x-3">
                      <div className="w-12 h-12 bg-gray-50 flex-shrink-0 p-1 flex items-center justify-center">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-brand-dark leading-tight">{item.name}</h4>
                        <p className="text-[10px] text-gray-400 uppercase mt-1">{item.variant} x {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold">${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-100">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>${cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-brand-dark pt-3 border-t border-gray-100 mt-3">
                  <span>Total</span>
                  <span>${cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                className="w-full mt-10 py-4 bg-brand-dark text-white font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition-all shadow-lg"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
