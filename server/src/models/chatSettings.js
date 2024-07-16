const mongoose = require('mongoose');

const chatSettingsSchema = new mongoose.Schema({
	showOnline: { type: Boolean, default: true },
	showTodo: { type: Boolean, default: true },
	showInformation: { type: Boolean, default: true },
	showZoomCall: { type: Boolean, default: true },
	showSticky: { type: Boolean, default: true },
	showGroup: { type: Boolean, default: true },
	showBookMark: { type: Boolean, default: true },
	allowDeleteChat: { type: Boolean, default: true },
	allowEditChat: { type: Boolean, default: true },
	allowCreateGroup: { type: Boolean, default: true },
	allowClearChat: { type: Boolean, default: true },
	showSharedFiles: { type: Boolean, default: true },
	showPhotosAndMedia: { type: Boolean, default: true },
	showScheduledMessage: { type: Boolean, default: true },
	showBookmarkMessage: { type: Boolean, default: true },
	showMeeting: { type: Boolean, default: true },
	showFavorite: { type: Boolean, default: true }
});

const chatSettings = mongoose.model('chatSettings', chatSettingsSchema);

module.exports = chatSettings;
