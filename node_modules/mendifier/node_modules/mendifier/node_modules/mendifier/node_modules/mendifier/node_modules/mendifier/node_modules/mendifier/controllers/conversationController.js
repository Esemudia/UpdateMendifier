const Conversation = require('../models/conversationModel');

exports.getConversations = async (req, res) => {
  const { userId } = req.params;
  try {
    const conversations = await Conversation.find({ participants: userId });
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching conversations' });
  }
};
