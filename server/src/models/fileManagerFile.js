const mongoose = require('mongoose');

const fileManagerFilesSchema = new mongoose.Schema({
	fileName: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users',
		required: true
	},
	filePath: {
		type: String,
		required: true
	},
	fileType: {
		type: String,
		required: true
	},
	fileSize: {
		type: Number,
		required: true
	},
	folderId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'FileManagerFolder',
		required: true
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

const FileManagerFile = mongoose.model('FileManagerFile', fileManagerFilesSchema);

module.exports = FileManagerFile;
