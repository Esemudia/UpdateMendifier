const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: false },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, required: true },
    password: { type: String, required: false },
    isVerified: { type: Boolean, default: false },
    wallet: { type: Number, default: 0 },
    otp: String,
    otpExpires: Date,
    referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    notifications: [{ message: String, date: { type: Date, default: Date.now } }],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
