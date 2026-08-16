const Transfer = require("../models/transferModel");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const mongoose = require("mongoose");

//Create transfer
exports.createTransfer = catchAsync(async (req, res, next) => {
  const transfer = await Transfer.create(req.body);
  res.status(201).json({
    status: "success",
    data: { transfer },
  });
});
exports.getAllTransfer = catchAsync(async (req, res, next) => {
  const transfers = await Transfer.find()
    .populate("player", "name avatar")
    .populate("fromTeam", "name logo")
    .populate("toTeam", "name logo")
    .sort({ createdAt: -1 })
    .select("-__v -updatedAt");
  if (!transfers.length)
    return next(new appError("not exist any transfers", 404));
  res.status(200).json({
    status: "success",
    result: transfers.length,
    data: { transfers },
  });
});
exports.getOneTransfer = catchAsync(async (req, res, next) => {
  const transfer = await Transfer.findById(req.params.id)
    .populate("player", "name avatar")
    .populate("fromTeam", "name logo")
    .populate("toTeam", "name logo")
    .sort({ createdAt: -1 })
    .select("-__v -updatedAt");
  if (!transfer) return next(new appError("not exist", 404));
  res.status(200).json({
    status: "success",
    data: { transfer },
  });
});
exports.updateTransfer = catchAsync(async (req, res, next) => {
  const transferId = req.params.id;
  if (!transferId) return next(new appError("please enter transferId", 400));
  const transfer = await Transfer.findByIdAndUpdate(transferId, req.body, {
    new: true,
  });
  if (!transfer) return next(new appError("not exist", 404));
  res.status(200).json({
    status: "success",
    data: { transfer },
  });
});
exports.deleteTransfer = catchAsync(async (req, res, next) => {
  const transferId = req.params.id;
  if (!transferId) return next(new appError("please enter NewId", 400));
  const transfer = await Transfer.findByIdAndDelete(transferId);
  if (!transfer) return next(new appError("not exist", 404));
  res.status(200).json({
    status: "success",
    data: null,
  });
});
exports.getTransferOfTeam = catchAsync(async (req, res, next) => {
  const teamId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(teamId))
    return next(new appError("id not valid", 400));
  const transfers = await Transfer.find({ toTeam: teamId })
    .populate("player", "name avatar")
    .populate("fromTeam", "name logo")
    .populate("toTeam", "name logo")
    .sort({ createdAt: -1 })
    .select("-__v -updatedAt");
  res.status(200).json({
    status: "success",
    result: transfers.length,
    data: { transfers },
  });
});
exports.getTransferOfPlayer = catchAsync(async (req, res, next) => {
  const playerId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(playerId))
    return next(new appError("id not valid", 400));
  const transfers = await Transfer.find({ player: playerId })
    .populate("player", "name avatar")
    .populate("fromTeam", "name logo")
    .populate("toTeam", "name logo")
    .sort({ createdAt: -1 })
    .select("-__v -updatedAt");
  res.status(200).json({
    status: "success",
    result: transfers.length,
    data: { transfers },
  });
});
