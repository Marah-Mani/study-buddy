const Chat = require('../../models/Chat');
const Message = require('../../models/Message');
const User = require('../../models/Users');
// eslint-disable-next-line import/no-extraneous-dependencies
const asyncHandler = require('express-async-handler');
const StickyMessage = require('../../models/stickyMessage');
const File = require('../../models/File');
const { getAdminDataByRole } = require('../../common/functions');

const chatController = {
	accessChat: asyncHandler(async (req, res) => {
		const { userId } = req.body;

		if (!userId) {
			return res.sendStatus(400);
		}

		var isChat = await Chat.find({
			isGroupChat: false,
			$and: [{ users: { $elemMatch: { $eq: req.user._id } } }, { users: { $elemMatch: { $eq: userId } } }]
		})
			.populate('users', '-password')
			.populate('latestMessage');

		isChat = await User.populate(isChat, {
			path: 'latestMessage.sender',
			select: 'name pic email'
		});

		if (isChat.length > 0) {
			res.send(isChat[0]);
		} else {
			var chatData = {
				chatName: 'sender',
				isGroupChat: false,
				users: [req.user._id, userId],
				createdBy: req.user._id
			};

			try {
				const createdChat = await Chat.create(chatData);
				const FullChat = await Chat.findOne({ _id: createdChat._id }).populate('users', '-password');
				res.status(200).json(FullChat);
			} catch (error) {
				res.status(400);
				throw new Error(error.message);
			}
		}
	}),

	fetchChats: asyncHandler(async (req, res) => {
		try {
			const chats = await Chat.find({
				users: { $elemMatch: { $eq: req.user._id } },
				deleteFor: { $nin: [req.user._id] }
			})
				.populate('users', '-password')
				.populate('groupAdmin', '-password')
				.populate('latestMessage')
				.sort({ updatedAt: -1 });

			const populatedChats = await Promise.all(
				chats.map(async (chat) => {
					const populatedChat = await User.populate(chat, {
						path: 'latestMessage.sender',
						select: 'name image email'
					});

					const unreadCount = await Message.countDocuments({
						chat: chat._id,
						readBy: {
							$not: {
								$elemMatch: { user: req.user._id }
							}
						},
						sender: { $ne: req.user._id }
					});

					const meetings = await Message.find({
						chat: chat._id,
						meetingId: { $ne: null },
						meetingStartTime: { $lte: new Date() }
					});

					const stickyMessage = await StickyMessage.findOne({ chatId: chat._id });

					return {
						...populatedChat.toObject(),
						unreadCount,
						stickyMessage,
						meetings
					};
				})
			);

			res.status(200).send(populatedChats);
		} catch (error) {
			res.status(400).send({ error: error.message });
		}
	}),

	createGroupChat: asyncHandler(async (req, res) => {
		if (!req.body.users || !req.body.name) {
			return res.status(400).send({ message: 'Please fill all the fields' });
		}

		let users = JSON.parse(req.body.users);
		users.push(req.user);
		const adminId = await getAdminDataByRole('users');
		users.push(adminId);

		if (users.length < 2) {
			return res.status(400).send('More than 2 users are required to form a group chat');
		}

		// Extract user IDs from the users array
		const userIds = users.map(user => user._id ? user._id : user);

		try {
			// Check if the type is 'marketChat'
			if (req.body.type == 'marketChat') {

				// Check if a chat with the same users already exists
				const existingChat = await Chat.findOne({
					isGroupChat: true,
					users: { $all: userIds, $size: userIds.length },
				}).populate('users', '-password').populate('groupAdmin', '-password');

				// If the chat already exists, return the existing chat
				if (existingChat) {
					return res.status(200).json(existingChat);
				}
			}

			// Create a new group chat if no existing chat is found
			const groupChat = await Chat.create({
				chatName: req.body.name,
				users: users,
				isGroupChat: true,
				groupAdmin: req.user
			});

			const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
				.populate('users', '-password')
				.populate('groupAdmin', '-password');

			res.status(200).json(fullGroupChat);
		} catch (error) {
			res.status(400);
			throw new Error(error.message);
		}
	}),

	removeFromGroup: asyncHandler(async (req, res) => {
		const { chatId, userId } = req.body;

		// check if the requester is admin

		const removed = await Chat.findByIdAndUpdate(
			chatId,
			{
				$pull: { users: userId }
			},
			{
				new: true
			}
		)
			.populate('users', '-password')
			.populate('groupAdmin', '-password');

		if (!removed) {
			res.status(404);
			throw new Error('Chat Not Found');
		} else {
			res.json(removed);
		}
	}),

	seenChat: asyncHandler(async (req, res) => {
		try {
			const { chatId, userId } = req.body;

			const currentTime = new Date();

			const updateResult = await Message.updateMany(
				{ chat: chatId, 'readBy.user': { $ne: userId } },
				{
					$addToSet: { readBy: { user: userId, seenAt: currentTime } },
					status: 'seen'
				}
			);

			if (updateResult.nModified === 0) {
				res.status(404);
				throw new Error('Chat Not Found or Already Seen');
			} else {
				res.status(200).json({ message: 'Chat marked as seen' });
			}
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}),

	storeStickyNote: asyncHandler(async (req, res) => {
		try {
			const { stickyNoteId } = req.body;
			let stickyNote = null;
			if (stickyNoteId) {
				stickyNote = await StickyMessage.findByIdAndUpdate(stickyNoteId, req.body, { new: true });
			} else {
				stickyNote = await StickyMessage.create(req.body);
			}
			res.json(stickyNote);
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}),

	addFavourite: asyncHandler(async (req, res) => {
		try {
			const { userId, chatId } = req.body;

			if (!userId || !chatId) {
				return res.status(400).json({ error: 'User ID and Chat ID are required.' });
			}

			const chat = await Chat.findById(chatId);

			if (!chat) {
				return res.status(404).json({ error: 'Chat not found.' });
			}
			const index = chat.favourites.indexOf(userId);

			if (index === -1) {
				chat.favourites.push(userId);
			} else {
				chat.favourites.splice(index, 1);
			}

			const updatedChat = await chat.save();

			res.json(updatedChat);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}),

	chatFiles: asyncHandler(async (req, res) => {
		try {
			const { chatId } = req.params;
			const fileIds = await Message.distinct('attachment', { chat: chatId, attachment: { $ne: null } });
			const files = await File.find({ _id: { $in: fileIds } });
			return res.json(files);
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}),

	clearChat: asyncHandler(async (req, res) => {
		try {
			const { chatId } = req.params;
			const currentTime = new Date();

			const chat = await Message.updateMany(
				{
					chat: chatId,
					$or: [
						{ meetingStartTime: null }, // Handle case where meetingStartTime is null
						{ meetingStartTime: { $lt: currentTime } } // Handle case where meetingStartTime is less than currentTime
					]
				},
				{ $addToSet: { deleteFor: req.user._id } }
			);

			return res.json(chat);
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}),

	deleteChat: asyncHandler(async (req, res) => {
		try {
			const { chatId } = req.params;

			// Update the Chat document
			const chat = await Chat.findByIdAndUpdate(chatId, { $addToSet: { deleteFor: req.user._id } });

			// Update the Message documents
			const currentTime = new Date();
			await Message.updateMany(
				{
					chat: chatId,
					$or: [
						{ meetingStartTime: null }, // Handle case where meetingStartTime is null
						{ meetingStartTime: { $lt: currentTime } } // Handle case where meetingStartTime is less than currentTime
					]
				},
				{ $addToSet: { deleteFor: req.user._id } }
			);

			return res.json(chat);
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}),

	blockUser: asyncHandler(async (req, res) => {
		try {
			const { userId } = req.body;
			// const { _id: currentUserId } = req.user;

			const currentUser = await User.findById(req.user._id);

			const isBlocked = currentUser.block.includes(userId);

			if (isBlocked) {
				await User.findByIdAndUpdate(req.user._id, { $pull: { block: userId } });
			} else {
				await User.findByIdAndUpdate(req.user._id, { $addToSet: { block: userId } });
			}
			const updatedData = await User.findById(currentUser);

			res.json(updatedData);
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}),

	markRead: asyncHandler(async (req, res) => {
		try {
			const { chatId } = req.query;
			const read = req.query.read === 'true';
			const currentTime = new Date();

			const chat = await Chat.findByIdAndUpdate(
				chatId,
				{ $addToSet: { markRead: { user: req.user._id, read: read } } },
				{ new: true }
			);

			await Message.updateMany(
				{ chat: chatId },
				{ $addToSet: { readBy: { user: req.user._id, seenAt: currentTime } } }
			);

			return res.json(chat);
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}),

	continueChat: asyncHandler(async (req, res) => {
		try {
			const { id } = req.params;
			const chat = await Chat.findByIdAndUpdate(id, { isApproved: true }, { new: true });

			return res.json(chat);
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	}),

	muteUnMuteChat: asyncHandler(async (req, res) => {
		try {
			const { userId, chatId } = req.body;

			// Find the chat by ID
			let chat = await Chat.findById(chatId);
			if (!chat) {
				return res.status(404).json({ error: 'Chat not found' });
			}

			// Toggle the mute state
			chat.isMute.mute = !chat.isMute.mute;
			chat.isMute.user = userId;

			// Save the chat with the updated mute state
			await chat.save();

			res.status(200).json(chat);
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	})
};

module.exports = chatController;
