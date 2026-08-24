const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getDBStatus } = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'smart_parking_super_secret_jwt_key_2026');

      if (decoded.id && getDBStatus()) {
        req.user = await User.findById(decoded.id).select('-password');
      }
      
      if (!req.user && decoded.email) {
        // Fallback for mock/demo tokens
        req.user = {
          _id: decoded.id || 'demo-user-id',
          name: decoded.name || 'Demo User',
          email: decoded.email,
          role: decoded.role || 'driver',
        };
      }

      return next();
    } catch (error) {
      console.error('Auth verification failed:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'smart_parking_super_secret_jwt_key_2026');
      if (decoded.id && getDBStatus()) {
        req.user = await User.findById(decoded.id).select('-password');
      }
      if (!req.user && decoded.email) {
        req.user = {
          _id: decoded.id || 'demo-user-id',
          name: decoded.name || 'Demo User',
          email: decoded.email,
          role: decoded.role || 'driver',
        };
      }
    } catch (e) {
      // ignore in optional
    }
  }
  next();
};

module.exports = { protect, optionalAuth, requireAdmin };
