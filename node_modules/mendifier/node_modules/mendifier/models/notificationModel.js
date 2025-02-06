const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: { type: String, enum: ['new_product', 'vendor_update', 'promotion', 'livestream'], required: true },
  message: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', notificationSchema);
