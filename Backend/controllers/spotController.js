const ParkingSpot = require('../models/ParkingSpot');
const { getDBStatus } = require('../config/db');

// Realistic initial dataset for fallback or seeder
const initialSpots = [
  {
    _id: 'spot_101',
    title: 'Metro Center Smart Garage - Level A',
    description: 'Ultra-modern covered parking deck with 24/7 automated gate and high-speed EV chargers.',
    spotType: 'ev',
    rentalType: 'flexible',
    slotCode: 'A-01',
    floor: 'Level 1 - EV Fast Hub',
    address: '450 Lexington Ave, Midtown',
    city: 'New York',
    landmark: 'Grand Central Station',
    coordinates: { lat: 40.7516, lng: -73.9754 },
    pricePerHour: 6.5,
    pricePerDay: 42.0,
    pricePerMonth: 320.0,
    amenities: ['ev_charging', 'cctv', 'covered', '24_7_access', 'security_guard'],
    status: 'available',
    isHostListing: false,
    hostName: 'MetroPark Global',
    hostPhone: '+1 (800) 555-0199',
    image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 48,
  },
  {
    _id: 'spot_102',
    title: 'Metro Center Smart Garage - Level A',
    description: 'Covered premium parking spot directly next to elevator lobby.',
    spotType: 'car',
    rentalType: 'flexible',
    slotCode: 'A-02',
    floor: 'Level 1',
    address: '450 Lexington Ave, Midtown',
    city: 'New York',
    landmark: 'Grand Central Station',
    coordinates: { lat: 40.7516, lng: -73.9754 },
    pricePerHour: 5.0,
    pricePerDay: 35.0,
    pricePerMonth: 280.0,
    amenities: ['cctv', 'covered', '24_7_access'],
    status: 'occupied',
    isHostListing: false,
    hostName: 'MetroPark Global',
    hostPhone: '+1 (800) 555-0199',
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 31,
  },
  {
    _id: 'spot_103',
    title: 'Metro Center Smart Garage - Level A',
    description: 'Spacious SUV and wide vehicle slot with rubberized pillar bumpers.',
    spotType: 'suv',
    rentalType: 'flexible',
    slotCode: 'A-03',
    floor: 'Level 1',
    address: '450 Lexington Ave, Midtown',
    city: 'New York',
    landmark: 'Grand Central Station',
    coordinates: { lat: 40.7516, lng: -73.9754 },
    pricePerHour: 5.5,
    pricePerDay: 38.0,
    pricePerMonth: 290.0,
    amenities: ['cctv', 'covered', 'security_guard'],
    status: 'available',
    isHostListing: false,
    hostName: 'MetroPark Global',
    hostPhone: '+1 (800) 555-0199',
    image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 19,
  },
  {
    _id: 'spot_104',
    title: 'Metro Center Smart Garage - Level A',
    description: 'Level A reserved executive slot.',
    spotType: 'car',
    rentalType: 'flexible',
    slotCode: 'A-04',
    floor: 'Level 1',
    address: '450 Lexington Ave, Midtown',
    city: 'New York',
    landmark: 'Grand Central Station',
    coordinates: { lat: 40.7516, lng: -73.9754 },
    pricePerHour: 5.0,
    pricePerDay: 35.0,
    pricePerMonth: 280.0,
    amenities: ['cctv', 'covered', '24_7_access'],
    status: 'reserved',
    isHostListing: false,
    hostName: 'MetroPark Global',
    hostPhone: '+1 (800) 555-0199',
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviewsCount: 14,
  },
  {
    _id: 'spot_105',
    title: 'Downtown Two-Wheeler Bay',
    description: 'Dedicated anchor locked motorcycle and scooter parking bay with weather shelter.',
    spotType: 'bike',
    rentalType: 'hourly',
    slotCode: 'B-01',
    floor: 'Ground Level East',
    address: '120 Broadway, Financial District',
    city: 'New York',
    landmark: 'Wall Street',
    coordinates: { lat: 40.7081, lng: -74.0113 },
    pricePerHour: 2.5,
    pricePerDay: 15.0,
    pricePerMonth: 120.0,
    amenities: ['cctv', 'covered', '24_7_access'],
    status: 'available',
    isHostListing: false,
    hostName: 'CityBays NYC',
    hostPhone: '+1 (555) 721-0988',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 52,
  },
  {
    _id: 'spot_106',
    title: 'Private Driveway - Residential Rental',
    description: 'Secure gated private driveway in quiet neighborhood. Perfect for daily commuters or airport long-term parking.',
    spotType: 'car',
    rentalType: 'daily',
    slotCode: 'DW-01',
    floor: 'Outdoor Driveway',
    address: '742 Evergreen Terrace, Brooklyn',
    city: 'New York',
    landmark: 'Prospect Park',
    coordinates: { lat: 40.6602, lng: -73.969 },
    pricePerHour: 3.5,
    pricePerDay: 22.0,
    pricePerMonth: 190.0,
    amenities: ['cctv', '24_7_access', 'security_guard'],
    status: 'available',
    isHostListing: true,
    hostName: 'Sarah Jenkins (Host)',
    hostPhone: '+1 (555) 443-9081',
    image: 'https://images.unsplash.com/photo-1584463699028-ebbb4b216972?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewsCount: 23,
  },
  {
    _id: 'spot_107',
    title: 'Bay Area Tech Park EV Superhub',
    description: 'Level 3 150kW ultra-fast DC charging slot. Free Wi-Fi and lounge access included with booking.',
    spotType: 'ev',
    rentalType: 'hourly',
    slotCode: 'EV-03',
    floor: 'Solar Canopy Level',
    address: '100 University Ave, Palo Alto',
    city: 'San Francisco',
    landmark: 'Stanford Campus',
    coordinates: { lat: 37.4419, lng: -122.143 },
    pricePerHour: 7.0,
    pricePerDay: 48.0,
    pricePerMonth: 360.0,
    amenities: ['ev_charging', 'cctv', 'covered', '24_7_access', 'valet'],
    status: 'available',
    isHostListing: false,
    hostName: 'ChargeGrid Tech',
    hostPhone: '+1 (555) 880-9911',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    rating: 4.95,
    reviewsCount: 77,
  },
  {
    _id: 'spot_108',
    title: 'Marina Bay Gated Garage Space',
    description: 'Underground temperature-controlled parking space with 24/7 security guard patrol.',
    spotType: 'suv',
    rentalType: 'monthly',
    slotCode: 'MB-12',
    floor: 'Basement B1',
    address: '500 Marina Blvd, Marina District',
    city: 'San Francisco',
    landmark: 'Palace of Fine Arts',
    coordinates: { lat: 37.8037, lng: -122.4415 },
    pricePerHour: 4.5,
    pricePerDay: 30.0,
    pricePerMonth: 260.0,
    amenities: ['cctv', 'covered', 'security_guard', 'valet', 'disabled_access'],
    status: 'occupied',
    isHostListing: true,
    hostName: 'David Zhang (Host)',
    hostPhone: '+1 (555) 654-3210',
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
    rating: 4.85,
    reviewsCount: 39,
  },
];

