const mongoose = require("mongoose");

const standingSchema = new mongoose.Schema(
  {
    league: {
      type: mongoose.Schema.ObjectId,
      ref: "League",
      required: [true, "League is required"],
    },
    team: {
      type: mongoose.Schema.ObjectId,
      ref: "Team",
      required: [true, "Team is required"],
    },
    playedGames: {
      type: Number,
      default: 0,
      min: 0,
    },
    won: {
      type: Number,
      default: 0,
      min: 0,
    },
    draw: {
      type: Number,
      default: 0,
      min: 0,
    },
    lost: {
      type: Number,
      default: 0,
      min: 0,
    },
    points: {
      type: Number,
      default: 0,
      min: 0,
    },
    goalsFor: {
      type: Number,
      default: 0,
      min: 0,
    },
    goalsAgainst: {
      type: Number,
      default: 0,
      min: 0,
    },
    goalDifference: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

standingSchema.index({ league: 1, team: 1 }, { unique: true });

standingSchema.index({ league: 1 });
standingSchema.index({ team: 1 });

const Standing = mongoose.model("Standing", standingSchema);

module.exports = Standing;
