const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const paymentRoutes = require('./paymentRoutes');
const menuRoutes = require('./menuRoutes');
const forumRoutes = require('./forumRoutes');

router.use('/auth', authRoutes);
router.use('/payment', paymentRoutes);
router.use('/menus', menuRoutes);
router.use('/forums', forumRoutes);

module.exports = router;
