const Notification = require('../../models/notifications');
const logError = require('../../../logger');

const notificationController = {
	notification: async (req, res) => {
		const userId = req.params.id;
		try {
			const notifications = await Notification.find({ notifyTo: userId })
				.populate('notifyBy', 'image')
				.sort({ _id: -1 });
			const unreadCount = await Notification.countDocuments({ notifyTo: userId, isRead: 'no' });

			if (!notifications) {
				return res.status(404).json({ status: false, message: 'Notification not found' });
			}

			res.status(200).json({ status: true, data: notifications, unreadCount });
		} catch (error) {
			logError('Error fetching notifications:', error);
			res.status(500).json({ status: false, message: 'Internal Server Error' });
		}
	},
	updateAllReadStatus: async (req, res) => {
		try {
			const { userId, isRead } = req.body;
			const updatedNotifications = await Notification.updateMany({ notifyTo: userId }, { $set: { isRead } });
			res.status(200).json({
				success: true,
				message: 'All notifications have been marked as read.',
				data: updatedNotifications
			});
		} catch (error) {
			logError(`Error updating notification status: ${error.message}`);
			res.status(500).json({ success: false, message: 'Internal server error' });
		}
	},
	deleteAllMessages: async (req, res) => {
		try {
			const { userId } = req.body;
			const updatedNotifications = await Notification.deleteMany({ notifyTo: userId });
			res.status(200).json({
				success: true,
				message: 'All notifications have been deleted.',
				data: updatedNotifications
			});
		} catch (error) {
			logError(`Error updating notification status: ${error.message}`);
			res.status(500).json({ success: false, message: 'Internal server error' });
		}
	},
	deleteMessage: async (req, res) => {
		try {
			const { userId, notificationId } = req.body;
			const updatedNotifications = await Notification.deleteOne({ _id: notificationId, notifyTo: userId });
			res.status(200).json({
				success: true,
				message: 'Notification has been deleted.',
				data: updatedNotifications
			});
		} catch (error) {
			logError(`Error deleting notification: ${error.message}`);
			res.status(500).json({ success: false, message: 'Internal server error' });
		}
	}
};

module.exports = notificationController;
