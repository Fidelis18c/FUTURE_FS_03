import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Truck, RefreshCw, Smartphone, ChevronDown, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import about5 from '../assets/AboutImage/About5.mp4';

const fade = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const categories = [
  { icon: ShoppingBag, title: 'Orders', desc: 'Track, modify, or cancel your order' },
  { icon: Truck, title: 'Shipping', desc: 'Delivery times, costs, and tracking info' },
  { icon: RefreshCw, title: 'Returns', desc: 'How to return or exchange a product' },
  { icon: Smartphone, title: 'Products', desc: 'Product info, specs, and compatibility' },
];

const faqs = [
  {
    q: 'How do I track my order?',
    a: 'Once your order is dispatched, you will receive an SMS and email with your tracking number. You can use this to monitor your delivery status in real time.',
  },
  {
    q: 'Are all products genuine and authentic?',
    a: 'Yes. Every product sold at HS Store is 100% genuine and sourced directly from authorised distributors. Each item comes with a 1-year store warranty.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept M-Pesa, Tigo Pesa, Airtel Money, bank transfers, and cash on delivery for selected areas in Dar es Salaam.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Delivery within Dar es Salaam typically takes 1–2 business days. Upcountry deliveries take 2–5 business days depending on the region.',
  },
  {
    q: 'Can I return a product if I change my mind?',
    a: 'Yes, you can return most items within 7 days of delivery as long as they are in original condition, unused, and with all original packaging.',
  },
  {
    q: 'Do you offer warranty service?',
    a: 'Yes. All products come with a 1-year HS Store warranty. For manufacturer warranty claims, we assist you in reaching the authorised service centre.',
  },
];

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors">
        <span className="text-sm font-semibold text-gray-900 pr-4">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown className="text-brand-orange shrink-0" size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
            <p className="px-6 pb-5 text-sm text-gray-500 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SupportCenter = () => (
  <div className="bg-white">

    {/* Hero Video */}
    <section className="relative w-full h-screen">
      <video src={about5} autoPlay muted loop playsInline className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-6">
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="text-brand-orange text-xs tracking-[0.4em] uppercase font-semibold mb-4">
        We're Here to Help
      </motion.p>
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="text-4xl md:text-6xl font-bold text-white mb-6">
        Support Center
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="text-white/80 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
        Find answers to your questions or reach out to our team. We're available 7 days a week.
      </motion.p>
      </div>
    </section>

    {/* FAQs */}
    <section className="py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} className="text-center mb-12">
          <p className="text-brand-orange text-xs tracking-[0.4em] uppercase font-semibold mb-3">Common Questions</p>
          <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((f) => <FaqItem key={f.q} {...f} />)}
        </div>
      </div>
    </section>

    {/* Still need help */}
    <section className="py-20 px-6 md:px-12 bg-gray-50">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Still Need Help?</h2>
          <p className="text-gray-500 text-sm mb-8">Our support team is just a message or call away.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-brand-orange text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-orange-700 transition-colors">
              <Mail size={15} /> Email Support
            </Link>
            <a href="tel:+255700000000"
              className="inline-flex items-center justify-center gap-2 border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors">
              <Phone size={15} /> Call Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>

  </div>
);

export default SupportCenter;
