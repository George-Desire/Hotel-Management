require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('./user.js');
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => { const token = req.headers.authorization?.split(' ')[1]; 
if (!token) { return res.status(401).json({ message: 'Missing token' }); } try { 
const decodedToken = jwt.verify(token, JWT_SECRET); 
const user = User.findById(decodedToken.userId); 
if (!user) { return res.status(401).json({ message: 'User not found' }); } 
req.user = user; 
next(); } 
catch (error) { return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;