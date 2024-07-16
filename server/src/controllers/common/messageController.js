// eslint-disable-next-line import/no-extraneous-dependencies
const asyncHandler = require('express-async-handler');
const Message = require('../../models/Message');
const User = require('../../models/Users');
const Chat = require('../../models/Chat');

const messageController = {
	allMessages: asyncHandler(async (req, res) => {
		try {
			// const { count } = req.query;
			const messages = await Message.find({
				chat: req.params.chatId,
				sentTime: { $lte: new Date() },
				status: { $ne: 'scheduled' }
			})
				.populate('sender', 'name image email')
				.populate('attachment')
				.populate('readBy.user')
				// .limit(40)
				// .skip(count)
				// .sort({ _id: -1 })
				.populate('chat');

			res.json(messages);
		} catch (error) {
			res.status(400);
			throw new Error(error.message);
		}
	}),
	sendMessage: asyncHandler(async (req, res) => {
		const {
			content,
			chatId,
			attachmentId,
			messageId,
			sentTime,
			status,
			meetingId,
			meetingStartTime,
			startUrl,
			joinUrl
		} = req.body;

		if (!content || !chatId) {
			return res.sendStatus(400);
		}

		const newMessageData = {
			sender: req.user._id,
			content: content,
			chat: chatId,
			attachment: attachmentId ? attachmentId : null,
			sentTime: sentTime,
			status: status,
			readBy: [{ user: req.user._id, seenAt: new Date() }],
			deleteFor: [],
			meetingStartTime: meetingStartTime,
			startUrl: startUrl,
			joinUrl: joinUrl,
			meetingId: meetingId
		};

		try {
			let message;

			if (messageId) {
				message = await Message.findByIdAndUpdate(messageId, { content: content }, { new: true });
			}

			if (!message) {
				message = await Message.create(newMessageData);
			}

			message = await message.populate('sender');
			message = await message.populate('chat');
			message = await message.populate('attachment');
			message = await User.populate(message, {
				path: 'chat.users',
				select: 'name image email'
			});

			if (status !== 'scheduled') {
				await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
			}

			const currentTime = new Date();

			// Add readBy for existing messages in the chat sent by other users
			await Message.updateMany(
				{ chat: chatId, sender: { $ne: req.user._id } },
				{
					$addToSet: { readBy: { user: req.user._id, seenAt: currentTime } },
					status: 'seen'
				}
			);

			// Extract receiver's ID from chat users
			const chat = await Chat.findById(chatId);
			const receiverId = chat.users.find((user) => String(user._id) !== String(req.user._id));

			// Check if the receiver has blocked the sender
			const receiver = await User.findById(receiverId);
			if (receiver.block.includes(String(req.user._id))) {
				message.deleteFor.push(receiverId);
				await message.save();
			}

			// Check if the sender has blocked the receiver
			if (req.user.block.includes(String(receiverId))) {
				// Push receiver's ID to deleteFor
				message.deleteFor.push(receiverId);
				await message.save();
			}

			res.json(message);
		} catch (error) {
			res.status(400);
			throw new Error(error.message);
		}
	}),

	deleteMessage: asyncHandler(async (req, res) => {
		try {
			const { messageId, deleteFor, deleteForEveryone } = req.body;
			const user = req.user;
			let message = await Message.findByIdAndUpdate(
				messageId,
				{
					$set: {
						deleteFor: deleteFor,
						deleteForEveryone: deleteForEveryone
					}
				},
				{ new: true }
			);

			const updateChat = await Chat.findById(message.chat);
			if (updateChat.latestMessage == messageId) {
				const newLatestMessage = await Message.findOne({
					chat: message.chat,
					deleteForEveryone: false,
					deleteFor: { $nin: [user._id] }
				}).sort({ createdAt: 'desc' });
				if (newLatestMessage) {
					await Chat.findByIdAndUpdate(message.chat, { latestMessage: newLatestMessage._id });
				}
			}

			message = await message.populate('sender');
			message = await message.populate('chat');
			message = await message.populate('attachment');
			message = await User.populate(message, {
				path: 'chat.users',
				select: 'name image email'
			});

			res.json(message);
		} catch (error) {
			console.error('Error deleting message:', error);
			res.status(400).send({ error: 'Failed to delete message.' });
		}
	}),

	deleteMessagePermanently: asyncHandler(async (req, res) => {
		try {
			const id = req.params.id;
			await Message.findByIdAndDelete(id);
			res.json({ success: true });
		} catch (error) {
			console.error('Error deleting message:', error);
			res.status(400).send({ error: 'Failed to delete message.' });
		}
	}),

	scheduledMessage: asyncHandler(async (req, res) => {
		try {
			const chatId = req.params.chatId;
			const message = await Message.find({ chat: chatId, status: 'scheduled' });
			res.json(message);
		} catch (error) {
			res.status(400);
			throw new Error(error.message);
		}
	}),

	bookmarkMessage: asyncHandler(async (req, res) => {
		try {
			const { messageId } = req.params;
			const { _id: userId } = req.user;

			const message = await Message.findById(messageId);

			if (!message) {
				return res.status(404).json({ error: 'Message not found' });
			}

			const isBookmarked = message.bookmark.includes(userId);

			if (isBookmarked) {
				await Message.findByIdAndUpdate(messageId, { $pull: { bookmark: userId } });
			} else {
				await Message.findByIdAndUpdate(messageId, { $addToSet: { bookmark: userId } });
			}

			res.json({ message: isBookmarked ? 'Bookmark removed' : 'Bookmark added' });
		} catch (error) {
			res.status(400).json({ error: error.message });
		}
	})
};

module.exports = messageController;
