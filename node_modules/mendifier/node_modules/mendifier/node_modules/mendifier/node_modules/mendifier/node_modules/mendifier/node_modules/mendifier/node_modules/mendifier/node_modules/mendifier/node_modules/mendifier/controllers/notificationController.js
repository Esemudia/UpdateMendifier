const User = require('../models/User');
const Pusher = require('pusher');
const Notification = require('../models/notificationModel');


const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
});

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

exports.sendNotification = async (req, res) => {
    try {
        const { channel, event, message } = req.body;

        await pusher.trigger(channel, event, { message });
        res.status(200).json({ message: 'Notification sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error sending notification' });
    }
};

exports.getNotifications= async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await Notification.findById({userId}).populate('notifications');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user.notifications);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching notifications' });
    }
  };


