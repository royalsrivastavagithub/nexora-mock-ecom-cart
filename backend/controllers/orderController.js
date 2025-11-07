const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// @desc    Process checkout and create an order
// @route   POST /api/orders
// @access  Private (user or guest with session)
exports.checkout = async (req, res) => {
  // Determine buyer details based on whether the user is logged in
  const isGuest = !req.user;
  let buyerName, buyerEmail, shippingAddress;

  if (isGuest) {
    // Guest checkout: details must be in the request body
    ({ buyerName, buyerEmail, shippingAddress } = req.body);
    if (!buyerName || !buyerEmail || !shippingAddress) {
      return res.status(400).json({ message: 'Buyer name, email, and shipping address are required for guest checkout.' });
    }
  } else {
    // Logged-in user: use user data, but allow overriding shipping address from body
    buyerName = req.user.username;
    buyerEmail = req.user.email;
    shippingAddress = req.body.shippingAddress || req.user.address;
    if (!shippingAddress) {
        return res.status(400).json({ message: 'Shipping address is required.' });
    }
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
      buyerName, // Use determined buyerName
      buyerEmail, // Use determined buyerEmail
      shippingAddress, // Use determined shippingAddress
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
    await order.populate('items.productId');

    // Convert to plain object to ensure populated fields are included in the response
    const orderObject = order.toObject({ getters: true, virtuals: true });

    res.status(201).json({
      ...orderObject, // Spread the order object to include all its properties
      orderId: orderObject._id,
      timestamp: orderObject.createdAt,
      message: 'Order placed successfully (mock payment).',
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
exports.getUserOrders = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('items.productId', 'name imageUrl')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
