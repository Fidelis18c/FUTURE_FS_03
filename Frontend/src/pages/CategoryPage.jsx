import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import productsData from '../data/products'; // fallback
import api from '../api';
import { FiChevronDown } from 'react-icons/fi';
import { sortIphonesFirst } from '../utils/sortProducts';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

const CategoryPage = () => {
  const { category } = useParams();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [sortOpen, setSortOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    // The real DB category (phones/audio/tablets/...) always comes from the
    // path segment; :category from the route params is actually a brand-ish
    // sub-filter (iphone/samsung/ipad/...) — there's no such column, so it's
    // matched against the product name on the backend.
    const mainCategory = location.pathname.split('/')[1];
    // Samsung tablets are named "TAB A11 4G" etc in the actual product data
    // (matching the static source exactly) — "Samsung" never appears in the
    // name itself, so that nav link needs its own match term.
    const brandTerm = mainCategory === 'tablets' && category === 'samsung' ? 'tab' : category;
    try {
      const params = { limit: 100 };
      if (mainCategory) params.category = mainCategory;
      if (brandTerm) params.brand = brandTerm;

      const { data } = await api.get('/products', { params });
      if (data && data.length > 0) {
        setProducts(sortIphonesFirst(data));
      } else {
        // Fallback to static data filtered by path
        let filtered = productsData;
        if (mainCategory) filtered = filtered.filter((p) => p.category === mainCategory);
        if (brandTerm) filtered = filtered.filter((p) => p.name.toLowerCase().includes(brandTerm.toLowerCase()));
        setProducts(sortIphonesFirst(filtered));
      }
    } catch {
      // Fallback to static data
      let filtered = productsData;
      if (mainCategory) filtered = filtered.filter((p) => p.category === mainCategory);
      if (brandTerm) filtered = filtered.filter((p) => p.name.toLowerCase().includes(brandTerm.toLowerCase()));
      setProducts(sortIphonesFirst(filtered));
    } finally {
      setLoading(false);
    }
  }, [category, location.pathname]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSort = (value) => {
    setSortBy(value);
    const sorted = [...products];
    if (value === 'price-low') sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (value === 'price-high') sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    setProducts(sorted);
  };

  return (
    <div className="bg-white min-h-screen py-12 px-3 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
          <h1 className="display-md text-brand-dark capitalize">
            {category || location.pathname.split('/')[1] || 'All Products'}
          </h1>

          {/* Custom sort dropdown — a native <select>'s open list can't be
              styled, so the menu is our own. self-end keeps it on the right
              on mobile, where the header stacks vertically. */}
          <div className="relative mt-6 md:mt-0 w-fit self-end md:self-auto">
            <button
              type="button"
              onClick={() => setSortOpen((o) => !o)}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-full pl-5 pr-4 py-2.5 button-text text-brand-dark cursor-pointer hover:border-brand-dark transition-colors shadow-sm"
            >
              {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
              <FiChevronDown
                size={14}
                className={`text-gray-500 transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {sortOpen && (
              <>
                {/* click-away backdrop */}
                <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                <div className="absolute right-0 top-full mt-2 z-20 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden py-2">
                  {SORT_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => { handleSort(o.value); setSortOpen(false); }}
                      className={`w-full text-left px-5 py-2.5 nav-link transition-colors ${
                        sortBy === o.value
                          ? 'text-brand-orange bg-orange-50 font-semibold'
                          : 'text-black hover:bg-gray-50'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 md:gap-x-6 gap-y-6 md:gap-y-10">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 md:gap-x-6 gap-y-6 md:gap-y-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-black">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
