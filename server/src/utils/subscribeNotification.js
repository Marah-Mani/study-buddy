const catchErrors = require('../middleware/catchErrors');
const subscriptionModel = require('../models/subscriptionModel');
const webPush = require('web-push');
const { WebPushError } = require('web-push');

const subscribeNotification = catchErrors(async (req, res) => {
	const newSubscription = await subscriptionModel.create({ ...req.body });

	const options = {
		vapidDetails: {
			subject: 'mailto:arjun.binarydata@gmail.com',
			publicKey: process.env.VAPID_PUBLIC_KEY,
			privateKey: process.env.VAPID_PRIVATE_KEY
		}
	};

	const payload = JSON.stringify({
		title: 'Hello from server',
		description: 'This message is coming from the server',
		image: 'https://cdn2.vectorstock.com/i/thumb-large/94/66/emoji-smile-icon-symbol-smiley-face-vector-26119466.jpg'
	});

	const response = await webPush.sendNotification(newSubscription, payload, options);

	console.log(response);
	res.sendStatus(200);
});

const sendNotification = async (subscription, payload) => {
	try {
		const options = {
			vapidDetails: {
				subject: 'mailto:arjun.binarydata@gmail.com',
				publicKey: process.env.VAPID_PUBLIC_KEY,
				privateKey: process.env.VAPID_PRIVATE_KEY
			}
		};

		const response = await webPush.sendNotification(subscription, JSON.stringify(payload), options);

		console.log('Notification sent successfully:', response);
	} catch (error) {
		if (error instanceof WebPushError && error.statusCode === 410) {
			// Handle expired subscription or invalid endpoint
			console.error('Subscription expired or invalid:', error);
		} else {
			console.error('Error sending notification:', error);
		}
	}
};

module.exports = { subscribeNotification, sendNotification };
