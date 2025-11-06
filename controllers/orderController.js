const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// @desc    Process checkout and create an order
// @route   POST /api/checkout
// @access  Private (user or guest with session)
exports.checkout = async (req, res) => {
  const { buyerName, buyerEmail, shippingAddress } = req.body; // Add shippingAddress

  // Basic validation for buyer info and shipping address
  if (!buyerName || !buyerEmail || !shippingAddress) { // Add shippingAddress to validation
    return res.status(400).json({ message: 'Buyer name, email, and shipping address are required for checkout.' });
  }

  try {
    let cart;
    if (req.user) {
      cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    } else {
      cart = await Cart.findOne({ sessionId: req.sessionId }).populate('items.productId');
    }

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty.' });
    }

    // Calculate total from priceSnapshot
    const total = cart.items.reduce((acc, item) => acc + item.qty * item.priceSnapshot, 0);

    // Create order
    const order = new Order({
      userId: req.user ? req.user._id : null,
      buyerName,
      buyerEmail,
      shippingAddress, // Add shippingAddress here
      items: cart.items.map(item => ({
        productId: item.productId._id,
        qty: item.qty,
        priceSnapshot: item.priceSnapshot,
      })),
      total,
      currency: 'INR', // Default currency
      status: 'mock_paid', // Mock status as per plan
    });

    await order.save();

    // Clear the cart after successful order
    cart.items = [];
    cart.updatedAt = Date.now();
    await cart.save();

    // Populate product details for the response
    await order.populate('items.productId'); // Populate product details in the order items

    // Convert to plain object to ensure populated fields are included in the response
    const orderObject = order.toObject({ getters: true, virtuals: true });

    res.status(201).json({
      orderId: orderObject._id,
      total: orderObject.total,
      timestamp: orderObject.createdAt,
      message: 'Order placed successfully (mock payment).',
      items: orderObject.items // Include the items from the plain object
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};