const express = require('express');
const conversationController = require('../controllers/conversationController');
const chatController = require('../controllers/chatcontroller');
const router = express.Router();

router.get('/:userId', conversationController.getConversations);
router.get('/:conversationId', chatController.getMessages);
router.post('/send', chatController.sendMessage);

module.exports = router;
