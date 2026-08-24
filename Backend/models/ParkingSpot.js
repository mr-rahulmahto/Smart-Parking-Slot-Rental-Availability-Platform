const mongoose = require('mongoose');

const parkingSpotSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    spotType: {
      type: String,
      enum: ['car', 'suv', 'bike', 'ev', 'truck'],
      default: 'car',
    },
    rentalType: {
      type: String,
      enum: ['hourly', 'daily', 'monthly', 'flexible'],
      default: 'flexible',
    },
    slotCode: {
      type: String,
      required: true,
      trim: true,
    },
    floor: {
      type: String,
      default: 'Ground Level',
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      default: 'New York',
    },
    landmark: {
      type: String,
      default: '',
    },
    coordinates: {
      lat: { type: Number, default: 40.7128 },
      lng: { type: Number, default: -74.006 },
    },
    pricePerHour: {
      type: Number,
      required: true,
      default: 5,
    },
    pricePerDay: {
      type: Number,
      default: 35,
    },
    pricePerMonth: {
      type: Number,
      default: 250,
    },
    amenities: {
      type: [String],
      default: ['cctv', '24_7_access'],
    },
    status: {
      type: String,
      enum: ['available', 'occupied', 'reserved', 'maintenance'],
      default: 'available',
    },
    isHostListing: {
      type: Boolean,
      default: false,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    hostName: {
      type: String,
      default: 'SmartPark System',
    },
    hostPhone: {
      type: String,
      default: '+1 (555) 019-2834',
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    reviewsCount: {
      type: Number,
      default: 12,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ParkingSpot', parkingSpotSchema);
