const mongoose = require("mongoose");

const detailsSchema = new mongoose.Schema(
  {
    match: {
      type: mongoose.Schema.ObjectId,
      ref: "Match",
      required: true,
      index: true,
    },

    league: {
      type: mongoose.Schema.ObjectId,
      ref: "League",
      required: true,
      index: true,
    },

    stadium: {
      type: mongoose.Schema.ObjectId,
      ref: "Stadium",
      default: null,
    },

    round: {
      type: String,
      required: [true, "Round is required"],
      trim: true,
    },

    channel: {
      type: mongoose.Schema.ObjectId,
      ref: "Channel",
      default: null,
    },

    referee: {
      type: mongoose.Schema.ObjectId,
      ref: "Referee",
      default: null,
    },

    commentator: {
      type: mongoose.Schema.ObjectId,
      ref: "Commentator",
      default: null,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    matchTime: {
      type: Date,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["scheduled", "live", "finished", "postponed", "cancelled"],
      default: "scheduled",
      index: true,
    },

    apiId: {
      type: Number,
      unique: true,
      required: [true, "apiId is required"],
      index: true,
    },
  },
  { timestamps: true },
);

detailsSchema.index({ league: 1, date: 1 });

detailsSchema.index({ match: 1 }, { unique: true });

const Details = mongoose.model("Details", detailsSchema);

module.exports = Details;
