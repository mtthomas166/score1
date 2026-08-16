const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    apiId: {
      type: Number,
      required: [true, "apiId is required"],
      unique: true,
      index: true,
    },

    homeTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
      index: true,
    },

    awayTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
      index: true,
    },

    league: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "League",
      required: true,
      index: true,
    },

    matchDate: {
      type: Date,
      required: true,
      index: true,
    },

    homeTeamGoals: {
      type: Number,
      default: 0,
      min: 0,
    },

    awayTeamGoals: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["scheduled", "live", "finished", "postponed", "cancelled"],
      default: "scheduled",
      index: true,
    },

    currentMinute: {
      type: Number,
      default: 0,
      min: 0,
      max: 130,
    },

    currentSecond: {
      type: Number,
      default: 0,
      min: 0,
      max: 59,
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

matchSchema.index({ status: 1, matchDate: 1 });

matchSchema.index({ league: 1, matchDate: 1 });

matchSchema.index({homeTeam:1,awayTeam:1,matchDate:1},{unique:1})

const Match = mongoose.model("Match", matchSchema);

module.exports = Match;

