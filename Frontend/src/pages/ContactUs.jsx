import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock } from 'react-icons/fi';

const fade = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const info = [
  { icon: FiMail, title: 'Email Us', value: 'support@hsstore.com', sub: 'We reply within 24 hours' },
  { icon: FiPhone, title: 'Call Us', value: '+255 700 000 000', sub: 'Mon – Sat, 8am – 8pm' },
  { icon: FiMapPin, title: 'Visit Us', value: 'Dar es Salaam, Tanzania', sub: 'P.O. Box 1234' },
  { icon: FiClock, title: 'Working Hours', value: 'Mon – Sat: 8am – 8pm', sub: 'Sunday: 10am – 5pm' },
];

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up to backend
    setSent(true);
  };

  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#13111c] to-[#1f1509] py-28 px-6 md:px-12 text-center">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="text-brand-orange text-xs tracking-[0.4em] uppercase font-semibold mb-4">
          Get In Touch
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-white mb-6">
          Contact Us
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-gray-400 text-base max-w-2xl mx-auto leading-relaxed">
          Have a question, a concern, or just want to say hello? We'd love to hear from you.
        </motion.p>
      </section>

      {/* Info Cards */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {info.map((item, i) => (
            <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <item.icon size={20} className="text-brand-orange" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-700 font-medium">{item.value}</p>
              <p className="text-xs text-gray-400 mt-1">{item.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Send Us a Message</h2>
            <p className="text-gray-500 text-sm">Fill in the form below and we'll get back to you as soon as possible.</p>
          </motion.div>

          {sent ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
              <FiSend size={36} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Message Sent!</h3>
              <p className="text-sm text-gray-500">Thank you for reaching out. We'll be in touch within 24 hours.</p>
            </motion.div>
          ) : (
            <motion.form initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} transition={{ delay: 0.1 }}
              onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2 tracking-wide uppercase">Full Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="John Doe"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-orange transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2 tracking-wide uppercase">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-orange transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2 tracking-wide uppercase">Subject</label>
                <input type="text" name="subject" value={form.subject} onChange={handleChange} required placeholder="How can we help?"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-orange transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2 tracking-wide uppercase">Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={6} placeholder="Tell us more..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-orange transition-colors resize-none" />
              </div>
              <button type="submit"
                className="w-full flex items-center justify-center gap-2 bg-brand-orange text-white py-3.5 rounded-full text-sm font-bold tracking-wide hover:bg-orange-700 transition-colors">
                <FiSend size={15} />
                Send Message
              </button>
            </motion.form>
          )}
        </div>
      </section>

    </div>
  );
};

export default ContactUs;
