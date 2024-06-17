const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/productController');

router.get('/get-all-product', productController.getAllProducts);
router.post('/add-update-product-details/', productController.addUpdateProductDetails);
router.get('/get-product-categories', productController.getProductCategories);
router.get('/getSingleProduct/:id', productController.getSingleProduct);
router.post('/deleteProductImage', productController.deleteProductImage);
router.post('/deleteProduct/:id', productController.deleteProduct);

module.exports = router;
