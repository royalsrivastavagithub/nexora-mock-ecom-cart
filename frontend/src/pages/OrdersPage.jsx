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
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Orders</h1>
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-blue-50 shadow-md rounded-lg p-8 border border-blue-200 min-h-[calc(100vh-150px)]">
          <p className="text-2xl text-blue-800 font-semibold mb-6">You haven't placed any orders yet.</p>
          <Link to="/" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 text-lg font-semibold transition duration-300 ease-in-out">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-gray-100 shadow-md rounded-lg p-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b-2 border-gray-200 pb-4 mb-4">
                <div className="mb-4 sm:mb-0 flex-grow break-words">
                  <p className="font-semibold text-lg text-gray-800">Order ID: <span className="font-normal text-gray-600 break-all">{order._id}</span></p>
                  <p className="font-semibold text-gray-700">Date: <span className="font-normal text-gray-600">{new Date(order.createdAt).toLocaleString()}</span></p>
                </div>
                <p className="font-bold text-xl text-right flex-shrink-0 ml-4 text-blue-700">Total: ₹{order.total}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Items:</h3>
                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item._id} className="flex items-center justify-between py-1 text-gray-700">
                      <div className="flex items-center flex-grow min-w-0">
                        <img src={item.productId.imageUrl || 'https://via.placeholder.com/40'} alt={item.productId.name} className="w-10 h-10 object-cover rounded-md mr-4 flex-shrink-0"/>
                        <span className="truncate sm:whitespace-normal">{item.productId.name} x {item.qty}</span>
                      </div>
                      <span className="ml-4 flex-shrink-0">₹{item.priceSnapshot * item.qty}</span>
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
