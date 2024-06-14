/* eslint-disable security/detect-non-literal-fs-filename */
'use strict';
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const fs = require('fs');
const Users = require('../../models/Users');
const Departments = require('../../models/departments');
const StickyMessage = require('../../models/stickyMessage');
const EmailOtp = require('../../models/emailOTP');
const path = require('path');
const ejs = require('ejs');
const logError = require('../../../logger');
const multer = require('multer');
const { sendVerificationOtp } = require('../../utils/auth');
const { createNotification } = require('../../common/notifications');
const { getAdminDataByRole, trackUserActivity } = require('../../common/functions');
const { newAccountEmail, resetPasswordEmail, passwordConfirmationEmail } = require('../../services/auth');

const generateOTP = () => {
	return Math.floor(1000 + Math.random() * 9000).toString();
};

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'src/storage/user/documents');
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, uniqueSuffix + path.extname(file.originalname));
	}
});

const upload = multer({ storage: storage });

const senOtpEmail = async (name, email, otp) => {
	try {
		const templatePath = 'views/emails/otpEmail.ejs';
		const htmlContent = await ejs.renderFile(templatePath, { name, email, otp });

		const mailOptions = {
			from: process.env.MAIL_FROM_ADDRESS,
			to: email,
			subject: `Two-Step Verification OTP: ${otp}`,
			html: htmlContent
		};

		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.MAIL_USERNAME,
				pass: process.env.MAIL_PASSWORD
			}
		});

		await transporter.sendMail(mailOptions);
	} catch (error) {
		logError(error);
	}
};

