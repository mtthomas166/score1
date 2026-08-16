const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const mongoose = require("mongoose");
const Standing = require("../models/standingModel");

//Create Standing
exports.createStanding = catchAsync(async (req, res, next) => {
  const standing = await Standing.findOne({
    team: req.body.team,
    league: req.body.league,  
  });
  if (standing) return next(new appError("standing already exist", 400));
  const newStanding = await Standing.create(req.body);
  res.status(201).json({
    status: "success",
    message: "standing created successfully",
    data: { newStanding },
  });
});

exports.getStandingOfLeague = catchAsync(async (req, res, next) => {
  const leagueId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(leagueId))
    return next(new appError("id not valid", 400));
  const standings = await Standing.find({ league: leagueId })
    .sort({ points: -1, goalDifference: -1, goalsFor: -1 })
    .populate("team", "name logo")
    .populate("league", "name logo");
  const finalStanding = standings.map((team, index) => ({
    position: index + 1,
    ...team._doc,
  }));
  res.status(200).json({
    status: "success",
    result: standings.length,
    data: { finalStanding },
  });
});

exports.getStandingOfTeam = catchAsync(async (req, res, next) => {
  const teamId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(teamId))
    return next(new appError("id not valid", 400));
  const standing = await Standing.findOne({ team: teamId })
    .populate("team", "name logo")
    .populate("league", "name logo");
  if (!standing) return next(new appError("not exist", 404));
  res.status(200).json({
    status: "success",
    data: { standing },
  });
});

exports.updateStanding = catchAsync(async (req, res, next) => {
  const standingId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(standingId))
    return next(new appError("id not valid", 400));
  const standing = await Standing.findByIdAndUpdate(standingId, req.body, {
    new: true,
    runValidators: true,
  })
    .populate("team", "name logo")
    .populate("league", "name logo");
  if (!standing) return next(new appError("not exist", 404));
  res.status(200).json({
    status: "success",
    message: "standing updated successfully",
    data: { standing },
  });
});

exports.deleteStanding = catchAsync(async (req, res, next) => {
  const standingId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(standingId))
    return next(new appError("id not valid", 400));
  const standing = await Standing.findByIdAndDelete(standingId);
  if (!standing) return next(new appError("not exist", 404));
  res.status(204).json({
    status: "success",
    data: null,
  });
});
