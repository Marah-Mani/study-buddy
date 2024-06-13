const { Server } = require('socket.io');
const User = require('../models/Users');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const subscriptionModel = require('../models/subscriptionModel');
const { sendNotification } = require('./subscribeNotification');

const webSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: 'http://localhost:3000'
		}
	});
	let onlineUsers = [];

	io.on('connection', (socket) => {
		socket.on('setup', (userData) => {
			socket.join(userData._id);
			socket.emit('connected');
		});

		socket.on('new-user-add', (userId) => {
			if (!onlineUsers.some((user) => user.userId === userId)) {
				// if user is not added before
				onlineUsers.push({ userId: userId, socketId: socket.id });
			}
			console.log('new user is here!', onlineUsers);
			// send all active users to new user
			io.emit('get-users', onlineUsers);
		});

		socket.on('join chat', (room) => {
			socket.join(room);
			console.log('User Joined Room: ' + room);
		});

		socket.on('typing', (room) => {
			socket.in(room).emit('typing');
			console.log('User typing on Room: ' + room);
		});

		socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

		socket.on('new message', (newMessageReceived) => {
			var chat = newMessageReceived.chat;
			console.log('new message');
			if (!chat.users) return console.log('chat.users not defined');

			chat.users.forEach(async (user) => {
				if (user._id == newMessageReceived.sender._id) return;
				socket.in(user._id).emit('message received', newMessageReceived);
				const subscriptions = await subscriptionModel.find();

				for (const subscription of subscriptions) {
					const importantEventPayload = {
						title: `New message from "${newMessageReceived.sender.name}" on Stayable`,
						description: newMessageReceived.content,
						image: 'https://cdn2.vectorstock.com/i/thumb-large/94/66/emoji-smile-icon-symbol-smiley-face-vector-26119466.jpg'
					};
					await sendNotification(subscription, importantEventPayload);
				}
			});
		});

		socket.on('scheduled message', async (chat) => {
			const scheduleMessage = await Message.findOneAndUpdate(
				{
					chat: chat._id,
					status: 'scheduled',
					sentTime: { $lte: Date.now() }
				},
				{ status: 'sent' },
				{ new: true }
			)
				.populate('sender')
				.populate('attachment')
				.populate('chat')
				.populate('readBy')
				.sort({ sentTime: 'desc' });

			if (!scheduleMessage) return;
			await Chat.findByIdAndUpdate(chat._id, { latestMessage: scheduleMessage._id });

			chat.users.forEach((user) => {
				socket.in(user._id).emit('message received', scheduleMessage);
			});
		});

		socket.on('delete message', (deleteMessage) => {
			var chat = deleteMessage.chat;
			if (!chat.users) return console.log('chat.users not defined');

			chat.users.forEach((user) => {
				if (user._id == deleteMessage.sender._id) return;

				socket.in(user._id).emit('message deleted', deleteMessage);
			});
		});

		socket.on('disconnect', async () => {
			const disconnectedUser = onlineUsers.find((user) => user.socketId === socket.id);

			if (disconnectedUser) {
				await User.findByIdAndUpdate(disconnectedUser.userId, {
					lastSeen: new Date()
				});

				onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

				io.emit('get-users', onlineUsers);

				console.log('user disconnected', disconnectedUser, onlineUsers);
			}
		});

		socket.on('offline', () => {
			onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
			console.log('user is offline', onlineUsers);
			io.emit('get-users', onlineUsers);
		});

		socket.off('setup', (userData) => {
			socket.leave(userData._id);
		});
	});
};

module.exports = webSocket;
