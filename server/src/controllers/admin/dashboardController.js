const User = require('../../models/Users');
const Product = require('../../models/product');
const Forums = require('../../models/forums');
const stickyMessage = require('../../models/stickyMessage');
const errorLogger = require('../../../logger');
const { trackUserActivity } = require('../../common/functions');

const dashboardController = {

    saveStickyNote: async (req, res) => {
        try {
            const { message } = req.body;

            if (!message) {
                return res.status(400).json({ status: false, message: 'Sticky note content is required' });
            }
            const newUser = new stickyMessage(req.body);
            await newUser.save();
            await trackUserActivity(newUser.userId, 'Your sticky note has been saved successfully!');
            return res.status(201).json({ status: true, message: 'Sticky note saved successfully', data: newUser });
        } catch (error) {
            errorLogger(error);
            return res.status(500).json({ status: false, message: 'Internal Server Error' });
        }
    },

    deleteStickyNote: async (req, res) => {
        try {
            const id = req.body._id;
            await stickyMessage.findByIdAndDelete(id);
            await trackUserActivity(id, 'Your sticky note has been deleted successfully!');
            res.status(200).json({ status: true, message: 'Sticky note deleted successfully' });
        } catch (error) {
            errorLogger(error);
            res.status(500).json({ status: false, message: 'Internal Server Error' });
        }
    },


    getAllStickyNote: async (req, res) => {
        try {
            const id = req.body._id;
            const user = await stickyMessage.findByIdAndUpdate(id);
            res.status(200).json({ status: true, data: user });
        } catch (error) {
            errorLogger(error);
            res.status(500).json({ status: false, message: 'Internal Server Error' });
        }
    },

    getDashboardData: async (req, res) => {
        try {
            // Execute all database queries in parallel
            const [
                totalStudentCount,
                totalTutorCount,
                totalUsers,
                totalProduct,
                totalForums,
                latestForums,
                latestProducts,
                latestUsers
            ] = await Promise.all([
                User.countDocuments({ interestedIn: 'student', status: 'active' }),
                User.countDocuments({ interestedIn: 'tutor', status: 'active' }),
                User.countDocuments({ role: { $ne: 'admin' }, status: 'active' }),
                Product.countDocuments({ status: 'active' }),
                Forums.countDocuments(),
                Forums.find().select('title createdAt slug').limit(10).sort({ createdAt: -1 }),
                Product.find().limit(10).sort({ createdAt: -1 }).populate('createdBy', 'name'),
                User.find().select('name image email phoneNumber createdAt').limit(10).sort({ createdAt: -1 })
            ]);

            const data = {
                totalStudentCount,
                totalTutorCount,
                totalUsers,
                totalProduct,
                totalForums,
                latestForums,
                latestProducts,
                latestUsers
            };

            res.status(200).json({ status: true, data });
        } catch (error) {
            errorLogger(error);
            res.status(500).json({ status: false, message: 'Internal Server Error' });
        }
    }

};

module.exports = dashboardController;
