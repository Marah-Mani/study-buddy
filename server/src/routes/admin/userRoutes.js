const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/userController');

router.get('/', userController.getAllUsers);
router.get('/userActivities', userController.getAllActivity);
router.post('/updateUserDetails', userController.updateUserDetails);
router.post('/deleteUser/:id', userController.deleteUser);
router.post('/updateUserStatus', userController.updateUserStatus);
router.get('/user-detail/:id', userController.getSingleUserDetail);

module.exports = router;
