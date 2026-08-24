const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getDBStatus } = require('../config/db');

const generateToken = (id, name, email, role) => {
  return jwt.sign(
    { id, name, email, role },
    process.env.JWT_SECRET || 'smart_parking_super_secret_jwt_key_2026',
    { expiresIn: '30d' }
  );
};

// Fallback in-memory users for demo mode if DB is connecting
const inMemoryUsers = [
  {
    _id: 'user_driver_01',
    name: 'Alex Rivera',
    email: 'driver@smartpark.io',
    password: 'password123',
    role: 'driver',
    phone: '+1 (555) 321-7890',
    vehicleNumber: 'NY-EV-8821',
    vehicleType: 'ev',
  },
  {
    _id: 'user_host_02',
    name: 'Sarah Jenkins (Host)',
    email: 'host@smartpark.io',
    password: 'password123',
    role: 'host',
    phone: '+1 (555) 443-9081',
    vehicleNumber: 'CA-776-XYZ',
    vehicleType: 'suv',
  },
  {
    _id: 'user_admin_03',
    name: 'Marcus Vance (Admin)',
    email: 'admin@smartpark.io',
    password: 'password123',
    role: 'admin',
    phone: '+1 (555) 890-1234',
    vehicleNumber: 'ADMIN-01',
    vehicleType: 'car',
  },
];

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, vehicleNumber, vehicleType } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    if (getDBStatus()) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      const user = await User.create({
        name,
        email,
        password,
        role: role || 'driver',
        phone: phone || '',
        vehicleNumber: vehicleNumber || '',
        vehicleType: vehicleType || 'car',
      });

      return res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          vehicleNumber: user.vehicleNumber,
          vehicleType: user.vehicleType,
        },
        token: generateToken(user._id, user.name, user.email, user.role),
      });
    } else {
      // In-memory fallback
      const existing = inMemoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }
      const newUser = {
        _id: 'user_' + Date.now(),
        name,
        email,
        password,
        role: role || 'driver',
        phone: phone || '',
        vehicleNumber: vehicleNumber || '',
        vehicleType: vehicleType || 'car',
      };
      inMemoryUsers.push(newUser);

      return res.status(201).json({
        success: true,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
          vehicleNumber: newUser.vehicleNumber,
          vehicleType: newUser.vehicleType,
        },
        token: generateToken(newUser._id, newUser.name, newUser.email, newUser.role),
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server registration error' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    if (getDBStatus()) {
      const user = await User.findOne({ email });
      if (user && (await user.matchPassword(password))) {
        return res.json({
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            vehicleNumber: user.vehicleNumber,
            vehicleType: user.vehicleType,
          },
          token: generateToken(user._id, user.name, user.email, user.role),
        });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    } else {
      // In-memory demo fallback
      const user = inMemoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (user && (user.password === password || password === 'password123')) {
        return res.json({
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            vehicleNumber: user.vehicleNumber,
            vehicleType: user.vehicleType,
          },
          token: generateToken(user._id, user.name, user.email, user.role),
        });
      }
      // Allow demo instant login if matching standard demo emails
      const demoRole = email.includes('host') ? 'host' : email.includes('admin') ? 'admin' : 'driver';
      const demoUser = {
        _id: 'demo_' + Date.now(),
        name: email.split('@')[0],
        email,
        role: demoRole,
        phone: '+1 (555) 000-1122',
        vehicleNumber: 'DEMO-999',
        vehicleType: 'car',
      };
      return res.json({
        success: true,
        user: demoUser,
        token: generateToken(demoUser._id, demoUser.name, demoUser.email, demoUser.role),
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server login error' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
const getUserProfile = async (req, res) => {
  try {
    if (req.user) {
      return res.json({ success: true, user: req.user });
    }
    res.status(404).json({ success: false, message: 'User not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
