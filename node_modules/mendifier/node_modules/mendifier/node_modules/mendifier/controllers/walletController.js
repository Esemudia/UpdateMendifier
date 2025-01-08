const User = require('../models/User');
const Transaction = require('../models/Transaction');

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

exports.tranfer=async (req, res) => {
    const { recipientEmail, amount,senderId } = req.body;
    try {
      if (amount <= 0) return res.status(400).send({ message: 'Invalid amount' });
  
      const sender = await User.findById(senderId);
      if (sender.walletBalance < amount) return res.status(400).send({ message: 'Insufficient balance' });
  
      const recipient = await User.findOne({ email: recipientEmail });
      if (!recipient) return res.status(404).send({ message: 'Recipient not found' });
  
      sender.walletBalance -= amount;
      recipient.walletBalance += amount;
  
      await sender.save();
      await recipient.save();
  
      const senderTransaction = new Transaction({
        userId: sender._id,
        amount,
        type: 'debit',
        description: `Transfer to ${recipient.email}`,
      });
      await senderTransaction.save();
  
      const recipientTransaction = new Transaction({
        userId: recipient._id,
        amount,
        type: 'credit',
        description: `Received from ${sender.email}`,
      });
      await recipientTransaction.save();
  
      res.status(200).send({ message: 'Transfer successful' });
    } catch (error) {
        console.log(error)
      res.status(400).send({ message: error.message });
    }
  };
  