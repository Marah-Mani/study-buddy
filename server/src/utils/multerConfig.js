/* eslint-disable security/detect-non-literal-fs-filename */
const multer = require('multer');
const fs = require('fs/promises');
const sharp = require('sharp');

const storage = (folderName) =>
	multer.diskStorage({
		destination: async (req, file, cb) => {
			const folderPath = `src/storage/${folderName}/original`;
			try {
				await fs.mkdir(folderPath, { recursive: true });
				cb(null, folderPath);
			} catch (error) {
				cb(error, folderPath);
			}
		},
		filename: (req, file, cb) => {
			cb(null, Date.now() + '-' + file.originalname);
		}
	});

const processAndSaveImages = async (file, folderName) => {
	const sizes = [
		{ suffix: 'extraSmall', width: 50, height: 50 },
		{ suffix: 'small', width: 200 },
		{ suffix: 'medium', width: 400 }
	];

	const imagePath = file.path;
	const fileName = file.filename;
	const originalFilePath = `src/storage/${folderName}/original/${fileName}`;

	// Save the original image
	const originalImageBuffer = await sharp(imagePath).toBuffer();
	await fs.writeFile(originalFilePath, originalImageBuffer);

	// Process and save resized images
	for (const size of sizes) {
		const resizedImageBuffer = await sharp(originalFilePath).resize(size.width, size.height).toBuffer();
		const folderPath = `src/storage/${folderName}/${size.suffix}`;
		const filePath = `${folderPath}/${fileName}`;
		await fs.mkdir(folderPath, { recursive: true });
		await fs.writeFile(filePath, resizedImageBuffer);
	}

	return fileName;
};

const createUpload = (folderName) => {
	const upload = multer({ storage: storage(folderName) });
	return {
		single: (fieldName) => async (req, res, next) => {
			upload.single(fieldName)(req, res, async (err) => {
				console.log(err);
				if (err) return res.status(500).json({ message: 'Error uploading file', status: false });
				if (!req.file) return next();

				try {
					req.uploadedFilename = await processAndSaveImages(req.file, folderName);
					next();
				} catch (error) {
					console.error(error);
					return res.status(500).json({ message: 'Error processing image', status: false });
				}
			});
		},

		fields: (fields) => async (req, res, next) => {
			upload.fields(fields)(req, res, async (err) => {
				console.log(err);
				if (err) return res.status(500).json({ message: 'Error uploading files', status: false });

				try {
					for (const fieldName of Object.keys(req.files)) {
						const files = req.files[fieldName];
						for (const file of files) {
							await processAndSaveImages(file, folderName);
						}
					}
					next();
				} catch (error) {
					console.error(error);
					return res.status(500).json({ message: 'Error processing images', status: false });
				}
			});
		},

		multiple: (fieldNames) => async (req, res, next) => {
			upload.array(fieldNames)(req, res, async (err) => {
				if (err) return res.status(500).json({ message: 'Error uploading files', status: false });
				try {
					for (const file of req.files) {
						const sizes = [
							{ suffix: 'extraSmall', width: 50, height: 50 },
							{ suffix: 'small', width: 200 },
							{ suffix: 'medium', width: 400 }
						];
						const imagePath = file.path;
						const fileName = file.filename;
						const originalFilePath = `src/storage/${folderName}/original/${fileName}`;

						// Save the original image
						const originalImageBuffer = await sharp(imagePath).toBuffer();
						await fs.writeFile(originalFilePath, originalImageBuffer);
						console.log('Original image saved successfully to', originalFilePath);

						// Process and save resized images
						for (const size of sizes) {
							const resizedImageBuffer = await sharp(originalFilePath)
								.resize(size.width, size.height)
								.toBuffer();
							const folderPath = `src/storage/${folderName}/${size.suffix}`;
							const filePath = `${folderPath}/${fileName}`;
							await fs.mkdir(folderPath, { recursive: true });
							await fs.writeFile(filePath, resizedImageBuffer);
							console.log('Resized image saved successfully to', filePath);
						}
					}

					next();
				} catch (error) {
					console.error(error);
					return res.status(500).json({ message: 'Error processing images', status: false });
				}
			});
		}
	};
};

module.exports = { createUpload };
