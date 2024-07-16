const User = require('../../models/Users');
const Role = require('../../models/roles');
const userActivity = require('../../models/userActivity');
const Departments = require('../../models/departments');
// eslint-disable-next-line import/no-extraneous-dependencies
const asyncHandler = require('express-async-handler');
const errorLogger = require('../../../logger');

const chatController = {
	allUsers: asyncHandler(async (req, res) => {
		const keyword = req.query.search
			? {
					$or: [
						{ name: { $regex: req.query.search, $options: 'i' } },
						{ email: { $regex: req.query.search, $options: 'i' } }
					]
				}
			: {};

		const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
		res.send(users);
	}),

	getAllUsers: async (req, res) => {
		try {
			const users = await User.find({ status: 'active' }).select('_id name email image');
			res.status(200).json({ status: true, data: users });
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	allRoles: async (req, res) => {
		try {
			const roles = await Role.find({ status: { $in: ['active', 'inactive'] } }).sort({ _id: -1 });
			res.status(200).json({ status: true, data: roles });
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	getAllCandidate: async (req, res) => {
		const { interestedIn, department, searchQuery, subject, page = 1, pageSize = 10 } = req.query;

		try {
			let query = {
				status: 'active',
				role: { $ne: 'admin' },
				interestedIn: interestedIn === 'student' ? 'tutor' : 'student'
			};

			if (department) query.departmentId = department;

			if (searchQuery) {
				const sanitizedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
				query.name = { $regex: sanitizedQuery, $options: 'i' };
			}

			if (subject) {
				query.subjects = subject;
			}

			const totalCount = await User.countDocuments(query);

			const users = await User.find(query)
				.select('-password')
				.populate('departmentId')
				.sort({ createdAt: -1 })
				.skip((page - 1) * parseInt(pageSize))
				.limit(parseInt(pageSize));

			res.status(200).json({
				status: true,
				data: users,
				totalCount: totalCount,
				totalPages: Math.ceil(totalCount / parseInt(pageSize)),
				currentPage: parseInt(page),
				pageSize: parseInt(pageSize)
			});
		} catch (error) {
			console.error('Error in getAllCandidate:', error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	getAllDepartments: async (req, res) => {
		try {
			const departments = await Departments.find();
			res.status(200).json({ status: true, data: departments });
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},
	blockedUser: async (req, res) => {
		try {
			const users = await User.findById(req.params.id).populate('block');
			res.status(200).json({ status: true, data: users });
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	updateUser: asyncHandler(async (req, res) => {
		try {
			const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

			if (!user) {
				return res.status(404).json({ status: false, message: 'User not found' });
			}

			res.status(200).json({ status: true, data: user });
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	}),

	getUserActivities: async (req, res) => {
		try {
			const user = await userActivity.find({ userId: req.params.id }).limit(10).sort({ createdAt: -1 });
			res.status(200).json({ status: true, data: user });
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},
	getAllUsersStudyBuddy: async (req, res) => {
		try {
			const { search } = req.query;
			let query = {};
			if (search) {
				query = {
					name: { $regex: search, $options: 'i' }
				};
			}
			const users = await User.find(query).sort({ _id: -1 }).populate('departmentId', 'departmentName');
			res.status(200).json({ status: true, data: users });
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	}
};

module.exports = chatController;
