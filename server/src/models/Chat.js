const mongoose = require('mongoose');

const chatModel = mongoose.Schema(
	{
		chatName: { type: String, trim: true },
		isGroupChat: { type: Boolean, default: false },
		users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
		deleteFor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
		favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users', default: [] }],
		markRead: [
			{
				user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', default: [] },
				read: { type: Boolean, default: false }
			}
		],
		latestMessage: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Message'
		},
		groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
	},
	{ timestamps: true }
);

const Chat = mongoose.model('Chat', chatModel);

module.exports = Chat;
