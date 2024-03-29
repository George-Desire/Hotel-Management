const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('./user.js');

router.post('/register', async (req, res) => { try { const { email, password, role } = req.body; 
const hashedPassword = await bcrypt.hash(password, 10); 
const user = new User({ email, password: hashedPassword, role }); 
await user.save(); 
res.status(201).json({ message: 'User registered successfully' }); } 
catch (error) { res.status(500).json({ message: 'Error registering user' }); }
});

router.post('/login', async (req, res) => { try { const { email, password } = req.body; 
const user = await User.findOne({ email }); 
if (!user) { return res.status(401).json({ message: 'Invalid login credentials' }); } 
const passwordMatch = await bcrypt.compare(password, user.password); 
if (!passwordMatch) { return res.status(401).json({ message: 'Invalid login credentials' }); } 
const token = generateToken(user); res.json({ token }); } 
catch (error) { res.status(500).json({ message: 'Error logging in' }); }
});

module.exports = router;