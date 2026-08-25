const mongoose = require('mongoose');

// Cache the connection promise so repeated calls (and serverless warm
// invocations) reuse the SAME in-flight connection instead of starting a new one.
let connectionPromise = null;

const getURI = () => process.env.MONGODB_URI || process.env.MONGO_URI;

const isPlaceholder = (uri) =>
  !uri || uri.includes('<db_password>') || uri.includes('<password>');

const connectDB = async () => {
  const uri = getURI();

  if (isPlaceholder(uri)) {
    console.warn('\n===============================================================');
    console.warn('⚠️  MONGODB WARNING:');
    console.warn('MONGODB_URI is missing or still has a placeholder password.');
    console.warn('Set MONGODB_URI (or MONGO_URI) in your environment / Vercel dashboard.');
    console.warn('The server will continue running in in-memory fallback mode.');
    console.warn('===============================================================\n');
    return false;
  }

  // Already connected — nothing to do.
  if (mongoose.connection.readyState === 1) return true;

  // A connection attempt is already in flight — await that one.
  if (connectionPromise) return connectionPromise;

  connectionPromise = mongoose
    .connect(uri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    })
    .then(() => {
      console.log(
        `✅ MongoDB Connected: ${mongoose.connection.host} | database: "${mongoose.connection.name}"`
      );
      return true;
    })
    .catch((error) => {
      console.error(`❌ MongoDB Connection FAILED: ${error.message}`);
      console.warn('⚠️  Possible causes:');
      console.warn('   1. Wrong password in MONGODB_URI');
      console.warn('   2. IP not whitelisted in MongoDB Atlas → Network Access → Add 0.0.0.0/0');
      console.warn('   3. Cluster paused or wrong cluster name in URI');
      console.warn('Falling back to in-memory mode. New registrations WILL NOT be persisted.');
      // Allow a future request to retry the connection.
      connectionPromise = null;
      return false;
    });

  return connectionPromise;
};

// Report the LIVE mongoose state rather than a stale boolean.
// 1 === connected. This stays correct across drops/reconnects.
const getDBStatus = () => mongoose.connection.readyState === 1;

/**
 * Express middleware: guarantees the DB connection has finished (or definitively
 * failed) BEFORE any route handler runs. This fixes requests arriving during the
 * connection window being wrongly told "Database not connected".
 */
const ensureDBConnected = async (req, res, next) => {
  try {
    if (!getDBStatus()) await connectDB();
  } catch (err) {
    console.error('ensureDBConnected error:', err.message);
  }
  next();
};

// Helpful lifecycle logs for debugging connection drops.
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected.');
  connectionPromise = null;
});
mongoose.connection.on('reconnected', () => console.log('✅ MongoDB reconnected.'));
mongoose.connection.on('error', (err) => console.error('MongoDB error:', err.message));

module.exports = { connectDB, getDBStatus, ensureDBConnected };
