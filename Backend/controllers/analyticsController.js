const ParkingSpot = require('../models/ParkingSpot');
const Booking = require('../models/Booking');
const { getDBStatus } = require('../config/db');

// @desc    Get dashboard analytics & live occupancy stats
// @route   GET /api/analytics
const getAnalytics = async (req, res) => {
  try {
    if (getDBStatus()) {
      const totalSpots = await ParkingSpot.countDocuments();
      const availableSpots = await ParkingSpot.countDocuments({ status: 'available' });
      const occupiedSpots = await ParkingSpot.countDocuments({ status: 'occupied' });
      const reservedSpots = await ParkingSpot.countDocuments({ status: 'reserved' });
      const maintenanceSpots = await ParkingSpot.countDocuments({ status: 'maintenance' });

      const activeBookings = await Booking.countDocuments({ status: 'active' });
      const totalBookings = await Booking.countDocuments();

      const revenueAgg = await Booking.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]);
      const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

      const evSpots = await ParkingSpot.countDocuments({ spotType: 'ev' });
      const hostListings = await ParkingSpot.countDocuments({ isHostListing: true });

      const occupancyRate = totalSpots > 0 ? Math.round(((occupiedSpots + reservedSpots) / totalSpots) * 100) : 0;

      const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(5);

      return res.json({
        success: true,
        data: {
          totalSpots,
          availableSpots,
          occupiedSpots,
          reservedSpots,
          maintenanceSpots,
          occupancyRate,
          activeBookings,
          totalBookings,
          totalRevenue,
          evSpots,
          hostListings,
          recentBookings,
        },
      });
    } else {
      // Fallback analytics
      return res.json({
        success: true,
        data: {
          totalSpots: 8,
          availableSpots: 5,
          occupiedSpots: 2,
          reservedSpots: 1,
          maintenanceSpots: 0,
          occupancyRate: 38,
          activeBookings: 2,
          totalBookings: 14,
          totalRevenue: 270.0,
          evSpots: 2,
          hostListings: 2,
          recentBookings: [
            {
              _id: 'book_901',
              userName: 'Alex Rivera',
              spotTitle: 'Metro Center Smart Garage - Level A',
              slotCode: 'A-02',
              vehicleNumber: 'NY-EV-8821',
              totalAmount: 10.0,
              status: 'active',
              createdAt: new Date(),
            },
          ],
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAnalytics };
