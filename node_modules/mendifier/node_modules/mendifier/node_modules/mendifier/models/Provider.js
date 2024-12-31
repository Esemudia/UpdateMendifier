const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
    name: String,
    serviceType: String,
    rating: { type: Number, default: 0 },
    ratings: [{ user: mongoose.Schema.Types.ObjectId, score: Number }],
});

module.exports = mongoose.model('Provider', providerSchema);
