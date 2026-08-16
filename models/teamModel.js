const mongoose = require("mongoose");

const teamSchema = mongoose.Schema(
  {
    name: { type: String, required: [true, "name is required"]},
    logo: { type: String },
    information: {
      achievements: [String],
      country: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
      level: String,
      stadium: { type: mongoose.Schema.Types.ObjectId, ref: "Stadium" },
      federation: String,
      description: String,
    },
    apiId: {
      type: Number,
      unique: true,
      required: [true, "apiId is required"],
    },
  },
  { timestamps: true },
);

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
