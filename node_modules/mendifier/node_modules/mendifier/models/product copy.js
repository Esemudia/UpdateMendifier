
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    providerId: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
    category: String,
    price: Number,
    images: [String],
    createdAt: { type: Date, default: Date.now },
  });
  const Product = mongoose.model('Product', productSchema);