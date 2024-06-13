const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DepartmentSchema = new Schema({
	departmentName: { type: String, required: true },
	subjects: [{ type: String, required: true }]
});

module.exports = mongoose.model('department', DepartmentSchema);
