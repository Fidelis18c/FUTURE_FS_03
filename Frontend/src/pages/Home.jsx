import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import productsData from '../data/products';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiChevronDown, FiChevronUp, FiTruck, FiLock, FiAward } from 'react-icons/fi';

import heroVideo from '../assets/Hero1/HSSTOREVideo.mp4';
import heroImg1 from '../assets/Hero1/HSSTOREHero1.jpeg';
import heroImg2 from '../assets/Hero1/HSSTOREHero2.jpeg';
import heroImg3 from '../assets/Hero1/HSSTOREHero3.jpeg';
import sidePhoneLeft from '../assets/hero/IphoneHeroB.png';
import sidePhoneRight from '../assets/hero/IphoneHeroC.png';
import featureVideo from '../assets/Hero2/The handcrafted wireless to daily mastery..mp4';

const INITIAL_PRODUCTS = 5;

const topHeroItems = [
  { type: 'video', src: heroVideo },
  { type: 'image', src: heroImg1 },
  { type: 'image', src: heroImg2 },
  { type: 'image', src: heroImg3 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};
const cardBounce = {
  whileHover: { y: -12, scale: 1.03 },
  transition: { type: 'spring', stiffness: 350, damping: 12 },
};

// Rich dark gradient — deep indigo shifting to warm dark amber; definitely not plain black
const HERO_BG = 'linear-gradient(155deg, #13111c 0%, #1f1509 52%, #13111c 100%)';

const Home = () => {
  const trendingProducts = [
    ...productsData.filter((p) => p.brand === 'iPhone' && p.trending).slice(0, 3),
    ...productsData.filter((p) => p.brand === 'JBL').slice(0, 3),
    ...productsData.filter((p) => p.brand === 'Samsung' && p.category === 'phones').slice(0, 2),
    ...productsData.filter((p) => p.category === 'audio' && p.brand !== 'JBL').slice(0, 2),
  ].slice(0, 10);
  const [showAll, setShowAll] = useState(false);
  const [slide, setSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  const visibleProducts = showAll
    ? trendingProducts
    : trendingProducts.slice(0, INITIAL_PRODUCTS);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setSlide((prev) => (prev + 1) % topHeroItems.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const goTo = (idx) => { setDirection(idx > slide ? 1 : -1); setSlide(idx); };
  const prev = () => { setDirection(-1); setSlide((s) => (s - 1 + topHeroItems.length) % topHeroItems.length); };
  const next = () => { setDirection(1); setSlide((s) => (s + 1) % topHeroItems.length); };

  const slideVariants = {
    enter: (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <div className="bg-white">

      {/* ══════════════════════════════════════════
          TOP HERO  —  3-column layout
          Left panel | Center slider | Right panel
      ══════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden flex"
        style={{ height: '88vh', minHeight: '500px', background: HERO_BG }}
      >

        {/* ── LEFT PANEL ── */}
        <div className="hidden md:flex w-[22%] flex-col justify-end relative overflow-hidden shrink-0">
          {/* Decorative phone image rising from bottom */}
          <img
            src={sidePhoneLeft}
            alt=""
            draggable="false"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 select-none pointer-events-none"
            style={{ height: '88%', width: 'auto', objectFit: 'contain', opacity: 0.55 }}
          />
          {/* Fade toward center so it blends seamlessly */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to right, #13111c 0%, transparent 70%)' }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to top, #1f1509 0%, transparent 45%)' }} />

          {/* Text + CTA */}
          <div className="relative z-10 px-7 pb-14">
            <p className="text-brand-orange text-[10px] tracking-[0.35em] uppercase font-semibold mb-3">
              New Arrivals · 2025
            </p>
            <h2 className="text-white text-2xl font-bold leading-snug mb-3">
              The Future of<br />Mobile Is Here.
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed mb-7">
              Top-tier smartphones.<br />Unbeatable prices.
            </p>
            <Link
              to="/phones"
              className="inline-flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-white bg-brand-orange px-6 py-3 hover:bg-orange-700 transition-colors rounded-full"
            >
              Buy Now &rarr;
            </Link>
          </div>
        </div>

        {/* ── CENTER SLIDER ── */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={slide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.55, ease: 'easeInOut' }}
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {topHeroItems[slide].type === 'video' ? (
                <video
                  src={topHeroItems[slide].src}
                  autoPlay muted loop playsInline
                  style={{ width: 'auto', height: '100%', maxWidth: '100%', objectFit: 'contain', display: 'block' }}
                />
              ) : (
                <img
                  src={topHeroItems[slide].src}
                  alt="HS Store"
                  draggable="false"
                  style={{ width: 'auto', height: '100%', maxWidth: '100%', objectFit: 'contain', display: 'block' }}
                />
              )}

              {/* Vignette — softens top & bottom edges */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: 'linear-gradient(to bottom, rgba(19,17,28,0.5) 0%, transparent 20%, transparent 75%, rgba(31,21,9,0.7) 100%)',
              }} />
            </motion.div>
          </AnimatePresence>

          {/* Arrows */}
          <button onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/35 text-white backdrop-blur-sm transition-all">
            <FiChevronLeft size={20} />
          </button>
          <button onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/35 text-white backdrop-blur-sm transition-all">
            <FiChevronRight size={20} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {topHeroItems.map((_, i) => (
              <button key={i} onClick={() => goTo(i)}
                className={`rounded-full h-1.5 transition-all duration-300 ${i === slide ? 'w-8 bg-brand-orange' : 'w-2 bg-white/50 hover:bg-white'}`}
              />
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="hidden md:flex w-[22%] flex-col justify-end relative overflow-hidden shrink-0">
          <img
            src={sidePhoneRight}
            alt=""
            draggable="false"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 select-none pointer-events-none"
            style={{ height: '88%', width: 'auto', objectFit: 'contain', opacity: 0.55 }}
          />
          {/* Fade toward center */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to left, #13111c 0%, transparent 70%)' }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to top, #1f1509 0%, transparent 45%)' }} />

          {/* Subtle quote / tagline */}
          <div className="relative z-10 px-7 pb-14 text-right">
            <p className="text-gray-500 text-[10px] tracking-[0.25em] uppercase mb-2">Explore the Collection</p>
            <p className="text-gray-300 text-sm font-light italic leading-relaxed">
              &ldquo;Experience<br />tomorrow,<br />today.&rdquo;
            </p>
          </div>
        </div>

      </section>
      {/* ── END TOP HERO ── */}



      {/* ══════════════════════════════════════════
          TRENDING PRODUCTS
      ══════════════════════════════════════════ */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            key={showAll ? 'all' : 'partial'}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {visibleProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          {trendingProducts.length > INITIAL_PRODUCTS && (
            <div className="flex justify-center mt-14">
              <button
                onClick={() => setShowAll((v) => !v)}
                className="inline-flex items-center gap-2 px-10 py-3 rounded-full border-2 border-black text-black text-xs font-semibold tracking-[0.3em] uppercase hover:bg-gray-100 transition-colors"
              >
                {showAll ? 'View Less' : 'View More'}
                {showAll ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
              </button>
            </div>
          )}
        </div>
      </section>


      {/* ══════════════════════════════════════════
          WHY CHOOSE US  —  3 info cards
          Icons from react-icons/fi (Feather Icons)
          No borders, no emoji, no photo
      ══════════════════════════════════════════ */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Fast Delivery */}
          <motion.div
            whileHover={cardBounce.whileHover}
            transition={cardBounce.transition}
            className="flex flex-col items-center text-center rounded-2xl p-8 bg-white shadow-md cursor-default"
          >
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-6">
              <FiTruck size={30} className="text-brand-orange" />
            </div>
            <h3 className="text-lg font-bold text-brand-dark mb-2">Fast Delivery</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Free shipping on all orders over Tshs&nbsp;1,000,000 across Tanzania.
            </p>
          </motion.div>

          {/* Secure Payments */}
          <motion.div
            whileHover={cardBounce.whileHover}
            transition={cardBounce.transition}
            className="flex flex-col items-center text-center rounded-2xl p-8 bg-white shadow-md cursor-default"
          >
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-6">
              <FiLock size={30} className="text-brand-orange" />
            </div>
            <h3 className="text-lg font-bold text-brand-dark mb-2">Secure Payments</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Mobile money and bank transfers accepted — fully encrypted and safe.
            </p>
          </motion.div>

          {/* Quality Guarantee */}
          <motion.div
            whileHover={cardBounce.whileHover}
            transition={cardBounce.transition}
            className="flex flex-col items-center text-center rounded-2xl p-8 bg-white shadow-md cursor-default"
          >
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-6">
              <FiAward size={30} className="text-brand-orange" />
            </div>
            <h3 className="text-lg font-bold text-brand-dark mb-2">Quality Guarantee</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Every product comes with a 1-year store warranty and genuine authenticity.
            </p>
          </motion.div>

        </div>
      </section>


      {/* ── PHONE SHOWCASE HERO (below products) ── */}
      <Hero />

      {/* ══════════════════════════════════════════
          FEATURE VIDEO SECTION
      ══════════════════════════════════════════ */}
      <section className="py-20 px-6 md:px-8 lg:px-12 bg-white">
        <div className="max-w-[90rem] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12 items-center">
          {/* Video (3/4 on large screens) */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden shadow-2xl">
            <video
              src={featureVideo}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Text Content (1/4 on large screens) */}
          <div className="lg:col-span-1 flex flex-col justify-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-dark leading-tight mb-4">
              The Feeling of Finding Exactly What You Need.
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              From the latest iPhones, Pixels, and Samsung flagships to high-performance laptops and premium headphones—we’ve got your upgrade waiting.
            </p>
            <ul className="text-sm text-gray-500 space-y-3 mb-8">
              <li><strong className="text-brand-dark">Phones:</strong> iPhone, Google Pixel, Samsung Galaxy.</li>
              <li><strong className="text-brand-dark">Gear:</strong> Premium Laptops & Immersive Headphones.</li>
              <li><strong className="text-brand-dark">Extras:</strong> Protective covers, fast chargers, and more</li>
            </ul>
            <Link
              to="/phones"
              className="inline-flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase text-white bg-black px-6 py-4 hover:bg-gray-800 transition-colors rounded-full text-center"
            >
              Explore the Collection &rarr;
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
