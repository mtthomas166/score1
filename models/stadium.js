const mongoose = require("mongoose");

const stadiumSchema = new mongoose.Schema(
  {
    apiId: {
      type: Number,
      required: [true, "apiId is required"],
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
      maxlength: 100,
    },

    numberOfSeats: {
      type: Number,
      required: [true, "num of seats is required"],
      min: 1,
    },

    dateOfCreation: {
      type: Date,
    },

    country: {
      type: String,
      required: [true, "country is required"],
      trim: true,
    },

    location: {
      type: String,
      required: [true, "location is required"],
      trim: true,
    },

    length: {
      type: String,
      required: [true, "length is required"],
      trim: true,
    },

    width: {
      type: Number,
      required: [true, "width is required"],
      min: 1,
    },

    team: {
      type: mongoose.Schema.ObjectId,
      ref: "Team",
    },

    nationalTeam: {
      type: mongoose.Schema.ObjectId,
      ref: "Team",
    },
  },
  {
    timestamps: true,
  },
);

stadiumSchema.index({ name: 1 });
stadiumSchema.index({ team: 1 });
stadiumSchema.index({ nationalTeam: 1 });

module.exports = mongoose.model("Stadium", stadiumSchema);
