const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User routes
router.post('/signup', userController.signUp);
router.post('/signin', userController.signIn);
router.put('/edit-profile', userController.editProfile);
router.post('/verify', userController.verifyUser);

module.exports = router;
