const mongoose = require('mongoose');
const kycSchema = new mongoose.Schema({
    kyc: {
        document: String,
        status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' }
    }
});
module.exports = mongoose.model('kyc', kycSchema);