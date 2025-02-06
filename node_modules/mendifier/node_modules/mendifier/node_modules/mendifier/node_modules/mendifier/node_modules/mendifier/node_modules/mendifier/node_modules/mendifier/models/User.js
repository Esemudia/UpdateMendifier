const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: false },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, required: true },
    password: { type: String, required: false },
    profile:{type:String,require:false},
    filename:{type:String, required  :false},
    isVerified: { type: Boolean, default: false },
    wallet: { type: Number, default: 0 },
    otp: String,
    otpExpires: Date,
    about:{ type : String,require:false },
    state:{type: String, required:false},
    address: {
        street: { type: String, required: false },
        city: { type: String, required: false },
        state: { type: String, required: false },
        zip: { type: String, required: false },
        country: { type: String, required: false },
        geometry: {
            type: {
                type: String,
                enum: ['Point'],
                required: false,
            },
            coordinates: {
                type: [Number],
                required: false,
            },
        },
    },
    jobtitle: { type: mongoose.Schema.Types.ObjectId, ref: 'providers', required: false },
    role: {  type: String, enum: ['user', 'serviceProvider'], default: 'user' },
    referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followedVendors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    notifications: [{ message: String, date: { type: Date, default: Date.now } }],
    customers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }],
    collaborations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collaboration' }],
    createdAt: { type: Date, default: Date.now },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

module.exports = mongoose.model('User', userSchema);