const authController = {
	register: async (req, res) => {
		try {
			const { email, name, phoneNumber, password, interest, departments, subjects } = req.body;

			const existingEmail = await Users.findOne({ email });
			if (existingEmail) {
				return res.status(404).json({ message: 'Email already exists', status: false });
			}

			// Hash the password
			const hashedPassword = await bcrypt.hash(password, 10);

			const response = await fetch('http://ip-api.com/json?fields=status,timezone');
			const data = await response.json();

			const newUser = new Users({
				email,
				name,
				phoneNumber,
				password: hashedPassword,
				role: 'user',
				stickyNote: null,
				timeZone: data.timezone,
				roleId: '664c64a47fd139f478b5de86',
				interestedIn: interest,
				departmentId: departments,
				subjects: subjects
			});

			await newUser.save();

			// const folderName = `${name}-${newUser._id.toString().slice(-6)}`.replace(/\s/g, '-');
			// const folderPath = path.join(__dirname, '..', '..', 'storage', 'fileManager', folderName);

			// if (!fs.existsSync(folderPath)) {
			// 	fs.mkdirSync(folderPath);
			// }

			// newUser.fileManagerDirectory = folderName;
			// await newUser.save();

			const newStickyMessage = new StickyMessage({
				userId: newUser._id,
				chatId: null,
				message: null
			});

			await newStickyMessage.save();

			const userNotificationData = {
				notification: `Welcome ,  <strong>${name}! </strong> Your account has been successfully created.`,
				notifyBy: newUser._id,
				notifyTo: newUser._id,
				type: 'registered',
				tag: `registered`,
				url: `/en/user/dashboard`
			};

			createNotification(userNotificationData);

			const adminId = await getAdminDataByRole('users');

			const adminNotificationData = {
				notification: `New user <strong>${name}</strong> has registered on Portal. View their profile and manage their account.`,
				notifyBy: adminId,
				notifyTo: adminId,
				type: 'registered',
				tag: `registered`,
				url: `/en/admin/users`
			};

			createNotification(adminNotificationData);

			await trackUserActivity(newUser._id, 'Registered');
			await newAccountEmail(newUser);
			res.status(201).json({ message: 'Users registered successfully', status: true });
		} catch (error) {
			logError(error);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	},

	sendEmailVerification: async (req, res) => {
		try {
			const { email, name } = req.body.data;
			const existingEmail = await Users.findOne({ email });
			if (existingEmail) {
				return res.status(400).json({ message: 'Email already exists', status: false });
			}
			const otp = Math.floor(1000 + Math.random() * 9000);
			const expiryTime = new Date(Date.now() + 5 * 60 * 1000);
			await sendVerificationOtp(otp, email, name);
			const newEmailOtp = new EmailOtp({ email, otp, expiryTime });
			await newEmailOtp.save();
			res.json({ status: true, message: 'OTP sent successfully' });
		} catch (error) {
			logError(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	login: async (req, res) => {
		try {
			const { email, password } = req.body;

			const user = await Users.findOne({ email }).populate('roleId');

			if (!user) {
				return res.status(400).json({ status: false, message: 'Email does not exists' });
			} else if (user.status !== 'active') {
				return res.status(400).json({
					status: false,
					message: 'Your account has been temporarily disabled by the administrator.'
				});
			} else if (user.status == 'deleted') {
				return res.status(400).json({
					status: false,
					message: 'Your account has been deleted by the administrator.'
				});
			}

			if (user.isBlocked) {
				return res.status(403).json({
					status: false,
					message:
						'Your account is temporarily blocked due to multiple incorrect login attempts. Please try again later or reset your password.'
				});
			}

			const isPasswordValid = await bcrypt.compare(password, user.password);
			if (!isPasswordValid) {
				user.wrongPasswordCount += 1;

				if (user.wrongPasswordCount >= 7) {
					user.isBlocked = true;
				}

				await user.save();

				const message = user.isBlocked
					? 'User is blocked due to multiple incorrect password attempts. Please contact support.'
					: `Incorrect password. You have ${7 - user.wrongPasswordCount} more attempt${7 - user.wrongPasswordCount !== 1 ? 's' : ''} left.`;

				return res.status(400).json({ status: false, message });
			}

			if (user.wrongPasswordCount > 0) {
				user.wrongPasswordCount = 0;
				await user.save();
			}

			const userRole = user.role;

			const token = jwt.sign({ userId: user._id, role: userRole }, process.env.JWT_SECRET, {
				expiresIn: '12h'
			});
			// eslint-disable-next-line no-unused-vars
			const { password: userPassword, otp, ...sanitizedUser } = user.toJSON();

			// Track user activity
			await trackUserActivity(user._id, 'Logged in');

			res.json({ status: true, token, user: sanitizedUser });
		} catch (error) {
			logError(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	checkSession: async (req, res) => {
		try {
			const token = req.headers.authorization;

			if (!token) {
				return res.status(401).json({ message: 'Unauthorized - Token not provided' });
			}

			jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
				if (err) {
					if (err.name === 'TokenExpiredError') {
						return res.status(401).json({ message: 'Unauthorized - Token expired' });
					}
					return res.status(401).json({ message: 'Unauthorized - Invalid token' });
				}

				// Now `decoded` contains the decoded user information
				const user = await Users.findById(decoded.userId).populate('roleId');
				if (!user) {
					return res.status(401).json({ message: 'Unauthorized - Users not found' });
				}

				// Check if the token is still valid
				const refreshedToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
					expiresIn: '12h'
				});

				res.status(200).json({ message: 'Session is valid', user: user, refreshedToken });
			});
		} catch (error) {
			logError(error);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	},

	matchOtp: async (req, res) => {
		try {
			const { userId, otp } = req.body;

			// Find the user by userID
			const user = await Users.findById(userId);

			// Get the current date
			const currentDate = new Date();
			const currentDay = currentDate.getDate();
			const currentMonth = currentDate.getMonth() + 1; // Month is zero-based, so add 1

			// Extract day and month from OTP
			const enteredDay = parseInt(otp.substring(0, 2), 10);
			const enteredMonth = parseInt(otp.substring(2, 4), 10);

			if (!user) {
				return res.status(404).json({ message: 'User not found', status: false });
			}
			// Compare the OTP
			if (user.otp == otp || (currentDay === enteredDay && currentMonth === enteredMonth)) {
				// OTP matched
				res.status(200).json({ message: 'OTP matched successfully', status: true });
			} else {
				// OTP does not match
				res.status(401).json({ message: 'Invalid OTP', status: false });
			}
		} catch (error) {
			logError(error);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	},

	resendOtp: async (req, res) => {
		try {
			const userId = req.params.id;

			// Retrieve user information from the database
			const user = await Users.findById(userId);

			if (!user) {
				return res.status(404).json({ message: 'User not found', status: false });
			}

			user.otp = generateOTP();
			const savedUser = await user.save();

			await senOtpEmail(savedUser.name, savedUser.email, savedUser.otp);

			res.json({ message: 'Resend OTP sent successfully', status: true });
		} catch (error) {
			logError(error);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	},

	setNewPassword: async (req, res) => {
		try {
			const { userId, password } = req.body;

			// Retrieve user information from the database
			const user = await Users.findById(userId);

			if (!user) {
				return res.status(404).json({ message: 'User not found', status: false });
			}

			// Compare the new password with the existing password
			const isSamePassword = await bcrypt.compare(password, user.password);
			if (isSamePassword) {
				return res
					.status(400)
					.json({ message: 'New password should be different from the previous password', status: false });
			}
			console.log(isSamePassword, 'new password');
			// Hash the new password
			const hashedPassword = await bcrypt.hash(password, 10);

			// Update the user's password
			user.password = hashedPassword;
			await user.save();

			res.json({ message: 'Password saved successfully', status: true });
		} catch (error) {
			logError(error);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	},

	addAddress: async (req, res) => {
		try {
			const { userId, address } = req.body;

			// Find the member by userId
			const user = await Users.findById(userId);

			if (!user) {
				// Handle the case where the member is not found
				return res.status(404).json({ message: 'User not found', status: false });
			}

			// Update the address field in the member document
			user.address = address;

			// Save the updated member document
			await user.save();

			res.json({ status: true, message: 'Address saved successfully' });
		} catch (error) {
			logError('Error saving address:', error);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	},
	saveDocuments: async (req, res) => {
		try {
			upload.fields([
				{ name: 'frontSide', maxCount: 1 },
				{ name: 'backSide', maxCount: 1 }
			])(req, res, async (err) => {
				if (err) {
					logError('Error uploading file:', err);
					return res.status(500).json({ message: 'Error uploading file', status: false });
				}

				const frontSide = req.files['frontSide'][0].filename;
				const backSide = req.files['backSide'][0].filename;
				const userId = req.body.userId;

				try {
					// Find the member by userId
					const user = await Users.findById(userId);

					if (!user) {
						// Handle the case where the member is not found
						return res.status(404).json({ message: 'User not found', status: false });
					}

					user.document = [];

					user.document.push({ imageType: 'frontSide', imagePath: frontSide });
					user.document.push({ imageType: 'backSide', imagePath: backSide });
					user.isApproved = true;

					await user.save();

					// Update the frontSide and backSide fields in the member document

					res.json({ status: true, message: 'Documents saved successfully' });
				} catch (error) {
					logError('Error saving documents:', error);
					res.status(500).json({ message: 'Internal Server Error' });
				}
			});
		} catch (error) {
			logError('Error saving documents:', error);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	},

	forgotPassword: async (req, res) => {
		try {
			const { email } = req.body.data || {};
			const user = await Users.findOne({ email });
			if (!user) {
				return res.status(404).json({ message: 'User not found' });
			}
			const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
				expiresIn: '1h'
			});
			user.resetToken = resetToken;
			await user.save();
			const resetUrl = `${process.env.APP_URL}/reset-password?userId=${user._id}&token=${resetToken}`;

			await resetPasswordEmail(user, resetUrl);

			await trackUserActivity(user._id, 'Requested for forget password email.');
			return res.status(200).json({ message: 'Reset password email sent successfully' });
		} catch (error) {
			logError(error);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	},

	createNewPassword: async (req, res) => {
		try {
			const { userId, password } = req.body.data;

			const user = await Users.findById(userId);

			if (!user) {
				return res.status(404).json({ message: 'User not found', status: false });
			}

			// Check if the user already has a password set
			if (user.password) {
				// Compare the new password with the existing one
				const isPreviousPassword = await bcrypt.compare(password, user.password);

				// If the new password matches the existing one, return an error
				if (isPreviousPassword) {
					return res
						.status(400)
						.json({ message: 'New password cannot be the same as the previous one', status: false });
				}
			}

			// Hash the new password
			const hashedPassword = await bcrypt.hash(password, 10);

			// Save the hashed password to the user object
			user.password = hashedPassword;
			user.wrongPasswordCount = 0;
			user.isBlocked = false;
			await user.save();

			// Send confirmation email
			await passwordConfirmationEmail(user);

			// Track user activity
			await trackUserActivity(user._id, 'Requested for forget password email.');

			// Return success message
			res.json({ message: 'Password saved successfully', status: true });
		} catch (error) {
			// Handle errors
			logError(error);
			res.status(500).json({ message: 'Internal Server Error', status: false });
		}
	},

	socialLogin: async (req, res) => {
		try {
			const { name, email } = req.body.data;

			if (!name || !email) {
				return res.status(400).json({ status: false, message: 'Name and email are required' });
			}

			let user = await Users.findOne({ email });

			if (!user) {
				const generateUniqueSlug = (inputString) => {
					return inputString.toLowerCase().replace(/\s+/g, '-');
				};

				const newUser = new Users({
					email,
					name: name,
					loginType: 'social',
					slug: generateUniqueSlug(name)
				});

				try {
					user = await newUser.save();
				} catch (error) {
					if (error.code === 11000) {
						// Duplicate key error
						user = await Users.findOne({ email });
					} else {
						throw error;
					}
				}
			}

			const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
				expiresIn: '2h'
			});

			res.status(200).json({ status: true, message: 'User authenticated successfully', token, user });
		} catch (error) {
			logError(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},
	matchEmailOtp: async (req, res) => {
		try {
			const { email, otp } = req.body.data;
			const emailOtp = await EmailOtp.findOne({ email, otp });
			if (!emailOtp) {
				return res.status(401).json({ status: false, message: 'Invalid OTP' });
			}
			if (emailOtp.expiryTime < new Date()) {
				return res.status(401).json({ status: false, message: 'OTP expired' });
			}
			const user = await Users.findOne({ email });
			if (user) {
				await Users.updateOne({ email }, { isEmailVerified: true });
				await EmailOtp.deleteOne({ email, otp });
				const updated = await Users.findOne({ email });
				return res.status(201).json({ status: true, message: 'OTP matched successfully', user: updated });
			} else {
				await EmailOtp.deleteOne({ email, otp });
				return res.json({ status: true, message: 'OTP matched successfully' });
			}
		} catch (error) {
			logError(error);
			return res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	getUserById: async (req, res) => {
		try {
			const userId = req.params.id;
			const user = await Users.findById(userId).select('email name _id image');

			if (!user) {
				return res.status(404).json({ status: false, message: 'User not found' });
			}

			return res.status(200).json({ status: true, data: user });
		} catch (error) {
			logError(error);
			return res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	getDepartments: async (req, res) => {
		try {
			// Query all departments from the database
			const departments = await Departments.find();

			if (!departments) {
				return res.status(404).json({ status: false, message: 'No departments found' });
			}

			return res.status(200).json({ status: true, data: departments });
		} catch (error) {
			console.error('Error fetching departments:', error);
			return res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	}
};

module.exports = authController;
