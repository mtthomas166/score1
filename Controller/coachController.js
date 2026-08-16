const catchAsync = require("./../utils/catchAsync");
const appError = require("./../utils/appError");
const Coach = require("./../models/coachModel");
const mongoose = require("mongoose");

//create Coach By Admin
exports.createCoach = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const coach = await Channel.find(name);
  if (coach) return next(new appError("channel already exist", 400));
  const newCoach = await Coach.create(req.body);
  res.status(201).json({
    status: "success",
    message: "coach created successfully",
    data: { newCoach },
  });
});

//get All Coaches
exports.getAllCoaches = catchAsync(async (req, res, next) => {
  const coaches = await Coach.find().populate(
    { path: "team", select: "name logo" },
    { state: "team", select: "name logo" },
  );
  res.status(200).json({
    status: "success",
    result: coaches.length,
    data: { coaches },
  });
});

//get One Coach
exports.getOneCoach = catchAsync(async (req, res, next) => {
  const coachId = req.params.id;
  if (!coachId) return next(new appError("please enter channelId", 400));
  if (!mongoose.Types.ObjectId.isValid(coachId))
    return next(new appError("id not valid", 400));
  const coach = await Coach.findById(coachId).populate(
    { path: "team", select: "name logo" },
    { state: "team", select: "name logo" },
  );
  if (!coach) return next(new appError("coach not exist", 404));
  res.status(200).json({
    status: "success",
    data: { coach },
  });
});

//update Coach By Admin
exports.updateCoach = catchAsync(async (req, res, next) => {
  const coachId = req.params.id;
  if (!coachId) return next(new appError("please enter channelId", 400));
  if (!mongoose.Types.ObjectId.isValid(coachId))
    return next(new appError("id not valid", 400));
  const coach = await Coach.findByIdAndUpdate(coachId, req.body, {
    new: true,
    runValidators: true,
  }).populate(
    { path: "team", select: "name logo" },
    { state: "team", select: "name logo" },
  );
  if (!coach) return next(new appError("coach not exist", 404));
  res.status(200).json({
    status: "success",
    message: "updated successfully",
    data: { coach },
  });
});

//delete Coach By Admin
exports.deleteCoach = catchAsync(async (req, res, next) => {
  const coachId = req.params.id;
  if (!coachId) return next(new appError("please enter channelId", 400));
  if (!mongoose.Types.ObjectId.isValid(coachId))
    return next(new appError("id not valid", 400));
  const coach = await Coach.findByIdAndDelete(coachId);
  if (!coach) return next(new appError("coach not exist", 404));
  res.status(204).send();
});  