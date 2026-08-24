require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const ParkingSpot = require('./models/ParkingSpot');
const Booking = require('./models/Booking');

const seedData = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri || uri.includes('<db_password>')) {
      console.error('❌ Please update <db_password> in Backend/.env first to run MongoDB seeder.');
      process.exit(1);
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB.');

    // Clear existing
    await User.deleteMany({});
    await ParkingSpot.deleteMany({});
    await Booking.deleteMany({});
    console.log('Cleared existing collections.');

    // Seed Users
    const users = await User.create([
      {
        name: 'Alex Rivera',
        email: 'driver@smartpark.io',
        password: 'password123',
        role: 'driver',
        phone: '+1 (555) 321-7890',
        vehicleNumber: 'NY-EV-8821',
        vehicleType: 'ev',
      },
      {
        name: 'Sarah Jenkins',
        email: 'host@smartpark.io',
        password: 'password123',
        role: 'host',
        phone: '+1 (555) 443-9081',
        vehicleNumber: 'CA-776-XYZ',
        vehicleType: 'suv',
      },
      {
        name: 'Marcus Vance',
        email: 'admin@smartpark.io',
        password: 'password123',
        role: 'admin',
        phone: '+1 (555) 890-1234',
        vehicleNumber: 'ADMIN-01',
        vehicleType: 'car',
      },
    ]);
    console.log(`Seeded ${users.length} users.`);

    // Seed Parking Spots
    const spots = await ParkingSpot.create([
      {
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
        host: users[1]._id,
        hostName: 'Sarah Jenkins',
        hostPhone: '+1 (555) 443-9081',
        image: 'https://images.unsplash.com/photo-1584463699028-ebbb4b216972?auto=format&fit=crop&w=800&q=80',
        rating: 5.0,
        reviewsCount: 23,
      },
      {
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
        host: users[1]._id,
        hostName: 'Sarah Jenkins',
        hostPhone: '+1 (555) 443-9081',
        image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
        rating: 4.85,
        reviewsCount: 39,
      },
    ]);
    console.log(`Seeded ${spots.length} parking spots.`);

    // Seed Sample Booking
    await Booking.create([
      {
        user: users[0]._id,
        userName: 'Alex Rivera',
        userEmail: 'driver@smartpark.io',
        userPhone: '+1 (555) 321-7890',
        spot: spots[1]._id,
        spotTitle: spots[1].title,
        slotCode: spots[1].slotCode,
        address: `${spots[1].address}, ${spots[1].city}`,
        vehicleNumber: 'NY-EV-8821',
        vehicleType: 'car',
        startTime: new Date(Date.now() - 1000 * 60 * 45),
        endTime: new Date(Date.now() + 1000 * 60 * 75),
        durationHours: 2,
        totalAmount: 10.0,
        bookingType: 'hourly',
        status: 'active',
        paymentStatus: 'paid',
        passCode: 'SP-NY4821',
      },
    ]);
    console.log('Seeded sample active booking.');

    console.log('✨ MongoDB Atlas Seed Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder Error:', error);
    process.exit(1);
  }
};

seedData();
