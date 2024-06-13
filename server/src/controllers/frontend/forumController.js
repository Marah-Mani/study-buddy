const Forum = require('../../models/forums');
const ForumView = require('../../models/ForumViewCount');
const errorLogger = require('../../../logger');
const mongoose = require('mongoose');
const { createNotification } = require('../../common/notifications');
const user = require('../../models/Users');

const handleVoteForComment = (comment, type, userId) => {
	if (type === 'like') {
		comment.dislikes = comment.dislikes.filter((id) => id.toString() !== userId);
		if (!comment.likes.includes(userId)) {
			comment.likes.push(userId);
		}
	} else if (type === 'dislike') {
		comment.likes = comment.likes.filter((id) => id.toString() !== userId);
		if (!comment.dislikes.includes(userId)) {
			comment.dislikes.push(userId);
		}
	} else {
		throw new Error('Invalid vote type');
	}
};

const handleVoteForReply = (reply, type, userId) => {
	if (type === 'like') {
		reply.dislikes = reply.dislikes.filter((id) => id.toString() !== userId);
		if (!reply.likes.includes(userId)) {
			reply.likes.push(userId);
		}
	} else if (type === 'dislike') {
		reply.likes = reply.likes.filter((id) => id.toString() !== userId);
		if (!reply.dislikes.includes(userId)) {
			reply.dislikes.push(userId);
		}
	} else {
		throw new Error('Invalid vote type');
	}
};

const handleVoteForForum = (forum, type, userId) => {
	if (type === 'like') {
		forum.dislikes = forum.dislikes.filter((id) => id.toString() !== userId);
		if (!forum.likes.includes(userId)) {
			forum.likes.push(userId);
		}
	} else if (type === 'dislike') {
		forum.likes = forum.likes.filter((id) => id.toString() !== userId);
		if (!forum.dislikes.includes(userId)) {
			forum.dislikes.push(userId);
		}
	} else {
		throw new Error('Invalid vote type');
	}
};

