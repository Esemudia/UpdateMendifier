const mongoose = require('mongoose');

const serviceProviderSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    approved: { type: Boolean, default: false }
});

module.exports=mongoose.model('Approval',serviceProviderSchema)