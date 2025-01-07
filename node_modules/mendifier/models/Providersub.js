const mongoose = require('mongoose');

const subProviderSchema = new mongoose.Schema({
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'providers' },
    name: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
  });
  const Product = mongoose.model('subProvider', subProviderSchema);