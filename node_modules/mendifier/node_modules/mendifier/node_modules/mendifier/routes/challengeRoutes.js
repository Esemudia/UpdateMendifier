const express = require('express');
const {
    createChallenge,
    joinChallenge,
    handleReferral,
    getLeaderboard,
} = require('../controllers/challengeController');
const router = express.Router();

// Middleware to check authentication
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', createChallenge); // Admins post challenge
router.post('/join', joinChallenge); // Users join challenge
router.post('/referral', handleReferral); // Record referral
router.get('/leaderboard/:challengeId', getLeaderboard); // View leaderboard

module.exports = router;