let inMemorySpots = [...initialSpots];

// @desc    Get all parking spots with filters
// @route   GET /api/spots
const getSpots = async (req, res) => {
  try {
    const { query, city, spotType, rentalType, status, amenity, minPrice, maxPrice, hostOnly } = req.query;

    if (getDBStatus()) {
      let filter = {};

      if (query) {
        filter.$or = [
          { title: { $regex: query, $options: 'i' } },
          { address: { $regex: query, $options: 'i' } },
          { city: { $regex: query, $options: 'i' } },
          { landmark: { $regex: query, $options: 'i' } },
          { slotCode: { $regex: query, $options: 'i' } },
        ];
      }

      if (city && city !== 'All') {
        filter.city = { $regex: new RegExp(`^${city}$`, 'i') };
      }

      if (spotType && spotType !== 'all') {
        filter.spotType = spotType.toLowerCase();
      }

      if (rentalType && rentalType !== 'all') {
        filter.rentalType = { $in: [rentalType.toLowerCase(), 'flexible'] };
      }

      if (status && status !== 'all') {
        filter.status = status.toLowerCase();
      }

      if (amenity) {
        filter.amenities = { $in: [amenity] };
      }

      if (minPrice || maxPrice) {
        filter.pricePerHour = {};
        if (minPrice) filter.pricePerHour.$gte = Number(minPrice);
        if (maxPrice) filter.pricePerHour.$lte = Number(maxPrice);
      }

      if (hostOnly === 'true') {
        filter.isHostListing = true;
      }

      const spots = await ParkingSpot.find(filter).sort({ createdAt: -1 });
      return res.json({ success: true, count: spots.length, data: spots });
    } else {
      // In-memory filter fallback
      let filtered = [...inMemorySpots];

      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.address.toLowerCase().includes(q) ||
            s.city.toLowerCase().includes(q) ||
            s.slotCode.toLowerCase().includes(q) ||
            (s.landmark && s.landmark.toLowerCase().includes(q))
        );
      }

      if (city && city !== 'All') {
        filtered = filtered.filter((s) => s.city.toLowerCase() === city.toLowerCase());
      }

      if (spotType && spotType !== 'all') {
        filtered = filtered.filter((s) => s.spotType.toLowerCase() === spotType.toLowerCase());
      }

      if (rentalType && rentalType !== 'all') {
        filtered = filtered.filter((s) => s.rentalType === rentalType || s.rentalType === 'flexible');
      }

      if (status && status !== 'all') {
        filtered = filtered.filter((s) => s.status === status);
      }

      if (amenity) {
        filtered = filtered.filter((s) => s.amenities && s.amenities.includes(amenity));
      }

      if (minPrice) {
        filtered = filtered.filter((s) => s.pricePerHour >= Number(minPrice));
      }
      if (maxPrice) {
        filtered = filtered.filter((s) => s.pricePerHour <= Number(maxPrice));
      }

      if (hostOnly === 'true') {
        filtered = filtered.filter((s) => s.isHostListing);
      }

      return res.json({ success: true, count: filtered.length, data: filtered });
    }
  } catch (error) {
    console.error('Error in getSpots:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single parking spot by ID
// @route   GET /api/spots/:id
const getSpotById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      const spot = await ParkingSpot.findById(id);
      if (!spot) {
        return res.status(404).json({ success: false, message: 'Parking spot not found' });
      }
      return res.json({ success: true, data: spot });
    } else {
      const spot = inMemorySpots.find((s) => s._id.toString() === id.toString());
      if (!spot) {
        return res.status(404).json({ success: false, message: 'Parking spot not found' });
      }
      return res.json({ success: true, data: spot });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new parking spot or host rental space
// @route   POST /api/spots
const createSpot = async (req, res) => {
  try {
    const {
      title,
      description,
      spotType,
      rentalType,
      slotCode,
      floor,
      address,
      city,
      landmark,
      pricePerHour,
      pricePerDay,
      pricePerMonth,
      amenities,
      isHostListing,
      image,
    } = req.body;

    if (!title || !address || !slotCode) {
      return res.status(400).json({ success: false, message: 'Please provide title, address, and slot code' });
    }

    const hostName = req.user ? req.user.name : req.body.hostName || 'Private Host';
    const hostPhone = req.user ? req.user.phone || '+1 (555) 012-9843' : req.body.hostPhone || '+1 (555) 012-9843';
    const hostId = req.user ? req.user._id : null;

    const spotData = {
      title,
      description: description || 'Secure, convenient parking slot.',
      spotType: spotType || 'car',
      rentalType: rentalType || 'flexible',
      slotCode: slotCode.toUpperCase(),
      floor: floor || 'Ground Level',
      address,
      city: city || 'New York',
      landmark: landmark || '',
      pricePerHour: Number(pricePerHour) || 5,
      pricePerDay: Number(pricePerDay) || (Number(pricePerHour) ? Number(pricePerHour) * 6 : 30),
      pricePerMonth: Number(pricePerMonth) || (Number(pricePerHour) ? Number(pricePerHour) * 45 : 220),
      amenities: Array.isArray(amenities) ? amenities : ['cctv', '24_7_access'],
      status: 'available',
      isHostListing: isHostListing !== undefined ? isHostListing : true,
      host: hostId,
      hostName,
      hostPhone,
      image: image || 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
      reviewsCount: 1,
    };

    if (getDBStatus()) {
      const created = await ParkingSpot.create(spotData);
      return res.status(201).json({ success: true, data: created });
    } else {
      const created = {
        _id: 'spot_' + Date.now(),
        ...spotData,
        createdAt: new Date(),
      };
      inMemorySpots.unshift(created);
      return res.status(201).json({ success: true, data: created });
    }
  } catch (error) {
    console.error('Error creating spot:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle or update spot status (available / occupied / reserved / maintenance)
// @route   PATCH /api/spots/:id/status
const updateSpotStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['available', 'occupied', 'reserved', 'maintenance'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    if (getDBStatus()) {
      const spot = await ParkingSpot.findByIdAndUpdate(id, { status }, { new: true });
      if (!spot) {
        return res.status(404).json({ success: false, message: 'Spot not found' });
      }
      return res.json({ success: true, data: spot });
    } else {
      const spotIndex = inMemorySpots.findIndex((s) => s._id.toString() === id.toString());
      if (spotIndex === -1) {
        return res.status(404).json({ success: false, message: 'Spot not found' });
      }
      inMemorySpots[spotIndex].status = status;
      return res.json({ success: true, data: inMemorySpots[spotIndex] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a spot
// @route   DELETE /api/spots/:id
const deleteSpot = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      await ParkingSpot.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Spot removed successfully' });
    } else {
      inMemorySpots = inMemorySpots.filter((s) => s._id.toString() !== id.toString());
      return res.json({ success: true, message: 'Spot removed successfully' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSpots,
  getSpotById,
  createSpot,
  updateSpotStatus,
  deleteSpot,
  initialSpots,
};
