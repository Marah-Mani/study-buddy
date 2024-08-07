const Product = require('../../models/product');
const ProductCategory = require('../../models/productCategory');
const ProductSubCategory = require('../../models/productSubCategory');
const errorLogger = require('../../../logger');
const { createUpload } = require('../../utils/multerConfig');
const { trackUserActivity } = require('../../common/functions');

const productController = {
	getAllProducts: async (req, res) => {
		try {
			const { searchObject } = req.query;
			const query = { status: 'active' };
			if (searchObject.search) {
				query.title = { $regex: new RegExp(searchObject.search, 'i') };
			}
			if (searchObject.category) {
				query.categoryId = searchObject.category;
			}
			if (searchObject.subCategory) {
				query.subCategoryId = searchObject.subCategory;
			}

			const skip = (searchObject.page - 1) * searchObject.pageSize;
			const total = await Product.countDocuments(query);
			const products = await Product.find(query)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(parseInt(searchObject.pageSize))
				.populate('categoryId', 'name')
				.populate('subCategoryId', 'name')
				.populate('createdBy', 'name');

			res.status(200).json({ status: true, data: { products, total } });
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	getUserProducts: async (req, res) => {
		try {
			const { searchObject } = req.query;
			const query = {};
			if (searchObject.search) {
				query.title = { $regex: new RegExp(searchObject.search, 'i') };
			}
			if (searchObject.userId) {
				query.createdBy = searchObject.userId;
			}

			const skip = (searchObject.page - 1) * searchObject.pageSize;
			const total = await Product.countDocuments(query);
			const products = await Product.find(query)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(parseInt(searchObject.pageSize))
				.populate('categoryId', 'name')
				.populate('subCategoryId', 'name');

			res.status(200).json({ status: true, data: { products, total } });
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	addUpdateProductDetails: async (req, res) => {
		try {
			const upload = createUpload('productImages');
			await upload.multiple('images')(req, res, async (err) => {
				if (err) {
					errorLogger('Error uploading images:', err);
					return res.status(500).json({ message: 'Error uploading images', error: err });
				}

				const files = req.files;
				const allImages = files.map((file) => ({
					name: file.filename
				}));

				try {
					const productId = req.body.productId;
					let productData = {
						title: req.body.title,
						description: req.body.description,
						price: req.body.price,
						discountPrice: req.body.discountPrice,
						categoryId: req.body.categoryId,
						subCategoryId: req.body.subCategoryId ? req.body.subCategoryId : null,
						status: req.body.status,
						createdBy: req.body.createdBy
					};

					let product;
					if (productId) {
						// Fetch existing product to get current images
						const existingProduct = await Product.findById(productId);
						if (!existingProduct) {
							return res.status(404).json({ status: false, message: 'Product not found' });
						}

						// Merge existing images with new images
						if (allImages.length > 0) {
							productData.images = [...existingProduct.images, ...allImages];
						} else {
							productData.images = existingProduct.images;
						}

						// Update existing product
						product = await Product.findByIdAndUpdate(productId, productData, { new: true });
						res.status(200).json({
							status: true,
							data: product,
							message: 'Product updated successfully'
						});
					} else {
						// Create new product with new images
						productData.images = allImages;
						product = await Product.create(productData);
						res.status(200).json({
							status: true,
							data: product,
							message: 'Product added successfully'
						});
					}
					await trackUserActivity(product.createdBy, 'Your product has been added successfully.');
				} catch (error) {
					errorLogger(error);
					res.status(500).json({ status: false, message: 'Internal Server Error' });
				}
			});
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	getProductCategories: async (req, res) => {
		try {
			const categories = await ProductCategory.find();
			const subCategories = await Promise.all(
				categories.map(async (category) => {
					return await ProductSubCategory.find({ categoryId: category._id });
				})
			);

			const flattenedSubCategories = subCategories.reduce((acc, val) => acc.concat(val), []);

			const data = {
				categories,
				subCategories: flattenedSubCategories
			};
			res.status(200).json({ status: true, data: data });
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	getSingleProduct: async (req, res) => {
		try {
			const product = await Product.findById(req.params.id);
			res.status(200).json({ status: true, data: product });
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	deleteProductImage: async (req, res) => {
		try {
			const { productId, imageId } = req.body;

			// Fetch the product by ID
			const product = await Product.findById(productId);
			if (!product) {
				return res.status(404).json({ status: false, message: 'Product not found' });
			}
			const imageIndex = product.images.findIndex((image) => image._id.toString() === imageId);
			if (imageIndex === -1) {
				return res.status(404).json({ status: false, message: 'Image not found' });
			}

			product.images.splice(imageIndex, 1);

			await product.save();
			await trackUserActivity(product.deletedBy, 'Your image has been deleted successfully!');
			res.status(200).json({ status: true, message: 'Image deleted successfully' });
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	deleteProduct: async (req, res) => {
		try {
			const { id } = req.params;
			const product = await Product.findByIdAndDelete(id);
			if (!product) {
				return res.status(404).json({ status: false, message: 'Product not found' });
			}
			await trackUserActivity(product.deletedBy, 'Your product has been deleted successfully!');
			res.status(200).json({ status: true, message: 'Product deleted successfully' });
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	}
};
module.exports = productController;
