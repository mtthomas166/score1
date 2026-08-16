const mongoose = require("mongoose");

const refereeSchema = new mongoose.Schema(
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
      maxlength: [50, "Name must be at most 100 characters"],
      index: true,
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [18, "Referee must be at least 18 years old"],
      max: [55, "Referee age must be at most 80 years old"],
    },
    type: {
      type: String,
      required: [true, "Type of referee is required"],
      trim: true,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },
    birthDate: {
      type: Date,
      default: null,
    },
    sex: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    isInternational: {
      type: Boolean,
      default: false,
    },
    avatar: String,
  },
  {
    timestamps: true,
  },
);

refereeSchema.index({ name: 1, country: 1 }, { unique: 1 });
const Referee = mongoose.model("Referee", refereeSchema);

module.exports = Referee;
