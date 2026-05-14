const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// MongoDB Connection
let dbConnected = false;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_interview')
  .then(() => { console.log('MongoDB connected'); dbConnected = true; })
  .catch(err => { console.error('MongoDB error:', err.message); dbConnected = false; });

// Expose db state for routes
app.use((req, res, next) => { req.dbConnected = dbConnected; next(); });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/interview', require('./routes/interview'));
app.use('/api/resume', require('./routes/resume'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/questions', require('./routes/questions'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
