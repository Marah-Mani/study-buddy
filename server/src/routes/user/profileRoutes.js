const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/user/profileController');

router.post('/update-profile-details/', profileController.updateProfileDetails);
router.put('/update-password/:id', profileController.updatePassword);
router.post('/lastSeenUser/:id', profileController.lastSeenUser);

module.exports = router;
