const mongoose = require('mongoose');

const stickyMessageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', default: true },
    message: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const StickyMessage = mongoose.model('stickyMessage', stickyMessageSchema);

module.exports = StickyMessage;
