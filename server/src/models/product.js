const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	title: { type: String, default: null, required: true },
	description: { type: String, default: null, required: true },
	price: { type: String, default: null },
	discountPrice: { type: String, default: null },
	categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'productCategory', required: true },
	subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'productSubcategory', default: null },
	images: [
		{
			name: { type: String, default: null }
		}
	],
	status: { type: String, enum: ['active', 'inactive', 'deleted'], default: 'active' },
	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users', default: null },
	deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users', default: null },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
});

const Products = mongoose.model('products', productSchema);

module.exports = Products;
