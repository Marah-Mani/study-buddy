const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/productController');

router.get('/get-all-product', productController.getAllProducts);

module.exports = router;
