/* eslint-disable no-process-env */
const userActivity = require('../../models/userActivity');
const Users = require('../../models/Users');
const errorLogger = require('../../../logger');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

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
			const users = await Users.find({
				status: { $in: ['active', 'inactive'] },
				role: { $ne: 'admin' }
			}).sort({ _id: -1 })
				.populate('departmentId', 'departmentName');

			res.status(200).json({ status: true, data: users });
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	addUpdateUser: async (req, res) => {
		try {
			const userData = {
				name: req.body.name,
				email: req.body.email,
				status: req.body.status,
				roleId: req.body.roleId,
				updatedBy: req.body.updatedBy
			};

			if (!userData.email) {
				return res.status(400).json({ status: false, message: 'Email is required' });
			}

			const existingUser = await Users.findOne({ email: userData.email });

			if (existingUser) {
				// Update existing user
				Object.assign(existingUser, userData);
				existingUser.updatedBy = userData.updatedBy;
				await existingUser.save();
				return res.status(200).json({ status: true, message: 'User updated successfully' });
			} else {
				// Add new user
				const newUser = new Users(userData);
				await newUser.save();

				const userId = newUser._id.toString();
				const resetToken = jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
					expiresIn: '1h'
				});
				newUser.resetToken = resetToken;
				const resetUrl = `${process.env.APP_URL}/reset-password?userId=${userId}&token=${resetToken}`;

				try {
					const transporter = nodemailer.createTransport({
						service: 'gmail',
						auth: {
							user: process.env.MAIL_USERNAME,
							pass: process.env.MAIL_PASSWORD
						}
					});

					await transporter.sendMail({
						from: 'your_email@example.com',
						to: userData.email,
						subject: 'User Added',
						html: `
							<p>Dear ${userData.name},</p>
							<p>Welcome to boiler! Your account has been created by the administrator, and now it's time to set up your password and start exploring your dashboard.</p>
							<p>To complete the setup process, please click on the link below to set your password:</p>
							<p><a href="${resetUrl}">Set Password</a></p>
							<p>Once you click the link, you'll be directed to a page where you can securely set your password. After that, you can log in using your email address (${userData.email}) and the password you just created.</p>
							<p>Thank you for choosing boiler! We're excited to have you on board.</p>
							<p>Best regards,<br>boiler plate</p>
						`
					});

					return res.status(200).json({ status: true, message: 'User added successfully' });
				} catch (emailError) {
					console.error('Error sending email:', emailError);
					return res.status(500).json({ status: false, message: 'User added but email sending failed' });
				}
			}
		} catch (error) {
			console.error('Error processing user operation:', error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	deleteUser: async (req, res) => {
		try {
			const { id } = req.params;
			const deletedUser = await Users.deleteOne({ _id: id });
			if (deletedUser.deletedCount === 0) {
				return res.status(404).json({ message: 'User not found', status: false });
			}
			res.status(200).json({ message: 'User deleted successfully', status: true });
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
				message: 'User status updated successfully',
			});
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	}
};

module.exports = userController;
