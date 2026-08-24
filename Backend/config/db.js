const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<db_password>')) {
    console.warn('\n===============================================================');
    console.warn('⚠️  MONGODB WARNING:');
    console.warn('Please replace <db_password> in Backend/.env with your actual password.');
    console.warn('The server will continue running and serve API requests.');
    console.warn('===============================================================\n');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️ Server will operate in memory-safe mode. Check your MongoDB credentials and IP Whitelist in Atlas.');
    return false;
  }
};

const getDBStatus = () => isConnected;

module.exports = { connectDB, getDBStatus };
