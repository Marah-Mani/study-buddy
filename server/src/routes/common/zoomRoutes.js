const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/authMiddleware');
const zoomController = require('../../controllers/common/zoomController');

router.route('/').post(protect, zoomController.create);
router.route('/').get(protect, zoomController.create);

module.exports = router;
