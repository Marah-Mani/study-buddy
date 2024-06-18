const express = require('express');
const router = express.Router();
const productController = require('../../controllers/common/productController');

router.get('/get-all-product', productController.getAllProducts);
router.get('/get-user-product', productController.getUserProducts);

module.exports = router;
