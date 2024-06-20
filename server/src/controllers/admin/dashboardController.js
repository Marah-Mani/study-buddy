const User = require('../../models/Users');
const Product = require('../../models/product');
const Forums = require('../../models/forums');
const stickyMessage = require('../../models/stickyMessage');
const errorLogger = require('../../../logger');

const dashboardController = {

    saveStickyNote: async (req, res) => {
        try {
            const { message } = req.body;

            if (!message) {
                return res.status(400).json({ status: false, message: 'Sticky note content is required' });
            }
            const newUser = new stickyMessage(req.body);
            await newUser.save();
            return res.status(201).json({ status: true, message: 'Sticky note saved successfully', data: newUser });
        } catch (error) {
            errorLogger(error);
            return res.status(500).json({ status: false, message: 'Internal Server Error' });
        }
    },

    deleteStickyNote: async (req, res) => {
        try {
            const id = req.body._id;
            await stickyMessage.findByIdAndDelete(id)
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
            const totalStudentCount = await User.countDocuments({ interestedIn: 'student', status: 'active' });
            const totalTutorCount = await User.countDocuments({
                interestedIn: 'tutor', status: 'active'
            });
            const totalUsers = await User.countDocuments({ role: 'user', status: 'active' })
            const totalProduct = await Product.countDocuments({ status: 'active' })
            const totalForums = await Forums.countDocuments()

            const data = {
                totalStudentCount,
                totalTutorCount,
                totalUsers,
                totalProduct,
                totalForums,
            }
            res.status(200).json({ status: true, data: data });
        } catch (error) {
            errorLogger(error);
            res.status(500).json({ status: false, message: 'Internal Server Error' });
        }
    }
};

module.exports = dashboardController;
