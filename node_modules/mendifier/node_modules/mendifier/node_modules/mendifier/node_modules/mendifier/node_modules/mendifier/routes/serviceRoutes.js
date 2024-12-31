const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Search for services
router.get('/', serviceController.searchServices);

module.exports = router;
