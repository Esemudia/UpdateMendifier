const express = require('express');
const { signUp, signIn,banUser,listUsers,unbanUser,reviewPost,kyc,approveServiceProvider,sendEmailToAllUsers,sendEmailToUser,
    isBlacklist,sendNoreplyEmail,getUserById,Unblacklist,blacklist,kycreview} = require('../controllers/adminController');
const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/banuser',banUser);
router.post('/listuser',listUsers);
router.post('/unbanuser',unbanUser);
router.post('/reviewPost', reviewPost)
router.post('/kycview',kycreview);
router.post('/kycreview',kyc);
router.post('/approveServiceProvider', approveServiceProvider)
router.post('/Allusersmail', sendEmailToAllUsers);
router.post('/sendtouser',sendEmailToUser)
router.post('/Blacklist',isBlacklist)
router.post('/sendEmail', sendNoreplyEmail)
router.post('/getuserbyID',getUserById)
router.post('/Unblacklist',Unblacklist)
router.post('/getallbacklist',blacklist);

module.exports = router;
