import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(2); // Start with center item

  const phones = [
    { id: 1, name: 'iPhone 16 Pro', image: '/src/assets/hero/iphone16pro.png', price: 'From $999', path: '/phones/iphone' },
    { id: 2, name: 'Samsung S24 Ultra', image: '/src/assets/hero/samsungs24.png', price: 'From $1199', path: '/phones/samsung' },
    { id: 3, name: 'Pixel 9 Pro', image: '/src/assets/hero/pixel9pro.png', price: 'From $899', path: '/phones/pixel' },
    { id: 4, name: 'OnePlus 12', image: '/src/assets/hero/oneplus12.png', price: 'From $799', path: '/phones/android' },
    { id: 5, name: 'iPhone 17', image: '/src/assets/hero/iphone17.png', price: 'From $1099', path: '/phones/iphone' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % phones.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [phones.length]);

  return (
    <section className="relative w-full min-h-[700px] bg-white overflow-hidden flex flex-col justify-center py-20">
      {/* Background Text Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.03] text-[20vw] font-bold whitespace-nowrap z-0">
        PREMIUM DEVICES
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full z-10">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-brand-dark tracking-tighter"
          >
            The Future <span className="text-gray-400">is Here</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 mt-4 max-w-2xl mx-auto"
          >
            Discover our collection of the world's most advanced smartphones. 
            Crafted for performance, designed for excellence.
          </motion.p>
        </div>

        {/* 3D Carousel Section */}
        <div className="relative h-[450px] flex items-center justify-center perspective-1000">
          <div className="flex items-center justify-center gap-4 md:gap-12">
            {phones.map((phone, index) => {
              // Calculate distance from active index
              const distance = index - activeIndex;
              const absDistance = Math.abs(distance);
              
              // Only show items within a certain range if needed, but here we have 5
              const isActive = index === activeIndex;
              
              return (
                <motion.div
                  key={phone.id}
                  className="relative cursor-pointer"
                  initial={false}
                  animate={{
                    scale: isActive ? 1.2 : 0.85 - (absDistance * 0.1),
                    x: distance * 50, // Slight spread
                    opacity: 1 - (absDistance * 0.3),
                    zIndex: 10 - absDistance,
                    filter: isActive ? 'blur(0px)' : `blur(${absDistance * 2}px)`,
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 30 
                  }}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className="relative group">
                    {/* Phone Image */}
                    <motion.img
                      src={phone.image}
                      alt={phone.name}
                      className="w-48 md:w-64 lg:w-72 h-auto drop-shadow-2xl"
                      style={{ 
                        filter: 'drop-shadow(0 25px 25px rgba(0,0,0,0.15))' 
                      }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/300x600?text=Phone'; }}
                    />

                    {/* Info Overlay (Visible when active or hover) */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-max text-center"
                        >
                          <h3 className="text-xl font-bold text-brand-dark">{phone.name}</h3>
                          <p className="text-gray-500 font-medium">{phone.price}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              to="/phones"
              className="inline-block px-12 py-5 bg-brand-dark text-white text-sm font-bold tracking-[0.2em] uppercase hover:bg-black transition-all hover:scale-105 shadow-xl"
            >
              Explore Collection
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center mt-12 gap-3">
        {phones.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === activeIndex ? 'w-8 bg-brand-dark' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;

