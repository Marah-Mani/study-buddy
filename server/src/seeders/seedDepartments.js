const mongoose = require('mongoose');
const Department = require('../models/departments');

// Static data to be seeded
const initialDepartments = [
	{
		departmentName: 'Computer Science',
		subjects: ['C++', 'Java', 'Python']
	},
	{
		departmentName: 'Electrical Engineering',
		subjects: ['Circuit Analysis', 'Electromagnetics', 'Power Systems']
	},
	{
		departmentName: 'Mechanical Engineering',
		subjects: ['Statics', 'Dynamics', 'Thermodynamics']
	},
	{
		departmentName: 'Civil Engineering',
		subjects: ['Structural Analysis', 'Fluid Mechanics', 'Geotechnical Engineering']
	}
	// Add more departments as needed
];

// MongoDB connection URI
const mongoURI =
	'mongodb+srv://stayable:7CCCzZDmorj3zd9h@cluster0.iyu0yml.mongodb.net/StudyBuddy?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose
	.connect(mongoURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(async () => {
		console.log('Connected to MongoDB');

		// Function to seed initial data
		const seedInitialData = async () => {
			try {
				// Check if there are any existing departments
				const count = await Department.countDocuments();

				// If no departments exist, seed the initial data
				if (count === 0) {
					await Department.insertMany(initialDepartments);
					console.log('Initial department data seeded successfully');
				} else {
					console.log('Departments already exist, skipping seeding');
				}
			} catch (err) {
				console.error('Error seeding initial department data:', err);
			} finally {
				// Close the connection after seeding
				mongoose.connection.close();
				console.log('MongoDB disconnected');
			}
		};

		// Call seeding function
		await seedInitialData();
	})
	.catch((err) => console.error('Could not connect to MongoDB', err));
