const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Get notifications
router.get('/', notificationController.getNotifications);

module.exports = router;
