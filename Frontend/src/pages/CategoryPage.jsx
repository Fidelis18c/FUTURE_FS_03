import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import productsData from '../data/products';
import { FiFilter } from 'react-icons/fi';

const CategoryPage = () => {
  const { category, brand } = useParams();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    let filtered = productsData;

    // Filter by main category if exists in URL (e.g., /phones, /audio)
    const mainCategory = location.pathname.split('/')[1];
    if (mainCategory && mainCategory !== 'phones' && mainCategory !== 'audio' && mainCategory !== 'chargers' && mainCategory !== 'covers') {
        // Fallback for general paths
    } else if (mainCategory) {
        filtered = filtered.filter(p => p.category === mainCategory);
    }

    // Filter by brand or subcategory (e.g., /phones/iphone)
    if (category) {
        filtered = filtered.filter(p => p.brand.toLowerCase() === category.toLowerCase());
    }

    setProducts(filtered);
  }, [category, location.pathname]);

  const handleSort = (e) => {
    const value = e.target.value;
    setSortBy(value);
    const sorted = [...products];
    if (value === 'price-low') sorted.sort((a, b) => a.price - b.price);
    if (value === 'price-high') sorted.sort((a, b) => b.price - a.price);
    setProducts(sorted);
  };

  return (
    <div className="bg-white min-h-screen py-12 px-3 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
          <h1 className="text-4xl font-bold text-brand-dark tracking-tighter capitalize">
            {category || location.pathname.split('/')[1] || 'All Products'}
          </h1>

          <div className="mt-6 md:mt-0 flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <FiFilter className="mr-2" />
              <span>Sort by:</span>
            </div>
            <select
              value={sortBy}
              onChange={handleSort}
              className="bg-transparent border-none text-sm font-bold text-brand-dark focus:ring-0 cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid — 4 columns */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 md:gap-x-6 gap-y-6 md:gap-y-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
