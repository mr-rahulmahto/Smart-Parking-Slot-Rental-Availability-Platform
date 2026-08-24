const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingByPassCode,
  cancelBooking,
  completeBooking,
} = require('../controllers/bookingController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.route('/').get(getBookings).post(optionalAuth, createBooking);
router.get('/pass/:passCode', getBookingByPassCode);
router.post('/:id/cancel', cancelBooking);
router.post('/:id/complete', completeBooking);

module.exports = router;
