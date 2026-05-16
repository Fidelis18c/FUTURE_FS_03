import React from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import productsData from '../data/products';
import { motion } from 'framer-motion';

const Home = () => {
  const trendingProducts = productsData.filter(p => p.trending).slice(0, 12);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="bg-white">
      <Hero />

      {/* Trending Products Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">


          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {trendingProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
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
