const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { validate } = require("./leagueModel");
const { type } = require("os");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "user must have name"],
  },
  email: {
    type: String,
    required: [true, "user must have email"],
    unique: [true, "not valid,please enter another email"],
    validate: [validator.isEmail, "not valid email or password"],
  },
  password: {
    type: String,
    required: [true, "please enter your password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "please enter passwordConfirm"],
    minlength: 8,
    select: false,
  },
  role: { type: String, enum: ["admin", "manager", "user"], default: "user",select:false },
  photo: String,
  active:{type:Boolean,default:true,select:false},
  favoriteLeagues: [{ type: mongoose.Schema.ObjectId, ref: "League" }],
  hiddenLeagues: [{ type: mongoose.Schema.ObjectId, ref: "League" }],
  homeLeaguesOrder:[{type:mongoose.Schema.ObjectId ,ref:'League'}],
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpired: Date,
});
userSchema.pre('save', async function () {
  if (!this.isModified('password') || this.isNew) return ;
  this.passwordChangetAt = Date.now() - 1000;
});

userSchema.pre('save', async function () {
  if (!this.isModified('password') ) return;
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});
userSchema.methods.comparePassword = async function (password, userPassword) {
  return await bcrypt.compare(password, userPassword);
};
userSchema.methods.changePassword = function (jwtTimeStart) {
  if (this.passwordChangeAt) {
    timeInS = this.passwordChangeAt.getTime() / 1000;
    return timeInS > jwtTimeStart;
  }
  return false;
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpired = Date.now() + 60 * 1000 * 10;
  return resetToken;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
