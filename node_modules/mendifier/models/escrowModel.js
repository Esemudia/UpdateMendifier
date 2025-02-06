const mongoose = require('mongoose');

const escrowSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'released', 'disputed'], default: 'pending' }
});

module.exports = mongoose.model('Escrow', escrowSchema);
