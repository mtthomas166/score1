
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet());

// === MongoDB connection for Vercel Serverless ===
let cached = global.mongooseCache;
if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI not set in Vercel Environment Variables');
  }
  if (!cached.promise) {
    console.log('Connecting to MongoDB...');
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
    }).then((m) => {
      console.log('MongoDB connected:', m.connection.host);
      return m;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Connect before every request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (e) {
    console.error('DB Connect Fail:', e.message);
    return res.status(500).json({ status: 'error', message: 'DB connection failed: ' + e.message });
  }
});

// Routes
const authRoute = require('./Routes/authRoute');
const matchRoute = require('./Routes/matchRoute');
const leagueRoute = require('./Routes/leagueRoute');
const teamRoute = require('./Routes/teamRoute');
const standingRoute = require('./Routes/standingRoute');
const playerRoute = require('./Routes/playerRoute');
const newsRoute = require('./Routes/NewsRoute');
const searchRoute = require('./Routes/searchRoute');
const syncRoute = require('./Routes/syncRoute');
const channelRoute = require('./Routes/channelRoute');
const coachRoute = require('./Routes/coachRoute');
const detailsRoute = require('./Routes/detailsRoute');
const refereeRoute = require('./Routes/refereeRoute');
const stadiumRoute = require('./Routes/stadiumRoute');
const topScoresRoute = require('./Routes/topScoresRoute');
const transferRoute = require('./Routes/transferRoute');
const userRoute = require('./Routes/userRoute');

app.use('/api/auth', authRoute);
app.use('/api/match', matchRoute);
app.use('/api/league', leagueRoute);
app.use('/api/team', teamRoute);
app.use('/api/standing', standingRoute);
app.use('/api/player', playerRoute);
app.use('/api/news', newsRoute);
app.use('/api/search', searchRoute);
app.use('/api/sync', syncRoute);
app.use('/api/channel', channelRoute);
app.use('/api/coach', coachRoute);
app.use('/api/details', detailsRoute);
app.use('/api/referee', refereeRoute);
app.use('/api/stadium', stadiumRoute);
app.use('/api/topScores', topScoresRoute);
app.use('/api/transfer', transferRoute);
app.use('/api/user', userRoute);

app.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Not Connected';
  res.send(`Yalla Shoot API is Running - DB: ${dbStatus}`);
});

module.exports = app;

// Local dev only
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => app.listen(PORT, () => console.log('Local server on', PORT)));
}
