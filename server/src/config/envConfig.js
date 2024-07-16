/* eslint-disable no-process-env */
require('dotenv').config();

module.exports = {
	TEST: "AVI",
	MONGODB_URL: process.env.MONGODB_URL,
	PORT: process.env.PORT,
	JWT_SECRET: process.env.JWT_SECRET,
	NODE_ENV: process.env.NODE_ENV,
	MAIL_USERNAME: process.env.MAIL_USERNAME,
	MAIL_PASSWORD: process.env.MAIL_PASSWORD,
	MAIL_FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS,
	APP_URL: process.env.APP_URL,
	FILE_MANAGER_IS_PUBLIC: process.env.FILE_MANAGER_IS_PUBLIC,
	API_URL: process.env.API_URL,
	STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
	VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY,
	VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY,
	// GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
	// GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
	// GOOGLE_SECRET_KEY: process.env.GOOGLE_SECRET_KEY,
	// ZOOM_ACCOUNT_ID: process.env.ZOOM_ACCOUNT_ID,
	ZOOM_CLIENT_ID: process.env.ZOOM_CLIENT_ID,
	ZOOM_SECRET_ID: process.env.ZOOM_SECRET_ID
	// ZOOM_SECRET_TOKEN: process.env.ZOOM_SECRET_TOKEN,
	// ZOOM_VERIFICATION_TOKEN: process.env.ZOOM_VERIFICATION_TOKEN
};
