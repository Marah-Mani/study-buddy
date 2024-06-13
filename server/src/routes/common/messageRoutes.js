const express = require('express');
const router = express.Router();
const messageController = require('../../controllers/common/messageController');
const { protect } = require('../../middleware/authMiddleware');

router.route('/:chatId').get(protect, messageController.allMessages);
router.route('/').post(protect, messageController.sendMessage);
router.route('/delete/:id').get(protect, messageController.deleteMessagePermanently);
router.route('/delete').put(protect, messageController.deleteMessage);
router.route('/scheduled/:chatId').get(protect, messageController.scheduledMessage);
router.route('/bookmark/:messageId').get(protect, messageController.bookmarkMessage);

module.exports = router;
