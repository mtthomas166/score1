const catchAsync = require("./../utils/catchAsync");
const appError = require("./../utils/appError");  
const Player = require("./../models/playerModel");
const mongoose = require("mongoose");

exports.createPlayer = catchAsync(async (req, res, next) => {
  const player = await Player.findOne({ name: req.body.name });
  if (player) return next(new appError("player already exist", 400));
  const newPlayer = await Player.create(req.body);
  res.status(201).json({
    status: "success",
    message: "player created Successfully",
    data: { newPlayer },
  });
});

exports.getAllPlayers = catchAsync(async (req, res, next) => {
  const players = await Player.find().select("-__v");
  if (players.length == 0)
    return next(new appError("no exist any player", 400));
  res.status(200).json({
    status: "success",
    result: players.length,
    data: { players },
  });
});

exports.getOnePlayer = catchAsync(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return next(new appError("id not valid", 400));
  const player = await Player.findById(req.params.id).select("-__v");
  if (!player) return next(new appError("player not exist", 404));
  res.status(200).json({
    status: "success",
    data: { player },
  });
});

exports.updatePlayer = catchAsync(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return next(new appError("id not valid", 400));
  const player = await Player.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).select("-__v");
  if (!player) return next(new appError("player not exist", 404));
  res.status(200).json({
    status: "success",
    message: "updated successfully",
    data: { player },
  });
});

exports.deletePlayer = catchAsync(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return next(new appError("id not valid", 400));
  const player = await Player.findByIdAndDelete(req.params.id);
  if (!player) return next(new appError("player not exist", 404));
  res.status(204).send();
});

exports.getPlayersInTeam = catchAsync(async (req, res, next) => {
  const teamId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(teamId))
    return next(new appError("id not valid", 400));
  const players = await Player.find({ currentTeam: teamId }).select(
    "name position avatar t_shirt",
  );
  res.status(200).json({
    status: "success",
    result: players.length,
    data: { players },
  });
});
