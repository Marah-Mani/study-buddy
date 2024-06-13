const express = require('express');
const router = express.Router();
const chatController = require('../../controllers/common/chatController');
const { protect } = require('../../middleware/authMiddleware');

router.route('/').get(protect, chatController.fetchChats);
router.route('/').post(protect, chatController.accessChat);
router.route('/group').post(protect, chatController.createGroupChat);
router.route('/groupremove').put(protect, chatController.removeFromGroup);
router.route('/seen').put(protect, chatController.seenChat);
router.route('/sticky-note').post(protect, chatController.storeStickyNote);
router.route('/favourite').put(protect, chatController.addFavourite);
router.route('/files/:chatId').get(protect, chatController.chatFiles);
router.route('/clear-chat/:chatId').get(protect, chatController.clearChat);
router.route('/delete-chat/:chatId').get(protect, chatController.deleteChat);
router.route('/block').post(protect, chatController.blockUser);

module.exports = router;
