import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const MyAccountPage = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    address: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    try {
      await updateUser(formData);
      setSuccess('Your account has been updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return <div className="text-center p-8">Loading user data...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Update Your Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-700 font-semibold">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={user.username}
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
              readOnly
            />
            <p className="text-sm text-gray-500 mt-1">Username cannot be changed.</p>
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-gray-700 font-semibold">Shipping Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            ></textarea>
          </div>

          {success && <p className="text-green-600 bg-green-100 p-3 rounded-md text-center">{success}</p>}
          {error && <p className="text-red-600 bg-red-100 p-3 rounded-md text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MyAccountPage;