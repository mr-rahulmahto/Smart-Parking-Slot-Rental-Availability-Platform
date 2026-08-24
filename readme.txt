================================================================================
SMART PARKING SLOT & RENTAL AVAILABILITY PLATFORM
================================================================================

A modern full-stack platform for real-time parking slot availability, 
interactive 2D slot reservation, private driveway rental hosting, and IoT pass generation.

PROJECT STRUCTURE:
------------------
├── Backend/                 # Node.js + Express + Mongoose (Port 5000)
│   ├── config/db.js         # MongoDB Atlas connection handler
│   ├── controllers/         # Auth, Spots, Bookings, Analytics
│   ├── models/              # User, ParkingSpot, Booking schemas
│   ├── routes/              # Express API endpoints
│   ├── seed.js              # Database seeder script
│   ├── server.js            # Express server entry point
│   ├── .env                 # Environment config (MongoDB URI)
│   └── package.json
│
└── Frontend/                # React (Vite) + Lucide Icons (Port 3000)
    ├── src/
    │   ├── components/      # Navbar, HeroSearch, ParkingGrid, SpotCard, Modals, Console
    │   ├── services/api.js  # API client
    │   ├── styles/index.css # Dark modern cyber/glassmorphism design system
    │   ├── App.jsx          # Master application state & routing
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json

QUICK START INSTRUCTIONS:
-------------------------

1. CONFIGURE MONGODB:
   Open Backend/.env and replace <db_password> with your actual MongoDB Atlas password:
   MONGODB_URI=mongodb+srv://rahulmahto2486_db_user:<YOUR_PASSWORD>@cluster0.qcxzizs.mongodb.net/smart_parking?retryWrites=true&w=majority&appName=Cluster0

2. START BACKEND SERVER:
   cd Backend
   npm install
   npm run seed      # (Optional) Pre-populates sample lots & driveways into MongoDB
   npm start         # Runs Express on http://localhost:5000

3. START FRONTEND APPLICATION:
   cd Frontend
   npm install
   npm run dev       # Runs Vite React App on http://localhost:3000

KEY FEATURES:
-------------
- Live 2D Interactive Parking Lot Grid (with real-time occupancy pulse)
- Instant Slot Booking & Dynamic Duration Price Calculator
- Digital Barcode / QR Code Gate Passes with Live Countdown Timers
- Rent Out Space (Driveway / Garage rental portal for private hosts)
- Live Operations & Telemetry Console (Slot override & revenue metrics)
- Driver, Host, and Admin roles with one-click demo presets
================================================================================
