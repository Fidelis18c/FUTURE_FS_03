import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  // --- Fetch cart from API if logged in, else load from localStorage ---
  const fetchCart = useCallback(async () => {
    if (!token) {
      const saved = localStorage.getItem('hs_cart');
      setCart(saved ? JSON.parse(saved) : []);
      return;
    }
    try {
      setCartLoading(true);

      // Check if there are local guest items in localStorage that need syncing to the DB cart
      const saved = localStorage.getItem('hs_cart');
      if (saved) {
        try {
          const localItems = JSON.parse(saved);
          if (Array.isArray(localItems) && localItems.length > 0) {
            for (const item of localItems) {
              const variantId = item.variant_id || item.id;
              if (variantId) {
                try {
                  await api.post('/cart', { variant_id: variantId, quantity: item.quantity });
                } catch (e) {
                  // Silently ignore non-database items or duplicate conflicts
                }
              }
            }
          }
        } catch (e) {
          console.warn('Local cart sync error:', e);
        } finally {
          localStorage.removeItem('hs_cart');
        }
      }

      const { data } = await api.get('/cart');
      // Normalize API cart items to match UI shape
      const normalized = data.map((item) => ({
        cartItemId: item.id,
        id: item.variant_id,
        variant_id: item.variant_id,
        name: item.product_name,
        variant: item.variant_name,
        color: item.attributes?.color || '',
        price: parseFloat(item.variant_price),
        image: item.image_url || '',
        quantity: item.quantity,
      }));
      setCart(normalized);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setCartLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // --- Save to localStorage when not logged in ---
  useEffect(() => {
    if (!token) {
      localStorage.setItem('hs_cart', JSON.stringify(cart));
    }
  }, [cart, token]);

  // --- Add to cart ---
  const addToCart = async (product, quantity = 1, variant = '', color = '') => {
    if (token && product.variant_id) {
      // Use API (expects variant_id from the live product data)
      try {
        await api.post('/cart', { variant_id: product.variant_id, quantity });
        await fetchCart();
      } catch (err) {
        console.error('Failed to add to cart:', err);
      }
    } else {
      // Local cart (guest or static data products)
      setCart((prev) => {
        const existingIdx = prev.findIndex(
          (item) => item.id === product.id && item.variant === variant && item.color === color
        );
        if (existingIdx > -1) {
          const updated = [...prev];
          updated[existingIdx].quantity += quantity;
          return updated;
        }
        return [...prev, { ...product, quantity, variant, color }];
      });
    }
    setIsCartOpen(true);
  };

  // --- Remove from cart ---
  const removeFromCart = async (id, variant, color) => {
    const item = cart.find((i) => i.id === id && i.variant === variant && i.color === color);
    if (token && item?.cartItemId) {
      try {
        await api.delete(`/cart/${item.cartItemId}`);
        setCart((prev) => prev.filter((i) => i.cartItemId !== item.cartItemId));
      } catch (err) {
        console.error('Failed to remove cart item:', err);
      }
    } else {
      setCart((prev) =>
        prev.filter((i) => !(i.id === id && i.variant === variant && i.color === color))
      );
    }
  };

  // --- Update quantity ---
  const updateQuantity = async (id, variant, color, quantity) => {
    if (quantity < 1) return;
    const item = cart.find((i) => i.id === id && i.variant === variant && i.color === color);
    if (token && item?.cartItemId) {
      try {
        await api.put(`/cart/${item.cartItemId}`, { quantity });
        setCart((prev) =>
          prev.map((i) =>
            i.cartItemId === item.cartItemId ? { ...i, quantity } : i
          )
        );
      } catch (err) {
        console.error('Failed to update cart:', err);
      }
    } else {
      setCart((prev) =>
        prev.map((i) =>
          i.id === id && i.variant === variant && i.color === color ? { ...i, quantity } : i
        )
      );
    }
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
