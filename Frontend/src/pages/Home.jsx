import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import api from '../api';
import productsData from '../data/products'; // fallback
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Truck, Lock, Award } from 'lucide-react';

import heroVideo from '../assets/Hero1/HSSTOREVideo.mp4';
import heroImg1 from '../assets/Hero1/HSSTOREHero1.jpeg';
import heroImg2 from '../assets/Hero1/HSSTOREHero2.jpeg';
import heroImg3 from '../assets/Hero1/HSSTOREHero3.jpeg';
import sidePhoneLeft from '../assets/hero/IphoneHeroB.png';
import sidePhoneRight from '../assets/hero/IphoneHeroC.png';
import featureVideo from '../assets/Hero2/The handcrafted wireless to daily mastery..mp4';
import aboutUsVideo from '../assets/AboutImage/About1.mp4';
import contactUsVideo from '../assets/AboutImage/About2.mp4';
import supportCenterVideo from '../assets/AboutImage/About5.mp4';
import shippingVideo from '../assets/AboutImage/About6.mp4';

const INITIAL_PRODUCTS = 8;
const STEP_SIZE = 8;

const exploreCards = [
  { title: 'About Us', video: aboutUsVideo },
  { title: 'Contact Us', video: contactUsVideo },
  { title: 'Shipping', video: shippingVideo },
  { title: 'Support Center', video: supportCenterVideo },
];

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
const cardFromLeft  = { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } };
const cardFromRight = { hidden: { opacity: 0, x: 60 },  visible: { opacity: 1, x: 0 } };
const cardAngleLeft  = { hidden: { opacity: 0, y: 60, x: -40, rotate: -10 }, visible: { opacity: 1, y: 0, x: 0, rotate: 0 } };
const cardAngleRight = { hidden: { opacity: 0, y: 60, x: 40,  rotate: 10  }, visible: { opacity: 1, y: 0, x: 0, rotate: 0 } };
const cardBounce = {
  whileHover: { y: -12, scale: 1.03 },
  transition: { type: 'spring', stiffness: 350, damping: 12 },
};

// Rich dark gradient — deep indigo shifting to warm dark amber; definitely not plain black
const HERO_BG = 'linear-gradient(155deg, #13111c 0%, #1f1509 52%, #13111c 100%)';

