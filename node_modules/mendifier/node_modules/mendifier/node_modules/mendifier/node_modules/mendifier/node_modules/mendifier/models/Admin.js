const mongoose = require('mongoose');
const { PhoneNumberContextImpl } = require('twilio/lib/rest/lookups/v2/phoneNumber');


const Adminschema= new mongoose.Schema({
    name: { type: String, required: false },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, required: true },
    password: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    role: {  type: String, enum: ['superAdmin', 'Admin'], default: 'Admin' },
})


module.exports = mongoose.model('Admin', Adminschema);