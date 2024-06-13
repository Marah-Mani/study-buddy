const express = require('express');
const router = express.Router();
const fileManagerController = require('../../controllers/user/fileManagerController');
const dynamicFileUpload = require('../../utils/dynamicFileUpload');

//Api routes for Folder
router.post('/createFolder', fileManagerController.createFolder);
router.get('/getFoldersByUserId/:userId', fileManagerController.getFoldersByUserId);
router.put('/updateFolder/:folderId', fileManagerController.updateFolder);
router.post('/deleteFolder', fileManagerController.deleteFolder);

//Api routes for Files
router.post('/uploadFile', dynamicFileUpload.single('file'), fileManagerController.uploadFile);
router.get('/getFilesByFolder/:folderId', fileManagerController.getFilesByFolder);
router.get('/getFile/:fileId', fileManagerController.getFile);
router.put('/renameFile/:fileId', fileManagerController.renameFile);
router.post('/deleteFile', fileManagerController.deleteFile);
router.get('/getFilesWithParams', fileManagerController.getFilesWithParams);
router.get('/getFilesByUser/:userId', fileManagerController.getFilesByUser);
router.get('/getFileTypes/:userId', fileManagerController.getFileTypes);

// Api for recycled files
router.get('/recycledFilesAndFolder/:userId', fileManagerController.recycledFilesAndFolders);

router.post('/recoverFolder/:folderId', fileManagerController.recoverFolder);
router.post('/recoverFile/:fileId', fileManagerController.recoverFile);
router.post('/deleteFolderPermanently', fileManagerController.deleteFolderPermanently);
router.post('/deleteFilePermanently', fileManagerController.deleteFilePermanently);
router.get('/downloadFolder/:folderId', fileManagerController.downloadFolder);

module.exports = router;
