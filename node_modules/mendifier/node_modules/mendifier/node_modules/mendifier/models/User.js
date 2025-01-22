const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: false },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, required: true },
    password: { type: String, required: false },
    profile:{type:String,require:false},
    isVerified: { type: Boolean, default: false },
    wallet: { type: Number, default: 0 },
    otp: String,
    otpExpires: Date,
    about:{ type : String,require:false },
    state:{type: String, required:false},
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
        country: { type: String, required: true },
        geometry: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
    },
    jobtitle: { type: mongoose.Schema.Types.ObjectId, ref: 'providers', required: true },
    role: {  type: String, enum: ['user', 'serviceProvider'], default: 'user' },
    referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    notifications: [{ message: String, date: { type: Date, default: Date.now } }],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
