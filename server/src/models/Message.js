const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
	{
		sender: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
		content: { type: String, trim: true },
		chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
		attachment: { type: mongoose.Schema.Types.ObjectId, ref: 'File', default: null },
		meetingId: { type: Number, default: null },
		readBy: [
			{
				user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
				seenAt: { type: Date, default: null }
			}
		],
		deleteFor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
		bookmark: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
		deleteForEveryone: { type: Boolean, default: false },
		meetingStartTime: { type: Date, default: null },
		startUrl: { type: String, default: null },
		joinUrl: { type: String, default: null },
		sentTime: { type: Date, default: Date.now },
		status: { type: String, enum: ['sent', 'delivered', 'seen', 'scheduled', 'meeting'], default: 'sent' }
	},
	{ timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
