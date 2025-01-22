const mongoose = require('mongoose');
const kycSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    documentType:{type: String, required:true},
    name: String,
    path: String,
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' }
    
});
module.exports = mongoose.model('kyc', kycSchema);