require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB, getDBStatus, getDBHealth, ensureDBConnected } = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const spotRoutes = require('./routes/spotRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database
connectDB();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://smart-parking-slot-rental-availabil-seven.vercel.app',
    /\.netlify\.app$/,
    /\.vercel\.app$/,
  ],
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// Ensure the MongoDB connection is established before ANY route handler runs.
// Without this, requests arriving during the connection window were incorrectly
// treated as "database not connected" and fell back to in-memory data.
app.use('/api', ensureDBConnected);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/spots', spotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const db = getDBHealth();
  res.json({
    status: 'online',
    service: 'Smart Parking Slot & Rental Availability Platform API',
    database: getDBStatus() ? 'connected' : 'disconnected',
    db,
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('🚗 Smart Parking Slot & Rental Availability Platform API is running.');
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Smart Parking Backend Server listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
