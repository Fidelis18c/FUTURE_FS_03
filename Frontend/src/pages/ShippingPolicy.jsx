import { motion } from 'framer-motion';
import { FiPackage, FiTruck, FiMapPin, FiClock, FiAlertCircle } from 'react-icons/fi';

const fade = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const steps = [
  { icon: FiPackage, title: 'Order Placed', desc: 'Your order is confirmed and payment is received. You will get an email and SMS confirmation immediately.' },
  { icon: FiPackage, title: 'Processing', desc: 'Our team picks, checks, and carefully packs your item. This usually takes a few hours on business days.' },
  { icon: FiTruck, title: 'Dispatched', desc: 'Your order leaves our warehouse. A tracking number is sent to you via SMS and email.' },
  { icon: FiMapPin, title: 'Delivered', desc: 'Your package arrives at your door. Enjoy your new device!' },
];

const zones = [
  { zone: 'Dar es Salaam (CBD)', time: '1 Business Day', fee: 'Free over Tshs 1,000,000 · Tshs 5,000 otherwise' },
  { zone: 'Dar es Salaam (Suburbs)', time: '1–2 Business Days', fee: 'Free over Tshs 1,000,000 · Tshs 8,000 otherwise' },
  { zone: 'Coast Region', time: '2–3 Business Days', fee: 'Tshs 10,000 – 15,000' },
  { zone: 'Upcountry (Major Towns)', time: '3–5 Business Days', fee: 'Tshs 15,000 – 25,000' },
  { zone: 'Remote Areas', time: '5–7 Business Days', fee: 'Calculated at checkout' },
];

const ShippingPolicy = () => (
  <div className="bg-white">

    {/* Hero */}
    <section className="bg-gradient-to-br from-[#13111c] to-[#1f1509] py-28 px-6 md:px-12 text-center">
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="text-brand-orange text-xs tracking-[0.4em] uppercase font-semibold mb-4">
        Delivery Information
      </motion.p>
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="text-4xl md:text-5xl font-bold text-white mb-6">
        Shipping Policy
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="text-gray-400 text-base max-w-2xl mx-auto leading-relaxed">
        We deliver across Tanzania. Here's everything you need to know about how we get your order to your door.
      </motion.p>
    </section>

    {/* Process Steps */}
    <section className="py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} className="text-center mb-16">
          <p className="text-brand-orange text-xs tracking-[0.4em] uppercase font-semibold mb-3">From Click to Doorstep</p>
          <h2 className="text-3xl font-bold text-gray-900">How Your Order Gets to You</h2>
        </motion.div>
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-orange-100 z-0" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 relative z-10">
            {steps.map((s, i) => (
              <motion.div key={s.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-brand-orange text-white flex items-center justify-center mb-5 shadow-lg shadow-orange-200">
                  <s.icon size={24} />
                </div>
                <p className="text-xs font-bold text-brand-orange uppercase tracking-widest mb-2">Step {i + 1}</p>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Delivery Zones Table */}
    <section className="py-20 px-6 md:px-12 lg:px-24 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} className="text-center mb-12">
          <p className="text-brand-orange text-xs tracking-[0.4em] uppercase font-semibold mb-3">Delivery Zones</p>
          <h2 className="text-3xl font-bold text-gray-900">Delivery Times & Fees</h2>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-3 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest px-6 py-4">
            <span>Zone</span>
            <span className="text-center">Estimated Time</span>
            <span className="text-right">Shipping Fee</span>
          </div>
          {zones.map((z, i) => (
            <div key={z.zone} className={`grid grid-cols-3 px-6 py-4 text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
              <span className="font-medium text-gray-900">{z.zone}</span>
              <span className="text-center text-gray-500 flex items-center justify-center gap-1">
                <FiClock size={13} className="text-brand-orange" /> {z.time}
              </span>
              <span className="text-right text-gray-500">{z.fee}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Notes */}
    <section className="py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}
          className="bg-orange-50 border border-orange-100 rounded-2xl p-8 flex gap-5">
          <FiAlertCircle size={22} className="text-brand-orange shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Important Notes</h3>
            <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
              <li>Orders placed before 12:00 PM on business days are processed the same day.</li>
              <li>Delivery times are estimates and may vary during public holidays or unforeseen circumstances.</li>
              <li>You will be contacted by our delivery team before arrival.</li>
              <li>Someone must be available at the delivery address to receive the order.</li>
              <li>HS Store is not responsible for delays caused by incorrect address information.</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>

  </div>
);

export default ShippingPolicy;
