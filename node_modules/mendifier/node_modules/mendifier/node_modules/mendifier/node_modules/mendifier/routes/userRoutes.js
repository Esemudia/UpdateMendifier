const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {blacklist}= require('../controllers/adminController')
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png/;
      const mimeType = fileTypes.test(file.mimetype);
      const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
      if (mimeType && extName) {
        return cb(null, true);
      }
      cb('Error: Images Only!');
    },
  });

// User routes
router.post('/signup', userController.signUp);
router.post('/signin', userController.signIn);
router.put('/edit-profile', userController.editProfile);
router.post('/verify', userController.verifyUser);
router.post('/send-otp', userController.sendOtp);
router.post('/verify-otp', userController.verifyOtp);
router.post('/getblacklist',blacklist);
router.post('/serviceprovider',userController.serviceprovider)
router.post('/uploadkyc',upload.single('image'),userController.uploadKYC)
router.post('/uploadprofilePic',upload.single('image'),userController.uploadpics)
router.post('/followVendor', userController.followVendor);
router.post('/requestCollaboration', userController.requestCollaboration);
router.post('/acceptCollab', userController.acceptCollaboration);
router.get('/:vendorId', userController.getCustomers);
router.post('/add', userController.addCustomer);
router.patch('/status', userController.updateCustomerStatus);
router.delete('/remove', userController.removeCustomer);
router.post('/review', userController.addReview);
router.get('/getvendorInsameline', userController.getVendors);

module.exports = router;
