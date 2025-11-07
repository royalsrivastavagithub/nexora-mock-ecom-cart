import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Header = () => {
  const { token, logout } = useAuth();
  const { cart } = useCart();

  const cartItemCount = cart.items.reduce((total, item) => total + item.qty, 0);

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Nexora E-Com</Link>
        <nav className="flex items-center space-x-6">
          <Link to="/" className="hover:text-gray-300">Products</Link>
          <Link to="/cart" className="hover:text-gray-300 flex items-center">
            Cart ({cartItemCount})
          </Link>
          {token ? (
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/register" className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
