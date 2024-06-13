const express = require('express');
const router = express.Router();
const profileRoutes = require('./profileRoutes');
const fileManagerRoutes = require('./fileManagerRoutes');

router.use('/profile', profileRoutes);
router.use('/fileManager', fileManagerRoutes);

module.exports = router;
