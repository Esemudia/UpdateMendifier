const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
    to: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['success', 'failure'], default: 'success' },
    error: String
});

module.exports = mongoose.model('EmailLog', emailLogSchema);
