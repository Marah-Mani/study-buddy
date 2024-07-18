const errorLogger = require('../../../logger');
const FileManagerFile = require('../../models/fileManagerFile');
const FavoriteFiles = require('../../models/favoritesFiles');
const FileManagerFolder = require('../../models/fileManagerFolder');
const User = require('../../models/Users');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const archiver = require('archiver');
const { getAdminDataByRole, trackUserActivity } = require('../../common/functions');
const { createNotification } = require('../../common/notifications');

const getFileCount = async (folderId) => {
	try {
		return await FileManagerFile.countDocuments({ folderId: folderId, status: 'active' });
	} catch (error) {
		errorLogger('Error fetching file count and total size:', error);
		throw error;
	}
};

function convertSize(sizeInKB) {
	if (sizeInKB < 1024) {
		return sizeInKB + ' KB'; // Return in KB if less than 1 MB
	} else {
		const sizeInMB = sizeInKB / 1024;
		return sizeInMB.toFixed(2) + ' MB'; // Convert to MB with 2 decimal places
	}
}

const getFileSize = async (folderId) => {
	try {
		// Get file count in the folder
		const totalFileSize = await FileManagerFile.aggregate([
			{
				$match: {
					folderId: folderId,
					status: 'active'
				}
			},
			{
				$group: {
					_id: null,
					totalSize: { $sum: '$fileSize' }
				}
			}
		]);

		// Extract the total size value in kilobytes
		const totalSizeInKB = totalFileSize.length > 0 ? totalFileSize[0].totalSize : 0;
		return convertSize(totalSizeInKB);
	} catch (error) {
		errorLogger('Error fetching file count and total size:', error);
		throw error;
	}
};

async function deleteSubfolders(folderId, userId, currentTime) {
	// Find and delete subfolders recursively
	const subfolders = await FileManagerFolder.find({ parentFolder: folderId, status: { $ne: 'deleted' } });
	for (let subfolder of subfolders) {
		// Recursively delete subfolders of the subfolder
		await deleteSubfolders(subfolder._id, userId, currentTime);

		// Mark the subfolder as deleted
		subfolder.status = 'deleted';
		subfolder.deletedBy = userId;
		subfolder.deletedAt = currentTime;
		await subfolder.save();

		// Mark all files within the subfolder as deleted
		await FileManagerFile.updateMany(
			{ folderId: subfolder._id, status: { $ne: 'deleted' } },
			{ $set: { status: 'deleted', deletedAt: currentTime } }
		);
	}
}

function organizeFolders(folders, deletedAt) {
	const folderMap = {};
	const rootFolders = [];
	// Create a mapping of folders by their IDs
	for (const folder of folders) {
		folderMap[folder._id] = folder;
	}
	// Organize folders hierarchically
	for (const folder of folders) {
		if (folder.parentFolder && folder.parentFolder in folderMap) {
			const parentFolder = folderMap[folder.parentFolder];
			if (!parentFolder.children) {
				parentFolder.children = [];
			}
			// Check if the folder's deletedAt matches the deletedAt parameter
			if (folder.deletedAt === deletedAt) {
				parentFolder.children.push(folder);
			}
		} else {
			rootFolders.push(folder);
		}
	}
	return rootFolders;
}

async function recoverFolderAndSubfolders(folderId) {
	// Find the folder
	let folder = await FileManagerFolder.findById(folderId);

	// If the folder is found, set its status to active
	if (folder) {
		folder.status = 'active';
		folder.deletedBy = null;
		await folder.save();

		// Find and recover subfolders recursively
		const subfolders = await FileManagerFolder.find({ parentFolder: folderId });
		for (let subfolder of subfolders) {
			await recoverFolderAndSubfolders(subfolder._id);
		}
		// Recover files within the folder
		await FileManagerFile.updateMany({ folderId: folderId }, { $set: { status: 'active' } });
	}
}
const getFolderContents = (dir) => {
	const contents = [];
	const list = fs.readdirSync(dir);
	list.forEach((file) => {
		const fullPath = path.join(dir, file);
		const stat = fs.statSync(fullPath);
		if (stat && stat.isDirectory()) {
			contents.push({ path: fullPath, type: 'directory' });
			contents.push(...getFolderContents(fullPath)); // Recursively get contents of subdirectories
		} else {
			contents.push({ path: fullPath, type: 'file' });
		}
	});
	return contents;
};

