import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Import assets from the provided asset folder
import logo from '../assets/HSMOBILESTORElogo.png';
import iphoneHero2image from '../assets/hero/IphoneHeroB.png';
import iphoneHero3image from '../assets/hero/IphoneHeroC.png';
import iphoneHero4image from '../assets/hero/IphoneHeroD.png';
import samsungImage1 from '../assets/hero/SamsungHero2.png';
import iphoneHero5image from '../assets/hero/SamsungHero3.png';
import jblHeadphonesImage from '../assets/hero/JBL headphones.png';
import fourSpeakersImage from '../assets/hero/FourSpeakers.png';
import macBookProImage from '../assets/hero/MacBookPro.png';
import oraimoPodsImage from '../assets/hero/OraimoPods.png';
import pixelImage from '../assets/hero/PIxel.png';


const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    { id: 1, image: iphoneHero2image, path: '/phones/iphone', category: 'iPhone' },
    { id: 2, image: iphoneHero3image, path: '/phones/iphone', category: 'iPhone' },
    { id: 3, image: iphoneHero4image, path: '/phones/iphone', category: 'iPhone' },
    { id: 4, image: samsungImage1, path: '/phones/samsung', category: 'Samsung' },
    { id: 5, image: iphoneHero5image, path: '/phones/samsung', category: 'Samsung' },
    { id: 6, image: jblHeadphonesImage, path: '/audio/jbl', category: 'JBL' },
    { id: 7, image: fourSpeakersImage, path: '/audio/speakers', category: 'Speakers' },
    { id: 8, image: pixelImage, path: '/phones/pixel', category: 'Pixel' },
    { id: 9, image: oraimoPodsImage, path: '/audio/oraimo', category: 'Oraimo Pods' },
    { id: 10, image: macBookProImage, path: '/', category: 'MacBook' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative w-full h-[35vh] md:h-[60vh] bg-transparent overflow-visible flex flex-col justify-between pt-0 pb-0 px-6 md:px-12 lg:px-24">

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
                  scale: isActive ? 1.15 : 0.75,
                  opacity: isVisible ? (isActive ? 1 : 0.4) : 0,
                  zIndex: isActive ? 30 : 20 - absDistance,
                  y: isActive ? 0 : 60,
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
                    fetchPriority="high"
                    className={`w-72 md:w-96 lg:w-[40rem] h-auto object-contain transition-all duration-700 ${isActive ? 'drop-shadow-[0_40px_60px_rgba(0,0,0,0.3)]' : ''}`}
                    style={{ mixBlendMode: 'multiply' }}
                    draggable="false"
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>


    </section>
  );
};

export default Hero;
