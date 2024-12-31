const User = require('../models/User');

exports.topUpWallet = async (req, res) => {
    try {
        const { userId, amount } = req.body;

        if (amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.wallet += amount;
        await user.save();

        res.status(200).json({ message: 'Wallet topped up successfully', wallet: user.wallet });
    } catch (error) {
        res.status(500).json({ error: 'Error topping up wallet' });
    }
};
