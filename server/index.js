const express = require('express');
const connectDB = require('./src/utils/db');
const app = express();
const cors = require('cors');
const logError = require('./logger');
const routes = require('./src/routes');
const path = require('path');
const { protect } = require('./src/middleware/authMiddleware');
const fileController = require('./src/controllers/common/fileController');
const webSocket = require('./src/utils/webSocket');
const { subscribeNotification } = require('./src/utils/subscribeNotification');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
require('dotenv').config();
// require('./src/cron');
// Connect to MongoDB
connectDB();

// In-memory store for blocked IPs
const blockedIPsFile = path.join(__dirname, 'blocked-ips.json');
let blockedIPs = new Set();
if (fs.existsSync(blockedIPsFile)) {
	const data = fs.readFileSync(blockedIPsFile, 'utf-8');
	blockedIPs = new Set(JSON.parse(data));
}

// Middleware to check if an IP is blocked
const blockMiddleware = (req, res, next) => {
	if (blockedIPs.has(req.ip)) {
		return res.status(403).json({
			message: 'Your IP has been blocked due to too many requests.',
			status: 403
		});
	}
	next();
};

// Save blocked IPs to file
const saveBlockedIPs = () => {
	fs.writeFileSync(blockedIPsFile, JSON.stringify(Array.from(blockedIPs)));
};

// Configure rate limiting
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 5 minutes
	max: 500, // limit each IP to 100 requests per windowMs
	handler: (req, res) => {
		blockedIPs.add(req.ip); // Add IP to the blocked list
		saveBlockedIPs(); // Save to file
		res.status(429).json({
			message: 'You have exceeded the 100 requests in 5 minutes limit!',
			status: 429
		});
	}
});

// Connect to Trigger

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(fileUpload());

app.use(blockMiddleware); // Apply the block checking middleware to all requests
app.use(limiter);

app.set('view engine', 'ejs');

// Global error handler middleware
const globalErrorHandler = (err, req, res, next) => {
	logError(err, req, res, next);
};

app.use(globalErrorHandler);

// Call all routes
app.use(routes);

app.get('/', async (req, res) => {
	res.send('Welcome to the Api');
});

app.post('/api/upload', protect, fileController.uploadFile);

app.use('/images', express.static(path.join(__dirname, 'src', 'storage')));

app.post('/subscribe', subscribeNotification);

// Start server
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT);

webSocket(server);
