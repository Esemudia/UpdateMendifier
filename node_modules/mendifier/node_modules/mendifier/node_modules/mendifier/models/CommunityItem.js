const mongoose = require('mongoose');

const communityItemSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    description: String,
    price: Number,
    donatedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CommunityItem', communityItemSchema);
