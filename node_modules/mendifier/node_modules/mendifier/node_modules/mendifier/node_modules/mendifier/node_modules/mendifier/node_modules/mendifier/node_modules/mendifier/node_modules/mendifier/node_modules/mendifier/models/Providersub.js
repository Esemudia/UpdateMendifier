const mongoose = require('mongoose');

const subProviderSchema = new mongoose.Schema({
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'providers', required: true },
    name: { type: String, required: true },
    description:  { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  });
  module.exports=mongoose.model('subProvider', subProviderSchema);