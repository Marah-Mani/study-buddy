const mongoose = require('mongoose');
const ForumCategory = require('../models/forumCategory');
const ForumSubCategory = require('../models/forumSubCategory');

const categories = [
	{
		name: 'Software Engineering',
		description: 'A category for discussions related to software engineering.',
		subcategories: [
			{ name: 'Calculus 0', description: 'Fundamentals of calculus for software engineers.' },
			{ name: 'Calculus 1', description: 'Advanced calculus concepts.' },
			{ name: 'Calculus 2', description: 'Multivariable calculus.' },
			{ name: 'Java', description: 'Programming in Java.' },
			{ name: 'C, C++', description: 'Programming in C and C++.' },
			{ name: 'Algorithms 1', description: 'Introduction to algorithms.' },
			{ name: 'Algorithms 2', description: 'Advanced algorithms.' },
			{ name: 'Physics 1', description: 'Physics for software engineering.' },
			{ name: 'Physics 2', description: 'Advanced physics for software engineering.' },
			{ name: 'Software Design', description: 'Principles of software design.' },
			{ name: 'Databases', description: 'Database management systems.' }
		]
	},
	{
		name: 'Mechanical Engineering',
		description: 'A category for discussions related to mechanical engineering.',
		subcategories: [
			{ name: 'Calculus 0', description: 'Fundamentals of calculus for mechanical engineers.' },
			{ name: 'Calculus 1', description: 'Advanced calculus concepts.' },
			{ name: 'Calculus 2', description: 'Multivariable calculus.' },
			{ name: 'Thermodynamics', description: 'Principles of thermodynamics.' },
			{ name: 'Fluid Mechanics', description: 'Basics of fluid mechanics.' },
			{ name: 'Mechanics of Materials', description: 'Study of material mechanics.' },
			{ name: 'Dynamics', description: 'Principles of dynamics.' }
		]
	},
	{
		name: 'Civil Engineering',
		description: 'A category for discussions related to civil engineering.',
		subcategories: [
			{ name: 'Structural Analysis', description: 'Principles of structural analysis.' },
			{ name: 'Geotechnical Engineering', description: 'Basics of geotechnical engineering.' },
			{ name: 'Environmental Engineering', description: 'Principles of environmental engineering.' },
			{ name: 'Transportation Engineering', description: 'Basics of transportation engineering.' },
			{ name: 'Construction Management', description: 'Study of construction management.' }
		]
	},
	{
		name: 'Computer Science',
		description: 'A category for discussions related to computer science.',
		subcategories: [
			{ name: 'Operating Systems', description: 'Principles of operating systems.' },
			{ name: 'Data Structures', description: 'Study of data structures.' },
			{ name: 'Networks', description: 'Basics of computer networks.' },
			{ name: 'Artificial Intelligence', description: 'Principles of AI and machine learning.' },
			{ name: 'Computer Graphics', description: 'Basics of computer graphics.' },
			{ name: 'Cybersecurity', description: 'Principles of cybersecurity.' }
		]
	},
	{
		name: 'Biomedical Engineering',
		description: 'A category for discussions related to biomedical engineering.',
		subcategories: [
			{ name: 'Biomechanics', description: 'Study of biomechanics.' },
			{ name: 'Biomedical Imaging', description: 'Principles of biomedical imaging.' },
			{ name: 'Biomaterials', description: 'Basics of biomaterials.' },
			{ name: 'Bioinstrumentation', description: 'Principles of bioinstrumentation.' },
			{
				name: 'Biomedical Signal Processing',
				description: 'Basics of signal processing in biomedical engineering.'
			}
		]
	},
	{
		name: 'Aerospace Engineering',
		description: 'A category for discussions related to aerospace engineering.',
		subcategories: [
			{ name: 'Aerodynamics', description: 'Principles of aerodynamics.' },
			{ name: 'Flight Mechanics', description: 'Study of flight mechanics.' },
			{ name: 'Aerospace Materials', description: 'Basics of materials used in aerospace.' },
			{ name: 'Propulsion', description: 'Principles of propulsion systems.' },
			{ name: 'Spacecraft Design', description: 'Designing spacecraft and related systems.' }
		]
	},
	{
		name: 'Chemical Engineering',
		description: 'A category for discussions related to chemical engineering.',
		subcategories: [
			{ name: 'Chemical Process Engineering', description: 'Principles of chemical process engineering.' },
			{ name: 'Thermodynamics', description: 'Thermodynamics in chemical engineering.' },
			{ name: 'Reaction Engineering', description: 'Study of chemical reactions and reactor design.' },
			{ name: 'Biochemical Engineering', description: 'Engineering principles applied to biological systems.' },
			{ name: 'Process Control', description: 'Control of chemical processes.' }
		]
	},
	{
		name: 'Environmental Engineering',
		description: 'A category for discussions related to environmental engineering.',
		subcategories: [
			{ name: 'Water Resources', description: 'Management of water resources.' },
			{ name: 'Air Quality', description: 'Study of air quality and pollution control.' },
			{ name: 'Waste Management', description: 'Principles of waste management.' },
			{ name: 'Environmental Impact Assessment', description: 'Assessing the environmental impact of projects.' },
			{ name: 'Sustainable Development', description: 'Principles of sustainable development in engineering.' }
		]
	},
	{
		name: 'Electrical Engineering',
		description: 'A category for discussions related to electrical engineering.',
		subcategories: [
			{ name: 'Calculus 0', description: 'Fundamentals of calculus for electrical engineers.' },
			{ name: 'Calculus 1', description: 'Advanced calculus concepts.' },
			{ name: 'Calculus 2', description: 'Multivariable calculus.' },
			{ name: 'Differential Functions', description: 'Study of differential functions.' },
			{ name: 'Physics 1', description: 'Physics for electrical engineering.' },
			{ name: 'Physics 2', description: 'Advanced physics for electrical engineering.' },
			{ name: 'Physics 3', description: 'Electromagnetism and optics.' },
			{ name: 'Physics 4', description: 'Quantum mechanics.' },
			{ name: 'Physics 5', description: 'Solid-state physics.' },
			{ name: 'Physics 6', description: 'Nuclear physics.' },
			{ name: 'Physics 7', description: 'Plasma physics.' }
		]
	}
];

mongoose
	.connect(
		'mongodb+srv://studyBuddy:CxbBCXJqdiK59ZRY@cluster0.dyl8mzf.mongodb.net/study-buddy?retryWrites=true&w=majority',
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(async () => {
		console.log('Connected to MongoDB');
		await seedCategories();
		mongoose.connection.close();
	})
	.catch((err) => console.error('Could not connect to MongoDB', err));

async function seedCategories() {
	try {
		await ForumCategory.deleteMany({});
		await ForumSubCategory.deleteMany({});
		console.log('Existing categories and subcategories deleted');

		for (const categoryData of categories) {
			const category = await ForumCategory.create({
				name: categoryData.name,
				description: categoryData.description
			});
			console.log(`Category created: ${category.name}`);

			for (const subcategoryData of categoryData.subcategories) {
				const subcategory = await ForumSubCategory.create({
					name: subcategoryData.name,
					description: subcategoryData.description,
					categoryId: category._id
				});
				console.log(`Subcategory created: ${subcategory.name} under ${category.name}`);
			}
		}

		console.log('All categories and subcategories have been seeded');
	} catch (error) {
		console.error('Error seeding categories:', error);
	}
}
