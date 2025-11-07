import React, { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiContext';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
  const api = useApi();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/orders');
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders', err);
        setError(err.response?.data?.message || 'Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [api]);

  if (loading) {
    return <div className="text-center p-8">Loading your orders...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center bg-white shadow-md rounded-lg p-8">
          <p className="text-xl text-gray-700">You haven't placed any orders yet.</p>
          <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white shadow-md rounded-lg p-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-4 mb-4">
                <div className="mb-4 sm:mb-0">
                  <p className="font-semibold text-lg">Order ID: <span className="font-normal text-gray-600">{order._id}</span></p>
                  <p className="font-semibold">Date: <span className="font-normal text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</span></p>
                </div>
                <p className="font-bold text-xl text-right">Total: ₹{order.total}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">Items:</h3>
                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item._id} className="flex items-center justify-between py-1">
                      <div className="flex items-center">
                        <img src={item.productId.imageUrl || 'https://via.placeholder.com/40'} alt={item.productId.name} className="w-10 h-10 object-cover rounded-md mr-4"/>
                        <span>{item.productId.name} x {item.qty}</span>
                      </div>
                      <span>₹{item.priceSnapshot * item.qty}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
