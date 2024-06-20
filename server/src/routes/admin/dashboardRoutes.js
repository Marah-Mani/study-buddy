const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/admin/dashboardController');

router.get('/', dashboardController.getAllStickyNote);
router.post('/saveStickyNote/', dashboardController.saveStickyNote);
router.post('/deleteStickyNote/', dashboardController.deleteStickyNote);
router.get('/getDashboardData', dashboardController.getDashboardData);

module.exports = router;
