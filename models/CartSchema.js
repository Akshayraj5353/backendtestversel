const mongoose = require('mongoose');

const cartDetailSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subtotal: Number,
  GST: Number,
  total: Number,
  vegMealTotal: Number,
  vegMealQuantity: Number,
  vegMealDescription: String,
  dessertTotals: {
    gulabJamoon: {
      quantity: Number,
      total: Number,
      description: String
    },
  }
});

module.exports = mongoose.model('OrderDetails', cartDetailSchema);
