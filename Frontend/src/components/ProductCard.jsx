import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.slug}`}>
      <motion.div
        whileHover={{ y: -5 }}
        className="group bg-white overflow-hidden transition-all duration-300 border border-transparent hover:border-gray-100"
      >
        {/* Top Area: Image */}
        <div className="relative aspect-square bg-white flex items-center justify-center p-3 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=Product'; }}
          />

        </div>

        {/* Bottom Area: Info */}
        <div className="p-6">
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">
            {product.brand}
          </div>
          <h3 className="text-base font-semibold text-brand-dark group-hover:text-gray-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-400 mt-1">{product.variant}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-bold text-brand-dark">
              Tshs {product.price.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500 border-b border-gray-300 group-hover:border-brand-dark transition-colors pb-0.5">
              View Details
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
