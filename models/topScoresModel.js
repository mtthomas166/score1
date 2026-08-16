const mongoose = require("mongoose");
const topScoresSchema = mongoose.Schema({
  league: { type: mongoose.Schema.ObjectId, ref: "League", required: true },
  player: { type: mongoose.Schema.ObjectId, ref: "Player", required: true },
  team: { type: mongoose.Schema.ObjectId, ref: "Team", required: true },
  goals: { type: Number, default: 0 },
  plantyKickSscored: { type: Number, default: 0 },
  missedPlantyKick: { type: Number, default: 0 },
  plantygames: { type: Number, default: 0 },
});
const TopScores = mongoose.model("TopScores", topScoresSchema);
module.exports = TopScores;

