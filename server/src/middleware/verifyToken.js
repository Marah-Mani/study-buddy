const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
	//const token = req.headers.authorization;
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (!token) {
		return res.status(401).json({ message: 'Unauthorized - Token not provided' });
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			if (err.name === 'TokenExpiredError') {
				return res.status(401).json({ message: 'Unauthorized - Token expired' });
			}
			return res.status(401).json({ message: 'Unauthorized - Invalid token' });
		}
		req.user = decoded;
		next();
	});
};

module.exports = verifyToken;
