const Message = require('../models/message');
const Conversation = require('../models/conversationModel');

exports.getMessages = async (req, res) => {
  const { conversationId } = req.params;
  try {
    const messages = await Message.find({ conversationId }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, sender, receiver, message } = req.body;
    const newMessage = new Message({ conversationId, sender, receiver, message });
    await newMessage.save();
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message,
      lastMessageTime: new Date(),
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Error sending message' });
  }
};
