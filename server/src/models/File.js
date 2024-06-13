const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
	name: String,
	size: Number,
	type: String,
	path: String
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
