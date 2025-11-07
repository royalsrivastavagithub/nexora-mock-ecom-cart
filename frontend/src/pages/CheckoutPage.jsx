import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const CheckoutPage = () => {
  const { cart, loading, checkout } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    buyerName: '',
    buyerEmail: '',
    shippingAddress: '',
  });
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        buyerName: user.username || '',
        buyerEmail: user.email || '',
        shippingAddress: user.address || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    if (!formData.shippingAddress) {
      setError('Shipping address is required.');
      setIsProcessing(false);
      return;
    }

    try {
      const order = await checkout(formData);
      navigate(`/order-confirmation/${order.orderId}`, { state: { order } });
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || 'Failed to process checkout.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading cart for checkout...</div>;
  }

  if (!user && cart.items.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p>Please add items to your cart before checking out.</p>
        <Link to="/" className="text-blue-500 hover:underline mt-4 block">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
        <div className="mb-6">
          {cart.items.map((item) => (
            <div key={item._id} className="flex justify-between py-2 border-b last:border-b-0">
              <span>{item.productId.name} x {item.qty}</span>
              <span>₹{item.qty * item.priceSnapshot}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-xl mt-4">
            <span>Total:</span>
            <span>₹{cart.total}</span>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="buyerName" className="block text-gray-700">Full Name</label>
            <input
              type="text"
              id="buyerName"
              name="buyerName"
              value={formData.buyerName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
              required
              readOnly={!!user}
            />
          </div>
          <div>
            <label htmlFor="buyerEmail" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="buyerEmail"
              name="buyerEmail"
              value={formData.buyerEmail}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
              required
              readOnly={!!user}
            />
          </div>
          <div>
            <label htmlFor="shippingAddress" className="block text-gray-700">Shipping Address</label>
            <textarea
              id="shippingAddress"
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            ></textarea>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
