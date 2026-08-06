import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import productsData from '../data/products'; // fallback
import api from '../api';
import { useCart } from '../context/CartContext';
import { Minus, Plus, ShoppingCart, Shield, Truck, RefreshCw } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { openWhatsAppOrder } from '../utils/whatsapp';

const ProductDetails = () => {
  const { slug } = useParams();
  const location = useLocation();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${slug}`);
        if (data) {
          setProduct(data);
          // Set default variant (first one)
          if (data.variants && data.variants.length > 0) {
            setSelectedVariant(data.variants[0]);
            setSelectedColor(data.variants[0].attributes?.color || '');
            setSelectedStorage(data.variants[0].attributes?.storage || '');
          }
          // Fetch related products
          const rel = await api.get('/products', { params: { category: data.category_name, limit: 5 } });
          setRelatedProducts((rel.data || []).filter((p) => p.id !== data.id).slice(0, 4));
        }
      } catch {
        // Fallback to static data
        const foundProduct = productsData.find((p) => p.slug === slug);
        if (foundProduct) {
          setProduct(foundProduct);
          const params = new URLSearchParams(location.search);
          setSelectedColor(
            params.get('color') ||
            foundProduct.colors?.[0] || ''
          );
          setSelectedStorage(
            params.get('storage') ||
            foundProduct.storage?.[0] || ''
          );
          const related = productsData
            .filter((p) => p.category === foundProduct.category && p.id !== foundProduct.id)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
    window.scrollTo(0, 0);
  }, [slug, location.search]);

  // When user picks a color or storage, find matching variant
  const handleVariantSelect = (attr, value) => {
    if (!product?.variants) return;
    if (attr === 'color') setSelectedColor(value);
    if (attr === 'storage') setSelectedStorage(value);
    const newColor = attr === 'color' ? value : selectedColor;
    const newStorage = attr === 'storage' ? value : selectedStorage;
    const match = product.variants.find(
      (v) =>
        (v.attributes?.color === newColor || !v.attributes?.color) &&
        (v.attributes?.storage === newStorage || !v.attributes?.storage)
    );
    if (match) setSelectedVariant(match);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="h-[500px] bg-gray-100 rounded-xl animate-pulse" />
          <div className="space-y-6">
            <div className="h-8 bg-gray-100 rounded animate-pulse w-2/3" />
            <div className="h-12 bg-gray-100 rounded animate-pulse" />
            <div className="h-6 bg-gray-100 rounded animate-pulse w-1/3" />
            <div className="h-24 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="py-20 text-center text-gray-500">Product not found.</div>;

  // Resolve static match for images/data fallback
  const staticMatch = productsData.find(
    (p) => p.slug === product.slug || p.name?.toLowerCase() === product.name?.toLowerCase()
  );

  // Resolve current price and image
  const currentPrice = selectedVariant?.price
    ? parseFloat(selectedVariant.price)
    : product.variantData?.[selectedColor]?.prices?.[selectedStorage] || staticMatch?.price || product.price || 0;

  const currentImage =
    product.variantData?.[selectedColor]?.image ||
    product.image ||
    staticMatch?.variantData?.[selectedColor]?.image ||
    staticMatch?.image ||
    '/HSMOBILESTORElogo.png';

  // Derive colors and storages from variants if available
  const variantColors = product.variants
    ? [...new Set(product.variants.map((v) => v.attributes?.color).filter(Boolean))]
    : product.colors || staticMatch?.colors || [];
  const variantStorages = product.variants
    ? [...new Set(product.variants.map((v) => v.attributes?.storage).filter(Boolean))]
    : product.storage || staticMatch?.storage || [];

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 pt-6 pb-12 md:py-12">
        {/* Mobile-only: name above image */}
        <div className="block lg:hidden mb-1">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{product.brand || product.category_name}</div>
          <h1 className="text-2xl font-bold text-brand-dark tracking-tighter">{product.name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-16">
          {/* Left: Image */}
          <div className="space-y-4 w-full mx-auto lg:mx-0">
            <div className="relative overflow-hidden h-[340px] md:h-[620px]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  src={currentImage}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="w-full h-full object-contain"
                  onError={(e) => { e.target.src = '/HSMOBILESTORElogo.png'; }}
                />
              </AnimatePresence>
            </div>
            {product.variantData && (
              <div className="grid grid-cols-4 gap-3">
                {Object.entries(product.variantData).map(([color, data]) => (
                  <div
                    key={color}
                    onClick={() => handleVariantSelect('color', color)}
                    className={`cursor-pointer transition-all overflow-hidden flex items-center justify-center ${selectedColor === color ? 'opacity-100 scale-105' : 'opacity-50 hover:opacity-80'}`}
                    style={{ height: '90px' }}
                  >
                    <img src={data.image} alt={color} className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <div className="hidden lg:block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
              {product.brand || product.category_name}
            </div>
            <h1 className="hidden lg:block text-4xl md:text-5xl font-bold text-brand-dark tracking-tighter mb-4">
              {product.name}
            </h1>
            <div className="text-xl md:text-3xl font-bold text-brand-dark mb-2 md:mb-8">
              Tshs {Number(currentPrice || 0).toLocaleString()}
            </div>

            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-3 md:mb-10">
              {product.description}
            </p>

            {/* Variant Selectors */}
            <div className="space-y-3 md:space-y-8 mb-3 md:mb-10">
              {variantStorages.length > 0 && (
                <div>
                  <h4 className="text-xs md:text-sm font-bold uppercase tracking-widest text-brand-dark mb-2 md:mb-4">Storage</h4>
                  <div className="flex flex-wrap gap-2">
                    {variantStorages.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleVariantSelect('storage', s)}
                        className={`px-3 py-1 md:px-6 md:py-2 text-xs md:text-sm border font-medium rounded-full transition-all ${selectedStorage === s ? 'border-brand-dark bg-brand-dark text-white' : 'border-gray-200 text-gray-600 hover:border-brand-dark'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {variantColors.length > 0 && (
                <div>
                  <h4 className="text-xs md:text-sm font-bold uppercase tracking-widest text-brand-dark mb-2 md:mb-4">Color</h4>
                  <div className="flex flex-wrap gap-2">
                    {variantColors.map((c) => (
                      <button
                        key={c}
                        onClick={() => handleVariantSelect('color', c)}
                        className={`px-3 py-1 md:px-6 md:py-2 text-xs md:text-sm border font-medium rounded-full transition-all ${selectedColor === c ? 'border-brand-dark bg-brand-dark text-white' : 'border-gray-200 text-gray-600 hover:border-brand-dark'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs md:text-sm font-bold uppercase tracking-widest text-brand-dark mb-2 md:mb-4">Quantity</h4>
                <div className="flex items-center border border-gray-200 w-fit">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 md:p-3 hover:bg-gray-50"><Minus size={16} /></button>
                  <span className="w-10 md:w-12 text-center text-sm font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 md:p-3 hover:bg-gray-50"><Plus size={16} /></button>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6 md:mb-12">
              <button
                onClick={() => addToCart(
                  { ...product, price: currentPrice, variant_id: selectedVariant?.id },
                  quantity,
                  selectedStorage,
                  selectedColor
                )}
                className="flex items-center justify-center rounded-full bg-brand-dark text-white py-3 md:py-4 px-4 md:px-8 font-bold uppercase tracking-wide md:tracking-widest text-xs md:text-sm hover:bg-gray-800 transition-all"
              >
                <ShoppingCart className="mr-1 md:mr-2" size={15} /> Add To Cart
              </button>
              <button
                onClick={() => openWhatsAppOrder([{
                  name: product.name,
                  variant: selectedStorage,
                  color: selectedColor,
                  price: currentPrice,
                  quantity,
                }])}
                className="flex items-center justify-center rounded-full bg-green-600 hover:bg-green-700 text-white py-3 md:py-4 px-4 md:px-8 font-bold uppercase tracking-wide md:tracking-widest text-xs md:text-sm transition-all"
              >
                <FaWhatsapp className="mr-1 md:mr-2" size={15} /> Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 md:gap-6 pt-5 md:pt-10 border-t border-gray-100">
              <div className="flex items-center text-xs text-gray-500 font-medium">
                <Truck className="text-brand-dark mr-3" size={18} /> Free Delivery
              </div>
              <div className="flex items-center text-xs text-gray-500 font-medium">
                <Shield className="text-brand-dark mr-3" size={18} /> 1 Year Warranty
              </div>
              <div className="flex items-center text-xs text-gray-500 font-medium">
                <RefreshCw className="text-brand-dark mr-3" size={18} /> Easy Returns
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {product.specs && Object.keys(product.specs).length > 0 && (
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
        )}

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
