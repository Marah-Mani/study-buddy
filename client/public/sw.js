self.addEventListener('activate', function (event) {
	console.log('Service worker activated');
});

self.addEventListener('push', async function (event) {
	try {
		const message = await event.data.json();
		const { title, description, image } = message;
		console.log({ message });

		const options = {
			body: description,
			icon: image,
			actions: [
				{ action: 'accept', title: 'Accept' },
				{ action: 'reject', title: 'Reject' }
			]
		};

		event.waitUntil(self.registration.showNotification(title, options));
	} catch (error) {
		console.error('Error handling push event:', error);
	}
});

self.addEventListener('notificationclick', function (event) {
	const { action } = event;
	console.log('Notification action clicked:', action);

	switch (action) {
		case 'accept':
			console.log('Accept action clicked');
			break;
		case 'reject':
			console.log('Reject action clicked');
			break;
		default:
			console.warn('Unknown action clicked:', action);
	}

	event.notification.close();
});
