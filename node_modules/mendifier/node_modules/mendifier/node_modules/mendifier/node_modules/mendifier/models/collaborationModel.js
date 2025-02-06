const mongoose = require('mongoose');

const collaborationSchema = new mongoose.Schema({
  vendor1: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  vendor2: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
});

module.exports = mongoose.model('Collaboration', collaborationSchema);
