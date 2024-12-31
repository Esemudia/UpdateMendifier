const Transaction = require('../models/Transaction');

exports.getTransactionHistory = async (req, res) => {
    try {
        const { userId } = req.body;

        const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching transaction history' });
    }
};
