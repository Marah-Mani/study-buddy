const checkCommonRole = () => {
    return (req, res, next) => {
        const userRole = req.user.role;

        if (userRole === 'admin' || userRole === 'user') {
            // User has the required role, grant access
            next();
        } else {
            res.status(403).json({ message: 'Forbidden - Insufficient permissions' });
        }
    };
};

module.exports = checkCommonRole;