async function deleteFolderAndContents(folderId) {
	// Find the folder
	let folder = await FileManagerFolder.findById(folderId);

	// If the folder is found, delete its subfolders and files recursively
	if (folder) {
		// Find and delete subfolders recursively
		const subfolders = await FileManagerFolder.find({ parentFolder: folderId });
		for (let subfolder of subfolders) {
			await deleteFolderAndContents(subfolder._id);
		}

		// Delete files within the folder
		await FileManagerFile.deleteMany({ folderId: folderId });

		// Remove the folder from the database
		await FileManagerFolder.findByIdAndDelete(folderId);
	}
}

const fetchSubfoldersRecursive = async (folderId) => {
	// Find all folders that have parentFolderId equal to folderId
	const folders = await FileManagerFolder.find({ parentFolder: folderId });

	// Array to hold promises for fetching subfolders recursively
	const subFoldersPromises = folders.map(async (folder) => {
		// Recursively fetch subfolders of the current folder
		const subfolders = await fetchSubfoldersRecursive(folder._id);
		return { ...folder.toObject(), subfolders }; // Append fetched subfolders to current folder
	});

	// Immediately return the result of Promise.all
	return await Promise.all(subFoldersPromises);
};

const fileManagerController = {
	addOrRemoveFileToFavorite: async (req, res) => {
		try {
			const { fileId, userId, type } = req.body;
			const favoriteFile = await FavoriteFiles.findOne({ userId: userId });

			if (type === 'favorite') {
				if (favoriteFile) {
					await FavoriteFiles.updateOne({ userId: userId }, { $addToSet: { files: fileId } });
				} else {
					const newFavoriteFile = new FavoriteFiles({
						userId: userId,
						files: [fileId]
					});
					await newFavoriteFile.save();
				}

				const AdminNotificationData = {
					notification: `File has been added to your favorites successfully.`,
					notifyBy: userId,
					notifyTo: userId,
					type: 'File added',
					url: ''
				};
				createNotification(AdminNotificationData);
				await trackUserActivity(userId, 'Your file has been added to your favorites successfully.');
				res.status(200).json({ status: true, message: 'File added to favorite successfully' });
			} else {
				if (favoriteFile) {
					await FavoriteFiles.updateOne({ userId: userId }, { $pull: { files: fileId } });
					await trackUserActivity(userId, 'Your file has been removed from your favorites successfully.');
					res.status(200).json({ status: true, message: 'File removed from favorite successfully' });
				} else {
					res.status(404).json({ status: false, message: 'Favorite record not found' });
				}
			}
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	checkIsFavoriteFile: async (req, res) => {
		try {
			const { fileId, userId } = req.body;
			const favoriteFile = await FavoriteFiles.findOne({ userId: userId });
			if (!favoriteFile) {
				return res.status(404).json({ status: false, message: 'Favorite record not found' });
			}
			if (favoriteFile.files.includes(fileId)) {
				res.status(200).json({ status: true, message: 'File is favorite' });
			} else {
				res.status(200).json({ status: false, message: 'File is not favorite' });
			}
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	deleteUserFile: async (req, res) => {
		try {
			const { fileId, userId } = req.body;

			let file = await FileManagerFile.findById(fileId);
			if (!file) {
				return res.status(404).json({ status: false, message: 'File not found' });
			}

			const adminId = await getAdminDataByRole('users');

			if (adminId.toString() === userId) {
				// If the user is an admin, delete the file directly
				file.status = 'deleted';
				file.deletedBy = userId;
				await file.save();
				const AdminNotificationData = {
					notification: `File has been deleted successfully.`,
					notifyBy: userId,
					notifyTo: userId,
					type: 'File deleted',
					url: ''
				};
				createNotification(AdminNotificationData);
				await trackUserActivity(userId, 'Your file has been deleted successfully.');
				return res.status(200).json({ status: true, message: 'File deleted successfully', data: file });
			}

			if (file.createdBy.toString() === userId) {
				// If the user is the creator of the file, delete the file
				file.status = 'deleted';
				file.deletedBy = userId;
				await file.save();
				const UserNotificationData = {
					notification: `Your file has been deleted successfully.`,
					notifyBy: userId,
					notifyTo: userId,
					type: 'File deleted',
					url: ''
				};
				createNotification(UserNotificationData);
				await trackUserActivity(userId, 'Your file has been deleted successfully.');
				return res.status(200).json({ status: true, message: 'File deleted successfully', data: file });
			} else {
				// If the user is not the creator of the file or an admin, return a 403 error
				return res.status(403).json({ status: false, message: 'User not authorized to delete this file' });
			}
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	getListOfContributors: async (req, res) => {
		try {
			const { folderId } = req.params;

			const folderStructure = await fetchSubfoldersRecursive(folderId);

			// Function to get all files in a folder and its subfolders recursively
			const getAllFilesInFolder = async (folderId) => {
				const files = await FileManagerFile.find({ folderId }); // Adjust as per your file model

				let subFolderFiles = [];
				for (const subFolder of folderStructure) {
					const subFolderFilesRecursive = await getAllFilesInFolder(subFolder._id);
					subFolderFiles = [...subFolderFiles, ...subFolderFilesRecursive];
				}

				return [...files, ...subFolderFiles];
			};

			const files = await getAllFilesInFolder(folderId);

			if (!files || files.length === 0) {
				return res
					.status(404)
					.json({ status: false, message: 'No files found in the specified folder and its subfolders' });
			}

			// Extract distinct user details
			const contributorsMap = new Map();

			for (const file of files) {
				if (file.createdBy) {
					const userId = file.createdBy._id.toString();
					if (!contributorsMap.has(userId)) {
						contributorsMap.set(userId, {
							_id: file.createdBy._id,
							name: file.createdBy.name,
							email: file.createdBy.email,
							image: file.createdBy.image,
							createdAt: file.createdAt
						});
					}
				}
			}

			const contributors = Array.from(contributorsMap.values());

			res.status(200).json({ status: true, data: { contributors } });
		} catch (error) {
			console.error('Error fetching contributors:', error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	getFavoriteFiles: async (req, res) => {
		try {
			const { id } = req.params;
			const favoriteFiles = await FavoriteFiles.findOne({ userId: id });
			if (!favoriteFiles) {
				return res.status(200).json({ status: true, data: [] });
			}
			const files = await FileManagerFile.find({ _id: { $in: favoriteFiles.files } });
			res.status(200).json({ status: true, data: files });
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	getFileDetails: async (req, res) => {
		try {
			const { fileId } = req.params;
			const file = await FileManagerFile.findById(fileId).populate('createdBy', 'name email image');
			if (!file) {
				return res.status(404).json({ status: false, message: 'File not found' });
			}
			res.status(200).json({ status: true, data: file });
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	createFolder: async (req, res) => {
		try {
			const { userId, folderName, description, currentFolderId } = req.body;
			let parentFolderPath = '';

			if (!folderName) {
				return res.status(400).json({ status: false, message: 'Folder name is required' });
			}

			if (currentFolderId) {
				const currentFolderData = await FileManagerFolder.findById(currentFolderId);
				if (!currentFolderData) {
					return res.status(404).json({ status: false, message: 'Current folder not found' });
				}
				parentFolderPath = currentFolderData.folderPath || '';
			}

			const userData = await User.findById(userId).select('fileManagerDirectory');
			if (!userData) {
				return res.status(404).json({ status: false, message: 'User Directory not found' });
			}

			let folderLocation;
			if (parentFolderPath) {
				// If parent folder path is provided, create folder inside it
				folderLocation = path.join(
					__dirname,
					'..',
					'..',
					'storage',
					'fileManager',
					parentFolderPath,
					folderName
				);
			} else {
				// Otherwise, create folder in root directory
				const userDirectory = userData.fileManagerDirectory || '';
				folderLocation = path.join(__dirname, '..', '..', 'storage', 'fileManager', userDirectory, folderName);
			}

			if (fs.existsSync(folderLocation)) {
				return res.status(400).json({ status: false, message: 'Folder with the same name already exists' });
			}

			fs.mkdirSync(folderLocation, { recursive: true });

			const relativeFilePath = path.relative(
				path.join(__dirname, '..', '..', 'storage', 'fileManager'),
				folderLocation
			);

			const newFolder = new FileManagerFolder({
				folderName,
				createdBy: userId,
				description: description,
				folderPath: relativeFilePath,
				parentFolder: currentFolderId || null
			});

			await newFolder.save();
			const AdminNotificationData = {
				notification: `Your folder has been created successfully!`,
				notifyBy: userId,
				notifyTo: userId,
				type: 'Folder created',
				url: ''
			};
			createNotification(AdminNotificationData);
			await trackUserActivity(userId, 'Your folder has been created successfully!');
			return res.status(201).json({ status: true, message: 'Folder created successfully', data: newFolder });
		} catch (error) {
			errorLogger(error);
			return res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	getFoldersByUserId: async (req, res) => {
		const { userId } = req.params;
		const { parentFolderId } = req.query;

		try {
			const isPublic = process.env.FILE_MANAGER_IS_PUBLIC;
			const query = {
				status: 'active'
			};

			if (!isPublic) {
				query.createdBy = userId;
			}

			if (parentFolderId) {
				query.parentFolder = parentFolderId;
			} else {
				query.parentFolder = null;
			}

			const folders = await FileManagerFolder.find(query).populate({
				path: 'createdBy',
				select: 'email name image'
			});

			for (let folder of folders) {
				const fileCount = await getFileCount(folder._id);
				const totalSize = await getFileSize(folder._id);
				folder.fileCount = fileCount;
				folder.totalSize = totalSize;
			}

			return res.status(200).json({ status: true, data: folders });
		} catch (error) {
			console.log(error);
			errorLogger('Error fetching folders by user ID:', error);
			return res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	updateFolder: async (req, res) => {
		try {
			const { folderId } = req.params;
			const { userId, folderName, description } = req.body;

			let folder = await FileManagerFolder.findById(folderId);
			if (!folder) {
				return res.status(404).json({ status: false, message: 'Folder not found' });
			}

			const userData = await User.findById(userId).select('fileManagerDirectory');
			if (!userData) {
				return res.status(404).json({ status: false, message: 'User Directory not found' });
			}

			let folderPath = folder.folderPath; // The original folder path
			let updatedFolderPath = path.dirname(folderPath);
			const currentFolderPath = path.join(__dirname, '..', '..', 'storage', 'fileManager', folder.folderPath);

			folder.folderName = folderName || folder.folderName;
			folder.description = description || folder.description;

			// Save the folder to update its name and description
			await folder.save();

			const newFolderPath = path.join(
				__dirname,
				'..',
				'..',
				'storage',
				'fileManager',
				updatedFolderPath,
				folderName
			);

			const relativeFilePath = newFolderPath.split('fileManager/')[1];
			folder.folderPath = relativeFilePath;

			// Rename the folder on the filesystem
			fs.renameSync(currentFolderPath, newFolderPath);

			// Update the folderPath in the database
			await folder.save();
			const NotificationData = {
				notification: `Your folder has been updated successfully!`,
				notifyBy: userId,
				notifyTo: userId,
				type: 'Folder updated',
				url: ''
			};
			createNotification(NotificationData);
			await trackUserActivity(userId, 'Your folder has been updated successfully');
			res.status(200).json({ status: true, message: 'Folder updated successfully', data: folder });
			// Update file paths in the database
			const oldFiles = await FileManagerFile.find({ folderId: folderId });

			for (let file of oldFiles) {
				const oldFilePath = file.filePath;
				const oldFileName = path.basename(oldFilePath); // Extract the file name
				const newFilePath = path.join(relativeFilePath, oldFileName); // Construct the new file path
				file.filePath = newFilePath;
				await file.save();
			}

			return;
		} catch (error) {
			// Log and handle error
			errorLogger(error);
			return res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	uploadFile: async (req, res) => {
		try {
			const { userId, folderId } = req.body;

			const folder = await FileManagerFolder.findById(folderId);
			if (!folder) {
				return res.status(404).json({ status: false, message: 'Folder not found' });
			}
			const file = req.file;
			const { mimetype, size } = file;
			const uploadedFileName = req.modifiedFilename;
			const fileSizeKB = Math.round(size / 1024);

			const relativeFilePath = req.file.path.split('fileManager/')[1];

			// Create new file entry
			const newFile = new FileManagerFile({
				fileName: uploadedFileName,
				description: req.body.description || '',
				createdBy: userId,
				fileType: mimetype,
				fileSize: fileSizeKB,
				folderId: folderId,
				status: 'active',
				createdDate: new Date(),
				filePath: `${relativeFilePath}`
			});

			await newFile.save();
			const NotificationData = {
				notification: `Your file has been uploaded successfully!`,
				notifyBy: userId,
				notifyTo: userId,
				type: 'File uploaded',
				url: ''
			};
			createNotification(NotificationData);
			await trackUserActivity(userId, 'Your file has been uploaded successfully!');
			return res.status(201).json({ status: true, message: 'File uploaded successfully', data: newFile });
		} catch (error) {
			// Log the error
			errorLogger(error);
			return res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	getFilesByFolder: async (req, res) => {
		try {
			const { folderId } = req.params;

			const files = await FileManagerFile.find({ folderId: folderId, status: 'active' });

			return res.status(200).json({ status: true, data: files });
		} catch (error) {
			errorLogger(error);
			return res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	getFile: async (req, res) => {
		try {
			const { fileId } = req.params;

			const file = await FileManagerFile.findById(fileId).populate([
				{
					path: 'createdBy',
					select: 'email name image'
				},
				{
					path: 'folderId'
				}
			]);

			if (!file) {
				return res.status(404).json({ status: false, message: 'File not found' });
			}

			file.fileSize = convertSize(file.fileSize);

			return res.status(200).json({ status: true, data: file });
		} catch (error) {
			errorLogger(error);
			return res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	renameFile: async (req, res) => {
		try {
			const { fileId } = req.params;
			const { newName, newDescription } = req.body;

			const file = await FileManagerFile.findById(fileId);
			if (!file) {
				return res.status(404).json({ status: false, message: 'File not found' });
			}

			const currentFilePath = path.join(__dirname, '..', '..', 'storage', 'fileManager', file.filePath);
			const fileExtension = path.extname(file.fileName);

			// Construct the new file path with the new name and the same extension
			const newFileName = `${newName}${fileExtension}`;
			const directoryPath = path.dirname(currentFilePath);
			const newFilePath = path.join(directoryPath, newFileName);

			// Check if the new file name already exists in the current folder
			if (fs.existsSync(newFilePath)) {
				return res.status(400).json({
					status: false,
					message:
						'A file with this name already exists in the current directory. Please choose a unique name.'
				});
			}

			// Rename the file on the filesystem
			fs.renameSync(currentFilePath, newFilePath);

			const prevFilePath = file.filePath;
			const directoryPathFromPrevFilePath = prevFilePath.substring(0, prevFilePath.lastIndexOf('/') + 1);
			const updatedPath = directoryPathFromPrevFilePath + newFileName;

			// Update the file name and description in the database
			file.fileName = newFileName;
			file.description = newDescription;
			file.filePath = updatedPath;

			await file.save();
			const AdminNotificationData = {
				notification: `Your file has been renamed successfully!`,
				notifyBy: file.createdBy,
				notifyTo: file.createdBy,
				type: 'File rename',
				url: ''
			};
			createNotification(AdminNotificationData);
			await trackUserActivity(file.createdBy, 'Your file has been renamed successfully!');
			return res.status(200).json({ status: true, message: 'File renamed successfully', data: file });
		} catch (error) {
			errorLogger(error);
			return res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	recycledFilesAndFolders: async (req, res) => {
		try {
			const userId = req.params.userId;
			// Find all recycled files and folders created by the user
			let recycledFolders;
			const recycledFiles = await FileManagerFile.find({ status: 'deleted', createdBy: userId });
			recycledFolders = await FileManagerFolder.find({ status: 'deleted', createdBy: userId });

			const deletedAt = recycledFiles.length > 0 ? recycledFiles[0].deletedAt : null;

			for (let folder of recycledFolders) {
				const fileCount = await getFileCount(folder._id);
				const totalSize = await getFileSize(folder._id);
				// Assign file count and total size to the folder object
				folder.fileCount = fileCount;
				folder.totalSize = totalSize;
			}

			// Organize recycled folders hierarchically
			const organizedRecycledFolders = organizeFolders(recycledFolders, deletedAt);
			const data = [];
			for (let recycledFile of recycledFiles) {
				const parent = await FileManagerFolder.find({
					status: 'deleted',
					createdBy: userId,
					_id: recycledFile.folderId,
					deletedAt: recycledFile.deletedAt
				}).countDocuments();

				if (parent === 0) {
					recycledFile.filePath = recycledFile.filePath.split('fileManager/')[1];
					data.push(recycledFile);
				}
			}
			const AdminNotificationData = {
				notification: `Your recycled files and folders have been retrieved successfully!`,
				notifyBy: userId,
				notifyTo: userId,
				type: 'Recycled files and folder',
				url: ''
			};
			createNotification(AdminNotificationData);
			await trackUserActivity(userId, 'Your recycled files and folders have been retrieved successfully!');
			return res.status(200).json({
				status: true,
				message: 'Recycled files and folders retrieved successfully',
				data: { recycledFiles: data, recycledFolders: organizedRecycledFolders }
			});
		} catch (error) {
			errorLogger('Error fetching recycled files and folders:', error);
			return res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	recoverFolder: async (req, res) => {
		try {
			const { folderId } = req.body;

			let folder = await FileManagerFolder.findById(folderId);
			if (!folder) {
				return res.status(404).json({ status: false, message: 'Folder not found' });
			}

			// Recover the folder
			await recoverFolderAndSubfolders(folderId);
			await trackUserActivity(
				folder.createdBy,
				'Your folder and its subfolders have been recovered successfully!'
			);
			return res
				.status(200)
				.json({ status: true, message: 'Folder and its subfolders recovered successfully', data: folder });
		} catch (error) {
			// Log and handle error
			errorLogger(error);
			return res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	deleteFolder: async (req, res) => {
		try {
			const { folderId, userId } = req.body;
			const currentTime = new Date();
			// Find the folder to delete
			let folder = await FileManagerFolder.findById(folderId);
			if (!folder) {
				return res.status(404).json({ status: false, message: 'Folder not found' });
			}

			// Mark the folder as deleted
			folder.status = 'deleted';
			folder.deletedBy = userId;
			folder.deletedAt = currentTime;
			await folder.save();

			// Mark all files within the folder as deleted
			await FileManagerFile.updateMany(
				{ folderId: folderId, status: { $ne: 'deleted' } },
				{ $set: { status: 'deleted', deletedAt: currentTime } }
			);

			// Recursively delete subfolders
			await deleteSubfolders(folderId, userId, currentTime);
			const AdminNotificationData = {
				notification: `Your folder and its subfolders have been deleted successfully!`,
				notifyBy: userId,
				notifyTo: userId,
				type: 'folder and subfolders',
				url: ''
			};
			createNotification(AdminNotificationData);
			await trackUserActivity(userId, 'Your folder and its subfolders have been deleted successfully!');
			return res
				.status(200)
				.json({ status: true, message: 'Folder and its subfolders deleted successfully', data: folder });
		} catch (error) {
			// Log and handle error
			errorLogger(error);
			return res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	deleteFile: async (req, res) => {
		try {
			const { fileId, userId } = req.body;
			const currentTime = new Date();
			let file = await FileManagerFile.findById(fileId);
			if (!file) {
				return res.status(404).json({ status: false, message: 'File not found' });
			}

			file.status = 'deleted';
			file.deletedBy = userId;
			file.deletedAt = currentTime;
			await file.save();
			const AdminNotificationData = {
				notification: `Your file has been deleted successfully!`,
				notifyBy: userId,
				notifyTo: userId,
				type: 'File',
				url: ''
			};
			createNotification(AdminNotificationData);
			await trackUserActivity(userId, 'Your file has been deleted successfully!');
			return res.status(200).json({ status: true, message: 'File deleted successfully', data: file });
		} catch (error) {
			// Log and handle error
			errorLogger(error);
			return res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	getFilesWithParams: async (req, res) => {
		try {
			const { search, page, pageSize } = req.query;
			let query = { status: 'active' };
			let sortOption = { createdAt: -1 };
			const isPublic = process.env.FILE_MANAGER_IS_PUBLIC;

			if (search) {
				try {
					const searchParams = JSON.parse(search);

					if (isPublic) {
						query = { status: 'active' };
					} else {
						if (searchParams.userId || searchParams.folderId || searchParams.sorting) {
							if (searchParams.userId) {
								query.createdBy = searchParams.userId;
							}
							if (searchParams.folderId) {
								query.folderId = searchParams.folderId;
							}
							if (searchParams.sorting === 'alphaBetically') {
								sortOption = { fileName: 1 };
							}
						}
					}
				} catch (e) {
					console.log(e);
					return res.status(400).json({ status: false, message: 'Invalid search parameters' });
				}
			}

			const options = {
				skip: (page - 1) * pageSize,
				limit: parseInt(pageSize, 10),
				sort: sortOption
			};

			const files = await FileManagerFile.find(query, null, options).populate([
				{
					path: 'createdBy',
					select: 'email name image'
				},
				{
					path: 'folderId',
					match: { status: 'active' }
				}
			]);

			const validFiles = files.filter((file) => file.createdBy !== null && file.folderId !== null);
			const totalFiles = await FileManagerFile.countDocuments(query);

			const userIds = validFiles.map((file) => file.createdBy._id);

			let favoriteFiles;
			if (isPublic) {
				favoriteFiles = await FavoriteFiles.find();
			} else {
				favoriteFiles = await FavoriteFiles.find({ userId: { $in: userIds } });
			}

			const favoriteFilesMap = new Map();
			favoriteFiles.forEach((favFile) => {
				favoriteFilesMap.set(favFile.userId.toString(), favFile.files);
			});

			const filesWithFormattedSize = validFiles.map((file) => {
				const formattedFile = file.toObject();
				formattedFile.fileSize = convertSize(formattedFile.fileSize);

				if (!isPublic) {
					const userFavorites = favoriteFilesMap.get(file.createdBy._id.toString());
					formattedFile.isFavorite = userFavorites ? userFavorites.includes(formattedFile._id) : false;
				} else {
					formattedFile.isFavorite = favoriteFiles.some((fav) => fav.files.includes(formattedFile._id));
				}

				return formattedFile;
			});

			return res.status(200).json({ status: true, data: filesWithFormattedSize, totalCount: totalFiles });
		} catch (error) {
			errorLogger(error);
			return res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	getFilesByUser: async (req, res) => {
		try {
			const { userId } = req.params;
			const files = await FileManagerFile.find({ createdBy: userId, status: 'active' })
				.sort({ createdAt: -1 })
				.populate([
					{
						path: 'createdBy',
						select: 'email name image'
					},
					{
						path: 'folderId'
					}
				]);
			return res.status(200).json({ status: true, data: files });
		} catch (error) {
			errorLogger(error);
			return res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	recoverFile: async (req, res) => {
		try {
			const { fileId } = req.body;

			let file = await FileManagerFile.findById(fileId);
			if (!file) {
				return res.status(404).json({ status: false, message: 'File not found' });
			}

			file.status = 'active';
			file.deletedBy = null;
			await file.save();
			const AdminNotificationData = {
				notification: `Your file has been recovered successfully!`,
				notifyBy: file.createdBy,
				notifyTo: file.createdBy,
				type: 'File',
				url: ''
			};
			createNotification(AdminNotificationData);
			await trackUserActivity(file.createdBy, 'Your file has been recovered successfully!');
			return res.status(200).json({ status: true, message: 'File recover successfully', data: file });
		} catch (error) {
			// Log and handle error
			errorLogger(error);
			return res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	getFileTypes: async (req, res) => {
		try {
			const { userId } = req.params;
			const isPublic = process.env.FILE_MANAGER_IS_PUBLIC;

			const matchStage = isPublic
				? {} // Match everything if public
				: { createdBy: new mongoose.Types.ObjectId(userId) }; // Match specific user if not public

			const fileTypeCounts = await FileManagerFile.aggregate([
				{
					$match: matchStage
				},
				{
					$addFields: {
						fileCategory: {
							$switch: {
								branches: [
									{
										case: {
											$in: [
												'$fileType',
												['audio/mpeg', 'audio/mp3', 'video/mp4', 'video/x-matroska']
											]
										},
										then: 'Audio/Video'
									},
									{
										case: {
											$in: [
												'$fileType',
												[
													'application/pdf',
													'application/msword',
													'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
													'application/vnd.ms-excel',
													'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
													'application/vnd.ms-powerpoint',
													'application/vnd.openxmlformats-officedocument.presentationml.presentation'
												]
											]
										},
										then: 'Document'
									},
									{
										case: { $eq: ['$fileType', 'application/zip'] },
										then: 'Zip'
									},
									{
										case: {
											$in: ['$fileType', ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']]
										},
										then: 'Image'
									}
								],
								default: 'Other'
							}
						}
					}
				},
				{
					$group: {
						_id: '$fileCategory',
						count: { $sum: 1 },
						totalSizeKB: { $sum: '$fileSize' } // Total size in KB
					}
				},
				{
					$addFields: {
						sizeCount: {
							$cond: {
								if: { $gt: ['$totalSizeKB', 1024] },
								then: {
									$concat: [
										{ $toString: { $round: [{ $divide: ['$totalSizeKB', 1024] }, 0] } },
										' MB'
									]
								},
								else: {
									$concat: [{ $toString: '$totalSizeKB' }, ' KB']
								}
							}
						}
					}
				},
				{
					$project: {
						_id: 0,
						fileType: '$_id',
						count: 1,
						sizeCount: 1
					}
				}
			]);

			return res.status(200).json({ status: true, message: 'All file type counts', data: fileTypeCounts });
		} catch (error) {
			errorLogger('Error fetching file type counts:', error);
			res.status(500).json({ message: 'Internal server error' });
		}
	},

	deleteFolderPermanently: async (req, res) => {
		try {
			const { folderId } = req.body;

			// Recursively delete folder and its contents
			await deleteFolderAndContents(folderId);
			// await trackUserActivity(file.createdBy, 'Your file has been recovered successfully!');
			return res
				.status(200)
				.json({ status: true, message: 'Folder and its contents permanently deleted successfully' });
		} catch (error) {
			// Log and handle error
			errorLogger(error);
			return res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	deleteFilePermanently: async (req, res) => {
		try {
			const { fileId } = req.body;

			let folder = await FileManagerFile.findById(fileId);
			if (!folder) {
				return res.status(404).json({ status: false, message: 'Folder not found' });
			}

			// Remove the folder from the database
			await FileManagerFolder.findByIdAndDelete(fileId);
			const AdminNotificationData = {
				notification: `Your folder has been permanently deleted successfully!`,
				notifyBy: folder.createdBy,
				notifyTo: folder.createdBy,
				type: 'Folder',
				url: ''
			};
			createNotification(AdminNotificationData);
			await trackUserActivity(folder.createdBy, 'Your folder has been permanently deleted successfully!');
			return res
				.status(200)
				.json({ status: true, message: 'Folder permanently deleted successfully', data: folder });
		} catch (error) {
			// Log and handle error
			errorLogger(error);
			return res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	downloadFolder: async (req, res) => {
		const { folderId } = req.params;
		try {
			const folder = await FileManagerFolder.findById(folderId).select('folderPath');

			if (!folder) {
				return res.status(404).json({ status: false, message: 'Folder not found' });
			}

			const folderPath = path.join(__dirname, '..', '..', 'storage', 'fileManager', folder.folderPath);

			if (!fs.existsSync(folderPath)) {
				return res.status(404).json({ status: false, message: 'Folder not found' });
			}

			const folderContents = getFolderContents(folderPath);

			// Define the path for the zip file
			const zipFileName = 'folder.zip';
			const zipPath = path.join(__dirname, '..', '..', 'storage', 'fileManager', folder.folderPath, zipFileName);

			const output = fs.createWriteStream(zipPath);
			const archive = archiver('zip', { zlib: { level: 9 } });

			output.on('close', () => {
				res.download(zipPath, zipFileName, (err) => {
					if (err) {
						errorLogger('Error downloading the file:', err);
					}
					// Clean up the zip file after sending
					fs.unlink(zipPath, (unlinkErr) => {
						if (unlinkErr) errorLogger('Error deleting the zip file:', unlinkErr);
					});
				});
			});

			archive.on('error', (err) => {
				errorLogger('Archive error:', err);
				res.status(500).send('Error creating zip file');
			});

			archive.pipe(output);

			for (let item of folderContents) {
				if (item.path === zipPath) continue; // Skip the zip file itself
				if (item.type === 'file') {
					archive.file(item.path, { name: path.relative(folderPath, item.path) });
				} else {
					archive.directory(item.path, path.relative(folderPath, item.path) + '/');
				}
			}

			archive.finalize();
			const AdminNotificationData = {
				notification: `Your folder has been downloaded successfully!`,
				notifyBy: folder.createdBy,
				notifyTo: folder.createdBy,
				type: 'Folder',
				url: ''
			};
			createNotification(AdminNotificationData);
			await trackUserActivity(folder.createdBy, 'Your folder has been downloaded successfully!');
		} catch (error) {
			errorLogger('Error fetching folder contents:', error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	}
};

module.exports = fileManagerController;
