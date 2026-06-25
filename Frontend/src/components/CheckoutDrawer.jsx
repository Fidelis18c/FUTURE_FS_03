import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, User, Phone, MapPin, Map, Building2, CreditCard } from 'lucide-react';

const PAYMENT_METHODS = [
  { id: 'mpesa',   label: 'M-Pesa',          sub: 'Vodacom' },
  { id: 'tigo',    label: 'Tigo Pesa',        sub: 'MIC Tanzania' },
  { id: 'airtel',  label: 'Airtel Money',     sub: 'Airtel' },
  { id: 'halotel', label: 'Halotel Pesa',     sub: 'Halotel' },
  { id: 'bank',    label: 'Bank Transfer',    sub: 'Any bank' },
  { id: 'cod',     label: 'Cash on Delivery', sub: 'Pay on arrival' },
];

const EMPTY_FORM = {
  fullName: '', phone: '', region: '', city: '', street: '', payment: '',
};

const Field = ({ label, icon: Icon, error, children }) => (
  <div>
    <label className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-gray-700 mb-1">
      {Icon && <Icon size={11} />} {label}
    </label>
    {children}
    {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
  </div>
);

const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-gray-800 transition-colors";

const CheckoutDrawer = ({ isOpen, onClose, product }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({});

  const close = () => {
    onClose();
    setTimeout(() => { setForm(EMPTY_FORM); setSubmitted(false); setTouched({}); }, 400);
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const touch = (key) => setTouched(t => ({ ...t, [key]: true }));

  const errors = {
    fullName: !form.fullName.trim() ? 'Required' : '',
    phone:    !form.phone.trim()    ? 'Required' : '',
    region:   !form.region.trim()   ? 'Required' : '',
    city:     !form.city.trim()     ? 'Required' : '',
    street:   !form.street.trim()   ? 'Required' : '',
    payment:  !form.payment         ? 'Select a payment method' : '',
  };

  const isValid = Object.values(errors).every(e => !e);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ fullName: true, phone: true, region: true, city: true, street: true, payment: true });
    if (!isValid) return;
    setSubmitted(true);
    setTimeout(close, 3000);
  };

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            {/* ── Header ── */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">HS Store</p>
                <h2 className="text-base font-bold text-gray-900 mt-0.5">Quick Checkout</h2>
              </div>
              <button onClick={close} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* ── Success State ── */}
            {submitted ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-5"
                >
                  <Check size={36} className="text-green-500" strokeWidth={2.5} />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Order Placed!</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Thank you, <span className="font-semibold text-gray-800">{form.fullName}</span>.<br />
                  We'll contact you on <span className="font-semibold text-gray-800">{form.phone}</span> to confirm.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">

                {/* ── Product Summary ── */}
                {product && (
                  <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-3 shrink-0">
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-gray-900 truncate leading-snug">{product.name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {[product.color, product.storage].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <p className="font-bold text-sm text-gray-900 shrink-0">
                      Tshs {product.price?.toLocaleString()}
                    </p>
                  </div>
                )}

                {/* ── Form Body ── */}
                <div className="flex-1 px-5 py-3 space-y-4">

                  {/* Contact */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-2 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[9px] font-bold shrink-0">1</span>
                      Contact Information
                    </p>
                    <div className="space-y-2">
                      <Field label="Full Name" icon={User} error={touched.fullName && errors.fullName}>
                        <input
                          type="text"
                          placeholder="e.g. Amina Hassan"
                          value={form.fullName}
                          onChange={e => set('fullName', e.target.value)}
                          onBlur={() => touch('fullName')}
                          className={inputCls}
                        />
                      </Field>
                      <Field label="Phone Number" icon={Phone} error={touched.phone && errors.phone}>
                        <input
                          type="tel"
                          placeholder="+255 7-- --- ---"
                          value={form.phone}
                          onChange={e => set('phone', e.target.value)}
                          onBlur={() => touch('phone')}
                          className={inputCls}
                        />
                      </Field>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100" />

                  {/* Delivery */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-2 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[9px] font-bold shrink-0">2</span>
                      Delivery Address
                    </p>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Region" icon={Map} error={touched.region && errors.region}>
                          <input
                            type="text"
                            placeholder="Dar es Salaam"
                            value={form.region}
                            onChange={e => set('region', e.target.value)}
                            onBlur={() => touch('region')}
                            className={inputCls}
                          />
                        </Field>
                        <Field label="City / District" icon={Building2} error={touched.city && errors.city}>
                          <input
                            type="text"
                            placeholder="Ilala"
                            value={form.city}
                            onChange={e => set('city', e.target.value)}
                            onBlur={() => touch('city')}
                            className={inputCls}
                          />
                        </Field>
                      </div>
                      <Field label="Street / Area" icon={MapPin} error={touched.street && errors.street}>
                        <input
                          type="text"
                          placeholder="e.g. Kariakoo, Block 4, near market"
                          value={form.street}
                          onChange={e => set('street', e.target.value)}
                          onBlur={() => touch('street')}
                          className={inputCls}
                        />
                      </Field>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100" />

                  {/* Payment */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-2 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[9px] font-bold shrink-0">3</span>
                      Payment Method
                    </p>
                    {touched.payment && errors.payment && (
                      <p className="text-[10px] text-red-500 mb-2">{errors.payment}</p>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      {PAYMENT_METHODS.map((m) => {
                        const active = form.payment === m.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => { set('payment', m.id); touch('payment'); }}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-left transition-all ${
                              active
                                ? 'border-gray-900 bg-gray-900'
                                : 'border-gray-200 hover:border-gray-400 bg-white'
                            }`}
                          >
                            <div>
                              <p className={`text-xs font-bold leading-tight ${active ? 'text-white' : 'text-gray-800'}`}>{m.label}</p>
                              <p className={`text-[10px] mt-0.5 ${active ? 'text-gray-300' : 'text-gray-400'}`}>{m.sub}</p>
                            </div>
                            {active && (
                              <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center shrink-0 ml-2">
                                <Check size={10} className="text-gray-900" strokeWidth={3} />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* ── Pinned Footer ── */}
                <div className="shrink-0 px-5 py-4 border-t border-gray-100 bg-white">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Total</span>
                    <span className="font-bold text-gray-900">Tshs {product?.price?.toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mb-3">Free delivery across Tanzania</p>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-gray-900 hover:bg-gray-700 text-white font-bold text-sm tracking-widest uppercase transition-colors"
                  >
                    Place Order
                  </button>
                </div>

              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CheckoutDrawer;
