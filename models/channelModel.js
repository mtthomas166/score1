const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      unique: true,
      index: true,
      minlength: 5,
      maxlength: 20,
    },

    satellite: {
      type: String,
      required: [true, "Satellite is required"],
      trim: true,
    },

    corner: {
      type: String,
      required: [true, "Corner is required"],
      trim: true,
    },

    frequency: {
      type: Number,
      required: [true, "Frequency is required"],
      min: 1000,
      max: 20000,
    },

    polarization: {
      type: String,
      required: true,
      enum: ["H", "V"],
    },

    coding: {
      type: String,
      required: true,
      trim: true,
    },

    correction: {
      type: String,
      required: true,
      trim: true,
    },

    encryption: {
      type: String,
      required: true,
      enum: ["FTA", "Encrypted"],
    },

    language: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

channelSchema.index(
  { satellite: 1, frequency: 1, polarization: 1 },
  { unique: true },
);

module.exports = mongoose.model("Channel", channelSchema);
