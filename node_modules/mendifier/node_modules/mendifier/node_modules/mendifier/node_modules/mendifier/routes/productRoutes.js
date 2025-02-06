const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');


router.post('/regProdcut',productController.addprodct);
router.get('/getproduct',productController.getProduct);
router.post('/prodcutbyId',productController.getProductById);
router.post('/productByuserID',productController.getProductByUserId);
router.post('/push', productController.pushProduct);
router.post('/purchase', productController.purchaseProduct);
router.post('/complete', productController.completeOrder);
router.delete('/delete', productController.deleteProduct);

module.exports= router;