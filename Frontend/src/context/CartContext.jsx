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

  const isUUID = (str) =>
    typeof str === 'string' &&
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);

  // --- Fetch cart from API if logged in, else load from localStorage ---
  const fetchCart = useCallback(async () => {
    // Read any existing local cart items from localStorage or current state
    const savedLocalRaw = localStorage.getItem('hs_cart');
    let localItems = [];
    try {
      if (savedLocalRaw) localItems = JSON.parse(savedLocalRaw);
    } catch (e) {}

    if (!token) {
      setCart(localItems);
      return;
    }

    try {
      setCartLoading(true);

      const unSyncedItems = [];

      // 1. Attempt DB sync for items with valid UUID variant IDs
      if (localItems.length > 0) {
        for (const item of localItems) {
          const vId = item.variant_id || item.id;
          if (isUUID(vId)) {
            try {
              await api.post('/cart', { variant_id: vId, quantity: item.quantity });
            } catch (e) {
              unSyncedItems.push(item);
            }
          } else {
            unSyncedItems.push(item);
          }
        }
      }

      // 2. Fetch DB cart
      let dbItemsNormalized = [];
      try {
        const { data } = await api.get('/cart');
        if (Array.isArray(data)) {
          dbItemsNormalized = data.map((item) => ({
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
        }
      } catch (e) {
        console.warn('Could not fetch backend cart:', e);
      }

      // 3. Merge DB items with any un-synced/local items without duplicates
      const merged = [...dbItemsNormalized];
      for (const localItem of unSyncedItems) {
        const exists = merged.some(
          (m) =>
            m.id === (localItem.variant_id || localItem.id) ||
            (m.name === localItem.name && m.color === localItem.color && m.variant === localItem.variant)
        );
        if (!exists) {
          merged.push(localItem);
        }
      }

      setCart(merged);
    } catch (err) {
      console.error('Failed to sync/fetch cart:', err);
    } finally {
      setCartLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // --- Sync cart to localStorage whenever cart state updates ---
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('hs_cart', JSON.stringify(cart));
    }
  }, [cart]);

  // --- Add to cart ---
  const addToCart = async (product, quantity = 1, variant = '', color = '') => {
    const vId = product.variant_id || product.id;
    if (token && isUUID(vId)) {
      try {
        await api.post('/cart', { variant_id: vId, quantity });
        await fetchCart();
      } catch (err) {
        console.error('Failed to add to API cart, using local state:', err);
        setCart((prev) => [...prev, { ...product, quantity, variant, color }]);
      }
    } else {
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
