const catchAsync = require("./../utils/catchAsync");
const appError = require("./../utils/appError");
const Details = require("./../models/detailsOfMatch");
const mongoose = require("mongoose");

exports.createDetails = catchAsync(async (req, res, next) => {
  const details = await Details.findOne({ match: req.body.match });
  if (details) return next(new appError("details already exist", 400));
  const newDetails = await Details.create(req.body);
  res.status(201).json({
    status: "success",
    message: "details created successfully",
    data: { newDetails },
  });
});

//get All Details By Admin
exports.getAllDetails = catchAsync(async (req, res, next) => {
  const details = await Details.find();
  if (details.length == 0)
    return next(new appError("not exist any details", 404));
  res.status(200).json({
    status: "success",
    result: details.length,
    data: { details },
  });
});

//get Details By Id
exports.getOneDetails = catchAsync(async (req, res, next) => {
  const detailsId = req.params.id;
  if (!detailsId) return next(new appError("please enter detailsId", 400));
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return next(new appError("id not valid", 400));
  const details = await Details.findById(req.params.id);
  if (!details) return next(new appError("not exist", 404));
  res.status(200).json({
    status: "success",
    data: { details },
  });
});

//update Details By Admin
exports.updateDetails = catchAsync(async (req, res, next) => {
  const detailsId = req.params.id;
  if (!detailsId) return next(new appError("please enter detailsId", 400));
  if (!mongoose.Types.ObjectId.isValid(detailsId))
    return next(new appError("id not valid", 400));
  const details = await Details.findByIdAndUpdate(detailsId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!details) return next(new appError("not exist", 404));
  res.status(200).json({
    status: "success",
    data: { details },
  });
});

//delete Details By Admin
exports.deleteDetails = catchAsync(async (req, res, next) => {
  const detailsId = req.params.id;
  if (!detailsId) return next(new appError("please enter detailsId", 400));
  if (!mongoose.Types.ObjectId.isValid(detailsId))
    return next(new appError("id not valid", 400));
  const details = await Details.findByIdAndDelete(detailsId);
  if (!details) return next(new appError("not exist", 404));
  res.status(204).json({
    status: "success",
    data: null,
  });
});
