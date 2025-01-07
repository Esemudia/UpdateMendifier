const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    prize: { type: Number, required: true }, // Prize amount in currency or wallet credits
    referralsRequired: { type: Number, required: true }, // Minimum referrals to win the prize
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    participants: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            referralsCount: { type: Number, default: 0 }, // Count of referrals for each participant
        },
    ],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Challenge', challengeSchema);
