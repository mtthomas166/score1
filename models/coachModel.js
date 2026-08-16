const mongoose = require("mongoose");

const coachSchema = new mongoose.Schema(
  {
    apiId: {
      type: Number,
      required: [true, "apiId is required"],
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 5,
      maxlength: 20,
      index: true,
      unique: true,
    },
    avatar: {
      type: String,
      trim: true,
      default: null,
    },
    team: {
      type: mongoose.Schema.ObjectId,
      ref: "Team",
      trim: true,
      default: null,
    },
    state: {
      type: mongoose.Schema.ObjectId,
      ref: "Team",
      trim: true,
      default: null,
    },
    birthDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Coach", coachSchema);
