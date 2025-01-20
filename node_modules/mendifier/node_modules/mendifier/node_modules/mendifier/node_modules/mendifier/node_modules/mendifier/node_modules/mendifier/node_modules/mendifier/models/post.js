const mongoose=require("mongoose");

const postSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    content: String,
    status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' }
});

module.exports=mongoose.model('post',postSchema);

const mailSchema = new mongoose.Schema({
    email: { type: String, required: true },
    preferences: { receiveEmails: Boolean },
    emailHistory: [{ subject: String, sentAt: Date }]
});
module.exports=mongoose.model('mail',mailSchema);