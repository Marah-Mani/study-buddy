const mongoose = require('mongoose');

const fileManagerFolderSchema = new mongoose.Schema({
	folderName: {
		type: String,
		required: true
	},
	totalSize: {
		type: String
	},
	fileCount: {
		type: String
	},
	description: {
		type: String
	},
	folderPath: {
		type: String
	},
	parentFolder: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'FileManagerFolder',
		default: null
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users',
		required: true
	},
	deletedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users'
	},
	status: {
		type: String,
		enum: ['active', 'inactive', 'deleted'],
		default: 'active'
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	deletedAt: {
		type: Date,
		default: Date.now
	}
});

const FileManagerFolder = mongoose.model('FileManagerFolder', fileManagerFolderSchema);

module.exports = FileManagerFolder;
