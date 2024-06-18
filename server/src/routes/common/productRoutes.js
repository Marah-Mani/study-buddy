const express = require('express');
const router = express.Router();
const productController = require('../../controllers/common/productController');

router.get('/get-all-product', productController.getAllProducts);
router.get('/get-user-product', productController.getUserProducts);
router.post('/add-update-product-details/', productController.addUpdateProductDetails);
router.get('/get-product-categories', productController.getProductCategories);
router.get('/getSingleProduct/:id', productController.getSingleProduct);
router.post('/deleteProductImage', productController.deleteProductImage);
router.post('/deleteProduct/:id', productController.deleteProduct);

module.exports = router;
