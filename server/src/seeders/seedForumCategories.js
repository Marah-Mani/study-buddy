const mongoose = require('mongoose');
const ForumCategory = require('../models/forumCategory');
const ForumSubCategory = require('../models/forumSubCategory');

const categories = [
	{
		name: 'Electronics',
		description: 'A category for discussions related to software engineering.',
		subcategories: [
			{ name: 'Calculus', description: 'Mathematical study of continuous change' },
			{ name: 'Physics 1', description: 'Fundamentals of mechanics, heat, and sound' },
			{ name: 'Calculus 2', description: 'Advanced topics in calculus, including integration and series' },
			{ name: 'Differential Equations', description: 'Mathematical equations involving derivatives of functions' }
		]
	},
	{
		name: 'Materials',
		description: 'A category for discussions related to various academic materials.',
		subcategories: [
			{
				name: 'Linear Algebra',
				description: 'Mathematical study of vectors, vector spaces, and linear transformations'
			},
			{
				name: 'Calculus 1',
				description: 'Introduction to calculus, including limits, derivatives, and integrals'
			},
			{
				name: 'Organic Chemistry',
				description: 'Study of the structure, properties, and reactions of organic compounds'
			},
			{
				name: 'Physical Chemistry',
				description: 'Study of macroscopic, atomic, subatomic, and particulate phenomena in chemical systems'
			}
		]
	},
	{
		name: 'Pharma',
		description: 'A category for discussions related to pharmaceutical studies and chemistry.',
		subcategories: [
			{
				name: 'Calculus 1',
				description: 'Introduction to calculus, including limits, derivatives, and integrals'
			},
			{ name: 'Introduction to Chemistry', description: 'Basics of chemical principles and reactions' },
			{
				name: 'Analytical Chemistry 1',
				description: 'Introduction to techniques and methods for analyzing chemical compounds'
			},
			{
				name: 'Organic Chemistry',
				description: 'Study of the structure, properties, and reactions of organic compounds'
			}
		]
	},
	{
		name: 'Machines',
		description: 'A category for discussions related to machine studies and engineering.',
		subcategories: [
			{
				name: 'Calculus 1',
				description: 'Introduction to calculus, including limits, derivatives, and integrals'
			},
			{ name: 'Physics 1', description: 'Fundamentals of mechanics, heat, and sound' },
			{ name: 'Calculus 2', description: 'Advanced topics in calculus, including integration and series' },
			{
				name: 'Physics 2',
				description: 'Advanced topics in physics, including electricity, magnetism, and optics'
			}
		]
	},
	{
		name: 'Software',
		description: 'A category for discussions related to software studies and computer science.',
		subcategories: [
			{
				name: 'Discrete Mathematics',
				description: 'Study of mathematical structures that are fundamentally discrete rather than continuous'
			},
			{
				name: 'Introduction to Programming',
				description: 'Basics of programming, including fundamental concepts and introductory coding skills'
			},
			{
				name: 'Calculus 1',
				description: 'Introduction to calculus, including limits, derivatives, and integrals'
			},
			{
				name: 'Data Structures',
				description: 'Introduction to data structures and algorithms for organizing and manipulating data'
			}
		]
	}
];

mongoose
	.connect(
		'mongodb+srv://studyBuddy:CxbBCXJqdiK59ZRY@cluster0.dyl8mzf.mongodb.net/study-buddy-dev?retryWrites=true&w=majority',
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
