/* eslint-disable no-process-env */
const userActivity = require('../../models/userActivity');
const Users = require('../../models/Users');
const errorLogger = require('../../../logger');
const { createUpload } = require('../../utils/multerConfig');
const { createNotification } = require('../../common/notifications');
const { trackUserActivity } = require('../../common/functions');

const userController = {
	getAllActivity: async (req, res) => {
		try {
			const userActivities = await userActivity.find().populate('userId');
			res.status(200).json({ status: true, data: userActivities });
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	getAllUsers: async (req, res) => {
		try {
			const searchQuery = req.query.search || '';

			// Create a MongoDB query object
			const query = {
				status: { $in: ['active', 'inactive'] },
				role: { $ne: 'admin' }
			};

			if (searchQuery) {
				query.name = { $regex: searchQuery, $options: 'i' };
			}

			const users = await Users.find(query)
				.sort({ _id: -1 })
				.populate('departmentId', 'departmentName');

			res.status(200).json({ status: true, data: users });
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},


	updateUserDetails: async (req, res) => {
		try {
			const upload = createUpload('userImage');
			upload.single('image')(req, res, async (err) => {
				if (err) {
					errorLogger('Error uploading logo:', err);
					return res.status(500).json({ message: 'Error uploading logo', status: false });
				}

				try {
					let imageValue = null;

					if (req.file && req.file.filename) {
						imageValue = req.file.filename;
					} else if (req.body.image && req.body.image !== 'null') {
						imageValue = req.body.image;
					} else {
						imageValue = null; // Ensure imageValue is set to null if no image is provided
					}
					const profileData = {
						name: req.body.name,
						email: req.body.email,
						phoneNumber: req.body.phoneNumber,
						address: {
							country: req.body.country,
							state: req.body.state
						},
						skills: req.body.skills ? req.body.skills.split(',').map((skill) => skill.trim()) : [],
						languages: req.body.languages ? req.body.languages.split(',').map((lang) => lang.trim()) : [],
						profileTitle: req.body.profileTitle,
						higherEducation: req.body.higherEducation,
						profileDescription: req.body.profileDescription,
						gender: req.body.gender,
						socialLinks: {
							twitter: req.body.twitter || '',
							facebook: req.body.facebook || '',
							linkedin: req.body.linkedIn || '',
							instagram: req.body.instagram || '',
							website: req.body.website || ''
						},
						image: imageValue
					};

					try {
						const existingUser = await Users.findByIdAndUpdate(req.body.userId, profileData, { new: true });
						await trackUserActivity(req.body.userId, `Profile updated by ${req.body.name}`);
						const UserNotificationData = {
							notification: `Profile has been updated successfully`,
							notifyBy: req.body.userId,
							notifyTo: req.body.userId,
							type: 'profile update',
							url: '/user/edit-profile'
						};
						createNotification(UserNotificationData);
						return res.status(200).json({
							status: true,
							message: 'Profile has been updated successfully',
							user: existingUser
						});
					} catch (error) {
						errorLogger('Error updating user:', error);
						return res.status(500).json({ status: false, message: 'Internal Server Error' });
					}
				} catch (error) {
					errorLogger(error);
					return res.status(500).json({ status: false, message: 'Internal Server Error' });
				}
			});
		} catch (error) {
			errorLogger(error);
			return res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	deleteUser: async (req, res) => {
		try {
			const { id } = req.params;
			const updatedUser = await Users.updateOne(
				{ _id: id },
				{ $set: { status: 'deleted' } } // Update the status field to 'deleted'
			);

			if (updatedUser.matchedCount === 0) {
				return res.status(404).json({ message: 'User not found', status: false });
			}

			res.status(200).json({ message: 'User status updated to deleted', status: true });
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	},

	updateUserStatus: async (req, res) => {
		try {
			const { userId, status } = req.body;
			if (!userId) {
				return res.status(404).json({ message: 'User not found', status: false });
			}
			await Users.updateOne({ _id: userId }, { status });
			res.status(200).json({
				status: true,
				message: 'User status updated successfully'
			});
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	},

	getSingleUserDetail: async (req, res) => {
		try {
			const userId = req.params.id;
			if (!userId) {
				return res.status(404).json({ message: 'User not found', status: false });
			}
			const user = await Users.findOne({ _id: userId });
			if (!user) {
				return res.status(404).json({ message: 'User not found', status: false });
			}
			res.status(200).json({ status: true, data: user });
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	}
};

module.exports = userController;
