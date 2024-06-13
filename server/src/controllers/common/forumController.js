const ForumViewCount = require('../../models/ForumViewCount');
const Forum = require('../../models/forums');
const ForumCategory = require('../../models/forumCategory');
const ForumSubCategory = require('../../models/forumSubCategory');
const errorLogger = require('../../../logger');
const { createUpload } = require('../../utils/multerConfig');
const { getAdminDataByRole, trackUserActivity } = require('../../common/functions');
const unlinkImage = require('../../utils/unlinkImage');

const invoiceController = {
	addUpdateForumData: async (req, res) => {
		try {
			const upload = createUpload('forumImages');
			await upload.single('attachment')(req, res, async (err) => {
				if (err) {
					errorLogger('Error uploading attachment:', err);
					return res.status(500).json({ message: 'Error uploading attachment', status: false });
				}
				try {
					const forumData = {
						title: req.body.title,
						description: req.body.description,
						userId: req.body.userId,
						categoryId: req.body.categoryId,
						subCategoryId: req.body.subCategoryId,
						attachment: req.file ? req.file.filename : null
					};

					let forum;

					if (req.body.forumId) {
						forum = await Forum.findByIdAndUpdate(req.body.forumId, forumData, { new: true });
						if (!forum) {
							return res.status(404).json({ status: false, message: 'Forum not found' });
						}
					} else {
						forumData.userId = req.body.userId;
						forum = new Forum(forumData);
						await forum.save();
					}
					const adminId = await getAdminDataByRole('users');
					await trackUserActivity(adminId, 'Forum data updated by admin');
					res.status(200).json({ status: true, message: 'Forum data updated successfully', forum });
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

	getAllForums: async (req, res) => {
		try {
			const { search } = req.query; // Get the 'search' parameter from the request query
			const query = {};

			if (search) {
				const searchParams = JSON.parse(search);

				if (searchParams.subCatId) {
					query.subCategoryId = searchParams.subCatId;
				}

				if (searchParams.catId) {
					query.categoryId = searchParams.catId;
				}
				if (searchParams.search) {
					query.title = { $regex: new RegExp(searchParams.search, 'i') };
				}
			}

			const forums = await Forum.find(query)
				.sort({ createdAt: -1 })
				.populate('userId')
				.populate('categoryId')
				.populate('subCategoryId')
				.exec();

			const forumsWithViewCount = await Promise.all(
				forums.map(async (forum) => {
					try {
						const viewCount = await ForumViewCount.countDocuments({ forumId: forum._id });
						const forumObj = forum.toObject();
						forumObj.viewCount = viewCount;
						return forumObj;
					} catch (error) {
						errorLogger(`Error counting view documents for forum ${forum._id}:`, error);
						throw error;
					}
				})
			);

			res.status(200).json({ status: true, data: forumsWithViewCount });
		} catch (error) {
			console.log(error);
			errorLogger('Error fetching forums:', error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	deleteForumAttachment: async (req, res) => {
		try {
			const forum = await Forum.findById(req.body.forumId);
			if (!forum) {
				return res.status(404).json({ message: 'Forum not found', status: false });
			}

			await unlinkImage('forumImages', forum.attachment);

			forum.attachment = null;

			await forum.save();
			res.status(200).json({ status: true, message: 'Forum attachment deleted successfully' });
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	deleteForum: async (req, res) => {
		try {
			const forumId = req.body;
			if (!forumId) {
				return res.status(400).json({ status: false, message: 'Forums ID is required' });
			}

			await Forum.deleteMany({ _id: { $in: forumId } });

			return res.status(200).json({ status: true, message: 'Forums deleted successfully' });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ status: false, message: 'Server error' });
		}
	},

	getForumCategories: async (req, res) => {
		try {
			const categories = await ForumCategory.find();
			const subCategories = await Promise.all(
				categories.map(async (category) => {
					return await ForumSubCategory.find({ categoryId: category._id });
				})
			);

			const flattenedSubCategories = subCategories.reduce((acc, val) => acc.concat(val), []);

			const data = {
				categories,
				subCategories: flattenedSubCategories
			};
			res.status(200).json({ status: true, data: data });
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	}
};

module.exports = invoiceController;
