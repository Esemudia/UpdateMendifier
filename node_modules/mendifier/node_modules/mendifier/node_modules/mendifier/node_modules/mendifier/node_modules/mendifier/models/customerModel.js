const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  joinedAt: { type: Date, default: Date.now },
  purchaseHistory: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      date: { type: Date, default: Date.now }
    }
  ],
  status: { type: String, enum: ['active', 'blocked'], default: 'active' }
});

module.exports = mongoose.model('Customer', customerSchema);
