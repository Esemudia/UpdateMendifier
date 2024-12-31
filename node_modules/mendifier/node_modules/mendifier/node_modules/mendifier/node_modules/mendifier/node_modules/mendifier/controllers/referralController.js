const User = require('../models/User');

exports.listReferrals = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId).populate('referrals');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user.referrals);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching referrals' });
    }
};

exports.participateInChallenge = async (req, res) => {
    try {
        const { userId, referredId } = req.body;

        const user = await User.findById(userId);
        const referred = await User.findById(referredId);

        if (!user || !referred) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.referrals.includes(referredId)) {
            return res.status(400).json({ error: 'Already referred this user' });
        }

        user.referrals.push(referredId);
        await user.save();

        res.status(200).json({ message: 'Referral challenge participation recorded' });
    } catch (error) {
        res.status(500).json({ error: 'Error processing referral challenge' });
    }
};
