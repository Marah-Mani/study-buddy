const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		const connection = await mongoose.connect(process.env.MONGODB_URL, {
			serverSelectionTimeoutMS: 5000
		});
		// eslint-disable-next-line no-console
		console.log(`MongoDB Connected: ${connection.connection.host}`);
	} catch (error) {
		throw new Error('Unable to connect to MongoDB');
	}
};

module.exports = connectDB;
