import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock } from 'react-icons/fi';
import about2 from '../assets/AboutImage/About2.mp4';

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

      {/* Hero Video */}
      <section className="relative w-full h-screen">
        <video
          src={about2}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-brand-orange text-xs tracking-[0.4em] uppercase font-semibold mb-4"
          >
            Get In Touch
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Find Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Have a question, a concern, or just want to say hello? We'd love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-16 px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {info.map((item, i) => (
            <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm text-center border border-orange-300">
              <div className="mx-auto mb-4">
                <item.icon size={24} className="text-brand-orange mx-auto" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-700 font-medium">{item.value}</p>
              <p className="text-xs text-gray-400 mt-1">{item.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Form + Map */}
      <section className="py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — Form */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
            <p className="text-gray-500 text-sm mb-8">Fill in the form below and we'll get back to you as soon as possible.</p>

            {sent ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
                <FiSend size={36} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-sm text-gray-500">Thank you for reaching out. We'll be in touch within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
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
              </form>
            )}
          </motion.div>

          {/* Right — Map */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} transition={{ delay: 0.15 }}
            className="w-full h-full min-h-96 rounded-3xl overflow-hidden border border-orange-300 shadow-lg"
            style={{ minHeight: '520px' }}
          >
            <iframe
              title="HS Store Location"
              src="https://maps.google.com/maps?q=Kariakoo+Dar+es+Salaam+Tanzania&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '520px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>

        </div>
      </section>

    </div>
  );
};

export default ContactUs;
