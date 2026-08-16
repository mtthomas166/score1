const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const authController = require("../Controller/authController");

const Team = require("../models/teamModel");
const Player = require("../models/playerModel");
const League = require("../models/leagueModel");

router.get(
  "",
  authController.protect,
  catchAsync(async (req, res) => {
    const q = req.query.q || "";
    if (!q) return res.status(400).json({ message: "Query is required" });

    const regex = new RegExp("^" + q, "i");

    const [teams, players, leagues] = await Promise.all([
      Team.find({ name: regex }),
      Player.find({ name: regex }),
      League.find({ name: regex }),
    ]);

    res.json({
      result: teams.length + players.length + leagues.length,
      data: { teams, players, leagues },
    });
  }),
);

module.exports = router;
