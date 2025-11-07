import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useApi } from './ApiContext';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const api = useApi();
  const { token } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/cart');
      setCart(data);
    } catch (error) {
      console.error('Failed to fetch cart', error);
      // It's normal for a new user/guest to not have a cart, so we don't treat 404 as a critical error.
      if (error.response && error.response.status === 404) {
        setCart({ items: [], total: 0 });
      }
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    // Fetch cart on initial load and when user logs in/out
    fetchCart();
  }, [token, fetchCart]);

  const addToCart = async (productId, qty) => {
    try {
      const { data } = await api.post('/cart', { productId, qty });
      setCart(data);
    } catch (error) {
      console.error('Failed to add to cart', error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const { data } = await api.delete(`/cart/${itemId}`);
      setCart(data);
    } catch (error) {
      console.error('Failed to remove from cart', error);
    }
  };

  const clearCart = async () => {
    try {
      const { data } = await api.post('/cart/clear');
      setCart(data);
    } catch (error) {
      console.error('Failed to clear cart', error);
    }
  };

  const checkout = async (checkoutData) => {
    const { data } = await api.post('/orders', checkoutData);
    fetchCart(); // Refetch cart to confirm it's empty
    return data; // Return order confirmation
  }

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, clearCart, checkout, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
