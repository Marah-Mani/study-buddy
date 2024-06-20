// const User = require('../../models/Users');
const stickyMessage = require('../../models/stickyMessage');
const errorLogger = require('../../../logger');
const { trackUserActivity } = require('../../common/functions');

const dashboardController = {
	// saveStickyNote: async (req, res) => {
	//     try {
	//         const { userId, stickyNote } = req.body;
	//         const user = await User.findByIdAndUpdate(userId, { stickyNote: stickyNote });
	//         res.status(200).json({ status: true, message: 'Sticky note saved successfully', data: user });
	//     } catch (error) {
	//         errorLogger(error);
	//         res.status(500).json({ status: false, message: 'Internal Server Error' });
	//     }
	// },

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
	}
};

module.exports = dashboardController;
