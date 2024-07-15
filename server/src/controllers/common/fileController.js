const expressAsyncHandler = require('express-async-handler');
const File = require('../../models/File');
const fs = require('fs');
const util = require('util');
const multer = require('multer');
const mkdir = util.promisify(fs.mkdir);

// Multer configuration
const storage = multer.diskStorage({
	destination: async (req, file, cb) => {
		const currentDate = new Date();
		const year = currentDate.getFullYear();
		const month = String(currentDate.getMonth() + 1).padStart(2, '0');
		const uploadPath = `src/storage/app/public/container/${year}/${month}/`;

		// Create directory if it doesn't exist
		await mkdir(uploadPath, { recursive: true });

		cb(null, uploadPath);
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	}
});

const upload = multer({ storage });

const fileController = {
	uploadFile: [
		upload.single('sampleFile'), // Updated field name to match the payload
		expressAsyncHandler(async (req, res) => {
			try {
				if (!req.file) {
					return res.status(400).send('No files were uploaded.');
				}

				const sampleFile = req.file;
				const currentDate = new Date();
				const year = currentDate.getFullYear();
				const month = String(currentDate.getMonth() + 1).padStart(2, '0');

				// const uploadPath = `src/storage/app/public/container/${year}/${month}/`;
				let imagePath = `app/public/container/${year}/${month}/`;
				const filename = sampleFile.originalname;
				// const fullPath = uploadPath + filename;
				imagePath = imagePath + filename;

				console.log(sampleFile);

				const fileData = new File({
					name: filename,
					size: sampleFile.size,
					type: sampleFile.mimetype,
					path: imagePath
				});
				const file = await fileData.save();
				res.status(201).json(file);
			} catch (error) {
				console.error('Error:', error);
				return res.status(500).send(error);
			}
		})
	]
};

module.exports = fileController;
