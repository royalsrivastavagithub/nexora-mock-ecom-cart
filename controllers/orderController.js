const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// @desc    Process checkout and create an order
// @route   POST /api/checkout
// @access  Private (user or guest with session)
exports.checkout = async (req, res) => {
  const { buyerName, buyerEmail } = req.body;

  // Basic validation for buyer info
  if (!buyerName || !buyerEmail) {
    return res.status(400).json({ message: 'Buyer name and email are required for checkout.' });
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

    res.status(201).json({
      orderId: order._id,
      total: order.total,
      timestamp: order.createdAt,
      message: 'Order placed successfully (mock payment).'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};