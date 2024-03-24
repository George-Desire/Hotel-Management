const authzMiddleware = (requiredRole) => (req, res, next) => { 
    if (req.user.role !== requiredRole) { return res.status(403).json({ message: 'Unauthorized' }); 
} next();
};

module.exports = authzMiddleware;