const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const hpp = require('hpp');

const app = express();

// Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet());
app.use(hpp());

// Routes - كل الملفات اللي موجودة فعلا عندك
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

// Use Routes
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
  res.send('Yalla Shoot API is Running');
});

module.exports = app;
