import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (location.state && location.state.order) {
      setOrder(location.state.order);
    } else {
      // In a real app, you would fetch the order details from the backend using orderId
      // For this mock, we rely on state passed during navigation.
      // console.warn("Order details not found in navigation state. This page might not display full info.");
    }
  }, [orderId, location.state]);

  if (!order) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
        <p>The order details could not be loaded. Please check your order ID or try again.</p>
        <Link to="/" className="text-blue-500 hover:underline mt-4 block">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-2xl mx-auto mt-10">
        <h1 className="text-4xl font-bold text-green-600 text-center mb-6">Order Confirmed!</h1>
        <p className="text-center text-gray-700 mb-8">Thank you for your purchase.</p>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">Order Details</h2>
          <p className="text-gray-700"><strong>Order ID:</strong> {order.orderId}</p>
          <p className="text-gray-700"><strong>Total Amount:</strong> ₹{order.total}</p>
          <p className="text-gray-700"><strong>Date:</strong> {new Date(order.timestamp).toLocaleString()}</p>
          <p className="text-gray-700"><strong>Buyer Name:</strong> {order.buyerName}</p>
          <p className="text-gray-700"><strong>Buyer Email:</strong> {order.buyerEmail}</p>
          <p className="text-gray-700"><strong>Shipping Address:</strong> {order.shippingAddress}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Items Purchased</h2>
          {order.items.map((item) => (
            <div key={item.productId._id} className="flex justify-between items-center py-2 border-b last:border-b-0">
              <span className="text-gray-700">{item.productId.name} x {item.qty}</span>
              <span className="font-semibold">₹{item.qty * item.priceSnapshot}</span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 text-lg font-semibold">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
