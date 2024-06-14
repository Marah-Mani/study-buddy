const express = require('express');
const router = express.Router();
const userController = require('../../controllers/common/userController');
const { protect } = require('../../middleware/authMiddleware');

router.route('/').get(protect, userController.allUsers);
router.get('/allUsers', userController.getAllUsers);
router.get('/getAllCandidate', userController.getAllCandidate);
router.get('/allRoles', userController.allRoles);

module.exports = router;
