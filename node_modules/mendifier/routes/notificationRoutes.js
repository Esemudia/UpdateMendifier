const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Get notifications
router.get('/', notificationController.getNotifications);
router.get('/getPusher',notificationController.sendNotification)
module.exports = router;
