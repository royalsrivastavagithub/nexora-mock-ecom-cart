const express = require('express');
const router = express.Router();
const { getCart, addItemToCart, removeItemFromCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

// GET /api/cart
router.get('/', protect, getCart);

// POST /api/cart
router.post('/', protect, addItemToCart);

// DELETE /api/cart/:itemId
router.delete('/:itemId', protect, removeItemFromCart);

// POST /api/cart/clear
router.post('/clear', protect, clearCart);

module.exports = router;
