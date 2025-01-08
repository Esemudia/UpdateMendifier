const Challenge = require('../models/Challenge');
const User = require('../models/User');

// Create a challenge
exports.createChallenge = async (req, res) => {
    try {
        const { title, description, prize, referralsRequired, startDate, endDate,adminId } = req.body;
        const challenge = new Challenge({
            title,
            description,
            prize,
            referralsRequired,
            startDate,
            endDate,
            postedBy:adminId,
        });
        await challenge.save();
        res.status(201).json({ message: 'Challenge created successfully', challenge });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error creating challenge', error });
    }
};

// Join a challenge
exports.joinChallenge = async (req, res) => {
    try {
        const { challengeId,userId } = req.body;
        const challenge = await Challenge.findById(challengeId);
        if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

        const alreadyJoined = challenge.participants.some(
            (participant) => participant.user.toString() === userId
        );
        if (alreadyJoined) return res.status(400).json({ message: 'You have already joined this challenge' });

       challenge.participants.push({ user: userId });
        await challenge.save();

        res.json({ message: 'Joined challenge successfully', challenge });
    } catch (error) {
        res.status(500).json({ message: 'Error joining challenge', error });
    }
};

// Handle referral
exports.handleReferral = async (req, res) => {
    try {
        const { referredBy, challengeId, userId  } = req.body;

        // Update referred user
        const referredUser = await User.findById(userId);
        referredUser.referredBy = referredBy;
        await referredUser.save();

        // Update referrals count for referring user in challenge
        const challenge = await Challenge.findById(challengeId);
        if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

        const participant = challenge.participants.find(
            (participant) => participant.user.toString() === referredBy
        );
        if (!participant) return res.status(400).json({ message: 'Referrer is not part of this challenge' });

        participant.referralsCount += 1;
        await challenge.save();

        res.json({ message: 'Referral recorded successfully', challenge });
    } catch (error) {
        res.status(500).json({ message: 'Error handling referral', error });
    }
};

// View challenge leaderboard
exports.getLeaderboard = async (req, res) => {
    try {
        const { challengeId } = req.params;
        const challenge = await Challenge.findById(challengeId).populate('participants.user', 'name email');
        if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

        const leaderboard = challenge.participants.sort((a, b) => b.referralsCount - a.referralsCount);
        res.json({ leaderboard });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leaderboard', error });
    }
};
