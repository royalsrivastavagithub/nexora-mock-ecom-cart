import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrdersPage from './pages/OrdersPage';
import MyAccountPage from './pages/MyAccountPage';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './contexts/AuthContext';

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return <div className="text-center p-8" >Loading application...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />

          {/* Protected Routes */}
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <OrdersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/account"
            element={
              <PrivateRoute>
                <MyAccountPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
