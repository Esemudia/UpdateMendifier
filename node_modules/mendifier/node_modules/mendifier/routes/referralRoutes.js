const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');

// List referrals
router.get('/', referralController.listReferrals);

// Participate in referral challenge
router.post('/challenge', referralController.participateInChallenge);

module.exports = router;
