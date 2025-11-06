const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  qty: { type: Number, required: true, min: 1 },
  priceSnapshot: { type: Number, required: true } // price at time of add (for stable totals)
});

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // null for guest
  sessionId: { type: String, index: true, default: null }, // for guest carts (UUID)
  items: [CartItemSchema],
  updatedAt: { type: Date, default: Date.now }
});
CartSchema.index({ userId: 1 });

module.exports = mongoose.model('Cart', CartSchema);