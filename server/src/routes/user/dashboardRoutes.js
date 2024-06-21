const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/user/dashboardController');

router.get('/getDashboardData/:id', dashboardController.getDashboardData);

module.exports = router;
