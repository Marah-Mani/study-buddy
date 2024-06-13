const errorLogger = require('../../../logger');
const FileManagerFile = require('../../models/fileManagerFile');
const FavoriteFiles = require('../../models/favoritesFiles');
const FileManagerFolder = require('../../models/fileManagerFolder');

const fileManagerController = {
    addOrRemoveFileToFavorite: async (req, res) => {
        try {
            const { fileId, userId, type } = req.body;
            const favoriteFile = await FavoriteFiles.findOne({ userId: userId });

            if (type === 'favorite') {
                if (favoriteFile) {
                    await FavoriteFiles.updateOne(
                        { userId: userId },
                        { $addToSet: { files: fileId } }
                    );
                } else {
                    const newFavoriteFile = new FavoriteFiles({
                        userId: userId,
                        files: [fileId]
                    });
                    await newFavoriteFile.save();
                }
                res.status(200).json({ status: true, message: 'File added to favorite successfully' });
            } else {
                if (favoriteFile) {
                    await FavoriteFiles.updateOne(
                        { userId: userId },
                        { $pull: { files: fileId } }
                    );
                    res.status(200).json({ status: true, message: 'File removed from favorite successfully' });
                } else {
                    res.status(404).json({ status: false, message: 'Favorite record not found' });
                }
            }
        } catch (error) {
            console.error(error);
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
            console.log(error);
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
            if (file.createdBy.toString() === userId) {
                file.status = 'deleted';
                file.deletedBy = userId;
                await file.save();

                return res.status(200).json({ status: true, message: 'File deleted successfully', data: file });
            } else {
                return res.status(403).json({ status: false, message: 'User not authorized to delete this file' });
            }
        } catch (error) {
            errorLogger(error);
            res.status(500).json({ status: false, message: 'Internal Server Error' });
        }
    },

    getListOfContributors: async (req, res) => {
        try {
            const { folderId } = req.body;

            // Function to get all files in a folder and its subfolders recursively
            const getAllFilesInFolder = async (folderId) => {
                const files = await FileManagerFile.find({ folderId: folderId }).populate('createdBy', 'email name image');
                const subFolders = await FileManagerFolder.find({ parentFolderId: folderId });

                for (const subFolder of subFolders) {
                    const subFolderFiles = await getAllFilesInFolder(subFolder._id);
                    files.push(...subFolderFiles);
                }

                return files;
            };

            const files = await getAllFilesInFolder(folderId);

            if (!files || files.length === 0) {
                return res.status(404).json({ status: false, message: 'Files not found' });
            }

            // Extract distinct user details
            const contributorsMap = new Map();

            for (const file of files) {
                if (file.createdBy) {
                    const userId = file.createdBy._id.toString();
                    if (!contributorsMap.has(userId)) {
                        contributorsMap.set(userId, file.createdBy);
                    }
                }
            }

            const contributors = Array.from(contributorsMap.values());

            res.status(200).json({ status: true, data: { contributors } });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: false, message: 'Internal Server Error' });
        }
    },

    getFavoriteFiles: async (req, res) => {
        try {
            const { id } = req.params;
            const favoriteFiles = await FavoriteFiles.findOne({ userId: id });
            if (!favoriteFiles) {
                return res.status(404).json({ status: false, message: 'Favorite files not found' });
            }
            const files = await FileManagerFile.find({ _id: { $in: favoriteFiles.files } });
            res.status(200).json({ status: true, data: files });
        } catch (error) {
            console.error(error);
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
            console.error(error);
            res.status(500).json({ status: false, message: 'Internal Server Error' });
        }
    }
}

module.exports = fileManagerController;
