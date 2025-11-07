import React from 'react';
import { ApiProvider } from './ApiContext';
import { AuthProvider } from './AuthContext';
import { ProductProvider } from './ProductContext';
import { CartProvider } from './CartContext';

export const AppProviders = ({ children }) => {
  return (
    <ApiProvider>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>{children}</CartProvider>
        </ProductProvider>
      </AuthProvider>
    </ApiProvider>
  );
};
