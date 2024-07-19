const User = require('../../models/Users');
const errorLogger = require('../../../logger');
const { createUpload } = require('../../utils/multerConfig');
const bcrypt = require('bcrypt');
const { createNotification } = require('../../common/notifications');
const { trackUserActivity } = require('../../common/functions');

const profileController = {
	updateProfileDetails: async (req, res) => {
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
						interestedIn: req.body.interestedIn,
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
						const existingUser = await User.findByIdAndUpdate(req.body.userId, profileData, { new: true });
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
							brand: existingUser
						});
					} catch (error) {
						errorLogger('Error updating brand:', error);
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
	updatePassword: async (req, res) => {
		try {
			const id = req.params.id;
			const { currentPassword, newPassword } = req.body;

			const user = await User.findById(id);

			if (!user) {
				return res.status(404).json({ message: 'User not found', status: false });
			}

			const isPreviousPassword = await bcrypt.compare(newPassword, user.password);

			if (isPreviousPassword) {
				return res
					.status(400)
					.json({ message: 'New password cannot be the same as the previous one', status: false });
			}
			if (user.loginType === 'social') {
				if (user.loginType === 'social' && currentPassword) {
					const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
					if (!isPasswordMatch) {
						return res.status(400).json({ message: 'Current password not matched', status: false });
					}
					const hashedPassword = await bcrypt.hash(newPassword, 10);

					user.password = hashedPassword;
					await user.save();
				} else {
					const hashedPassword = await bcrypt.hash(newPassword, 10);
					user.password = hashedPassword;
					await user.save();
					return res.status(200).json({ message: 'Password updated successfully', status: true });
				}
			}

			const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

			if (!isPasswordMatch) {
				return res.status(400).json({ message: 'Current password not matched', status: false });
			}

			const hashedPassword = await bcrypt.hash(newPassword, 10);

			user.password = hashedPassword;
			await user.save();

			const userNotificationData = {
				notification: `Hi  <strong>${user.name}</strong> Your password has been updated successfully.`, // Customize the notification message as needed
				notifyBy: user._id, // Assuming the user ID is used for notification
				notifyTo: user._id, // Notify the user who updated their profile
				type: 'profile_update',
				url: `/en/user/edit-profile` // Optional URL to include in the notification
			};

			createNotification(userNotificationData);
			await trackUserActivity(id, `Password updated by ${user.name}`);
			res.json({ message: 'Password updated successfully', status: true });
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	},

	lastSeenUser: async (req, res) => {
		try {
			const userId = req.params.id;
			if (!userId) {
				return res.status(404).json({ message: 'User not found', status: false });
			}
			const lastSeen = new Date().toISOString();

			const user = await User.findByIdAndUpdate(userId, { lastSeen: lastSeen }, { new: true });
			const data = user.lastSeen;

			res.status(200).json({ status: true, message: 'last seen user', lastSeenData: data });
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	}
};

module.exports = profileController;
