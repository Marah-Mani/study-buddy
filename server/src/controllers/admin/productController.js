const Product = require('../../models/product');
const ProductCategory = require('../../models/productCategory');
const ProductSubCategory = require('../../models/productSubCategory');
const errorLogger = require('../../../logger');
const { createUpload } = require('../../utils/multerConfig');

const productController = {

    getAllProducts: async (req, res) => {
        try {
            const products = await Product.find();
            res.status(200).json({ status: true, data: products });
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
                    name: file.originalname,
                }));
                try {
                    const productData = {
                        title: req.body.title,
                        description: req.body.description,
                        price: req.body.price,
                        discountPrice: req.body.discountPrice,
                        categoryId: req.body.categoryId,
                        subCategoryId: req.body.subCategoryId,
                        images: allImages,
                        status: req.body.status,
                        createdBy: req.body.createdBy,
                    };
                    const product = await Product.create(productData);
                    res.status(200).json({
                        status: true, data: product,
                        message: 'Product added successfully'
                    });
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
    }
}
module.exports = productController;
