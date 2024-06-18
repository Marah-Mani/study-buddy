const Product = require('../../models/product');
const errorLogger = require('../../../logger');

const productController = {

    getAllProducts: async (req, res) => {
        try {
            const { search } = req.query; // Get the 'search' parameter from the request query
            const query = {};
            if (search) {
                query.title = { $regex: new RegExp(search, 'i') };
            }

            const products = await Product.find(query)
                .sort({ createdAt: -1 })
                .populate('categoryId', 'name')
                .populate('subCategoryId', 'name');
            res.status(200).json({ status: true, data: products });
        } catch (error) {
            errorLogger(error);
            res.status(500).json({ status: false, message: 'Internal Server Error' });
        }
    },


}
module.exports = productController;
