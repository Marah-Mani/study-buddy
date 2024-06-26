
const Product = require('../../models/product');
const Forums = require('../../models/forums');
const errorLogger = require('../../../logger');

const dashboardController = {

    getDashboardData: async (req, res) => {
        try {
            const { id } = req.params;
            const [
                myProducts,
                myForums
            ] = await Promise.all([
                Product.find({ createdBy: id, status: 'active' }).select('title createdAt').limit(10).sort({ createdAt: -1 }),
                Forums.find({ userId: id }).select('title createdAt slug').limit(10).sort({ createdAt: -1 }),
            ]);
            const data = {
                myProducts,
                myForums
            };

            res.status(200).json({ status: true, data });
        } catch (error) {
            errorLogger(error);
            res.status(500).json({ status: false, message: 'Internal Server Error' });
        }
    }

};

module.exports = dashboardController;
