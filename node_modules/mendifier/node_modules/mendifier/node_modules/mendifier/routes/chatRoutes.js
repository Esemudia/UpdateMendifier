const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.get('/:conversationId', chatController.getMessages);
router.post('/send', chatController.sendMessage);

module.exports = router;
