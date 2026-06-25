import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Heart, Shield, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import about1 from '../assets/AboutImage/About1.mp4';
import about3 from '../assets/AboutImage/About3.mp4';
import about4 from '../assets/AboutImage/About4.mp4';
import aboutImage from '../assets/AboutImage/AboutImage.jpg';
import fourSpeakers from '../assets/hero/FourSpeakers.png';
import jblBoomBox from '../assets/products/JBL BOOM BOX 3.webp';
import samsung1 from '../assets/AboutImage/Samsung1.png';
import samsung2 from '../assets/AboutImage/Samsung2.jpeg';
import samsung3 from '../assets/AboutImage/Samsung.png';
import iphone1 from '../assets/AboutImage/IPhone1.jpg';
import iphone2 from '../assets/AboutImage/Iphone2.jpg';
import iphone3 from '../assets/AboutImage/IPhone3.png';

const fade = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const wordsLeft = ['Premium Devices', 'Genuine Products', 'Trusted by Thousands', 'Best Prices'];
const wordsRight = ['Fast Delivery', 'Latest Tech', '1-Year Warranty', 'We Got You Covered'];
const slideLeft = { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } };
const slideRight = { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0 } };

const values = [
  { icon: Target, title: 'Our Mission', body: 'To make premium technology accessible to every Tanzanian — delivering genuine products at honest prices.' },
  { icon: Heart, title: 'Our Passion', body: 'We love what we do. Every device we sell is carefully selected to meet the needs of modern life.' },
  { icon: Shield, title: 'Our Promise', body: 'Authenticity guaranteed. Every product comes with a 1-year store warranty and full after-sales support.' },
  { icon: Star, title: 'Our Standard', body: 'From packaging to delivery, we hold ourselves to the highest standard so you always receive the best.' },
];

const stats = [
  { value: '5,000+', label: 'Happy Customers' },
  { value: '500+', label: 'Products Available' },
  { value: '3+', label: 'Years in Business' },
  { value: '24/7', label: 'Customer Support' },
];

const slides = [
  { src: samsung1, label: 'Samsung Galaxy S Series' },
  { src: samsung2, label: 'Samsung Galaxy Flagship' },
  { src: samsung3, label: 'Samsung Collection' },
  { src: iphone1, label: 'iPhone Pro Series' },
  { src: iphone2, label: 'iPhone Latest' },
  { src: iphone3, label: 'iPhone Collection' },
];

const variants = {
  enter: dir => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: dir => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
};

const AboutUs = () => {
  const [[index, dir], setSlide] = useState([0, 0]);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setWordIndex(i => (i + 1) % wordsLeft.length), 2500);
    return () => clearInterval(t);
  }, []);

  const paginate = (newDir) => {
    setSlide(([prev]) => [(prev + newDir + slides.length) % slides.length, newDir]);
  };

  return (
    <div className="bg-white">

      {/* Full-screen video hero */}
      <section className="relative w-full h-screen">
        <video
          src={about1}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-brand-orange text-xs tracking-[0.4em] uppercase font-semibold mb-4"
          >
            Who We Are
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white leading-tight max-w-3xl mb-6"
          >
            About HS Store
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/80 text-base md:text-lg max-w-xl leading-relaxed"
          >
            Tanzania's trusted destination for genuine technology — built on quality, honesty, and a passion for the products we sell.
          </motion.p>
        </div>
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
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={slideLeft}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
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
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={slideRight}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            whileHover={{ y: -12, scale: 1.02, transition: { type: 'spring', stiffness: 300, damping: 10 } }}
            className="relative rounded-3xl overflow-visible cursor-pointer"
          >
            <img src={aboutImage} alt="About HS Store" className="w-full h-full object-cover rounded-3xl" />
            {/* Floating speaker — top right */}
            <motion.img
              src={fourSpeakers}
              alt="Speaker"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-10 -right-8 w-40 drop-shadow-2xl"
              style={{ transform: 'rotate(18deg)' }}
            />
            {/* Floating JBL — bottom left */}
            <motion.img
              src={jblBoomBox}
              alt="JBL Speaker"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-10 -left-8 w-36 drop-shadow-2xl"
              style={{ transform: 'rotate(-15deg)' }}
            />
          </motion.div>
        </div>
      </section>

      {/* Product Carousel — Samsung & iPhone */}
      <section className="pt-0 md:pt-8 pb-0 md:pb-6 px-6 bg-gray-50">
        <div className="text-center mb-0 md:mb-10">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.8 }}
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            {'Experience Tomorrow Today'.split('').map((char, i) => (
              <motion.span
                key={i}
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                className={char === ' ' ? 'inline-block w-3' : (
                  'Experience Tomorrow Today'.indexOf('Tomorrow') <= i &&
                  i < 'Experience Tomorrow Today'.indexOf('Tomorrow') + 'Tomorrow'.length
                    ? 'text-brand-orange' : ''
                )}
              >
                {char === ' ' ? ' ' : char}
              </motion.span>
            ))}
          </motion.h2>
        </div>

        <div className="flex items-center justify-center gap-6 -mt-16 md:mt-0">
          {/* Left arrow */}
          <button
            onClick={() => paginate(-1)}
            className="flex-shrink-0 w-12 h-12 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-700 hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all duration-300"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Image frame */}
          <div className="relative w-full max-w-4xl h-[680px] md:h-[680px]">
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.div
                key={index}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.32, 0, 0.67, 0] }}
                className="absolute inset-0"
              >
                <img
                  src={slides[index].src}
                  alt={slides[index].label}
                  className="w-full h-full object-contain"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right arrow */}
          <button
            onClick={() => paginate(1)}
            className="flex-shrink-0 w-12 h-12 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-gray-700 hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all duration-300"
          >
            <ChevronRight size={24} />
          </button>
        </div>

      </section>

      {/* About3 & About4 videos */}
      <section className="hidden md:block pt-6 pb-8 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={slideLeft}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative rounded-3xl overflow-hidden shadow-lg"
          >
            <video src={about3} autoPlay muted loop playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/90 to-transparent pointer-events-none rounded-b-3xl" />
            <div className="absolute top-5 left-0 right-0 flex justify-center overflow-hidden pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="text-brand-orange text-lg md:text-xl font-bold tracking-wide drop-shadow-lg whitespace-nowrap"
                >
                  {wordsLeft[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={slideRight}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative rounded-3xl overflow-hidden shadow-lg"
          >
            <video src={about4} autoPlay muted loop playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/90 to-transparent pointer-events-none rounded-b-3xl" />
            <div className="absolute top-5 left-0 right-0 flex justify-center overflow-hidden pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="text-brand-orange text-lg md:text-xl font-bold tracking-wide drop-shadow-lg whitespace-nowrap"
                >
                  {wordsRight[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="pt-0 md:pt-8 pb-16 px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-brand-orange text-xs tracking-[0.4em] uppercase font-semibold mb-3">What Drives Us</p>
            <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: -40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
                whileHover={{ y: -12, scale: 1.03, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-brand-orange rounded-full flex items-center justify-center mb-5">
                  <v.icon size={22} className="text-white" />
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
