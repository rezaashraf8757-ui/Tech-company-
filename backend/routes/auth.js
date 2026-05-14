const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    // Dev fallback when MongoDB is not connected
    if (!req.dbConnected) {
      console.log('[DEV MODE] Mock register for:', email);
      const token = jwt.sign(
        { userId: 'dev-user-' + Date.now(), email: email },
        process.env.JWT_SECRET || 'fallbacksecret',
        { expiresIn: '24h' }
      );
      return res.status(201).json({
        token,
        user: { id: 'dev-user-' + Date.now(), name: name, email: email },
        devMode: true
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallbacksecret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Dev fallback when MongoDB is not connected
    if (!req.dbConnected) {
      console.log('[DEV MODE] Mock login for:', email);
      const token = jwt.sign(
        { userId: 'dev-user-123', email: email },
        process.env.JWT_SECRET || 'fallbacksecret',
        { expiresIn: '24h' }
      );
      return res.json({
        token,
        user: { id: 'dev-user-123', name: 'Developer', email: email },
        devMode: true
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallbacksecret',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
