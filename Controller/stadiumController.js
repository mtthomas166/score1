const Stadium = require("../models/stadium");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const mongoose = require("mongoose");

//Create Stadium
exports.createStadium = catchAsync(async (req, res, next) => {
  const stadium = await Stadium.findOne({ name: req.body.name });
  if (stadium) return next(new appError("stadium already exist", 400));
  const stad = await Stadium.create(req.body);
  res.status(201).json({
    status: "success",
    message: "staium created successfully",
    data: { stad },
  });
});

exports.getAllStadiums = catchAsync(async (req, res, next) => {
  const stads = await Stadium.find()
    .populate("team", "name logo")
    .populate("nationalTeam", "logo");
  if (stads.length == 0) return next(new appError("not exist any stads", 404));
  res.status(200).json({
    status: "success",
    result: stads.length,
    data: { stads },
  });
});

exports.getOneStadium = catchAsync(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return next(new appError("id not valid", 400));
  const stad = await Stadium.findById(req.params.id)
    .populate("team", "name logo")
    .populate("nationalTeam", "logo");
  if (!stad) return next(new appError("not exist", 404));
  res.status(200).json({
    status: "success",
    data: { stad },
  });
});

exports.updateStadium = catchAsync(async (req, res, next) => {
  const stadId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(stadId))
    return next(new appError("id not valid", 400));
  const stad = await Stadium.findByIdAndUpdate(stadId, req.body, {
    new: true,
    runValidators: true,
  })
    .populate("team", "name logo")
    .populate("nationalTeam", "logo");
  if (!stad) return next(new appError("not exist", 404));
  res.status(200).json({
    status: "success",
    message: "stadium updated sucessfully",
    data: { stad },
  });
});

exports.deleteStadium = catchAsync(async (req, res, next) => {
  const stadId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return next(new appError("id not valid", 400));
  const stad = await Stadium.findByIdAndDelete(stadId);
  if (!stad) return next(new appError("not exist", 404));
  res.status(204).json({
    status: "success",
    data: null,
  });
});
