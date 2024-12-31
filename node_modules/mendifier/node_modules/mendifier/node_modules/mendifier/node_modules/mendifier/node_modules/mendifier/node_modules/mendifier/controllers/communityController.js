const CommunityItem = require('../models/CommunityItem');

exports.postItem = async (req, res) => {
    try {
        const { userId, title, description, price } = req.body;

        const item = new CommunityItem({ userId, title, description, price });
        await item.save();

        res.status(201).json({ message: 'Item posted successfully', item });
    } catch (error) {
        res.status(500).json({ error: 'Error posting item' });
    }
};

exports.getItems = async (req, res) => {
    try {
        const items = await CommunityItem.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching community items' });
    }
};

exports.donateItem = async (req, res) => {
    try {
        const { userId, itemId } = req.body;

        const item = await CommunityItem.findById(itemId);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        item.donatedTo = userId;
        await item.save();

        res.status(200).json({ message: 'Item donated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error donating item' });
    }
};
