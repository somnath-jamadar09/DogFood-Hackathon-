const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiter');
const errorMiddleware = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security and utility middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static project uploads (thumbnails/attachments)
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadDir));

// Healthcheck endpoint (used by Docker Compose healthchecks)
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Apply rate limiter to API routes
app.use('/api/v1', apiLimiter);

// Mount API routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/teams', require('./routes/teamRoutes'));
app.use('/api/v1/submissions', require('./routes/submissionRoutes'));
app.use('/api/v1/judging', require('./routes/judgingRoutes'));
app.use('/api/v1/admin', require('./routes/adminRoutes'));
app.use('/api/v1/votes', require('./routes/voteRoutes'));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// Centralized error handling middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`[Dogfood Core API] Listening on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
});

module.exports = app;
