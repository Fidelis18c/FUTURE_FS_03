import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import productsData from '../data/products';
import { FiFilter, FiChevronDown } from 'react-icons/fi';

const CategoryPage = () => {
  const { category, brand } = useParams();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 2000]);

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
        // In this case 'category' might actually be the brand (iphone, samsung, etc.)
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
    <div className="bg-white min-h-screen py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
          <h1 className="text-4xl font-bold text-brand-dark tracking-tighter capitalize">
            {category || location.pathname.split('/')[1] || 'All Products'} <span className="text-gray-300 font-light">Collection</span>
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

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filter Panel */}
          <aside className="w-full lg:w-64 space-y-10 hidden lg:block">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-brand-dark mb-6">Price Range</h3>
              <input 
                type="range" 
                min="0" 
                max="2000" 
                step="50"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full accent-brand-dark"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>$0</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-brand-dark mb-6">Brand</h3>
              <div className="space-y-3">
                {['iPhone', 'Samsung', 'Pixel', 'Oraimo', 'JBL'].map((b) => (
                  <label key={b} className="flex items-center text-sm text-gray-600 cursor-pointer hover:text-brand-dark">
                    <input type="checkbox" className="mr-3 border-gray-300 rounded-sm text-brand-dark focus:ring-brand-dark" />
                    {b}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-brand-dark mb-6">Storage</h3>
              <div className="space-y-3">
                {['128GB', '256GB', '512GB', '1TB'].map((s) => (
                  <label key={s} className="flex items-center text-sm text-gray-600 cursor-pointer hover:text-brand-dark">
                    <input type="checkbox" className="mr-3 border-gray-300 rounded-sm text-brand-dark focus:ring-brand-dark" />
                    {s}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
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
      </div>
    </div>
  );
};

export default CategoryPage;