const forumController = {
	getSingleForum: async (req, res) => {
		try {
			const slug = req.params.slug;

			const singleData = await Forum.findOne({ slug: slug })
				.populate('userId')
				.populate('comments.userId')
				.populate('comments.replies.userId')
				.sort({ createdAt: -1 }); // Sort the forum document itself

			if (singleData) {
				// Sort comments by createdAt in descending order
				singleData.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

				// Sort replies by createdAt in descending order within each comment
				singleData.comments.forEach((comment) => {
					comment.replies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
				});
			}

			let forumView = 0;

			if (singleData) {
				forumView = await ForumView.countDocuments({ forumId: singleData._id });
			}

			if (!singleData) {
				return res.status(404).json({ status: false, message: 'Data not found' });
			}
			res.status(200).json({ status: true, data: singleData, forumView: forumView });
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	submitForumComment: async (req, res) => {
		try {
			const { userId, forumId, comment } = req.body;

			const forum = await Forum.findById(forumId);

			if (!forum) {
				return res.status(404).json({ status: false, message: 'Forum not found' });
			}

			const newComment = {
				userId: userId,
				message: comment
			};

			forum.comments.push(newComment);
			const admin = await user.findOne({ role: 'admin' }).select('_id');
			const adminNotificationData = {
				notification: `New comment has been added`,
				comment: newComment,
				notifyBy: admin,
				notifyTo: admin,
				type: 'comment',
				tag: 'comment',
				url: '/en/admin/forums'
			};

			createNotification(adminNotificationData);
			await forum.save();

			const data = await Forum.findById(forumId)
				.populate('comments.userId')
				.populate('comments.replies.userId')
				.sort({ createdAt: -1 }); // Sort the forum document itself

			if (data) {
				// Sort comments by createdAt in descending order
				data.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

				// Sort replies by createdAt in descending order within each comment
				data.comments.forEach((comment) => {
					comment.replies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
				});
			}

			res.status(200).json({ status: true, message: 'Comment added successfully', data });
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	submitForumVote: async (req, res) => {
		try {
			const { forumId, commentId, userId, type, replyId } = req.body;

			// Validate input data
			if (!forumId || !userId || !type) {
				return res.status(400).json({ status: false, message: 'Missing required parameters' });
			}

			const forum = await Forum.findById(forumId);
			if (!forum) {
				return res.status(404).json({ status: false, message: 'Forum not found' });
			}

			if (!commentId && !replyId) {
				// Handle vote for forum
				handleVoteForForum(forum, type, userId);
			} else {
				const comment = forum.comments.id(commentId);
				if (!comment) {
					return res.status(404).json({ status: false, message: 'Comment not found' });
				}

				if (replyId) {
					const reply = comment.replies.id(replyId);
					if (!reply) {
						return res.status(404).json({ status: false, message: 'Reply not found' });
					}

					// Handle vote for reply
					handleVoteForReply(reply, type, userId);
				} else {
					// Handle vote for comment
					handleVoteForComment(comment, type, userId);
				}
			}

			await forum.save();

			const data = await Forum.findById(forumId)
				.populate('comments.userId')
				.populate('comments.replies.userId')
				.sort({ createdAt: -1 });

			if (data) {
				// Sort comments by createdAt in descending order
				data.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

				// Sort replies by createdAt in descending order within each comment
				data.comments.forEach((comment) => {
					comment.replies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
				});
			}

			res.status(200).json({ status: true, message: 'Vote submitted successfully', data });
		} catch (error) {
			console.error(error); // Log the error
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	submitForumReply: async (req, res) => {
		try {
			const { userId, forumId, message, commentId } = req.body;

			const forum = await Forum.findById(forumId);
			if (!forum) {
				return res.status(404).json({ status: false, message: 'Forum not found' });
			}

			const comment = forum.comments.id(commentId);
			if (!comment) {
				return res.status(404).json({ status: false, message: 'Comment not found' });
			}

			const newReply = {
				userId: userId,
				message: message
			};

			comment.replies.push(newReply);

			const admin = await user.findOne({ role: 'admin' }).select('_id');
			const adminNotificationData = {
				notification: `New reply has been added: ${message}`,
				comment: comment,
				notifyBy: admin,
				notifyTo: admin,
				type: 'comment',
				tag: 'comment',
				url: '/en/admin/forums'
			};

			createNotification(adminNotificationData);

			await forum.save();

			const data = await Forum.findById(forumId)
				.populate('comments.userId')
				.populate('comments.replies.userId')
				.sort({ createdAt: -1 });

			if (data) {
				// Sort comments by createdAt in descending order
				data.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

				// Sort replies by createdAt in descending order within each comment
				data.comments.forEach((comment) => {
					comment.replies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
				});
			}

			res.status(200).json({ status: true, message: 'Reply added successfully', data });
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	forumQuestionViews: async (req, res) => {
		try {
			const {
				forumId,
				country,
				countryCode,
				regionName,
				city,
				zip,
				lat,
				lon,
				timezone,
				isp,
				query,
				browserName,
				operatingSystem,
				deviceName
			} = req.body;

			await ForumView.create({
				forumId: forumId,
				country: country,
				countryCode: countryCode,
				regionName: regionName,
				city: city,
				zip: zip,
				lat: lat,
				lon: lon,
				timezone: timezone,
				isp: isp,
				ipAddress: query,
				operatingSystem: operatingSystem,
				browserName: browserName,
				deviceName: deviceName
			});

			res.status(200).json({ status: true, message: 'Forum count recorded successfully' });
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	getRelatedForums: async (req, res) => {
		try {
			const { id } = req.params;

			let relatedForums;
			let others;

			if (id === 'empty') {
				relatedForums = await Forum.aggregate([{ $sample: { size: 3 } }]);
				others = await Forum.aggregate([{ $sample: { size: 4 } }]);
			} else if (mongoose.Types.ObjectId.isValid(id)) {
				const catId = new mongoose.Types.ObjectId(id);
				relatedForums = await Forum.aggregate([{ $match: { categoryId: catId } }, { $sample: { size: 3 } }]);

				others = await Forum.find({ categoryId: { $ne: catId } }).limit(4);
			} else {
				return res.status(400).json({ status: false, message: 'Invalid category ID' });
			}

			const data = {
				relatedForums,
				others
			};

			res.status(200).json({ status: true, data });
		} catch (error) {
			errorLogger(error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},

	deleteComment: async (req, res) => {
		console.log(req.body, 'req');
		try {
			const { forumId, commentId } = req.body;
			if (!forumId || !commentId) {
				return res.status(400).json({ error: 'Forum ID or Comment ID not provided' });
			}

			// Assuming 'forums' is a MongoDB collection reference
			const result = await Forum.updateOne({ _id: forumId }, { $pull: { comments: { _id: commentId } } });

			if (result.nModified === 1) {
				return res.status(200).json({ message: 'Comment deleted successfully' });
			} else {
				return res.status(404).json({ error: 'Comment not found or already deleted' });
			}
		} catch (error) {
			console.error('Error deleting comment:', error);
			return res.status(500).json({ error: 'Internal server error' });
		}
	}
};

module.exports = forumController;
