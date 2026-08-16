const Channel = require("../models/channelModel");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const mongoose = require("mongoose");

//Create Channel By Admin
exports.createChannel = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const channel = await Channel.find(name);
  if (channel) return next(new appError("channel already exist", 400));
  const newChannel = await Channel.create(req.body);
  res.status(201).json({
    status: "success",
    message: "coach created successfully",
    data: { newChannel },
  });
});

//get All Channel By Admin
exports.getAllChannels = catchAsync(async (req, res, next) => {
  const channels = await Channel.find();
  if (channels.length == 0)
    return next(new appError("not exist any channel", 404));
  res.status(200).json({
    status: "success",
    result: channels.length,
    data: { channels },
  });
});

//get Channel By Id
exports.getOneChannel = catchAsync(async (req, res, next) => {
  const channelId = req.params.id;
  if (!channelId) return next(new appError("please enter channelId", 400));
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return next(new appError("id not valid", 400));
  const channel = await Channel.findById(req.params.id);
  if (!channel) return next(new appError("not exist", 404));
  res.status(200).json({
    status: "success",
    data: { channel },
  });
});

//update Channel By Admin
exports.updateChannel = catchAsync(async (req, res, next) => {
  const channelId = req.params.id;
  if (!channelId) return next(new appError("please enter channelId", 400));
  if (!mongoose.Types.ObjectId.isValid(channelId))
    return next(new appError("id not valid", 400));
  const channel = await Channel.findByIdAndUpdate(channelId, req.body, {
    new: true,
  });
  if (!channel) return next(new appError("not exist", 404));
  res.status(200).json({
    status: "success",
    data: { channel },
  });
});

//delete Channel By Admin
exports.deleteChannel = catchAsync(async (req, res, next) => {
  const channelId = req.params.id;
  if (!channelId) return next(new appError("please enter channelId", 400));
  if (!mongoose.Types.ObjectId.isValid(channelId))
    return next(new appError("id not valid", 400));
  const channel = await Channel.findByIdAndDelete(channelId);
  if (!channel) return next(new appError("not exist", 404));
  res.status(204).json({
    status: "success",
    data: null,
  });
});
