const express = require('express');
const frontendRoutes = require('./frontend');
const adminRoutes = require('./admin');
const commonRoutes = require('./common');
const userRoutes = require('./user');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');
const checkCommonRole = require('../middleware/checkCommonRole');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const fileController = require('../controllers/common/fileController');

router.use('/api/chat/upload', protect, fileController.uploadFile);

router.use('/api', frontendRoutes);
router.use('/api/admin', verifyToken, checkRole('admin'), adminRoutes);
router.use('/api/user', verifyToken, checkRole('user'), userRoutes);
router.use('/api/common', verifyToken, checkCommonRole('user', 'admin'), commonRoutes);

module.exports = router;
