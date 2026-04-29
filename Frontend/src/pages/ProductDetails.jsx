import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import productsData from '../data/products.json';
import { useCart } from '../context/CartContext';
import { FiMinus, FiPlus, FiShoppingCart, FiShield, FiTruck, FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedStorage, setSelectedStorage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const foundProduct = productsData.find((p) => p.slug === slug);
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedStorage(foundProduct.storage?.[0] || '');
      setSelectedColor(foundProduct.colors?.[0] || '');
      
      // Get related products (same category)
      const related = productsData
        .filter((p) => p.category === foundProduct.category && p.id !== foundProduct.id)
        .slice(0, 4);
      setRelatedProducts(related);
    }
    window.scrollTo(0, 0);
  }, [slug]);

  if (!product) return <div className="py-20 text-center">Loading...</div>;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square bg-brand-gray flex items-center justify-center p-12 overflow-hidden"
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain mix-blend-multiply"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/600x600?text=Product'; }}
              />
            </motion.div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-brand-gray cursor-pointer border border-transparent hover:border-brand-dark transition-all opacity-60 hover:opacity-100"></div>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">{product.brand}</div>
            <h1 className="text-4xl md:text-5xl font-bold text-brand-dark tracking-tighter mb-4">{product.name}</h1>
            <div className="text-3xl font-bold text-brand-dark mb-8">${product.price.toLocaleString()}</div>
            
            <p className="text-gray-500 leading-relaxed mb-10">
              {product.description}
            </p>

            {/* Selectors */}
            <div className="space-y-8 mb-10">
              {product.storage.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-brand-dark mb-4">Storage</h4>
                  <div className="flex flex-wrap gap-3">
                    {product.storage.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedStorage(s)}
                        className={`px-6 py-2 text-sm border font-medium transition-all ${selectedStorage === s ? 'border-brand-dark bg-brand-dark text-white' : 'border-gray-200 text-gray-600 hover:border-brand-dark'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.colors.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-brand-dark mb-4">Color</h4>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-6 py-2 text-sm border font-medium transition-all ${selectedColor === c ? 'border-brand-dark bg-brand-dark text-white' : 'border-gray-200 text-gray-600 hover:border-brand-dark'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-brand-dark mb-4">Quantity</h4>
                <div className="flex items-center border border-gray-200 w-fit">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-50"><FiMinus /></button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-gray-50"><FiPlus /></button>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              <button
                onClick={() => addToCart(product, quantity, selectedStorage, selectedColor)}
                className="flex items-center justify-center bg-brand-dark text-white py-4 px-8 font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition-all"
              >
                <FiShoppingCart className="mr-2" /> Add To Cart
              </button>
              <button className="flex items-center justify-center border border-brand-dark text-brand-dark py-4 px-8 font-bold uppercase tracking-widest text-sm hover:bg-gray-50 transition-all">
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-gray-100">
              <div className="flex items-center text-xs text-gray-500 font-medium">
                <FiTruck className="text-brand-dark mr-3" size={18} /> Free Delivery
              </div>
              <div className="flex items-center text-xs text-gray-500 font-medium">
                <FiShield className="text-brand-dark mr-3" size={18} /> 1 Year Warranty
              </div>
              <div className="flex items-center text-xs text-gray-500 font-medium">
                <FiRefreshCw className="text-brand-dark mr-3" size={18} /> Easy Returns
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-32">
          <h2 className="text-2xl font-bold text-brand-dark mb-10 border-b border-gray-100 pb-4">Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-6">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="flex justify-between py-4 border-b border-gray-50">
                <span className="text-sm text-gray-400 uppercase tracking-widest">{key}</span>
                <span className="text-sm font-bold text-brand-dark">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32">
            <h2 className="text-2xl font-bold text-brand-dark mb-10">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
