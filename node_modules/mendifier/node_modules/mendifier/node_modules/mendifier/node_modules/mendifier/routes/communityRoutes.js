const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');

// Post an item
router.post('/post', communityController.postItem);

// Fetch items in the community
router.get('/items', communityController.getItems);

// Donate an item
router.post('/donate', communityController.donateItem);

module.exports = router;
