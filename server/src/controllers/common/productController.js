const Product = require('../../models/product');
const ProductCategory = require('../../models/productCategory');
const ProductSubCategory = require('../../models/productSubCategory');
const errorLogger = require('../../../logger');
const { createUpload } = require('../../utils/multerConfig');

const productController = {

    getAllProducts: async (req, res) => {
        try {
            const { searchObject } = req.query;
            const query = {};
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
                .populate('subCategoryId', 'name');

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
    }

}
module.exports = productController;
