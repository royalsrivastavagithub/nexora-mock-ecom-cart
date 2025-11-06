const express = require('express');
const router = express.Router();
const { checkout } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// POST /api/checkout
router.post('/', protect, checkout);

module.exports = router;
