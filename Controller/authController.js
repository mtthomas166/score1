const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const sendEmail = require("./../utils/email");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const crypto = require("crypto");
const { promisify } = require("util");

//create Token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

//sendToken
const sendToken = (user, res, statuscode) => {
  const token = signToken(user._id);
  const cookiesOptions = {
    httpOnly: true,
  };
  if (process.env.NODE_ENV !== "development") cookiesOptions.secure = true;
  res.cookie("jwt", token, cookiesOptions);
  res.status(statuscode).json({
    status: "success",
    token,
    data: { user },
  });
};

//signUp
exports.signUp = catchAsync(async (req, res, next) => {
  const { email, password, passwordConfirm } = req.body;
  const user = await User.create(req.body);
  sendToken(user, res, 201);
});

//logIn
exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new appError("please enter email and password", 400));
  if (!validator.isEmail(email))
    return next(new appError("please enter valid email", 400));
  const user = await User.findOne({ email }).select("+password +active");
  if (!user || !(await user.comparePassword(password, user.password)))
    return next(new appError("email or password not correct", 404));
  if (user.active == false) user.active = true;
  await user.save();
  sendToken(user, res, 200);
});

//authorization
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.cookies.jwt) token = req.cookies.jwt;
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];
  else return next(new appError("please logIn first", 401));
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select("+role +active");
  if (!user)
    return next(
      new appError("user belong this token not exist,please signUp", 401)
    );
  if (user.changePassword(decoded.iat))
    return next(
      new appError("you recenty change password,please logIn again", 401)
    );
  if (user.active == false) return next(new appError("please logIn", 401));
  req.user = user;
  next();
});

//roles
exports.restrict = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new appError(`you don't have permision to perform this action`, 403)
      );
    next();
  };
};

//logOut
exports.logOut = catchAsync(async (req, res, next) => {
  res.cookie("jwt", "loggedOut");
  res.status(200).json({
    status: "success",
  });
});

//resetToken
exports.resetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new appError("no user with this email", 404));
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH 
  request with your new password and passwordConfirm to:
   ${resetUrl}`;
  try {
    await sendEmail({
      to: user.email,
      message,
      subject: "your password reset token( valid for 10 mintues)",
    });
    res.status(200).json({
      status: "success",
      message: "token send to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpired = undefined;
    await user.save({ validateBeforeSave: false });
    next(
      new appError(
        "there was an error sending the email,please try again later",
        500
      )
    );
  }
});

//updatePassword
exports.forgetPassword = catchAsync(async (req, res, next) => {
  const hashToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetTokenExpired: { $gte: Date.now() },
  });
  if (!user) return next(new appError("token not valid or expired", 404));
  const { password, passwordConfirm } = req.body;
  if (!password || !passwordConfirm)
    return next(new appError("please enter password and passwordConfirm"));
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpired = undefined;
  await user.save();
  sendToken(user, res, 201);
});
