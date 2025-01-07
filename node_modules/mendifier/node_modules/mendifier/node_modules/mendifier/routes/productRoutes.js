const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');


router.post('/regProdcut',productController.addprodct);
router.get('/getproduct',productController.getProduct);
router.post('/prodcutbyId',productController.getProductById);
router.post('/productByuserID',productController.getProductByUserId);


module.exports= router;