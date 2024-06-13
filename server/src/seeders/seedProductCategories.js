const mongoose = require('mongoose');
const ProductCategory = require('../models/productCategory');
const ProductSubCategory = require('../models/productSubCategory');

const categories = [
	{
		name: 'Books',
		description: 'Books for study across various subjects and levels.',
		subcategories: [
			{ name: 'Textbooks', description: 'Academic textbooks for schools and colleges.' },
			{ name: 'Reference Books', description: 'Books for reference and further reading.' },
			{ name: 'E-books', description: 'Digital format books for easy access.' }
		]
	},
	{
		name: 'Stationery',
		description: 'Essential stationery items for students.',
		subcategories: [
			{ name: 'Notebooks', description: 'Notebooks for taking notes and writing assignments.' },
			{ name: 'Pens & Pencils', description: 'Writing instruments including pens, pencils, and markers.' },
			{ name: 'Erasers & Sharpeners', description: 'Erasers and sharpeners for correction and maintenance.' },
			{ name: 'Files & Folders', description: 'Organizational tools for keeping documents and papers.' }
		]
	},
	{
		name: 'Electronics',
		description: 'Electronic devices useful for study purposes.',
		subcategories: [
			{ name: 'Laptops', description: 'Portable computers for studying and assignments.' },
			{ name: 'Tablets', description: 'Handheld devices for reading and note-taking.' },
			{ name: 'Calculators', description: 'Electronic calculators for mathematical calculations.' },
			{ name: 'Accessories', description: 'Electronic accessories like chargers, headphones, etc.' }
		]
	}
];

mongoose
	.connect(
		'mongodb+srv://stayable:7CCCzZDmorj3zd9h@cluster0.iyu0yml.mongodb.net/StudyBuddy?retryWrites=true&w=majority',
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
