
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoute = require("./Routes/authRoute");
const teamRoute = require("./Routes/teamRoute");
const leagueRoute = require("./Routes/leagueRoute");
const matchRoute = require("./Routes/matchRoute");
const detailsRoute = require("./Routes/detailsRoute");
const standingRoute = require("./Routes/standingRoute");
const eventRoute = require("./Routes/eventRoute");
const newsRoute = require("./Routes/newsRoute");
const syncRoute = require("./Routes/syncRoute");
const globalErrorHandler = require("./Controllers/errorController");
const AppError = require("./Utils/appError");

dotenv.config({ path: "./config.env" });
const app = express();

// CORS FIX - allow all origins
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/team", teamRoute);
app.use("/api/league", leagueRoute);
app.use("/api/match", matchRoute);
app.use("/api/details", detailsRoute);
app.use("/api/standing", standingRoute);
app.use("/api/event", eventRoute);
app.use("/api/news", newsRoute);
app.use("/api/sync", syncRoute);

app.get("/", (req, res) => {
  res.json({ status: "API running", time: new Date() });
});

app.get("/api", (req, res) => {
  res.json({ message: "Yalla Shoot API", endpoints: ["/api/match", "/api/league", "/api/team", "/api/sync"] });
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

// Auto sync on startup (once)
try {
  const { syncAllLeagues } = require("./Services/espnSync");
  setTimeout(() => {
    console.log("Starting auto sync...");
    syncAllLeagues().then(t => console.log(`Auto synced ${t} matches`)).catch(e => console.log("Auto sync failed", e.message));
  }, 3000);
} catch (e) {
  console.log("Auto sync service not found yet", e.message);
}

module.exports = app;
