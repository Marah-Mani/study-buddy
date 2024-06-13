const multer = require('multer');
const FileManagerFolder = require('../models/fileManagerFolder');
const Users = require('../models/Users');
const path = require('path');
const fs = require('fs');

const dynamicStorage = async (req, file, cb) => {
	try {
		const { folderId, userId } = req.body;
		console.log(folderId, 'dynamicStorage');
		console.log(userId, 'dynamicStorage');

		const folder = await FileManagerFolder.findById(folderId);
		const user = await Users.findById(userId).select('fileManagerDirectory');

		if (!folder && !user) {
			return cb(new Error('Both Folder and User not found in the database'), false);
		}

		if (!folder) {
			return cb(new Error('Folder not found in the database'), false);
		}

		if (!user) {
			return cb(new Error('User not found in the database'), false);
		}

		// const userFolder = user.fileManagerDirectory;
		const folderPath = folder.folderPath;

		const uploadPath = path.join(__dirname, '..', 'storage', 'fileManager', folderPath);

		fs.mkdirSync(uploadPath, { recursive: true });

		// Use the folder as the destination
		cb(null, uploadPath);
	} catch (error) {
		cb(error, false);
	}
};

// Configure Multer storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		dynamicStorage(req, file, cb);
	},
	filename: (req, file, cb) => {
		const timestamp = Date.now();
		const lastFourDigits = timestamp.toString().slice(-12);
		const fileExtension = path.extname(file.originalname);
		const filenameWithoutExtension = path.basename(file.originalname, fileExtension);

		const filenameWithTimestamp = `${filenameWithoutExtension}_${lastFourDigits}${fileExtension}`;

		req.modifiedFilename = filenameWithTimestamp;

		cb(null, filenameWithTimestamp);
	}
});

const dynamicFileUpload = multer({ storage: storage });

module.exports = dynamicFileUpload;
