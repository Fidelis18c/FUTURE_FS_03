import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiRefreshCw, FiAlertCircle, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const fade = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const steps = [
  { num: '01', title: 'Contact Us', desc: 'Reach out via email or phone within 7 days of delivery. Provide your order number and reason for return.' },
  { num: '02', title: 'Get Approved', desc: 'Our team reviews your request and sends a return authorisation within 24 hours.' },
  { num: '03', title: 'Ship It Back', desc: 'Pack the item securely in its original packaging and deliver it to our store or arrange a pickup.' },
  { num: '04', title: 'Refund or Exchange', desc: 'Once we inspect and confirm the return, your refund is processed or your exchange item is dispatched within 3 business days.' },
];

const eligible = [
  'Item delivered in wrong condition (damaged, defective, or wrong product)',
  'Item is unused and in original packaging with all accessories',
  'Return initiated within 7 days of delivery',
  'Item has not been activated or registered',
];

const notEligible = [
  'Items that have been used, opened, or had seals broken',
  'Software, digital downloads, and gift cards',
  'Items damaged due to misuse or accidental damage by the customer',
  'Returns initiated after the 7-day window',
  'Bundled items where only part of the bundle is returned',
];

const ReturnsRefunds = () => (
  <div className="bg-white">

    {/* Hero */}
    <section className="bg-gradient-to-br from-[#13111c] to-[#1f1509] py-28 px-6 md:px-12 text-center">
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="text-brand-orange text-xs tracking-[0.4em] uppercase font-semibold mb-4">
        Our Guarantee
      </motion.p>
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="text-4xl md:text-5xl font-bold text-white mb-6">
        Returns & Refunds
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="text-gray-400 text-base max-w-2xl mx-auto leading-relaxed">
        Your satisfaction matters. If something isn't right, we'll make it right — quickly and hassle-free.
      </motion.p>
    </section>

    {/* Return Process */}
    <section className="py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} className="text-center mb-16">
          <p className="text-brand-orange text-xs tracking-[0.4em] uppercase font-semibold mb-3">Simple Process</p>
          <h2 className="text-3xl font-bold text-gray-900">How to Return an Item</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <motion.div key={s.num} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} transition={{ delay: i * 0.1 }}
              className="relative">
              <span className="text-6xl font-black text-orange-50 absolute -top-4 -left-2 select-none">{s.num}</span>
              <div className="relative z-10 pt-6">
                <h3 className="text-sm font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Eligibility */}
    <section className="py-20 px-6 md:px-12 lg:px-24 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} className="text-center mb-12">
          <p className="text-brand-orange text-xs tracking-[0.4em] uppercase font-semibold mb-3">Policy Details</p>
          <h2 className="text-3xl font-bold text-gray-900">What Can Be Returned?</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Eligible */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}
            className="bg-white rounded-2xl p-8 shadow-sm border border-green-50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                <FiCheckCircle size={20} className="text-green-500" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Eligible for Return</h3>
            </div>
            <ul className="space-y-3">
              {eligible.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                  <FiCheckCircle size={15} className="text-green-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Not Eligible */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-red-50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <FiXCircle size={20} className="text-red-400" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Not Eligible for Return</h3>
            </div>
            <ul className="space-y-3">
              {notEligible.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                  <FiXCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Refund Timeline */}
    <section className="py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}
          className="bg-orange-50 border border-orange-100 rounded-2xl p-8 flex gap-5 mb-8">
          <FiRefreshCw size={22} className="text-brand-orange shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Refund Timeline</h3>
            <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
              <li>Mobile money refunds (M-Pesa, Airtel, Tigo): within 24 hours of approval.</li>
              <li>Bank transfer refunds: 2–3 business days after approval.</li>
              <li>Exchange orders are dispatched within 3 business days once the return is received and inspected.</li>
            </ul>
          </div>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} transition={{ delay: 0.1 }}
          className="bg-gray-50 border border-gray-100 rounded-2xl p-8 flex gap-5">
          <FiAlertCircle size={22} className="text-gray-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Shipping Costs on Returns</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              If the return is due to a defect or our error, HS Store covers the return shipping cost. If the return is due to a change of mind, the customer is responsible for the return shipping fee.
            </p>
          </div>
        </motion.div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 px-6 md:px-12 bg-gray-50">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to Start a Return?</h2>
          <p className="text-gray-500 text-sm mb-8">Contact our team and we'll guide you through every step.</p>
          <Link to="/contact"
            className="inline-flex items-center gap-2 bg-brand-orange text-white px-10 py-3.5 rounded-full text-sm font-bold hover:bg-orange-700 transition-colors">
            <FiMail size={15} /> Contact Support
          </Link>
        </motion.div>
      </div>
    </section>

  </div>
);

export default ReturnsRefunds;
