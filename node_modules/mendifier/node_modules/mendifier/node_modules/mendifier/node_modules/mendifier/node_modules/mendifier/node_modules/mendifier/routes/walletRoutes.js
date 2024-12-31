const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

// Top-up wallet
router.post('/topup', walletController.topUpWallet);

module.exports = router;
