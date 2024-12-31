const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// View transaction history
router.get('/', transactionController.getTransactionHistory);

module.exports = router;
