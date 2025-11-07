const express = require('express');
const router = express.Router();
const { checkout, getUserOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { check } = require('express-validator');

// GET /api/orders - Get all orders for the logged-in user
router.get('/', protect, getUserOrders);

// POST /api/orders - Create an order (checkout)
router.post(
  '/',
  protect,
  [
    // Conditional validation: only require for guest checkout
    check('buyerName', 'Buyer name is required').if((value, { req }) => !req.user).not().isEmpty(),
    check('buyerEmail', 'Please include a valid buyer email').if((value, { req }) => !req.user).isEmail(),
    // Shipping address is always required
    check('shippingAddress', 'Shipping address is required').not().isEmpty(),
  ],
  checkout
);

module.exports = router;