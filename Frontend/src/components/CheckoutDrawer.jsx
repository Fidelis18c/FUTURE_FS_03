import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiUser, FiMapPin } from 'react-icons/fi';

const PAYMENT_METHODS = [
  { id: 'mpesa',   label: 'M-Pesa',          sub: 'Vodacom' },
  { id: 'tigo',    label: 'Tigo Pesa',        sub: 'MIC Tanzania' },
  { id: 'airtel',  label: 'Airtel Money',     sub: 'Airtel' },
  { id: 'halotel', label: 'Halotel Pesa',     sub: 'Halotel' },
  { id: 'bank',    label: 'Bank Transfer',    sub: 'Any bank' },
  { id: 'cod',     label: 'Cash on Delivery', sub: 'Pay on arrival' },
];

const EMPTY_FORM = { fullName: '', address: '', payment: '' };

const CheckoutDrawer = ({ isOpen, onClose, product }) => {
  const [form, setForm]           = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);

  const close = () => {
    onClose();
    setTimeout(() => { setForm(EMPTY_FORM); setSubmitted(false); }, 400);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(close, 2800);
  };

  const isValid = form.fullName.trim() && form.address.trim() && form.payment;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Quick Checkout</h2>
                <p className="text-xs text-gray-400 mt-0.5">Fill in your details to place the order</p>
              </div>
              <button onClick={close} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <FiX size={22} />
              </button>
            </div>

            {/* Success */}
            {submitted ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-5"
                >
                  <FiCheck size={36} className="text-green-500" strokeWidth={2.5} />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Order Placed!</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Thank you, <span className="font-semibold text-gray-700">{form.fullName}</span>.<br />
                  We'll contact you shortly to confirm.
                </p>
              </div>
            ) : (
              <>
                {/* Product summary */}
                {product && (
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-4 shrink-0">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-900 leading-snug truncate">{product.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {[product.color, product.storage].filter(Boolean).join(' · ')}
                      </p>
                      <p className="font-bold text-blue-600 text-sm mt-1">
                        Tshs {product.price?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">

                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <FiUser size={11} /> Full Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Amina Hassan"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <FiMapPin size={11} /> Delivery Address
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Street / Area, City, Region"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-3 block">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {PAYMENT_METHODS.map((m) => {
                        const active = form.payment === m.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setForm({ ...form, payment: m.id })}
                            className={`flex flex-col items-start px-4 py-3 rounded-2xl border text-left transition-all ${
                              active
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <span className={`text-xs font-bold ${active ? 'text-blue-700' : 'text-gray-800'}`}>
                              {m.label}
                            </span>
                            <span className={`text-[10px] mt-0.5 ${active ? 'text-blue-400' : 'text-gray-400'}`}>
                              {m.sub}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!isValid}
                    className="mt-2 w-full py-4 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wide transition-colors"
                  >
                    Complete Checkout
                  </button>

                </form>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CheckoutDrawer;
