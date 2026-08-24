const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  // Accept both MONGODB_URI and MONGO_URI to handle different deployment env var names
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri || uri.includes('<db_password>') || uri.includes('<password>')) {
    console.warn('\n===============================================================');
    console.warn('⚠️  MONGODB WARNING:');
    console.warn('MONGODB_URI is missing or still has a placeholder password.');
    console.warn('Set MONGODB_URI (or MONGO_URI) in your environment / Vercel dashboard.');
    console.warn('The server will continue running in in-memory fallback mode.');
    console.warn('===============================================================\n');
    return false;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection FAILED: ${error.message}`);
    console.error('Full error:', error);
    console.warn('⚠️  Possible causes:');
    console.warn('   1. Wrong password in MONGODB_URI');
    console.warn('   2. IP address not whitelisted in MongoDB Atlas → Network Access → Add 0.0.0.0/0');
    console.warn('   3. Cluster paused or wrong cluster name in URI');
    console.warn('Falling back to in-memory mode. New registrations WILL NOT be persisted.');
    isConnected = false;
    return false;
  }
};

const getDBStatus = () => isConnected;

module.exports = { connectDB, getDBStatus };
