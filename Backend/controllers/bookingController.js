const Booking = require('../models/Booking');
const ParkingSpot = require('../models/ParkingSpot');
const { getDBStatus } = require('../config/db');

// Sample initial bookings for demonstration
const initialBookings = [
  {
    _id: 'book_901',
    userName: 'Alex Rivera',
    userEmail: 'driver@smartpark.io',
    userPhone: '+1 (555) 321-7890',
    spot: 'spot_102',
    spotTitle: 'Metro Center Smart Garage - Level A',
    slotCode: 'A-02',
    address: '450 Lexington Ave, Midtown, New York',
    vehicleNumber: 'NY-EV-8821',
    vehicleType: 'car',
    startTime: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
    endTime: new Date(Date.now() + 1000 * 60 * 75), // 75 mins remaining
    durationHours: 2,
    totalAmount: 10.0,
    bookingType: 'hourly',
    status: 'active',
    paymentStatus: 'paid',
    passCode: 'SP-NY4821',
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    _id: 'book_902',
    userName: 'Emma Watson',
    userEmail: 'emma@smartpark.io',
    userPhone: '+1 (555) 776-5412',
    spot: 'spot_108',
    spotTitle: 'Marina Bay Gated Garage Space',
    slotCode: 'MB-12',
    address: '500 Marina Blvd, Marina District, San Francisco',
    vehicleNumber: 'SF-991-GL',
    vehicleType: 'suv',
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25),
    durationHours: 720,
    totalAmount: 260.0,
    bookingType: 'monthly',
    status: 'active',
    paymentStatus: 'paid',
    passCode: 'SP-SF9912',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
  },
];

let inMemoryBookings = [...initialBookings];

const generatePassCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'SP-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// @desc    Create a new booking & reserve slot
// @route   POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const {
      spotId,
      vehicleNumber,
      vehicleType,
      durationHours,
      bookingType,
      userName,
      userEmail,
      userPhone,
      startTime,
    } = req.body;

    if (!spotId || !vehicleNumber) {
      return res.status(400).json({ success: false, message: 'Please provide spotId and vehicleNumber' });
    }

    const effectiveDuration = Number(durationHours) || 2;
    const start = startTime ? new Date(startTime) : new Date();
    let end;
    if (bookingType === 'daily') {
      end = new Date(start.getTime() + effectiveDuration * 24 * 60 * 60 * 1000);
    } else if (bookingType === 'monthly') {
      end = new Date(start.getTime() + effectiveDuration * 30 * 24 * 60 * 60 * 1000);
    } else {
      end = new Date(start.getTime() + effectiveDuration * 60 * 60 * 1000);
    }

    const passCode = generatePassCode();

    if (getDBStatus()) {
      const spot = await ParkingSpot.findById(spotId);
      if (!spot) {
        return res.status(404).json({ success: false, message: 'Parking spot not found' });
      }

      if (spot.status === 'occupied') {
        return res.status(400).json({ success: false, message: 'This parking slot is currently occupied' });
      }

      let unitPrice = spot.pricePerHour;
      if (bookingType === 'daily') unitPrice = spot.pricePerDay;
      if (bookingType === 'monthly') unitPrice = spot.pricePerMonth;

      const totalAmount = unitPrice * effectiveDuration;

      const booking = await Booking.create({
        user: req.user ? req.user._id : null,
        userName: userName || (req.user ? req.user.name : 'Guest Driver'),
        userEmail: userEmail || (req.user ? req.user.email : ''),
        userPhone: userPhone || (req.user ? req.user.phone : ''),
        spot: spot._id,
        spotTitle: spot.title,
        slotCode: spot.slotCode,
        address: `${spot.address}, ${spot.city}`,
        vehicleNumber: vehicleNumber.toUpperCase(),
        vehicleType: vehicleType || spot.spotType || 'car',
        startTime: start,
        endTime: end,
        durationHours: effectiveDuration,
        totalAmount,
        bookingType: bookingType || 'hourly',
        status: 'active',
        paymentStatus: 'paid',
        passCode,
      });

      // Mark spot as occupied
      spot.status = 'occupied';
      await spot.save();

      return res.status(201).json({ success: true, data: booking });
    } else {
      // In-memory fallback
      const { initialSpots } = require('./spotController');
      // Look in both inMemorySpots from spotController or fallback
      let spot = initialSpots.find((s) => s._id.toString() === spotId.toString());
      if (!spot) {
        spot = {
          _id: spotId,
          title: 'Smart Parking Bay',
          slotCode: 'A-' + Math.floor(Math.random() * 90 + 10),
          address: 'Downtown Metro Center',
          city: 'New York',
          pricePerHour: 5,
          pricePerDay: 35,
          pricePerMonth: 250,
          spotType: 'car',
        };
      }

      let unitPrice = spot.pricePerHour || 5;
      if (bookingType === 'daily') unitPrice = spot.pricePerDay || 35;
      if (bookingType === 'monthly') unitPrice = spot.pricePerMonth || 250;

      const totalAmount = unitPrice * effectiveDuration;

      const newBooking = {
        _id: 'book_' + Date.now(),
        user: req.user ? req.user._id : null,
        userName: userName || (req.user ? req.user.name : 'Guest Driver'),
        userEmail: userEmail || (req.user ? req.user.email : 'guest@smartpark.io'),
        userPhone: userPhone || (req.user ? req.user.phone : '+1 (555) 000-0000'),
        spot: spot._id,
        spotTitle: spot.title,
        slotCode: spot.slotCode,
        address: `${spot.address}, ${spot.city}`,
        vehicleNumber: vehicleNumber.toUpperCase(),
        vehicleType: vehicleType || 'car',
        startTime: start,
        endTime: end,
        durationHours: effectiveDuration,
        totalAmount,
        bookingType: bookingType || 'hourly',
        status: 'active',
        paymentStatus: 'paid',
        passCode,
        createdAt: new Date(),
      };

      inMemoryBookings.unshift(newBooking);

      // update in memory status if available
      try {
        const spotCtrl = require('./spotController');
        if (spotCtrl.updateSpotStatus) {
          spot.status = 'occupied';
        }
      } catch (e) {}

      return res.status(201).json({ success: true, data: newBooking });
    }
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
const getBookings = async (req, res) => {
  try {
    const { status, email } = req.query;

    if (getDBStatus()) {
      let filter = {};
      if (status && status !== 'all') filter.status = status;
      if (email) filter.userEmail = email;

      const bookings = await Booking.find(filter).sort({ createdAt: -1 });
      return res.json({ success: true, count: bookings.length, data: bookings });
    } else {
      let result = [...inMemoryBookings];
      if (status && status !== 'all') {
        result = result.filter((b) => b.status === status);
      }
      if (email) {
        result = result.filter((b) => b.userEmail && b.userEmail.toLowerCase() === email.toLowerCase());
      }
      return res.json({ success: true, count: result.length, data: result });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single booking by passCode
// @route   GET /api/bookings/pass/:passCode
const getBookingByPassCode = async (req, res) => {
  try {
    const { passCode } = req.params;

    if (getDBStatus()) {
      const booking = await Booking.findOne({ passCode });
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Pass code not found' });
      }
      return res.json({ success: true, data: booking });
    } else {
      const booking = inMemoryBookings.find((b) => b.passCode.toUpperCase() === passCode.toUpperCase());
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Pass code not found' });
      }
      return res.json({ success: true, data: booking });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel an active booking & release slot
// @route   POST /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      booking.status = 'cancelled';
      await booking.save();

      // Release spot
      await ParkingSpot.findByIdAndUpdate(booking.spot, { status: 'available' });
      return res.json({ success: true, message: 'Booking cancelled and slot released', data: booking });
    } else {
      const booking = inMemoryBookings.find((b) => b._id.toString() === id.toString());
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      booking.status = 'cancelled';
      return res.json({ success: true, message: 'Booking cancelled and slot released', data: booking });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Complete booking (Check-out)
// @route   POST /api/bookings/:id/complete
const completeBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      booking.status = 'completed';
      await booking.save();

      // Release spot
      await ParkingSpot.findByIdAndUpdate(booking.spot, { status: 'available' });
      return res.json({ success: true, message: 'Check-out completed', data: booking });
    } else {
      const booking = inMemoryBookings.find((b) => b._id.toString() === id.toString());
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      booking.status = 'completed';
      return res.json({ success: true, message: 'Check-out completed', data: booking });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingByPassCode,
  cancelBooking,
  completeBooking,
};
