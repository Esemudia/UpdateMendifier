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

router.post('/', authMiddleware, createChallenge); // Admins post challenge
router.post('/join/:challengeId', authMiddleware, joinChallenge); // Users join challenge
router.post('/referral', authMiddleware, handleReferral); // Record referral
router.get('/leaderboard/:challengeId', authMiddleware, getLeaderboard); // View leaderboard

module.exports = router;
