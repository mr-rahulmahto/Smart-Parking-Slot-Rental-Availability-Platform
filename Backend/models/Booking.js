const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    userName: {
      type: String,
      required: true,
      default: 'Guest Driver',
    },
    userEmail: {
      type: String,
      default: '',
    },
    userPhone: {
      type: String,
      default: '',
    },
    spot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ParkingSpot',
      required: true,
    },
    spotTitle: {
      type: String,
      required: true,
    },
    slotCode: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      default: '',
    },
    vehicleNumber: {
      type: String,
      required: true,
    },
    vehicleType: {
      type: String,
      enum: ['car', 'suv', 'bike', 'ev', 'truck', 'other'],
      default: 'car',
    },
    startTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endTime: {
      type: Date,
      required: true,
    },
    durationHours: {
      type: Number,
      required: true,
      default: 2,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    bookingType: {
      type: String,
      enum: ['hourly', 'daily', 'monthly'],
      default: 'hourly',
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending'],
      default: 'paid',
    },
    passCode: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
