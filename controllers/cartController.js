const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Get user or guest cart
exports.getCart = async (req, res) => {
  try {
    let cart;
    if (req.user) {
      cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    } else {
      cart = await Cart.findOne({ sessionId: req.sessionId }).populate('items.productId');
    }

    if (!cart) {
      return res.json({ items: [], total: 0 });
    }

    const total = cart.items.reduce((acc, item) => acc + item.qty * item.priceSnapshot, 0);

    res.json({ items: cart.items, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add item to cart
exports.addItemToCart = async (req, res) => {
  const { productId, qty } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart;
    if (req.user) {
      cart = await Cart.findOne({ userId: req.user._id });
    } else {
      cart = await Cart.findOne({ sessionId: req.sessionId });
    }

    if (!cart) {
      if (req.user) {
        cart = new Cart({ userId: req.user._id, items: [] });
      } else {
        cart = new Cart({ sessionId: req.sessionId, items: [] });
      }
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
      // Update quantity
      cart.items[itemIndex].qty = qty;
    } else {
      // Add new item
      cart.items.push({
        productId,
        qty,
        priceSnapshot: product.price
      });
    }

    cart.updatedAt = Date.now();
    await cart.save();

    // Re-populate to get product details
    await cart.populate('items.productId');
    const total = cart.items.reduce((acc, item) => acc + item.qty * item.priceSnapshot, 0);

    res.json({ items: cart.items, total });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove item from cart
exports.removeItemFromCart = async (req, res) => {
  const { itemId } = req.params;

  try {
    let cart;
    if (req.user) {
      cart = await Cart.findOne({ userId: req.user._id });
    } else {
      cart = await Cart.findOne({ sessionId: req.sessionId });
    }

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);

    cart.updatedAt = Date.now();
    await cart.save();

    await cart.populate('items.productId');
    const total = cart.items.reduce((acc, item) => acc + item.qty * item.priceSnapshot, 0);

    res.json({ items: cart.items, total });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    let cart;
    if (req.user) {
      cart = await Cart.findOne({ userId: req.user._id });
    } else {
      cart = await Cart.findOne({ sessionId: req.sessionId });
    }

    if (cart) {
      cart.items = [];
      cart.updatedAt = Date.now();
      await cart.save();
    }

    res.json({ items: [], total: 0 });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};