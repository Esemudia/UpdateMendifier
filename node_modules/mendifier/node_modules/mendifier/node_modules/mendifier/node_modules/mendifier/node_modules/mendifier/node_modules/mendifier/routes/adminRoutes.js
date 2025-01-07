const express = require('express');
const { signUp, signIn,banUser,listUsers } = require('../controllers/adminController');
const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/banuser',banUser);
router.post('/listuser',listUsers)
module.exports = router;
