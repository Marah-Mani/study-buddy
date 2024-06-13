const express = require('express');
const router = express.Router();
const fileManagerController = require('../../controllers/common/fileManagerController');

//Api routes for File
router.post('/addOrRemoveFileToFavorite', fileManagerController.addOrRemoveFileToFavorite);
router.post('/check-favorite-file', fileManagerController.checkIsFavoriteFile);
router.post('/deleteUserFile', fileManagerController.deleteUserFile);
router.get('/getListOfContributors', fileManagerController.getListOfContributors);
router.get('/getFavoriteFiles/:id', fileManagerController.getFavoriteFiles);
router.get('/getFileDetails/:fileId', fileManagerController.getFileDetails);

module.exports = router;
