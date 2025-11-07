import React from 'react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

const CartItem = ({ item }) => {
  const { removeFromCart, addToCart } = useCart();

  const handleQuantityChange = (e) => {
    const newQty = parseInt(e.target.value, 10);
    if (newQty > 0) {
      addToCart(item.productId._id, newQty);
    }
  };

  const handleDecrement = () => {
    if (item.qty > 1) {
      addToCart(item.productId._id, item.qty - 1);
    }
  };

  const handleIncrement = () => {
    addToCart(item.productId._id, item.qty + 1);
  };

  return (
    <div className="flex items-center justify-between border-b py-4">
      <div className="flex items-center space-x-4">
        <img src={item.productId.imageUrl || 'https://via.placeholder.com/80'} alt={item.productId.name} className="w-20 h-20 object-cover rounded-md" />
        <div>
          <h3 className="font-semibold text-lg">{item.productId.name}</h3>
          <p className="text-gray-600">₹{item.priceSnapshot}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center border rounded-md">
          <button
            onClick={handleDecrement}
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded-l-md hover:bg-gray-300 focus:outline-none"
            disabled={item.qty <= 1}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={item.qty}
            onChange={handleQuantityChange}
            className="w-12 p-1 text-center border-y-0 border-x focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            onClick={handleIncrement}
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded-r-md hover:bg-gray-300 focus:outline-none"
          >
            +
          </button>
        </div>
        <p className="font-semibold">₹{item.qty * item.priceSnapshot}</p>
        <button
          onClick={() => removeFromCart(item._id)}
          className="text-red-500 hover:text-red-700"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

const CartPage = () => {
  const { cart, loading, clearCart } = useCart();

  if (loading) {
    return <div className="text-center p-8">Loading cart...</div>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <Link to="/" className="text-blue-500 hover:underline">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        {cart.items.map((item) => (
          <CartItem key={item._id} item={item} />
        ))}
        <div className="flex justify-end items-center mt-6 space-x-4">
          <button onClick={clearCart} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
            Clear Cart
          </button>
          <div className="text-xl font-bold">Total: ₹{cart.total}</div>
          <Link to="/checkout" className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;