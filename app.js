const express = require("express");
const app = express();

const appError = require("./utils/appError");

const morgan = require("morgan");
app.use(morgan("dev"));
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const hpp = require("hpp");
const rateLimiter = require("express-rate-limit");
app.use(helmet());
app.use(cookieParser());
app.use(hpp());
const limiter = rateLimiter({
  max: 100,
  windowMs: 1000 * 60 * 60,
  message: "too many request from this ip,please try again in an hour",
});

const authRoute = require("./Routes/authRoute");
const userRoute = require("./Routes/userRoute");
const leagueRoute = require("./Routes/leagueRoute");
const teamRoute = require("./Routes/teamRoute");
const NewsRoute = require("./Routes/NewsRoute");
const playerRoute = require("./Routes/playerRoute");
const coachRoute = require("./Routes/coachRoute");
const transferRoute = require("./Routes/transferRoute");
const stadiumRoute = require("./Routes/stadiumRoute");
const channelRoute = require("./Routes/channelRoute");
const refereeRoute = require("./Routes/refereeRoute");
const standingRoute = require("./Routes/standingRoute");
const topScoresRoute = require("./Routes/topScoresRoute");
const detailsRoute = require("./Routes/detailsRoute");
const searchRoute = require("./Routes/searchRoute");
const errorController = require("./Controller/errorController");

require("./Services/soccersApi");
require("./Services/matchService");
require("./Services/detailsService");
require("./Services/channelServices");
require("./Services/coachesServices");
require("./Services/leagueServices");
require("./Services/playerServices");
require("./Services/refereeServices");
require("./Services/stadiumServices");
require("./Services/transferAndPlayers");
require("./Services/standingServices");
require("./Services/teamService");

app.use("/api", limiter);
app.use(express.json({ limit: "10kb" }));
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/league", leagueRoute);
app.use("/api/team", teamRoute);
app.use("/api/News", NewsRoute);
app.use("/api/player", playerRoute);
app.use("/api/coach", coachRoute);
app.use("/api/transfer", transferRoute);
app.use("/api/stadium", stadiumRoute);
app.use("/api/channel", channelRoute);
app.use("/api/refree", refereeRoute);
app.use("/api/standing", standingRoute);
app.use("/api/topScores", topScoresRoute);
app.use("/api/details", detailsRoute);
app.use("/api/search", searchRoute);
app.use((req, res, next) => {
  next(new appError(`can't find ${req.originalUrl} on the server`, 404));
});

app.use(errorController);

module.exports = app;