const Home = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(INITIAL_PRODUCTS);
  const [slide, setSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [exploreHidden, setExploreHidden] = useState(false);
  const lastScrollY = useRef(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const diff = latest - lastScrollY.current;
    if (Math.abs(diff) > 4) {
      setExploreHidden(diff < 0);
      lastScrollY.current = latest;
    }
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products', { params: { limit: 100 } });
        if (data && data.length > 0) {
          setAllProducts(data);
        } else {
          setAllProducts(productsData);
        }
      } catch {
        setAllProducts(productsData);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const trendingProducts = allProducts.length > 0 ? allProducts : productsData.slice(0, 24);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const visibleProducts = trendingProducts.slice(0, visibleCount);

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
        className="relative overflow-hidden flex -mt-16"
        style={{ height: 'calc(88vh + 4rem)', minHeight: 'calc(500px + 4rem)', background: HERO_BG }}
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
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <img
                  src={topHeroItems[slide].src}
                  alt="HS Store"
                  draggable="false"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
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
            <ChevronLeft size={20} />
          </button>
          <button onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/35 text-white backdrop-blur-sm transition-all">
            <ChevronRight size={20} />
          </button>

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
            key={visibleCount}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {visibleProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={
                  isMobile
                    ? (i % 2 === 0 ? cardAngleLeft : cardAngleRight)
                    : (i % 2 === 0 ? cardFromLeft  : cardFromRight)
                }
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: (i % 4) * 0.07 }}
                className={i >= 3 ? 'hidden sm:block' : ''}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          {/* More / Less toggle */}
          {trendingProducts.length > INITIAL_PRODUCTS && (
            <div className="flex justify-center mt-14 gap-12">
              {visibleCount < trendingProducts.length && (
                <button
                  onClick={() => setVisibleCount((c) => Math.min(c + STEP_SIZE, trendingProducts.length))}
                  className="group flex flex-col items-center gap-2.5"
                >
                  <span className="w-14 h-14 rounded-full navbar-glass shadow-lg flex flex-col items-center justify-center overflow-hidden group-hover:bg-white/60 transition-colors">
                    <motion.span
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <ChevronDown size={14} className="text-black -mb-2.5" />
                    </motion.span>
                    <motion.span
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                    >
                      <ChevronDown size={14} className="text-black" />
                    </motion.span>
                  </span>
                  <span className="text-[9px] font-semibold tracking-[0.25em] uppercase text-black">More</span>
                </button>
              )}
              {visibleCount > INITIAL_PRODUCTS && (
                <button
                  onClick={() => setVisibleCount(INITIAL_PRODUCTS)}
                  className="group flex flex-col items-center gap-2.5"
                >
                  <span className="w-14 h-14 rounded-full navbar-glass shadow-lg flex flex-col items-center justify-center overflow-hidden group-hover:bg-white/60 transition-colors">
                    <motion.span
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <ChevronUp size={14} className="text-black" />
                    </motion.span>
                    <motion.span
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                    >
                      <ChevronUp size={14} className="text-black -mt-2.5" />
                    </motion.span>
                  </span>
                  <span className="text-[9px] font-semibold tracking-[0.25em] uppercase text-black">Less</span>
                </button>
              )}
            </div>
          )}
        </div>
      </section>


      {/* ══════════════════════════════════════════
          WHY CHOOSE US  —  3 info cards
          Icons from react-icons/fi (Feather Icons)
          No borders, no emoji, no photo
      ══════════════════════════════════════════ */}
      <section className="pt-4 md:pt-8 pb-8 md:pb-12 px-6 md:px-12 lg:px-24 bg-brand-orange">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Fast Delivery */}
          <motion.div
            whileHover={cardBounce.whileHover}
            transition={cardBounce.transition}
            className="flex flex-col items-center text-center rounded-2xl p-8 bg-white cursor-default"
          >
            <Truck size={32} className="text-brand-dark mb-6" />
            <h3 className="text-lg font-bold text-brand-dark mb-2">Fast Delivery</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Free shipping on all orders over Tshs&nbsp;1,000,000 across Tanzania.
            </p>
          </motion.div>

          {/* Secure Payments */}
          <motion.div
            whileHover={cardBounce.whileHover}
            transition={cardBounce.transition}
            className="flex flex-col items-center text-center rounded-2xl p-8 bg-white cursor-default"
          >
            <Lock size={32} className="text-brand-dark mb-6" />
            <h3 className="text-lg font-bold text-brand-dark mb-2">Secure Payments</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Mobile money and bank transfers accepted — fully encrypted and safe.
            </p>
          </motion.div>

          {/* Quality Guarantee */}
          <motion.div
            whileHover={cardBounce.whileHover}
            transition={cardBounce.transition}
            className="flex flex-col items-center text-center rounded-2xl p-8 bg-white cursor-default"
          >
            <Award size={32} className="text-brand-dark mb-6" />
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
      <section className="pt-44 pb-20 md:pt-56 md:pb-20 px-6 md:px-8 lg:px-12 bg-white">
        <div className="max-w-[90rem] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12 items-center">
          {/* Video (3/4 on large screens) */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden shadow-2xl">
            <video
              src={featureVideo}
              autoPlay
              muted
              loop
              playsInline
              className="w-full min-h-[280px] h-auto object-cover"
            />
          </div>

          {/* Text Content (1/4 on large screens) */}
          <div className="lg:col-span-1 flex flex-col justify-center px-6 lg:px-0">
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

      {/* ══════════════════════════════════════════
          EXPLORE HS STORE — 4 portrait video cards
      ══════════════════════════════════════════ */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark leading-snug max-w-2xl mx-auto">
              Every device on HS Store carries a{' '}
              <span
                className="italic font-normal text-brand-orange"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                story worth discovering
              </span>
              .
            </h2>
          </div>

          <motion.div
            animate={{ y: exploreHidden ? -60 : 0, opacity: exploreHidden ? 0 : 1 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {exploreCards.map((card) => (
              <div
                key={card.title}
                className="relative rounded-2xl overflow-hidden shadow-xl aspect-[9/16]"
              >
                <video
                  src={card.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;
