const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
    },
    logo: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    league: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "League",
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
  },
  { timestamps: true },
);

const News = mongoose.model("News", newsSchema);

module.exports = News;