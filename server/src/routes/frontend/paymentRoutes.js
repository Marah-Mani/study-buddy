const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/frontend/paymentController');

router.post('/create-checkout-session', paymentController.createCheckoutSession);

module.exports = router;
