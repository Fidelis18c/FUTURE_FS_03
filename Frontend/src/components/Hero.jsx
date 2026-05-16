import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Import assets from the provided asset folder
import logo from '../assets/HSSTORELOGO.png';
import iphoneHero2image from '../assets/hero/IphoneHeroB.png';
import iphoneHero3image from '../assets/hero/IphoneHeroC.png';
import iphoneHero4image from '../assets/hero/IphoneHeroD.png';
import samsungImage1 from '../assets/hero/SamsungHero2.png';
import iphoneHero5image from '../assets/hero/SamsungHero3.png';


const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    { id: 1, image: iphoneHero2image, path: '/phones/iphone', category: 'iPhone' },
    { id: 2, image: iphoneHero3image, path: '/phones/iphone', category: 'iPhone' },
    { id: 3, image: iphoneHero4image, path: '/phones/iphone', category: 'iPhone' },
    { id: 4, image: samsungImage1, path: '/phones/samsung', category: 'Samsung' },
    { id: 5, image: iphoneHero5image, path: '/phones/samsung', category: 'Samsung' },

  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative w-full h-[75vh] min-h-125 bg-brand-gray overflow-hidden flex flex-col justify-between pt-8 pb-12 px-6 md:px-12 lg:px-24">

      {/* SHOWROOM AREA */}
      <div className="relative flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-7xl h-full flex items-center justify-center">
          {slides.map((slide, index) => {
            const total = slides.length;
            let distance = index - activeIndex;

            // Proper circular wrapping logic
            if (distance > total / 2) distance -= total;
            if (distance < -total / 2) distance += total;

            const isActive = index === activeIndex;
            const absDistance = Math.abs(distance);

            // We keep everything mounted but hide the ones that are far away
            // This prevents "stuttering" caused by mounting/unmounting
            const isVisible = absDistance <= 2;

            return (
              <motion.div
                key={slide.id}
                initial={false}
                animate={{
                  x: distance * (window.innerWidth < 768 ? 140 : 400),
                  scale: isActive ? 1.3 : 0.8,
                  opacity: isVisible ? (isActive ? 1 : 0.4) : 0,
                  zIndex: isActive ? 30 : 20 - absDistance,
                  y: isActive ? 50 : 100, // Move down to make arm flush with bottom
                  pointerEvents: isVisible ? 'auto' : 'none',
                }}
                transition={{
                  type: "spring",
                  stiffness: 80,
                  damping: 20,
                  mass: 0.8,
                }}
                className="absolute bottom-0 cursor-pointer select-none"
                onClick={() => setActiveIndex(index)}
              >
                <Link to={slide.path} className="block relative">
                  <img
                    src={slide.image}
                    alt={slide.category}
                    loading="eager"
                    fetchpriority="high"
                    className={`w-64 md:w-96 lg:w-[40rem] h-auto object-contain transition-all duration-700 ${isActive ? 'drop-shadow-[0_35px_50px_rgba(0,0,0,0.25)]' : ''}`}
                    style={{ 
                      mixBlendMode: 'multiply' // Keep for non-transparent backgrounds if needed
                    }}
                    draggable="false"
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CTA AREA */}
      <div className="relative z-50 flex justify-end items-end w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            to="/phones"
            className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-black bg-white border-2 border-black overflow-hidden transition-all duration-500 ease-out"
          >
            <span className="absolute inset-0 w-0 h-full bg-brand-orange transition-all duration-500 ease-out group-hover:w-full"></span>
            <span className="relative text-xs tracking-[0.4em] uppercase transition-colors duration-500 group-hover:text-white">
              Get Your Phone
            </span>
          </Link>
        </motion.div>
      </div>

      {/* Subtle Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`transition-all duration-500 rounded-full h-1 ${i === activeIndex
                ? 'w-8 bg-brand-orange'
                : 'w-2 bg-gray-200 hover:bg-gray-400'
              }`}
          />
        ))}
      </div>

    </section>
  );
};

export default Hero;
