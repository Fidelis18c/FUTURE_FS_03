import React from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import productsData from '../data/products.json';
import { motion } from 'framer-motion';

const Home = () => {
  const trendingProducts = productsData.filter(p => p.trending);

  return (
    <div className="bg-white">
      <Hero />

      {/* Trending Products Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-dark tracking-tighter">
                Trending <span className="text-gray-400">Products</span>
              </h2>
              <p className="text-gray-500 mt-2">The most popular items this week.</p>
            </div>
            <button className="mt-4 md:mt-0 text-sm font-bold uppercase tracking-widest border-b-2 border-brand-dark pb-1 hover:text-gray-500 hover:border-gray-300 transition-all">
              View All
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <span className="text-2xl">🚚</span>
            </div>
            <h3 className="text-lg font-bold text-brand-dark mb-2">Fast Delivery</h3>
            <p className="text-gray-500 text-sm">Free shipping on all orders over $1000 in Tanzania.</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="text-lg font-bold text-brand-dark mb-2">Secure Payments</h3>
            <p className="text-gray-500 text-sm">Support for mobile money and bank transfers.</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <span className="text-2xl">💎</span>
            </div>
            <h3 className="text-lg font-bold text-brand-dark mb-2">Quality Guarantee</h3>
            <p className="text-gray-500 text-sm">All products come with a 1-year store warranty.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
