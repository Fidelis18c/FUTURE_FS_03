import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import productsData from '../data/products';

// Map color names to CSS colors for swatches
const COLOR_MAP = {
  'black': '#1a1a1a',
  'titanium black': '#1a1a1a',
  'obsidian': '#2C2C2C',
  'white': '#e8e8e8',
  'porcelain': '#F2EDE8',
  'silver': '#C0C0C0',
  'natural titanium': '#C2B280',
  'desert titanium': '#C4A882',
  'gold': '#D4AF37',
  'orange': '#FF6B00',
  'dark blue': '#1B3A6B',
  'blue': '#3B82F6',
  'lightblue': '#93C5FD',
  'light blue': '#93C5FD',
  'sage': '#8FAF8F',
  'hazel': '#A08060',
  'purple': '#9B59B6',
  'titanium violet': '#7B68EE',
  'violet': '#7B68EE',
  'pink': '#F472B6',
  'yellow': '#FBBF24',
  'titanium gray': '#8C8C8C',
  'gray': '#8C8C8C',
  'red': '#EF4444',
  'green': '#22C55E',
};

const getColorHex = (colorName) => {
  return COLOR_MAP[colorName.toLowerCase()] || '#cccccc';
};

const getPrice = (product, selectedColor, selectedStorage) => {
  if (product.variantData && selectedColor) {
    const key = Object.keys(product.variantData).find(
      k => k.toLowerCase() === selectedColor.toLowerCase()
    );
    if (key) {
      const prices = product.variantData[key].prices;
      if (selectedStorage && prices[selectedStorage]) {
        return prices[selectedStorage];
      }
      if (selectedStorage) {
        const storageKey = Object.keys(prices).find(
          sk => sk.toLowerCase() === selectedStorage.toLowerCase()
        );
        if (storageKey && prices[storageKey]) {
          return prices[storageKey];
        }
      }
      const firstKey = Object.keys(prices)[0];
      if (firstKey) return prices[firstKey];
    }
  }
  return product.price;
};

const getImage = (product, selectedColor) => {
  const staticMatch = productsData.find(
    (p) => p.slug === product.slug || p.name?.toLowerCase() === product.name?.toLowerCase()
  );

  const target = (product.variantData && Object.keys(product.variantData).length > 0) ? product : staticMatch;

  if (target && target.variantData && selectedColor) {
    if (target.variantData[selectedColor]?.image) {
      return target.variantData[selectedColor].image;
    }
    const key = Object.keys(target.variantData).find(
      k => k.toLowerCase() === selectedColor.toLowerCase()
    );
    if (key && target.variantData[key]?.image) {
      return target.variantData[key].image;
    }
  }

  if (product.image) return product.image;
  if (product.image_url) return product.image_url;
  if (staticMatch?.image) return staticMatch.image;

  return '/HSSTORELOGO.png';
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const hasColors = product.colors && product.colors.length > 0;
  const hasStorage = product.storage && product.storage.length > 0;

  const [selectedColor, setSelectedColor] = useState(hasColors ? product.colors[0] : null);
  const [selectedStorage, setSelectedStorage] = useState(hasStorage ? product.storage[0] : null);

  const displayPrice = getPrice(product, selectedColor, selectedStorage);
  const displayImage = getImage(product, selectedColor);

  const getTargetUrl = () => {
    const parts = [];
    if (selectedColor) parts.push(`color=${encodeURIComponent(selectedColor)}`);
    if (selectedStorage) parts.push(`storage=${encodeURIComponent(selectedStorage)}`);
    const query = parts.length > 0 ? `?${parts.join('&')}` : '';
    return `/product/${product.slug}${query}`;
  };

  const handleCardClick = () => {
    navigate(getTargetUrl());
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={handleCardClick}
      className="group overflow-hidden transition-all duration-300 rounded-2xl flex flex-col cursor-pointer"
      style={{ backgroundColor: '#f5f5f7' }}
    >
      {/* Image Area */}
      <div className="relative w-full overflow-hidden flex-shrink-0" style={{ height: '260px' }}>
        <img
          src={displayImage}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = '/HSSTORELOGO.png'; }}
        />
      </div>

      {/* Info Area */}
      <div className="px-3 md:px-5 pb-4 pt-3 flex flex-col gap-3">
        {/* Name */}
        <h3 className="text-sm font-semibold text-brand-dark group-hover:text-gray-600 transition-colors leading-relaxed tracking-wide">
          {product.name}
        </h3>

        {/* Color Swatches */}
        {hasColors && (
          <div className="flex items-center gap-1.5 flex-wrap" onClick={(e) => e.stopPropagation()}>
            {product.colors.map((color) => (
              <button
                key={color}
                title={color}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedColor(color);
                }}
                className="transition-transform hover:scale-110"
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: getColorHex(color),
                  border: selectedColor === color
                    ? '2px solid #000'
                    : '2px solid transparent',
                  outline: selectedColor === color ? '1.5px solid #000' : '1.5px solid #ccc',
                  outlineOffset: '1.5px',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        )}

        {/* Storage Pills */}
        {hasStorage && (
          <div className="flex items-center gap-1.5 flex-wrap" onClick={(e) => e.stopPropagation()}>
            {product.storage.map((size) => (
              <button
                key={size}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedStorage(size);
                }}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full border transition-all"
                style={{
                  backgroundColor: selectedStorage === size ? '#000' : 'transparent',
                  color: selectedStorage === size ? '#fff' : '#555',
                  borderColor: selectedStorage === size ? '#000' : '#ccc',
                }}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {/* Price + Buy */}
        <div className="flex items-center justify-between mt-1" onClick={(e) => e.stopPropagation()}>
          <span className="text-sm font-bold text-brand-dark">
            Tshs {Number(displayPrice || 0).toLocaleString()}
          </span>
          <button
            className="text-xs font-semibold text-white px-4 py-2 rounded-full transition-opacity hover:opacity-80 whitespace-nowrap"
            style={{ backgroundColor: '#000000' }}
            onClick={() => {
              navigate(getTargetUrl());
            }}
          >
            Buy
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
