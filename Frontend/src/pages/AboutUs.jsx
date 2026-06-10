import { motion } from 'framer-motion';
import { FiTarget, FiHeart, FiShield, FiStar } from 'react-icons/fi';

const fade = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const values = [
  { icon: FiTarget, title: 'Our Mission', body: 'To make premium technology accessible to every Tanzanian — delivering genuine products at honest prices.' },
  { icon: FiHeart, title: 'Our Passion', body: 'We love what we do. Every device we sell is carefully selected to meet the needs of modern life.' },
  { icon: FiShield, title: 'Our Promise', body: 'Authenticity guaranteed. Every product comes with a 1-year store warranty and full after-sales support.' },
  { icon: FiStar, title: 'Our Standard', body: 'From packaging to delivery, we hold ourselves to the highest standard so you always receive the best.' },
];

const stats = [
  { value: '5,000+', label: 'Happy Customers' },
  { value: '500+', label: 'Products Available' },
  { value: '3+', label: 'Years in Business' },
  { value: '24/7', label: 'Customer Support' },
];

const AboutUs = () => {
  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#13111c] to-[#1f1509] py-28 px-6 md:px-12 text-center">
        <motion.p
          initial="hidden" animate="visible" variants={fade} transition={{ duration: 0.5 }}
          className="text-brand-orange text-xs tracking-[0.4em] uppercase font-semibold mb-4"
        >
          Our Story
        </motion.p>
        <motion.h1
          initial="hidden" animate="visible" variants={fade} transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-white mb-6"
        >
          About HS Store
        </motion.h1>
        <motion.p
          initial="hidden" animate="visible" variants={fade} transition={{ duration: 0.5, delay: 0.2 }}
          className="text-gray-400 text-base max-w-2xl mx-auto leading-relaxed"
        >
          We are Tanzania's trusted destination for premium smartphones, audio gear, tablets, and accessories — built on a foundation of quality, trust, and service.
        </motion.p>
      </section>

      {/* Stats */}
      <section className="bg-brand-orange py-14 px-6 md:px-12">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} transition={{ delay: i * 0.1 }}>
              <p className="text-4xl font-bold mb-1">{s.value}</p>
              <p className="text-sm font-medium opacity-80">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}>
            <p className="text-brand-orange text-xs tracking-[0.4em] uppercase font-semibold mb-4">Who We Are</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Bringing the World's Best Technology to Tanzania
            </h2>
            <p className="text-gray-500 text-sm leading-loose mb-4">
              HS Store was founded with a simple idea: everyone deserves access to world-class technology without compromise. We source directly from authorised distributors to ensure every product you receive is 100% genuine.
            </p>
            <p className="text-gray-500 text-sm leading-loose">
              Based in Dar es Salaam, we serve customers across Tanzania with fast delivery, secure payments, and a dedicated after-sales team ready to help whenever you need us.
            </p>
          </motion.div>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} transition={{ delay: 0.15 }}
            className="bg-gray-50 rounded-3xl p-10 flex items-center justify-center min-h-64"
          >
            <img src="/src/assets/HSSTORELOGO.png" alt="HS Store" className="max-h-40 object-contain opacity-80" />
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-brand-orange text-xs tracking-[0.4em] uppercase font-semibold mb-3">What Drives Us</p>
            <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-5">
                  <v.icon size={22} className="text-brand-orange" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-3">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;
