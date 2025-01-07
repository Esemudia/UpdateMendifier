const express = require('express');
const router = express.Router();
const subService= require('../controllers/subServiceController')


router.post('/insertService', subService.insertsubServices)
router.post('/getSubservice', subService.getService);

module.exports=router