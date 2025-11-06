const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  qty: { type: Number, required: true, min: 1 },
  priceSnapshot: { type: Number, required: true } // price at time of add (for stable totals)
});

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  buyerName: { type: String, required: true },
  buyerEmail: { type: String, required: true },
  shippingAddress: { type: String, required: true },
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  status: { type: String, default: "mock_paid" }, // mock flow
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);