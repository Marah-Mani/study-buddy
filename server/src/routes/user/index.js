const express = require('express');
const router = express.Router();
const profileRoutes = require('./profileRoutes');
const fileManagerRoutes = require('./fileManagerRoutes');
const dashboardRoutes = require('./dashboardRoutes');

router.use('/profile', profileRoutes);
router.use('/fileManager', fileManagerRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
