const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {blacklist}= require('../controllers/adminController')

// User routes
router.post('/signup', userController.signUp);
router.post('/signin', userController.signIn);
router.put('/edit-profile', userController.editProfile);
router.post('/verify', userController.verifyUser);
router.post('/send-otp', userController.sendOtp);
router.post('/verify-otp', userController.verifyOtp);
router.post('/getblacklist',blacklist)


module.exports = router;
