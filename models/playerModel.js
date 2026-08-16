const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  apiId: {
    type: Number,
    required: [true, "apiId is required"],
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, "name is required"],
  },
  currentTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: [true, "team is required"],
  },
  nationalTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },
  position: {
    type: String,
    required: [true, "position is required"],
  },
  age: {
    type: Number,
    required: [true, "age is required"],
  },
  weight: {
    type: Number,
    required: [true, "weight is required"],
  },
  length: {
    type: Number,
    required: [true, "length is required"],
  },
  avatar: String,
  t_shirt: String,
});

const Player = mongoose.model("Player", PlayerSchema);
module.exports = Player;
