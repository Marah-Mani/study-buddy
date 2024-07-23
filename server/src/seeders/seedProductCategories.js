const mongoose = require('mongoose');
const ProductCategory = require('../models/productCategory');
const ProductSubCategory = require('../models/productSubCategory');

const categories = [
	{
		name: 'Textbooks',
		description: 'Books for study across various subjects and levels.',
		subcategories: [
			{
				name: 'Study Guides',
				description: 'Study guides to help understand and prepare for academic subjects or exams.'
			},
			{
				name: 'Notes',
				description: 'Notes compiled to summarize and review key information from lectures or textbooks.'
			},
			{
				name: 'New Textbooks',
				description: 'New textbooks for learning and studying various academic subjects.'
			},
			{
				name: 'Used Textbooks',
				description:
					'Used textbooks that have been previously owned and may show signs of use, often available at a lower cost.'
			}
		]
	},
	{
		name: 'Dorm and apartment essentials',
		description: 'Essential stationery items for students.',
		subcategories: [
			{
				name: 'Furniture',
				description:
					'Furniture for creating comfortable living and working spaces, including chairs, desks, and shelves.'
			},
			{
				name: 'Kitchen Appliances',
				description:
					'Kitchen appliances for cooking, baking, and food preparation, including ovens, blenders, and refrigerators.'
			},
			{
				name: 'Decoration',
				description:
					'Decoration items for enhancing aesthetic appeal and personalizing spaces, including art pieces, vases, and decorative accents.'
			},
			{
				name: 'Storage Solutions',
				description:
					'Storage solutions for organizing and storing belongings efficiently, including cabinets, shelves, and storage boxes.'
			}
		]
	},
	{
		name: 'Electronics',
		description: 'Electronic devices useful for study purposes.',
		subcategories: [
			{
				name: 'Tablets',
				description: 'Tablets for digital note-taking, browsing, and multimedia consumption.'
			},
			{
				name: 'Headphones',
				description: 'Headphones for immersive audio experience and private listening.'
			},
			{
				name: 'Earphones',
				description: 'Earphones for convenient and portable personal audio.'
			},
			{
				name: 'Calculators',
				description: 'Calculators for mathematical computations and problem-solving.'
			},
			{
				name: 'USB Drives',
				description: 'USB drives for storing and transferring files between devices.'
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
		await ProductCategory.deleteMany({});
		await ProductSubCategory.deleteMany({});
		console.log('Existing categories and subcategories deleted');

		for (const categoryData of categories) {
			const category = await ProductCategory.create({
				name: categoryData.name,
				description: categoryData.description
			});
			console.log(`Category created: ${category.name}`);

			for (const subcategoryData of categoryData.subcategories) {
				const subcategory = await ProductSubCategory.create({
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
