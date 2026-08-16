
const mongoose = require('mongoose');
const app = require('./app');

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = conn.connections[0].readyState === 1;
    console.log('MongoDB Connected:', conn.connection.host); 
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
}

// For Vercel serverless - connect on each request
app.use(async (req, res, next) => {
  try {
    if (!isConnected) await connectDB();
    next();
  } catch (e) {
    res.status(500).json({ status: 'error', message: 'DB connection failed: ' + e.message });
  }
});

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  });
}

module.exports = app;
