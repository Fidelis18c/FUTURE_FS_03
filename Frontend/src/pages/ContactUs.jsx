import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import contactHeroVideo from '../assets/Hero2/VIdeoContactHero.mp4';
import api from '../api';

const fade = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const info = [
  { icon: Mail, title: 'Email Us', value: 'hamzasaidd02@gmail.com', sub: 'We reply within 24 hours' },
  { icon: Phone, title: 'Call Us', value: '+255 762 889 818', sub: 'Mon – Sat, 8am – 8pm' },
  { icon: MapPin, title: 'Visit Us', value: 'Skycity Mall, Dar es Salaam', sub: 'P.O. Box 1234' },
  { icon: Clock, title: 'Working Hours', value: 'Mon – Sat: 8am – 8pm', sub: 'Sunday: 10am – 5pm' },
];

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      await api.post('/contact', form);
      setForm({ name: '', email: '', message: '' });
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white">

      {/* Hero Video */}
      <section className="relative w-full -mt-16" style={{ height: 'calc(100vh + 4rem)' }}>
        <video
          src={contactHeroVideo}
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
            className="caption-uppercase text-brand-orange mb-4"
          >
            Get In Touch
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="display-md md:display-lg text-white mb-6"
          >
            Find Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="body-md text-white/80 max-w-2xl mx-auto"
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
              whileHover={{ y: -12, scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <item.icon size={22} className="text-gray-700" />
              </div>
              <h3 className="title-sm text-gray-800 mb-1">{item.title}</h3>
              <p className="body-sm text-gray-700">{item.value}</p>
              <p className="caption text-gray-700 mt-1">{item.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Form + Map */}
      <section className="py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left — Form */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}>
            <h2 className="display-sm text-gray-800 mb-2">Send Us a Message</h2>
           
          

            <AnimatePresence>
              {sent && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="body-sm text-gray-700 mb-4"
                >
                  Message sent successfully.
                </motion.p>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 body-sm text-red-600">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block caption-uppercase text-gray-700 mb-2">Full Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="John Doe"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 body-sm focus:outline-none focus:border-brand-orange transition-colors" />
                </div>
                <div>
                  <label className="block caption-uppercase text-gray-700 mb-2">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 body-sm focus:outline-none focus:border-brand-orange transition-colors" />
                </div>
              </div>
              <div>
                <label className="block caption-uppercase text-gray-700 mb-2">Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={6} placeholder="Tell us more..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 body-sm focus:outline-none focus:border-brand-orange transition-colors resize-none" />
              </div>
              <button type="submit" disabled={sending}
                className="w-full flex items-center justify-center gap-2 bg-brand-orange text-white py-3.5 rounded-full button-text hover:bg-orange-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                <Send size={15} />
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>

          {/* Right — Map */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} transition={{ delay: 0.15 }}
            className="w-full h-full min-h-96 rounded-3xl overflow-hidden shadow-lg"
            style={{ minHeight: '520px' }}
          >
            <iframe
              title="HS Store Location"
              src="https://maps.google.com/maps?q=SkyCity+Mall+Dar+es+Salaam+Tanzania&t=&z=17&ie=UTF8&iwloc=&output=embed"
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
