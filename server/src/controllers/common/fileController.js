const expressAsyncHandler = require('express-async-handler');
const File = require('../../models/File');
const fs = require('fs');
const util = require('util');
const mkdir = util.promisify(fs.mkdir);

const fileController = {
	uploadFile: expressAsyncHandler(async (req, res) => {
		let sampleFile;
		let uploadPath;

		if (!req.files || Object.keys(req.files).length === 0) {
			return res.status(400).send('No files were uploaded.');
		}

		sampleFile = req.files.sampleFile;

		const currentDate = new Date();
		const year = currentDate.getFullYear();
		const month = String(currentDate.getMonth() + 1).padStart(2, '0');

		uploadPath = 'src/storage/app/public/container/' + year + '/' + month + '/';
		let imagePath = 'app/public/container/' + year + '/' + month + '/';
		const filename = sampleFile.name;
		const fullPath = uploadPath + filename;
		imagePath = imagePath + filename;

		try {
			await mkdir(uploadPath, { recursive: true });

			await sampleFile.mv(fullPath);

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
};

module.exports = fileController;
