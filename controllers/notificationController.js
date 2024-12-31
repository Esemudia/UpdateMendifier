const User = require('../models/User');

exports.getNotifications = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user.notifications);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching notifications' });
    }
};
