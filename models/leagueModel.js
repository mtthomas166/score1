const mongoose = require("mongoose");

const leagueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "League must have a name"],
      trim: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["continental", "domestic", "international", "friendly"],
      required: [true, "League type is required"],
    },

    country: {
      type: String,
      trim: true,
    },

    logo: {
      type: String,
    },

    foundedYear: {
      type: Number,
    },

    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },

    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },

    isRoundRobin: { type: Boolean, default: true },

    apiId: {
      type: Number,
      unique: true,
      required: [true, "apiId is required"],
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const League = mongoose.model("League", leagueSchema);
module.exports = League;
