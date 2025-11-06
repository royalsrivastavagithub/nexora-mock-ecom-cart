const express = require('express');
const router = express.Router();
const { checkout } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { check } = require('express-validator'); // Import check

// POST /api/checkout
router.post(
  '/',
  protect,
  [
    check('buyerName', 'Buyer name is required').not().isEmpty(),
    check('buyerEmail', 'Please include a valid buyer email').isEmail(),
    check('shippingAddress', 'Shipping address is required').not().isEmpty(),
  ],
  checkout
);

module.exports = router;
