const Referee = require("../models/refereeModel");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const mongoose = require("mongoose");

//Create Refree
exports.createReferee = catchAsync(async (req, res, next) => {
  const referee = await Referee.findOne({
    name: req.body.name,
    country: req.body.country,
  });
  if (referee) return next(new appError("referee already exist", 400));
  const newReferee = await Referee.create(req.body);
  res.status(201).json({
    status: "success",
    message: "referee created successfully",
    data: { newReferee },
  });
});

exports.getAllReferees = catchAsync(async (req, res, next) => {
  const referees = await Referee.find().populate("country", " name logo");
  if (referees.length == 0)
    return next(new appError("not exist any referee", 404));
  res.status(200).json({
    status: "success",
    result: referees.length,
    data: { referees },
  });
});

exports.getOneReferee = catchAsync(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return next(new appError("id not valid", 400));
  const referee = await Referee.findById(req.params.id).populate(
    "country",
    " name logo",
  );
  if (!referee) return next(new appError("not exist", 404));
  res.status(200).json({
    status: "success",
    data: { referee },
  });
});

exports.updateReferee = catchAsync(async (req, res, next) => {
  const refereeId = req.params.id;
  if (!refereeId) return next(new appError("please enter refereeId", 400));
  if (!mongoose.Types.ObjectId.isValid(refereeId))
    return next(new appError("id not valid", 400));
  const referee = await Referee.findByIdAndUpdate(refereeId, req.body, {
    new: true,
    runValidators: true,
  }).populate("country", " name logo");
  if (!referee) return next(new appError("not exist", 404));
  res.status(200).json({
    status: "success",
    message: "referee upated successfully",
    data: { referee },
  });
});

exports.deleteReferee = catchAsync(async (req, res, next) => {
  const refereeId = req.params.id;
  if (!refereeId) return next(new appError("please enter refereeId", 400));
  if (!mongoose.Types.ObjectId.isValid(refereeId))
    return next(new appError("id not valid", 400));
  const referee = await Referee.findByIdAndDelete(refereeId);
  if (!referee) return next(new appError("not exist", 404));
  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.getRefereesInCountry = catchAsync(async (req, res, next) => {
  const countryId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(countryId))
    return next(new appError("id not valid", 400));
  const referees = await Referee.find({ country: countryId }).select(
    "name  avatar ",
  );
  res.status(200).json({
    status: "success",
    result: referees.length,
    data: { referees },
  });
});
