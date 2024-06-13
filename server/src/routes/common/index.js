const express = require('express');
const router = express.Router();
const notificationRoutes = require('./notificationRoutes');
const chatRoutes = require('./chatRoutes');
const userRoutes = require('./userRoutes');
const messageRoutes = require('./messageRoutes');
const profileRoutes = require('./profileRoutes');
const forumRoutes = require('./forumRoutes');
const fileManagerRoutes = require('./fileManagerRoutes');

router.use('/notification', notificationRoutes);
router.use('/chat', chatRoutes);
router.use('/user', userRoutes);
router.use('/message', messageRoutes);
router.use('/profile', profileRoutes);
router.use('/forum', forumRoutes);
router.use('/fileManager', fileManagerRoutes);

module.exports = router;
