const mongoose = require('mongoose');

// Define the schema for roles
const DepartmentSchema = new mongoose.Schema({
	departmentName: { type: String, required: true },
	subjects: [{ type: String, required: true }]
});

// Create the Role model using the schema
const department = mongoose.model('department', DepartmentSchema);

module.exports = department;
